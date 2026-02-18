// иниц. пароля
async function hash(text) {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

async function initPassword() {
    if (!localStorage.getItem("passwordHash")) {
        const h = await hash("1234");
        localStorage.setItem("passwordHash", h);
    }
}

initPassword();

// проверка
async function checkPassword(pass) {
    const stored = localStorage.getItem("passwordHash");
    const entered = await hash(pass);
    return stored === entered;
}

// Авторизация
function isAuth() {
    return localStorage.getItem("auth") === "true";
}

function logout() {
    localStorage.removeItem("auth");
    window.location.href = "login.html";
}

// Вход
async function login() {
    const passInput = document.getElementById("password");
    if (!passInput) return;

    const pass = passInput.value;

    if (await checkPassword(pass)) {
        localStorage.setItem("auth", "true");
        alert("Вход выполнен");
        window.location.href = "index.html";
    } else {
        alert("Неверный пароль");
    }
}

//смена
function isStrongPassword(pass) {
    if (pass.length < 6) return false;
    return /[A-Za-z]/.test(pass) && /\d/.test(pass);
}

async function changePassword() {
    if (!isAuth()) {
        alert("Сначала войдите");
        return;
    }

    const newPassInput = document.getElementById("newPassword");
    if (!newPassInput) return;

    const newPass = newPassInput.value;

    if (!isStrongPassword(newPass)) {
        alert("Пароль слабый (минимум 6 символов, буквы и цифры)");
        return;
    }

    const h = await hash(newPass);
    localStorage.setItem("passwordHash", h);
    localStorage.removeItem("auth");

    alert("Пароль изменён. Войдите снова.");
    window.location.href = "login.html";
}
