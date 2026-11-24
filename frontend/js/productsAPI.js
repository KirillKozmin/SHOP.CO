export const API_URL = "http://localhost:8000";

// Запрос списка товаров.
export async function getProducts(params = {}) {
    const query = new URLSearchParams();

    for (const key in params) {
        if (params[key] !== "" && params[key] !== undefined && params[key] !== null) {
            query.set(key, params[key]);
        }
    }

    const response = await fetch(`${API_URL}/products?${query.toString()}`);

    if (!response.ok) {
        throw new Error("Не удалось загрузить товары");
    }

    return response.json();
}

// Один товар по id.
export async function getProduct(id) {
    const response = await fetch(`${API_URL}/products/${id}`);

    if (!response.ok) {
        throw new Error("Товар не найден");
    }

    return response.json();
}
