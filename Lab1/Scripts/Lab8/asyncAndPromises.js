// ==================== ОБЩИЕ УТИЛИТЫ ====================
function appendOutput(elementId, text, isError = false) {
    const output = document.getElementById(elementId);
    if (output.classList.contains('loading')) {
        output.classList.remove('loading');
        output.textContent = '';
    }
    if (isError) {
        output.classList.add('error');
    } else {
        output.classList.remove('error');
    }
    output.textContent += text + '\n';
    output.scrollTop = output.scrollHeight;
}

function clearOutput(elementId) {
    const output = document.getElementById(elementId);
    output.textContent = '';
    output.classList.remove('error', 'loading');
}

function setLoading(elementId) {
    const output = document.getElementById(elementId);
    output.textContent = 'Загрузка...';
    output.classList.add('loading');
    output.classList.remove('error');
}

// ==================== ЗАДАЧА 1.1: counter(n) ====================
function counter(n, outputId) {
    let current = n;
    
    function tick() {
        appendOutput(outputId, current);
        if (current > 0) {
            current--;
            setTimeout(tick, 1000);
        }
    }
    tick();
}

function runCounter() {
    const n = parseInt(document.getElementById('input1_1').value);
    if (isNaN(n) || n < 0) {
        appendOutput('output1_1', '❌ Введите корректное неотрицательное число', true);
        return;
    }
    clearOutput('output1_1');
    appendOutput('output1_1', `Запуск обратного отсчёта с ${n}...`);
    counter(n, 'output1_1');
}

// ==================== ЗАДАЧА 1.2: createCounter(n) ====================
let activeCounter = null;

function createCounter(n, outputId) {
    let current = n;
    let timerId = null;
    let isRunning = false;

    function tick() {
        appendOutput(outputId, current);
        if (current <= 0) {
            stop();
            return;
        }
        current--;
    }

    function start() {
        if (isRunning) return;
        isRunning = true;
        tick();
        if (current > 0) {
            timerId = setInterval(tick, 1000);
        }
        updateCounterButtons();
    }

    function pause() {
        if (!isRunning) return;
        isRunning = false;
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        updateCounterButtons();
    }

    function stop() {
        pause();
        current = n;
        appendOutput(outputId, `↺ Счётчик сброшен к ${n}`);
        updateCounterButtons();
    }

    function updateCounterButtons() {
        document.getElementById('btnStart').disabled = isRunning || current <= 0;
        document.getElementById('btnPause').disabled = !isRunning;
        document.getElementById('btnStop').disabled = false;
        const status = document.getElementById('counterStatus');
        if (current <= 0 && !isRunning) {
            status.textContent = '✓ Завершён';
        } else if (isRunning) {
            status.textContent = `▶ Работает: ${current}`;
        } else {
            status.textContent = `⏸ Пауза: ${current}`;
        }
    }

    // Инициализация кнопок
    updateCounterButtons();

    return { start, pause, stop };
}

function initCounter() {
    const n = parseInt(document.getElementById('input1_2').value);
    if (isNaN(n) || n < 0) {
        appendOutput('output1_2', '❌ Введите корректное неотрицательное число', true);
        return;
    }
    clearOutput('output1_2');
    if (activeCounter && activeCounter.stop) {
        activeCounter.stop();
    }
    activeCounter = createCounter(n, 'output1_2');
    appendOutput('output1_2', `✓ Счётчик создан: ${n}`);
    document.getElementById('btnStart').disabled = false;
    document.getElementById('btnPause').disabled = true;
    document.getElementById('btnStop').disabled = false;
    document.getElementById('counterStatus').textContent = `Готов: ${n}`;
}

function counterStart() {
    if (activeCounter) activeCounter.start();
}

function counterPause() {
    if (activeCounter) activeCounter.pause();
}

function counterStop() {
    if (activeCounter) activeCounter.stop();
}

// ==================== ЗАДАЧА 2.1: delay(N) ====================
function delay(N) {
    return new Promise(resolve => {
        setTimeout(() => resolve(`✅ Прошло ${N} секунд`), N * 1000);
    });
}

async function runDelay() {
    const n = parseFloat(document.getElementById('input2_1').value);
    if (isNaN(n) || n < 0) {
        appendOutput('output2_1', '❌ Введите корректное неотрицательное число', true);
        return;
    }
    setLoading('output2_1');
    try {
        const result = await delay(n);
        appendOutput('output2_1', result);
    } catch (err) {
        appendOutput('output2_1', '❌ Ошибка: ' + err.message, true);
    }
}

// ==================== ЗАДАЧА 2.2: counter через delay ====================
async function counterWithDelay(n, outputId) {
    for (let i = n; i >= 0; i--) {
        appendOutput(outputId, i);
        if (i > 0) {
            await delay(1);
        }
    }
}

