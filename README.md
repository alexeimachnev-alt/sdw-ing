# СДВ Инжиниринг — Telegram Mini App + Бот (aiogram 3)

## Структура архива
- `frontend/` — Telegram Mini App (React + TypeScript + Tailwind CSS + Framer Motion)
- `backend/` — Telegram-бот на Python (aiogram 3 + aiohttp API для приёма заявок)

## Быстрый запуск локально

### 1. Фронтенд
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 2. Бэкенд
```bash
cd backend
cp .env.example .env
# Заполните BOT_TOKEN, ADMIN_CHAT_ID и WEBAPP_URL в .env
pip install -r requirements.txt
python bot.py
```
