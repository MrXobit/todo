# Назва проекту

Цей проект складається з двох основних частин:
- **Серверна частина** (backend) — папка `server`
- **Клієнтська частина** (frontend) — папка `client`

## Структура проекту

- `/server` — серверна частина проекту, яка відповідає за логіку та обробку запитів.
- `/client` — клієнтська частина проекту, яка відповідає за відображення інтерфейсу та взаємодію з користувачем.

## Встановлення та запуск

### 1. Налаштування серверної частини

1. Перейдіть до папки `server`:
    ```bash
    cd server
    ```

2. Встановіть залежності для серверної частини:
    ```bash
    npm install
    ```

3. Запустіть сервер у режимі розробки:
    ```bash
    npm run dev
    ```

    Після цього сервер буде працювати на локальному сервері (наприклад, на `http://localhost:5000`).

### 2. Налаштування клієнтської частини

1. Перейдіть до папки `client`:
    ```bash
    cd client
    ```

2. Встановіть залежності для клієнтської частини:
    ```bash
    npm install
    ```

3. Запустіть клієнтську частину:
    ```bash
    npm start
    ```

    Після цього клієнт буде доступний на локальному сервері, зазвичай на `http://localhost:3000`.

## Примітки

- Переконайтесь, що ви маєте встановлені всі необхідні залежності та правильно налаштовані середовища для роботи обох частин проекту.
- Сервер і клієнт повинні працювати паралельно для коректної роботи всього проекту.
