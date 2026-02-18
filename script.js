if (!localStorage.getItem("auth") &&
    !window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
}


//Анимация
const products = document.querySelectorAll('.product-card');

products.forEach(product => {
    product.addEventListener('mouseenter', () => {
        product.style.transition = 'transform 0.3s, box-shadow 0.3s';
    });
    product.addEventListener('mouseleave', () => {
        product.style.transition = 'transform 0.3s, box-shadow 0.3s';
    });
});

////////////////////////////////////////////////////////////////////////

//Скрипт который добавляет товары в корзину и удаляет
const buttons = document.querySelectorAll(".add-btn");

buttons.forEach(button => {
    button.addEventListener("click", function () {

        const card = this.closest(".product-card");

        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = parseInt(card.dataset.price);

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find(item => item.id === id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
    });
});

