
// Обработчик кнопки "Открыть карту"
demoButton.addEventListener('click', async function() {
        if (mapContainer.style.display === 'none') {
            mapContainer.style.display = 'block';
            demoButton.textContent = 'Скрыть карту';
            
            // Загружаем карту при первом открытии
            if (!mapSvg.children.length || mapSvg.querySelector('.loading')) {
                await loadMapSvg();
            }
            
            // Плавная прокрутка к карте
            mapContainer.scrollIntoView({ behavior: 'smooth' });
        } else {
            mapContainer.style.display = 'none';
            demoButton.textContent = 'Открыть карту';
            mapInfo.classList.remove('active');
        }
    });

// Показ информации о регионе
function showRegionInfo(regionId) {
        const data = regionData[regionId];
        
        mapInfo.innerHTML = `
            <h3>${data.name}</h3>
            <p>${data.description}</p>
            <h4>Достопримечательности:</h4>
            <ul>
                ${data.attractions.map(attr => `<li>${attr}</li>`).join('')}
            </ul>
        `;
        
        mapInfo.classList.add('active');
    }

// Настройка интерактивности карты
function setupMapInteractions() {
        const regions = document.querySelectorAll('.region, [data-region]');
        
        regions.forEach(region => {
            region.addEventListener('click', function() {
                const regionId = this.getAttribute('data-region');
                
                if (regionId && regionData[regionId]) {
                    showRegionInfo(regionId);
                    
                    // Подсветка выбранного региона
                    regions.forEach(r => r.classList.remove('selected'));
                    this.classList.add('selected');
                }
            });
            
            // Добавляем всплывающую подсказку
            const regionId = region.getAttribute('data-region');
            if (regionId && regionData[regionId]) {
                region.title = regionData[regionId].name;
            }
        });
    }


// // Функция загрузки SVG карты через API
async function loadMapWithApiData() {
    try {
        // Загружаем SVG карту
        const mapResponse = await fetch('/api/map/svg');
        const svgText = await mapResponse.text();
        mapSvg.innerHTML = svgText;
        
        // Загружаем данные о регионах
        const dataResponse = await fetch('/api/regions');
        const regionsApiData = await dataResponse.json();
        
        // Объединяем данные
        Object.assign(regionData, regionsApiData);
        
        setupMapInteractions();
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        //createFallbackMap();
    }
}
loadMapWithApiData();