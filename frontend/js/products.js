import { API_URL, getProduct, getProducts } from "./productsAPI.js";

const CLASSES = {
    catalog: ["catalog__product", "catalog__product-title", "catalog__product-rating", "catalog__product-price", "catalog__product-old-price", "catalog__product-discount"],
    home: ["products__card-item", "products__title", "products__estimation", "products__price", "products__text-crossed", "products__discount"],
    related: ["product-card__item", "product-card__title", "product-card__rating", "product-card__prices", "product-card__price product-card__price-old", "product-card__discount"],
};

const IMAGES = {
    "Polo with Contrast Trims": "Polo with Contrast Trims.svg",
    "T-shirt with Tape Details": "T-SHIRT WITH TAPE DETAILS.svg",
    "One Life Graphic T-shirt": "T-SHIRT WITH TAPE DETAILS.svg",
    "Faded Skinny Jeans": "FADED SKINNY JEANS.svg",
    "Classic Oxford Shirt": "CHECKERED SHIRT.svg",
    "Slim Fit Dress Shirt": "VERTICAL STRIPED SHIRT.svg",
    "Relaxed Hoodie": "T-SHIRT WITH TAPE DETAILS.svg",
    "Zip-Up Hoodie": "T-SHIRT WITH TAPE DETAILS.svg",
    "Oversized Graphic Hoodie": "T-SHIRT WITH TAPE DETAILS.svg",
    "Athletic Training Shorts": "LOOSE FIT BERMUDA SHORTS.svg",
    "Cargo Shorts": "LOOSE FIT BERMUDA SHORTS.svg",
    "Denim Shorts": "LOOSE FIT BERMUDA SHORTS.svg",
    "Straight Leg Jeans": "SKINNY FIT JEANS.svg",
    "Gym Performance T-shirt": "COURAGE GRAPHIC T-SHIRT.svg",
    "Party Sequin Shirt": "CHECKERED SHIRT.svg",
};

const FALLBACK = "../img/T-SHIRT WITH TAPE DETAILS.svg";



function imageUrl(product) {
    return Number(product.image) <= 9
        ? `${API_URL}/static/images/${product.image}.png`
        : `../img/${IMAGES[product.name] || "T-SHIRT WITH TAPE DETAILS.svg"}`;
}

function ratingImage(rating) {
    const value = Math.min(5, Math.max(3, Math.round(Number(rating) * 2) / 2));
    return `../img/estimation${value}.svg`;
}

function setMessage(element, text) {
    element.textContent = text;
    element.hidden = !text;
}

function productCard(product, type) {
    const [card, title, rating, price, oldPrice, discount] = CLASSES[type];

    return `
        <a class="${card}" href="./product.html?id=${product.id}">
            <img src="${imageUrl(product)}" alt="${product.alt}" loading="lazy"
                onerror="this.onerror=null;this.src='${FALLBACK}'">
            <p class="${title}">${product.name}</p>
            <div class="${rating}">
                <img src="${ratingImage(product.rating)}" alt="Rating">
                <p>${Number(product.rating).toFixed(1)}/5</p>
            </div>
            <div class="${price}">
                <p>$${product.price}</p>
                ${product.oldPrice ? `<p class="${oldPrice}">$${product.oldPrice}</p>` : ""}
                ${product.discount ? `<p class="${discount}">-${product.discount}%</p>` : ""}
            </div>
        </a>
    `;
}

function render(list, message, products, type) {
    if (products.length === 0) {
        setMessage(message, "No products found.");
        return;
    }

    setMessage(message, "");
    list.innerHTML = products.map((product) => productCard(product, type)).join("");
}

// category

const catalog = document.querySelector("#catalog-products");

if (catalog) {
    const status = document.querySelector("#catalog-status");
    const message = document.querySelector("#catalog-message");
    const prev = document.querySelector("#catalog-prev");
    const next = document.querySelector("#catalog-next");
    const pages = document.querySelector("#catalog-pages");
    let page = 1;
    let pagesCount = 1;

    pages.onclick = (event) => {
        const button = event.target.closest(".catalog__page");
        if (button) {
            page = Number(button.dataset.page);
            loadCatalog();
        }
    };

    prev.onclick = () => {
        if (page > 1) {
            page = page - 1;
            loadCatalog();
        }
    };

    next.onclick = () => {
        if (page < pagesCount) {
            page = page + 1;
            loadCatalog();
        }
    };

    async function loadCatalog() {
        catalog.innerHTML = "";
        setMessage(message, "Loading products...");

        try {
            const data = await getProducts({ page, limit: 9, sortBy: "popular", order: "desc" });
            pagesCount = data.pages;
            prev.disabled = data.page === 1;
            next.disabled = data.page === data.pages;

            if (data.items.length === 0) {
                status.textContent = "No products found";
                pages.innerHTML = "";
                prev.disabled = true;
                next.disabled = true;
                setMessage(message, "Nothing matches these filters.");
                return;
            }

            render(catalog, message, data.items, "catalog");

            const first = (data.page - 1) * data.limit + 1;
            const last = Math.min(data.page * data.limit, data.total);
            status.textContent = `Showing ${first}-${last} of ${data.total} Products`;

            pages.innerHTML = Array.from({ length: data.pages }, (_, index) => {
                const number = index + 1;
                const active = number === data.page ? "catalog__page-active" : "";
                return `<button type="button" class="catalog__page ${active}" data-page="${number}">${number}</button>`;
            }).join("");
        } catch {
            status.textContent = "";
            setMessage(message, "Could not load products. Please try again later.");
        }
    }

    loadCatalog();
}

