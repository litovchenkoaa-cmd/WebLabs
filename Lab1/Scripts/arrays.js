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
                Func1(rawValue);
                break;
            case 2:
                Func2(rawValue);
                break;
                
            case 3:
                Func3(rawValue);
                break;
            
            case 4:
                // Преобразование данных для func3: ожидаем "строка, цифра"
                let parts = rawValue.split(',').map(part => part.trim());
                if (parts.length === 2) {
                    Func4(parts[0], parts[1]);
                } else {
                    // Если формат не тот, просто покажем ошибку в результате
                    document.getElementById('result4').textContent = 'Ошибка: нужно "число, цифра"';
                }
                break;
                
            case 5:
                Func5(rawValue);
                break;
                
            case 6:
                // Преобразование данных для func3: ожидаем "строка, цифра"
                let items = rawValue.split(',').map(part => part.trim());
                if (items.length === 2) {
                    Func6(items[0], items[1]);
                } else {
                    // Если формат не тот, просто покажем ошибку в результате
                    document.getElementById('result6').textContent = 'Ошибка: нужно "число, цифра"';
                }
                break;
                /*
            case 7:
                func7(rawValue);
                break;*/
        }

        inputElement.value = '';
    }
}

function Func1(stroka){
    const arr = stroka.split(' ');
    document.getElementById('result1').textContent = Math.max(...arr)-Math.min(...arr); 
}

function Func2(stroka){
    document.getElementById('result2').textContent = [... new Set(stroka.split(' '))]; 
}

function Func3(stroka){
    const result = new Array();
    const objects = [
        {id: 1, idDone: true}, 
        {id: 2, idDone: false},
        {id: 3, idDone: true},
        {id: 4, idDone: true}, 
        {id: 5, idDone: false},
        {id: 6, idDone: true},
        {id: 7, idDone: true}, 
        {id: 8, idDone: false}
    ]
    
    for (let i = 0; i < objects.length; i++) {
        if(objects[i].idDone === true)
        {
            result.push(objects[i].id);
        }
    }
    document.getElementById('result3').textContent = result; 
}

function Func4(stroka, value){
    value = Number(value);
    const arr = stroka.split(' ');
    
    const result = new Array();

    for (let i = 0; i < arr.length; i++)
    {
        if (arr[i] > value){
            result.push(arr[i]);
        }
    }
    document.getElementById('result4').textContent = result;

}

function Func5(stroka)
{
    const arr = [1, 4, [34, 1, 20], [6, [6, 12, 8], 6]];
    result = new Array();

    for (let item of arr)
    {
        if(Array.isArray(item))
        {
            result = result.concat(item);
        }
        else{
            result.push(item);
        }

    }
    document.getElementById('result5').textContent = result;

}

function Func6(stroka, value)
{
    value = Number(value);
    let arr = stroka.split(' ');
    arr = arr.map(a => Number(a));
    let quantity = 0;
    const map = new Map();

    for (let i = 0; i < arr.length; i++)
    {
        for(let j = i+1; j < arr.length; j++)
        {
            if(i === j)
            {
                continue;
            }
            else
            {
                if(arr[i] + arr[j] === value && arr[j] !== map.get(arr[i]))
                {
                    quantity += 1;
                    map.set(arr[i], arr[j]);
                }
            }
        }
    }
    document.getElementById('result6').textContent = quantity;

}