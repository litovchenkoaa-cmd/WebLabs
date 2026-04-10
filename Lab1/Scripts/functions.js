"use strict";




alert( "Task 1, Get ready!" );
alert( "1)");

function func1(number) {
    let result = 0;
    let sign = Math.sign(number);
    number = Math.abs(number);

    while(number > 0)
    {
        result = result * 10 + (number % 10);
        number = Math.trunc(number/10);

    }


    return result * sign;

}

let value = Number(prompt("Enter the number: ", ''));
alert(func1(value));




alert( "2)");

function func2(number) {
    return Number([... new Set(String(number))].join(''));

}

value = Number(prompt("Enter the number: ", ''));
alert(func2(value));




alert( "3)");

function func3(number, value) {
    let quantity = 0;
    let stroka = String(number);
    for(let i = 0; i < stroka.length; i++)
    {
        if(Number(stroka[i]) === value)
        {
            quantity++;
        }
    }
    
    return quantity;

}

value = Number(prompt("Enter the number: ", ''));
alert(func3(value, Number(prompt("Enter the value: ", ''))));




alert( "4)");

function func4(number) {
    let stroka = number.toString(2).split('1');
    let Length = 0;

    for (let str of stroka)
    {
        Length = Math.max(Length, str.length);
    }
    return Length;
}

value = Number(prompt("Enter the number: ", ''));
alert(func4(value));

