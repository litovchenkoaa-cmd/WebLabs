//1
function signCount(arr) {
    if (arr.length <= 1) return 0;
    
    let count = 0;
    let lastSign = 0;
    
    for (let num of arr) {
        let sign = Math.sign(num);
        if (sign === 0) continue;
        if (lastSign !== 0 && sign !== lastSign) {
            count++;
        }
        lastSign = sign;
    }
    return count;
}

// Проверка:
console.log(signCount([1, 0, -1, -3, -5, 5, -1])); // 3
console.log(signCount([1, 0, 1, 3, 5, 5, 1]));     // 0
console.log(signCount([-11, 1, 3, 5, 1]));          // 1



//2
function createAsc(arr) {
    if (arr.length === 0) return [];
    
    const n = arr.length;
    const dp = new Array(n).fill(1);
    const parent = new Array(n).fill(-1);
    
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (arr[j] < arr[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                parent[i] = j;
            }
        }
    }
    
    let maxLen = 0, maxIdx = 0;
    for (let i = 0; i < n; i++) {
        if (dp[i] > maxLen) {
            maxLen = dp[i];
            maxIdx = i;
        }
    }
    
    const result = [];
    let curr = maxIdx;
    while (curr !== -1) {
        result.unshift(arr[curr]);
        curr = parent[curr];
    }
    
    return result;
}

// Проверка:
console.log(createAsc([6,2,5,4,2,5,6])); // [2,4,5,6]



//3
function f3() {
    return new Promise((resolve, reject) => {
        Math.random() < 0.5 ? resolve() : reject();
    });
}

// Проверка:
f3()
    .then(() => console.log('resolved'))
    .catch(() => console.log('rejected'));



//4
function CtoF(celsius) {
    return celsius * 9/5 + 32;
}

function FtoC(fahrenheit) {
    return +((fahrenheit - 32) * 5/9).toFixed(4);
}

// Проверка:
console.log(CtoF(0));    // 32
console.log(CtoF(50));   // 122
console.log(CtoF(100));  // 212
console.log(FtoC(0));    // -17.7778
console.log(FtoC(50));   // 10
console.log(FtoC(100));  // 37.7778




//5
function clearStr(str) {
    return str.replace(/\d/g, '');
}

// Проверка:
console.log(clearStr("3f54u55f895fg5jyi454")); // "fuffgjyi"



//6
function mostRare(str) {
    const words = str.trim().split(/\s+/);
    const freq = {};
    
    for (let word of words) {
        freq[word] = (freq[word] || 0) + 1;
    }
    
    let minFreq = Infinity;
    let rarest = '';
    
    for (let word in freq) {
        if (freq[word] < minFreq) {
            minFreq = freq[word];
            rarest = word;
        }
    }
    
    return rarest;
}

// Проверка:
console.log(mostRare("ток кот кукож ток кот")); // "кукож"




//7
function randomRange(N, M) {
    return Math.floor(Math.random() * (M - N + 1)) + N;
}

// Проверка:
const r = randomRange(5, 10);
console.log(r >= 5 && r <= 10); // true
console.log(randomRange(5, 10) === 23); // false (невозможно)




//8
let j;
for (j = 1; j <= 3; j++) {
    setTimeout(console.log, 1000, j);
}


//9
function f9(str) {
    function isPalindrome(s) {
        return s === s.split('').reverse().join('');
    }
    
    let longest = '';
    
    for (let i = 0; i < str.length; i++) {
        for (let j = i + 1; j <= str.length; j++) {
            const substr = str.slice(i, j);
            if (isPalindrome(substr) && substr.length > longest.length) {
                longest = substr;
            }
        }
    }
    
    return longest;
}

// Проверка:
console.log(f9("123abcba123abba")); // "abcba"



//10
function f10(arr, target) {
    // Защита от некорректных аргументов
    if (!Array.isArray(arr)) {
        console.error('Первый аргумент должен быть массивом чисел');
        return false;
    }
    if (typeof target !== 'number' || isNaN(target)) {
        console.error('Второй аргумент должен быть числом');
        return false;
    }
    
    const seen = new Set();
    for (let num of arr) {
        if (typeof num !== 'number') continue; // пропускаем не-числа
        if (seen.has(target - num)) {
            return true;
        }
        seen.add(num);
    }
    return false;
}

// Проверка:
console.log(f10([1, 3, 4], 5)); // true (1 + 4)
console.log(f10([1, 2, 3], 10)); // false