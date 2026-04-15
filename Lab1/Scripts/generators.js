let inputElement = document.getElementById(`input1`);
let forfunc1 = inputElement.value.split(',')
const func1 = Func1(Number(forfunc1[0]), Number(forfunc1[1]));

function processAllTasks() {
    // Получаем элемент ввода
    func1.next();
    inputElement.value = '';
    
}

function * Func1(min, max) {
    for(let i = 0; i < i+1; i++) {
        document.getElementById('result1').textContent = (Math.floor(Math.random() * (max - min + 1) + min));
        yield i;
    }
}