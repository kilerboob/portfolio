# React Landing (Vite + React + TS + Tailwind)

## Страницы

- /services — карточки услуг, анимации, CTA (контакт/Telegram)
- /contact — форма с валидацией и уведомлением об успехе
- /login, /register — регистрация выполняет автологин и редирект на /services

## ENV

- VITE_API_BASE — базовый URL API. В Docker уже прокинут `http://127.0.0.1:18000`.

## Dev

```powershell
npm i
npm run dev
```

Откройте <http://127.0.0.1:5173>

## Prod build

```powershell
npm run build
npm run preview
```

## Примечания

- Навигация со стекло‑эффектом и градиентами.
- API‑клиент `src/lib/api.ts` использует VITE_API_BASE.
