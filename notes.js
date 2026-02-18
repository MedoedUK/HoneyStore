// Проверка авторизации
if (!localStorage.getItem("auth")) {
    window.location.href = "login.html";
}

// Автоблокировка через 2 минуты
let timeout;
function resetTimer() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        alert("Сессия заблокирована");
        logout();
    }, 120000); // 2 минуты
}
document.onmousemove = resetTimer;
document.onkeypress = resetTimer;
resetTimer();

//Установка пароля 
// Берётся хешированный пароль из auth.js и сохраняется в userPassword для шифрования
// нужно, чтобы заметки могли шифроваться и расшифровываться
const storedHash = localStorage.getItem("passwordHash");
if (!localStorage.getItem("userPassword")) {

    const tempPass = prompt("Введите текущий пароль для доступа к заметкам:");
    if (tempPass) {
        localStorage.setItem("userPassword", tempPass);
    } else {
        alert("Нужен пароль для работы заметок");
        logout();
    }
}

// Сохранение 
function saveNote() {
    const text = document.getElementById("noteInput").value;
    const password = localStorage.getItem("userPassword");

    if (!password) {
        alert("Пароль не установлен");
        return;
    }

    const encrypted = CryptoJS.AES.encrypt(text, password).toString();
    localStorage.setItem("secureNote", encrypted);

    alert("Заметка зашифрована и сохранена");
}

//Загрузка 
function loadNote() {
    const encrypted = localStorage.getItem("secureNote");
    const password = localStorage.getItem("userPassword");

    if (!encrypted) {
        alert("Нет сохранённых данных");
        return;
    }

    try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, password)
            .toString(CryptoJS.enc.Utf8);

        if (!decrypted) throw new Error("Ошибка дешифрования");

        document.getElementById("noteInput").value = decrypted;
    } catch (err) {
        alert("Не удалось загрузить заметку. Возможно, введён неверный пароль.");
    }
}

//  Выход
function logout() {
    localStorage.removeItem("auth");
    localStorage.removeItem("userPassword");
    window.location.href = "login.html";
}

//  Резервное копирование 

// Зашифрованная 
function backupNoteEncrypted() {
    const data = localStorage.getItem("secureNote");
    if (!data) {
        alert("Нет данных для резервного копирования");
        return;
    }

    const blob = new Blob([data], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "backup_note_encrypted.txt";
    link.click();
}

// Расшифрованная 
function backupNoteDecrypted() {
    const encrypted = localStorage.getItem("secureNote");
    const password = localStorage.getItem("userPassword");

    if (!encrypted) {
        alert("Нет данных для резервного копирования");
        return;
    }

    try {
        const decrypted = CryptoJS.AES.decrypt(encrypted, password)
            .toString(CryptoJS.enc.Utf8);

        const blob = new Blob([decrypted], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "backup_note_decrypted.txt";
        link.click();
    } catch (err) {
        alert("Не удалось создать расшифрованную резервную копию");
    }
}
