let inputElement1;
let forfunc1;
let inputElement2;
let forfunc2;

function processTask1() {
    // Получаем элемент ввода
    inputElement1 = document.getElementById(`input1`);
  
    if(inputElement1.value !== '')
    {
    forfunc1 = inputElement1.value.split(' ');
    inputElement1.value = '';
    }
    const func1 = Func1(Number(forfunc1[0]), Number(forfunc1[1]));
    func1.next();

    
}

function processTask2() {
    // Получаем элемент ввода
    inputElement2 = document.getElementById(`input2`);
   
    if(inputElement2.value !== '')
    {
    forfunc2 = Number(inputElement2.value);
    inputElement2.value = '';
    }
    const func2 = Func2(forfunc2);
    
    document.getElementById('result2').textContent = func2.next().value;
    forfunc2++;

    
}

function * Func1(min, max) {
    for(let i = 0; i < i+1; i++) {
        document.getElementById('result1').textContent = (Math.floor(Math.random() * (max - min + 1) + min));
        yield i;
    }
}

function * Func2(n)
{
    if([0, 1, 2].includes(n)){
        return 1;
    }
    return (Func2(n - 2) + Func2(n - 3));
}