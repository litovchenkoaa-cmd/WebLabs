/* ==========================================
   ПОГОДА В ОСЛО: Open-Meteo API
   ========================================== */

const OSLO_LAT = 59.91;
const OSLO_LON = 10.75; // Правильные координаты Осло

// Функция для получения иконок погоды по WMO коду
function getWeatherIcon(code, isDay = true) {
    const icons = {
        0: isDay ? '01d' : '01n', // Ясно
        1: isDay ? '01d' : '01n', // Преимущественно ясно
        2: isDay ? '02d' : '02n', // Переменная облачность
        3: isDay ? '04d' : '04n', // Пасмурно
        45: '50d', 48: '50d',     // Туман
        51: '09d', 53: '09d', 55: '09d', // Морось
        61: '09d', 63: '09d', 65: '09d', // Дождь
        71: '13d', 73: '13d', 75: '13d', // Снег
        80: '09d', 81: '09d', 82: '09d', // Ливень
        95: '11d', 96: '11d', 99: '11d'  // Гроза
    };
    return icons[code] || '01d';
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Ясно', 1: 'Преимущественно ясно', 2: 'Переменная облачность',
        3: 'Пасмурно', 45: 'Туман', 48: 'Изморозь',
        51: 'Слабая морось', 53: 'Умеренная морось', 55: 'Сильная морось',
        61: 'Слабый дождь', 63: 'Умеренный дождь', 65: 'Сильный дождь',
        71: 'Слабый снег', 73: 'Умеренный снег', 75: 'Сильный снег',
        80: 'Ливень', 81: 'Сильный ливень', 82: 'Очень сильный ливень',
        95: 'Гроза', 96: 'Гроза с градом', 99: 'Сильная гроза с градом'
    };
    return descriptions[code] || 'Неизвестно';
}

async function loadOsloWeather() {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${OSLO_LAT}&longitude=${OSLO_LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('Погода в Осло:', data);
        
        renderCurrentWeather(data);
        renderDailyForecast(data);
        renderHourlyForecast(data);
        
    } catch (error) {
        console.error('Ошибка загрузки погоды:', error);
        document.getElementById('weatherDesc').textContent = 'Ошибка загрузки данных';
    }
}

function renderCurrentWeather(data) {
    const current = data.current;
    
    document.getElementById('currentTemp').textContent = Math.round(current.temperature_2m);
    document.getElementById('humidity').textContent = current.relative_humidity_2m;
    document.getElementById('windSpeed').textContent = current.wind_speed_10m;
    
    // Open-Meteo не возвращает feels_like и visibility в базовом запросе
    // Можно добавить дополнительные параметры или показать прочерк
    document.getElementById('feelsLike').textContent = '--';
    document.getElementById('visibility').textContent = '--';
    
    const icon = getWeatherIcon(current.weather_code);
    document.getElementById('weatherDesc').textContent = getWeatherDescription(current.weather_code);
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
}

function renderDailyForecast(data) {
    const track = document.getElementById('dailyTrack');
    track.innerHTML = '';
    
    const daily = data.daily;
    
    // Берем все 5 дней
    daily.time.forEach((date, index) => {
        const maxTemp = Math.round(daily.temperature_2m_max[index]);
        const minTemp = Math.round(daily.temperature_2m_min[index]);
        const weatherCode = daily.weather_code[index];
        
        const dateObj = new Date(date);
        const dayName = dateObj.toLocaleDateString('ru-RU', { weekday: 'short' });
        const dayDate = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        
        const icon = getWeatherIcon(weatherCode);
        
        const card = document.createElement('div');
        card.className = 'daily-card';
        card.innerHTML = `
            <div class="day-name">${dayName}</div>
            <div class="day-date">${dayDate}</div>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon">
            <div class="temp-range">${maxTemp}° <span>/ ${minTemp}°</span></div>
        `;
        track.appendChild(card);
    });
}

function renderHourlyForecast(data) {
    const track = document.getElementById('hourlyTrack');
    track.innerHTML = '';
    
    const hourly = data.hourly;
    
    // Берем следующие 24 часа
    const now = new Date();
    let startIndex = 0;
    
    // Находим текущий час
    for (let i = 0; i < hourly.time.length; i++) {
        const hourTime = new Date(hourly.time[i]);
        if (hourTime >= now) {
            startIndex = i;
            break;
        }
    }
    
    // Берем 24 часа начиная с текущего
    for (let i = startIndex; i < startIndex + 24 && i < hourly.time.length; i++) {
        const time = hourly.time[i].split('T')[1];
        const temp = Math.round(hourly.temperature_2m[i]);
        const weatherCode = hourly.weather_code[i];
        const icon = getWeatherIcon(weatherCode);
        
        const card = document.createElement('div');
        card.className = 'hourly-card';
        card.innerHTML = `
            <div class="time">${time}</div>
            <img src="https://openweathermap.org/img/wn/${icon}.png" alt="icon">
            <div class="temp">${temp}°</div>
        `;
        track.appendChild(card);
    }
}

/* ==========================================
   ЛОГИКА КАРУСЕЛИ (без изменений)
   ========================================== */
let dailySlide = 0;
let hourlySlide = 0;

function moveDailyCarousel(direction) {
    const track = document.getElementById('dailyTrack');
    const cards = track.querySelectorAll('.daily-card');
    if (cards.length === 0) return;
    
    const cardWidth = cards[0].offsetWidth + 20;
    const viewportWidth = document.querySelector('.carousel-viewport').offsetWidth;
    const visibleCards = Math.floor(viewportWidth / cardWidth);
    const maxSlide = Math.max(0, cards.length - visibleCards);
    
    dailySlide += direction;
    if (dailySlide < 0) dailySlide = 0;
    if (dailySlide > maxSlide) dailySlide = maxSlide;
    
    track.style.transform = `translateX(-${dailySlide * cardWidth}px)`;
}

function moveHourlyCarousel(direction) {
    const track = document.getElementById('hourlyTrack');
    const cards = track.querySelectorAll('.hourly-card');
    if (cards.length === 0) return;
    
    const cardWidth = cards[0].offsetWidth + 20;
    const viewportWidth = document.querySelector('.carousel-viewport').offsetWidth;
    const visibleCards = Math.floor(viewportWidth / cardWidth);
    const maxSlide = Math.max(0, cards.length - visibleCards);
    
    hourlySlide += direction;
    if (hourlySlide < 0) hourlySlide = 0;
    if (hourlySlide > maxSlide) hourlySlide = maxSlide;
    
    track.style.transform = `translateX(-${hourlySlide * cardWidth}px)`;
}

/* ==========================================
   ИНИЦИАЛИЗАЦИЯ
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    loadOsloWeather();
});