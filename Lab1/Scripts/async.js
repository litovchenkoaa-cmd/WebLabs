class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

async function loadJson(url) {
    const response = await fetch(url)

    if (response.status == 200) {
        const json = response.json();
        return json;
    } else {
        throw new HttpError(response);
    }
}

// Запрашивается логин, пока github не вернёт существующего пользователя.
async function getGithubUser() {
    while(true)
    {
        let name = prompt("Введите логин?", "iliakan");
        try{
            const user = await loadJson(`https://api.github.com/users/${name}`)
            alert(`Полное имя: ${user.name}.`);
            return user;
        }
        catch (err) {
            if (err instanceof HttpError && err.response.status == 404) {
            alert("Такого пользователя не существует, пожалуйста, повторите ввод.");
            
            } else {
            throw err;
            }
        }
    }
}

getGithubUser();