async function runCounterWithDelay() {
    const n = parseInt(document.getElementById('input2_2').value);
    if (isNaN(n) || n < 0) {
        appendOutput('output2_2', '❌ Введите корректное неотрицательное число', true);
        return;
    }
    clearOutput('output2_2');
    appendOutput('output2_2', `Запуск обратного отсчёта с ${n} через Promise...`);
    try {
        await counterWithDelay(n, 'output2_2');
        appendOutput('output2_2', '✓ Завершено!');
    } catch (err) {
        appendOutput('output2_2', '❌ Ошибка: ' + err.message, true);
    }
}

// ==================== ЗАДАЧА 2.3: GitHub первый репозиторий ====================
async function getFirstRepo(username) {
    // Первый запрос — список репозиториев
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=1`);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const repos = await response.json();
    if (repos.length === 0) {
        return { message: 'У пользователя нет публичных репозиториев' };
    }
    const firstRepo = repos[0];
    return {
        name: firstRepo.name,
        full_name: firstRepo.full_name,
        description: firstRepo.description || 'Нет описания',
        url: firstRepo.html_url,
        stars: firstRepo.stargazers_count,
        language: firstRepo.language || 'N/A'
    };
}

async function runGetFirstRepo() {
    const username = document.getElementById('input2_3').value.trim();
    if (!username) {
        appendOutput('output2_3', '❌ Введите имя пользователя GitHub', true);
        return;
    }
    setLoading('output2_3');
    try {
        const repo = await getFirstRepo(username);
        if (repo.message) {
            appendOutput('output2_3', `ℹ️ ${repo.message}`);
        } else {
            let result = `📦 Репозиторий: ${repo.name}\n`;
            result += `🔗 Полное имя: ${repo.full_name}\n`;
            result += `📝 Описание: ${repo.description}\n`;
            result += `⭐ Звёзды: ${repo.stars}\n`;
            result += `💻 Язык: ${repo.language}\n`;
            result += `🌐 Ссылка: <a href="${repo.url}" target="_blank">${repo.url}</a>`;
            
            const output = document.getElementById('output2_3');
            output.classList.remove('error', 'loading');
            output.innerHTML = result;
        }
    } catch (err) {
        let msg = err.message;
        if (msg.includes('404')) msg = '❌ Пользователь не найден';
        else if (msg.includes('403')) msg = '⚠️ Превышен лимит запросов GitHub API (попробуйте позже)';
        appendOutput('output2_3', msg, true);
    }
}

// ==================== ЗАДАЧА 3: getGithubUser с async/await ====================
class HttpError extends Error {
    constructor(response) {
        super(`${response.status} for ${response.url}`);
        this.name = 'HttpError';
        this.response = response;
    }
}

async function loadJson(url) {
    const response = await fetch(url);
    if (response.status === 200) {
        return await response.json();
    } else {
        throw new HttpError(response);
    }
}

async function getGithubUser(username) {
    try {
        const user = await loadJson(`https://api.github.com/users/${username}`);
        return {
            success: true,
            name: user.name || user.login,
            bio: user.bio || 'Нет биографии',
            public_repos: user.public_repos,
            followers: user.followers,
            url: user.html_url,
            avatar: user.avatar_url
        };
    } catch (err) {
        if (err instanceof HttpError && err.response.status === 404) {
            return { success: false, error: 'Пользователь не найден' };
        }
        throw err;
    }
}

async function runGetGithubUser() {
    const username = document.getElementById('input3').value.trim();
    if (!username) {
        appendOutput('output3', '❌ Введите имя пользователя GitHub', true);
        return;
    }
    setLoading('output3');
    try {
        const result = await getGithubUser(username);
        if (result.success) {
            let output = `✅ Пользователь найден!\n`;
            output += `👤 Имя: ${result.name}\n`;
            output += `📝 Био: ${result.bio}\n`;
            output += `📦 Репозиториев: ${result.public_repos}\n`;
            output += `👥 Подписчиков: ${result.followers}\n`;
            output += `🔗 Профиль: <a href="${result.url}" target="_blank">${result.url}</a>`;
            
            const el = document.getElementById('output3');
            el.classList.remove('error', 'loading');
            el.innerHTML = output;
        } else {
            appendOutput('output3', `⚠️ ${result.error}. Попробуйте другое имя.`, true);
        }
    } catch (err) {
        let msg = err.message;
        if (msg.includes('403')) msg = '⚠️ Превышен лимит запросов GitHub API';
        appendOutput('output3', `❌ Ошибка: ${msg}`, true);
    }
}

// Инициализация: отключаем кнопки счётчика до создания
document.getElementById('btnStart').disabled = true;
document.getElementById('btnPause').disabled = true;
document.getElementById('btnStop').disabled = true;