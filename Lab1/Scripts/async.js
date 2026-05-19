function counter(n)
{
    for(; n >= 0; n--) 
    {
        const innerN = n;
        setTimeout(() => console.log(innerN), (5-n+1) * 1000);
    }
}

//counter(5);


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
const cntr = createCounter(5);

cntr.start();  // Выведет: 5, 4, 3, 2, 1
// Через пару секунд...

cntr.pause();  // Приостанавливает счёт, можно возобновить
cntr.start();  // Продолжает: ..., 3, 2, 1
/*
cntr.stop();   // Останавливает и сбрасывает до 5
cntr.start();  // Начинает заново: 5, 4, 3, 2, 1*/