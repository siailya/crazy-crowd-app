# Crazy Crowd App

**Crazy Crowd App** — экзотический Vue.js-сервис регистрации с цепочкой капч-головоломок и «шизанутым» интерфейсом

## Описание

Приложение проводит пользователя через серию «капч» шагов:

1. Генерация аватара
2. Цветовая головоломка
3. Ввод слова в обратном порядке
4. Поиск бодрой овечки
5. «Нажми быстро»
6. Финальный шаг
7. Пятиминутная задержка перед входом

Шаги открываются друг за другом в родительском компоненте `TheRegistrationView.vue`, сохраняются в Local Storage и
подхватываются при перезагрузке. После успешного прохождения всех этапов и таймаута появляется кнопка «На вход»

## Архитектура

- **Vue 3 + `<script setup>` + TypeScript**
- **Pinia** для глобального состояния и аутентификации
- **NaiveUI** для визуальных компонентов (`n-button`, `n-modal`, `n-input`, `n-form` и пр.)
- Родительский компонент:
    - Агрегирует все капчи по шагам
    - Хранит прогресс в Local Storage
    - Обеспечивает задержки, таймеры и блокировки
- Каждый шаг ― отдельный SFC-компонент в `src/pages/auth/captcha`

## Установка и запуск

```bash
git clone https://github.com/siailya/crazy-crowd-app.git
cd crazy-crowd-app
npm install
npm run dev          # запустить локально на http://localhost:5173
```

## Сборка

```bash
npm run build        # production-сборка в папку dist/
```

## Docker

В корне проекта есть `Dockerfile`, собирающий приложение и раздающий его через Nginx

### Собрать образ локально

```bash
docker build -t crazy-crowd-app .
```

### Запустить контейнер

```bash
docker run -d -p 80:80 crazy-crowd-app
```

### Использовать готовый образ

На Docker Hub доступен образ `siailyadev/crazy-crowd-app`:

```bash
docker pull siailyadev/crazy-crowd-app
docker run -d -p 80:80 siailyadev/crazy-crowd-app
```

## Авторизация

* После регистрации данные пользователя сохраняются в Local Storage
* Флаг `isAuthenticated` подтягивается из Local Storage и хранится в Pinia
* Маршруты `/auth/*` защищены: авторизованный пользователь будет перенаправлен на `/home`
