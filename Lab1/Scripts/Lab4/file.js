"use strict";
//task 1
alert( "Task 1, Get ready!" );
let Name, admin;
Name = "John";
admin = Name;
alert( admin );

//task 2
alert( "Task 2, Get ready!" );
let a = Number(prompt("First value?", ''));
let b = Number(prompt("Second value?", ''));

alert(a + b);

//task 3
alert( "Task 3, Get ready!" );
for (let j = 2; j <= 10; j++) {
    if (j % 2 === 0) {
        alert(j);
    }
}

//task 4
alert( "Task 4, Get ready!" );
let i = 0
while (i < 3) {
    alert( `number ${i}!` );
    i++;
}

//task 5
alert( "Task 5, Get ready!" );
let flag = true;
let value = 0;
while (flag) {
    value = prompt("Enter value more than 100: ", '');
    if (value === null){
        flag = false;
    } 
    else if (Number(value) <= 100){
        continue;
    } 
    else
    {
        flag = false;
    }

}

// task 6
alert( "Task 6, Get ready!")
let n = 10;
let pupupu = false;

for (let j = 2; j <= 20; j++)
{
    pupupu = false;
    if (j === 2){
        alert(j);
        continue;
    }

    for (let k = 2; k <= j**0.5; k++)
    {
        if (j % k === 0)
        {
            pupupu = true;
            k = j ** 0.5 + 1;
        }
    }
    if (!pupupu)
    {
         alert(j);
    }
    
}