// YOU MIGHT ALSO LIKE

const related = document.querySelector("#related-products-list");

if (related) {
    const relatedMessage = document.querySelector("#related-products-message");

    (async () => {
        setMessage(relatedMessage, "Loading products...");

        try {
            const { items } = await getProducts({ limit: 4, sortBy: "popular", order: "desc" });
            render(related, relatedMessage, items, "related");
        } catch {
            setMessage(relatedMessage, "Could not load products.");
        }
    })();
}

// product

const productTitle = document.querySelector("#product-title");

if (productTitle) {
    const productCategory = document.querySelector("#product-category");
    const productImage = document.querySelector("#product-image");
    const productThumbnails = document.querySelector("#product-thumbnails");
    const productRating = document.querySelector("#product-rating");
    const productPrices = document.querySelector("#product-prices");
    const productDescription = document.querySelector("#product-description");
    const productColors = document.querySelector("#product-colors");
    const productSizes = document.querySelector("#product-sizes");
    const productMessage = document.querySelector("#product-message");

    // Цвета из API приходят названиями, а кнопке нужен обычный CSS-цвет.
    const COLOR_VALUES = {
        green: "#00c12b", red: "#f50606", yellow: "#f5dd06", orange: "#f57906", cyan: "#06caf5",
        blue: "#063af5", purple: "#7d06f5", pink: "#f506a4", white: "#ffffff", black: "#000000",
    };

    // id берём из адреса: product.html?id=3. Если id нет — открываем товар 12.
    const productId = new URLSearchParams(window.location.search).get("id") || "12";

    // Одна кнопка цвета.
    function makeColorButton(color, index) {
        const isFirst = index === 0;
        const selectedClass = isFirst ? "product__color-selected" : "";
        const checkMark = isFirst ? '<img src="../img/Frame (4).svg" alt="✓">' : "";
        const backgroundColor = COLOR_VALUES[color] || "#cccccc";

        return `<button class="product__color ${selectedClass}" type="button"
            style="background-color: ${backgroundColor}"
            data-color="${color}" aria-label="${color}">${checkMark}</button>`;
    }

    // Одна кнопка размера.
    function makeSizeButton(size, defaultSize) {
        const selectedClass = size === defaultSize ? "product__size-selected" : "";
        return `<button class="product__size ${selectedClass}" type="button">${size}</button>`;
    }

    // Заполняем страницу данными товара.
    function showProduct(product) {
        const imageSource = imageUrl(product);
        const ratingValue = Number(product.rating).toFixed(1);
        const defaultSize = product.sizes.includes("Large") ? "Large" : product.sizes[0];

        // Название и категория в хлебных крошках.
        productTitle.textContent = product.name.toUpperCase();
        productCategory.textContent = product.category;

        // Основная картинка и миниатюра.
        productImage.src = imageSource;
        productImage.alt = product.alt;
        productThumbnails.innerHTML = `<img src="${imageSource}" alt="${product.alt}">`;

        // Рейтинг.
        productRating.innerHTML = `
            <img src="${ratingImage(product.rating)}" alt="Rating">
            <p class="product__rating-valuet">${ratingValue}/</p>
            <p class="product__rating-total">5</p>
        `;

        // Старая цена и скидка показываются только если они есть.
        let oldPriceHtml = "";
        if (product.oldPrice) {
            oldPriceHtml = `<p class="product__price-old">$${product.oldPrice}</p>`;
        }

        let discountHtml = "";
        if (product.discount) {
            discountHtml = `<p class="product__discount">-${product.discount}%</p>`;
        }

        productPrices.innerHTML = `
            <p>$${product.price}</p>
            ${oldPriceHtml}
            ${discountHtml}
        `;

        productDescription.textContent = product.description;

        // Цвета и размеры рисуем кнопками.
        productColors.innerHTML = product.colors.map(makeColorButton).join("");
        productSizes.innerHTML = product.sizes
            .map((size) => makeSizeButton(size, defaultSize))
            .join("");

        // Убираем сообщение «Loading product...».
        setMessage(productMessage, "");
    }

    // Загружаем товар по id.
    async function loadProduct() {
        try {
            const product = await getProduct(productId);
            showProduct(product);
        } catch {
            productTitle.textContent = "Product not found";
            setMessage(productMessage, "Could not load this product. Please return to the catalog.");
        }
    }

    loadProduct();
}
