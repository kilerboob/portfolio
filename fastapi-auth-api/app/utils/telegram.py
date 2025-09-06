import os
import httpx
import logging

logger = logging.getLogger(__name__)

TG_BOT_TOKEN = os.getenv("TG_BOT_TOKEN")
TG_CHAT_ID = os.getenv("TG_CHAT_ID")

async def send_telegram_message(text: str, chat_id: str | None = None) -> None:
    """Асинхронная отправка уведомления в Telegram.
    Если chat_id не указан, используется TG_CHAT_ID из .env.
    Пишем простые логи об ошибках.
    """
    if not TG_BOT_TOKEN:
        logger.warning("TG_BOT_TOKEN не задан; сообщение не отправлено")
        return
    target_chat = chat_id or TG_CHAT_ID
    if not target_chat:
        logger.warning("TG_CHAT_ID не задан; сообщение не отправлено")
        return
    url = f"https://api.telegram.org/bot{TG_BOT_TOKEN}/sendMessage"
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(url, data={"chat_id": target_chat, "text": text})
        if resp.status_code != 200:
            logger.error("Telegram sendMessage %s: %s", resp.status_code, resp.text)
        else:
            logger.info("Telegram sendMessage OK: chat_id=%s, len=%s", target_chat, len(text))
    except Exception as e:
        logger.exception("Ошибка отправки в Telegram: %s", e)

async def send_auto_reply_to_user(user_chat_id: str, name: str) -> None:
    token = os.getenv("TG_BOT_TOKEN")
    if not token or not user_chat_id:
        return
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    text = (
        "Спасибо за заявку! Мы свяжемся с вами в ближайшее время.\n\n"
        f"— Ваша заявка получена, {name}."
    )
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(url, data={"chat_id": user_chat_id, "text": text})
    except Exception:
        logger.exception("Failed to send auto-reply")


def build_bot_link(query: str | None = None) -> str:
    """Построить публичную ссылку на бота без использования токена."""
    username = "FullstackSashkaBot"
    return f"https://t.me/{username}?start={query}" if query else f"https://t.me/{username}"
