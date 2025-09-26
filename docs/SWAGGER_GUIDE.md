# Foodies API – Swagger Guide

# Запуск Swagger

Встанови залежності:

npm install

Запусти сервер:

npm run dev

Відкрий у браузері:
http://localhost:3000/api-docs

Ти побачиш інтерактивну документацію Swagger UI.

# Авторизація (JWT)

Створи або увійди в акаунт:

POST /auth/register – створення користувача

POST /auth/login – отримання токена

Приклад для логіну:

{
"email": "user@example.com",
"password": "secret123"
}

Скопіюй токен з відповіді ("token": "...").

У Swagger UI натисни Authorize, встав токен без Bearer, підтверди.

Тепер усі захищені запити будуть виконуватись з JWT у заголовках.

# Основні ендпоінти

## Auth

POST /auth/register – реєстрація нового користувача

POST /auth/login – отримання JWT токена

Приклад відповіді:

{
"token": "jwt_token_here",
"user": {
"id": "FqCQNJjkb0DDF2cvj8pA2",
"name": "Ivan",
"email": "user@example.com",
"avatar_url": "https://..."
}
}

## Users

GET /users/me – профіль поточного користувача

PATCH /users/me – оновлення профілю

GET /users/{id} – перегляд іншого користувача

## Recipes

GET /recipes – список рецептів (фільтри: category, ingredient, page)

POST /recipes – створення рецепта

GET /recipes/{id} – деталі рецепта

PATCH /recipes/{id} – оновлення рецепта

DELETE /recipes/{id} – видалення рецепта

Приклад створення:

{
"title": "Borshch",
"description": "Traditional Ukrainian soup",
"instructions": "Boil beetroot, add cabbage...",
"image_url": "https://example.com/borshch.jpg",
"category_id": "1",
"area_id": "UA",
"ingredients": [
{ "ingredient_id": "beet", "quantity": "2 pcs" },
{ "ingredient_id": "cabbage", "quantity": "200 g" }
]
}

## Favorites

POST /recipes/{id}/favorite – додати рецепт у вибране

DELETE /recipes/{id}/favorite – видалити з вибраного

## Reviews

GET /recipes/{id}/reviews – отримати відгуки

POST /recipes/{id}/reviews – залишити відгук

Приклад:

{
"rating": 5,
"content": "Дуже смачно!"
}

## Додаткові ендпоінти

GET /categories – список категорій

GET /areas – список регіонів

GET /ingredients – список інгредієнтів

### Типові помилки

401 Unauthorized → не вказаний або прострочений токен

400 Bad Request → некоректні дані у запиті

404 Not Found → рецепт/користувач не існує

500 Server Error → проблема на сервері

### Рекомендації команді

Завжди перевіряйте зміни API у Swagger перед злиттям у main.

Тримайте swagger.yaml актуальним.

Для автотестів використовуйте Postman або Jest із supertest.
