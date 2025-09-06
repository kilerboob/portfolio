# FastAPI Auth API

Minimal auth + contact/services API for portfolio.

## Env vars

Create `.env` in repo root (sibling of `docker-compose.yml`), not committed:

```env
# DB
POSTGRES_USER=postgres
POSTGRES_PASSWORD=553837
POSTGRES_DB=portfolio_db
DB_HOST=db
DB_PORT=5432
DATABASE_URL=postgresql+psycopg2://postgres:553837@db:5432/portfolio_db

# Telegram
TG_BOT_TOKEN=<token>
TG_CHAT_ID=775935518

# CORS
CORS_ORIGINS=http://localhost:5173,https://your-domain
```

## Local dev (Python)

1. Create venv and install deps

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Migrate and run

```powershell
alembic upgrade head
uvicorn main:app --reload --port 8000
```

## Docker Compose

From repo root:

```powershell
docker compose up -d --build
```

Backend will be available on <http://127.0.0.1:18000> (mapped to container 8000).

## Test contact endpoint (PowerShell)

```powershell
$body = @{ name = "Сашка"; email = "sashka@example.com"; subject = "Фриланс"; message = "Нужен лендинг + Docker" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:18000/api/contact" -Method Post -ContentType "application/json" -Body $body
```

You should receive a 200 and Telegram notification if TG_BOT_TOKEN/TG_CHAT_ID set.

## API overview

- POST /auth/register — регистрация (email, password)
- POST /auth/login — вход, возвращает { access, refresh }
- GET /api/services — список услуг
- POST /api/contact — создать заявку; поля: name, email, subject, message, source, utm (dict[str,str] optional), telegram_chat_id (optional)
- GET /api/leads — список заявок
- GET /health — проверка здоровья

