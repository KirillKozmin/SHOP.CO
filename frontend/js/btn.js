// Все кнопки: цвета, размеры и количество товара.
document.addEventListener("click", (event) => {
    const color = event.target.closest(".color");
    if (color) {
        document.querySelectorAll(".color").forEach((item) => {
            item.textContent = "";
        });
        color.innerHTML = '<img src="../img/Frame (4).svg" alt="✓">';
        return;
    }

    const catalogSize = event.target.closest(".catalog__size");
    if (catalogSize) {
        document.querySelectorAll(".catalog__size").forEach((item) => {
            item.classList.remove("catalog__size-active");
        });
        catalogSize.classList.add("catalog__size-active");
        return;
    }

    const productColor = event.target.closest(".product__color");
    if (productColor) {
        document.querySelectorAll(".product__color").forEach((item) => {
            item.textContent = "";
            item.classList.remove("product__color-selected");
        });
        productColor.classList.add("product__color-selected");
        productColor.innerHTML = '<img src="../img/Frame (4).svg" alt="✓">';
        return;
    }

    const productSize = event.target.closest(".product__size");
    if (productSize) {
        document.querySelectorAll(".product__size").forEach((item) => {
            item.classList.remove("product__size-selected");
        });
        productSize.classList.add("product__size-selected");
        return;
    }

    const plus = event.target.closest(".product__quantity-plus");
    if (plus) {
        const quantity = plus.closest(".product__quantity");
        const value = quantity.querySelector(".product__quantity-value");
        const minus = quantity.querySelector(".product__quantity-minus");

        value.textContent = Number(value.textContent) + 1;
        minus.disabled = false;
        return;
    }

    const minus = event.target.closest(".product__quantity-minus");
    if (minus) {
        const quantity = minus.closest(".product__quantity");
        const value = quantity.querySelector(".product__quantity-value");
        const count = Number(value.textContent);

        if (count > 1) {
            value.textContent = count - 1;
        }

        minus.disabled = Number(value.textContent) === 1;
    }
});

// Минус неактивен, пока количество равно 1.
document.querySelectorAll(".product__quantity").forEach((quantity) => {
    const value = quantity.querySelector(".product__quantity-value");
    const minus = quantity.querySelector(".product__quantity-minus");
    minus.disabled = Number(value.textContent) === 1;
});
