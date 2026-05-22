//Задача 1.1
function counter(n)
{
    for(; n >= 0; n--) 
    {
        const innerN = n;
        setTimeout(() => console.log(innerN), (5-n+1) * 1000);
    }
}

//counter(5);

//Задача 1.2
function createCounter(n) {
    let current = n;
    let timerId = null;

    function tick() {
        console.log(current);

        if (current <= 1) {
            stop();
            return;
        }

        current--;
    }

    function start() {
        // Если таймер уже запущен, не запускаем новый
        if (timerId !== null) return;

        tick(); // Первый вывод сразу
        timerId = setInterval(tick, 1000);
    }

    function pause() {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    function stop() {
        pause();
        current = n; // Сбрасываем значение
    }

    return {
        start,
        pause,
        stop
    };
}

// Пример использования:
//const cntr = createCounter(5);

//cntr.start();

//Задача 2.1
function delay(N)
{
    return new Promise(res => {
        setTimeout(res, N * 1000);
    });

}

delay(2).then(() => console.log("Прошло 2 секунды"))
    

//Задача 2.2
for(let i = 5, j = 1; i >=0; i--, j++)
{
    delay(j).then(() => console.log(i));
}

//Задача 2.3
async function getFirstRepo(username) {
    try {
        // Первый запрос - получаем список репозиториев
        const response = await fetch(`https://api.github.com/users/${username}/repos`);

        // Проверяем успешность запроса
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Парсим JSON из ответа
        const repos = await response.json();

        // Проверяем, что массив не пустой
        if (repos.length === 0) {
            return 'У пользователя нет репозиториев';
        }

        // Получаем имя первого репозитория
        const firstRepoName = repos[0].name;

        // Второй запрос - получаем детальную информацию о первом репозитории
        const repoResponse = await fetch(`https://api.github.com/repos/${username}/${firstRepoName}`);
        
        // Проверяем успешность второго запроса
        if (!repoResponse.ok) {
            throw new Error(`HTTP error! status: ${repoResponse.status}`);
        }
        
        const repoDetails = await repoResponse.json();
        
        return {
            name: repoDetails.name,
            full_name: repoDetails.full_name,
            description: repoDetails.description,
            url: repoDetails.html_url
        };


    } catch (error) {
        console.error('Ошибка:', error);
        return null;
    }
}

// Использование функции
getFirstRepo('litovchenkoaa-cmd').then(repo => {
    console.log('Первый репозиторий:', repo);
});