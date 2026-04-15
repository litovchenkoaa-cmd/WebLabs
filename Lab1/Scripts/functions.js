"use strict";
//value = Number(prompt("Enter the number: ", ''));

function processAllTasks() {
    // Проходим по всем 7 полям
    for (let i = 1; i <= 7; i++) {
        // Получаем элемент ввода
        let inputElement = document.getElementById(`input${i}`);
        let rawValue = inputElement.value;

        // Пропускаем пустые поля, чтобы не ломать функции
        if (rawValue.trim() === '') continue;

        // В зависимости от номера вызываем нужную функцию и при необходимости преобразуем данные
        switch (i) {
            case 1:
                func1(rawValue);
                break;
            case 2:
                func2(rawValue);
                break;
            case 3:
                // Преобразование данных для func3: ожидаем "число, цифра"
                let parts = rawValue.split(',').map(part => part.trim());
                if (parts.length === 2) {
                    func3(parts[0], parts[1]);
                } else {
                    // Если формат не тот, просто покажем ошибку в результате
                    document.getElementById('result3').textContent = 'Ошибка: нужно "число, цифра"';
                }
                break;
            case 4:
                func4(rawValue);
                break;
            case 5:
                func5(rawValue);
                break;
            case 6:
                func6(rawValue);
                break;
            case 7:
                func7(rawValue);
                break;
        }

        // *** ВАЖНОЕ ТРЕБОВАНИЕ: Возвращаем поле ввода в исходное состояние (очищаем) ***
        inputElement.value = '';
    }
}

function func1(value) {
    let number = Number(value);
    let result = 0;
    let sign = Math.sign(number);
    number = Math.abs(number);

    while (number > 0) {
        result = result * 10 + (number % 10);
        number = Math.trunc(number / 10);
    }
    document.getElementById('result1').textContent = result * sign;
}

function func2(stroka) {
    document.getElementById('result2').textContent = Number([...new Set(stroka)].join(''));
}

function func3(number, value) {
    number = Number(number);
    value = Number(value);
    let quantity = 0;
    let stroka = String(number);
    for (let i = 0; i < stroka.length; i++) {
        if (Number(stroka[i]) === value) quantity++;
    }
    document.getElementById('result3').textContent = quantity;
}

function func4(value) {
    let number = Number(value);
    let stroka = number.toString(2).split('1');
    let Length = 0;
    for (let str of stroka) {
        Length = Math.max(Length, str.length);
    }
    document.getElementById('result4').textContent = Length;
}

function func5(stroka) {
    const count = {};
    for (let char of stroka) {
        count[char] = (count[char] || 0) + 1;
    }
    for (let char of stroka) {
        if (count[char] === 1) {
            document.getElementById('result5').textContent = char;
            return; // Нашли первый уникальный - выходим
        }
    }
    document.getElementById('result5').textContent = "Error (нет уникальных)";
}

function func6(value) {
    let number = Number(value);
    const symbolArr = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    let randomString = "";
    for (let i = 0; i < number; i++) {
        let index = Math.floor(Math.random() * symbolArr.length);
        randomString += symbolArr[index];
    }
    document.getElementById('result6').textContent = randomString;
}

function func7(stroka) {
    document.getElementById('result7').textContent = [...new Set(stroka)].join('');
}

