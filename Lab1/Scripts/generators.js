let inputElement1;
let forfunc1;
let inputElement2;
let forfunc2;
let inputElement3;
let forfunc3;
let inputElement4;
let forfunc4;
let inputElement5;
let forfunc5;

let PadovanSequence = [1, 1, 1];
let arr = [2];


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

function processTask3() {
    // Получаем элемент ввода
    inputElement3 = document.getElementById(`input3`);
   
    if(inputElement3.value !== '')
    {
    forfunc3 = Number(inputElement3.value);
    inputElement3.value = '';
    }
    const func3 = Func3(forfunc3);
    
    document.getElementById('result3').textContent = func3.next().value;
    forfunc3++;
}

function processTask4() {
    // Получаем элемент ввода
    inputElement4 = document.getElementById(`input4`);
   
    if(inputElement4.value !== '')
    {
    forfunc4 = inputElement4.value.split(',').map(part => part.trim());
    
    if (forfunc4.length === 2) {
        document.getElementById('result4').textContent = Func4(forfunc4[0], forfunc4[1]);
    } else {
        document.getElementById('result4').textContent = 'Ошибка: нужно "строка, элемент(символ, слово)"';
    }
    
    inputElement4.value = '';
    }
    
}

function processTask5() {
    // Получаем элемент ввода
    inputElement5 = document.getElementById(`input5`);
   
    if(inputElement5.value !== '')
    {
    forfunc5 = Number(inputElement5.value);
    
    
    document.getElementById('result5').textContent = Func5(forfunc5);
    
        
    
    inputElement5.value = '';
    }
    
}

function * Func1(min, max) {
    for(let i = 0; i < i+1; i++) {
        document.getElementById('result1').textContent = (Math.floor(Math.random() * (max - min + 1) + min));
        yield i;
    }
}

function * Func2(n)
{
    let i;
    if([0, 1, 2].includes(n)){
        return PadovanSequence[n];
    }
    if(n > PadovanSequence.length)
    {
        i = PadovanSequence.length - 1
    }
    else
    {
        i = n-1
    }
    for(; i < n; i++)
    {
        PadovanSequence.push(PadovanSequence[i - 2] + PadovanSequence[i - 1]);
        
    }
    return PadovanSequence[PadovanSequence.length-1];
}

function * Func3(n)
{
    
    if (n <= arr.length) return arr[n - 1];
    
    
    let item = arr[arr.length - 1];
    while (arr.length < n)
    {
        let flag
        do{
            flag = false;
            item++;
            if(item % 2 === 0){
                flag = true;
                continue;
            }

            let i = (Math.trunc(item/2) % 2 === 0) ? Math.trunc(item/2) - 1 : Math.trunc(item/2);
            for(; i > 2; i=i-2)
            {
                if (item % i === 0)
                {
                    flag = true;
                    break;
                }
            }

            if(!flag)
            {
                arr.push(item);
            }
            
        }while(flag)
        
        flag = true;
    }
    
    return arr[arr.length-1];
    
    
}

function Func4(stroka, item)
{
    let flag = (item.length > 1)? true: false;
    const map = new Map();

    if(!flag)
    {
        for (let element of stroka)
        {
            (map.has(element))? map.set(element, map.get(element)+1): map.set(element, 1);
        }
    }
    else
    {
        let arr = stroka.split(' ');
        for (let element of arr)
        {
            (map.has(element))? map.set(element, map.get(element)+1): map.set(element, 1);
        }

    }
    return map.get(item);
    
}

function getPrime(n) {
    if (n <= 0) throw new Error('n должно быть положительным');
    
    const primes = [2n];
    if (n === 1) return 2n;
    
    let candidate = 3n;
    
    while (primes.length < n) {
        let isPrime = true;
        const limit = candidate / 2n;
        
        for (const prime of primes) {
            if (prime > limit) break;
            if (candidate % prime === 0n) {
                isPrime = false;
                break;
            }
        }
        
        if (isPrime) {
            primes.push(candidate);
        }
        
        candidate += 2n;
    }
    
    return primes[n - 1];
}