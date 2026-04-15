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
            /*
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
    document.getElementById('result2').textContent = [... new Set(stroka)]; 
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