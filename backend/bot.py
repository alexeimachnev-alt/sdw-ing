import asyncio
import html
import json
import logging
import os
from typing import Any

from aiohttp import web
from aiogram import Bot, Dispatcher, F, Router
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.types import (
    KeyboardButton,
    MenuButtonWebApp,
    Message,
    ReplyKeyboardMarkup,
    WebAppInfo,
)
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.environ["BOT_TOKEN"]
ADMIN_CHAT_ID = int(os.environ["ADMIN_CHAT_ID"])
WEBAPP_URL = os.environ["WEBAPP_URL"].rstrip("/")
PORT = int(os.getenv("PORT", "8080"))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sdv_bot")

router = Router()

MODE_LABELS = {
    "estimate_48h": "📐 План и смета за 48 часов",
    "order_project": "📐 Заказ проекта",
    "order_mount": "🛠 Заказ монтажа",
    "order_service": "⚙️ Обслуживание (ТО)",
    "audit": "🔍 Инженерный аудит",
    "consultation": "📞 Запрос консультации",
    "office_viewing": "🔒 Закрытый просмотр в офисе (NDA)",
    "partner_b2b": "🤝 Партнёрство (Архитекторы / Дизайнеры)",
    "question": "💬 Вопрос инженеру-куратору",
}


def format_admin_lead(data: dict[str, Any], tg_user: Any = None) -> str:
    mode = data.get("mode", "estimate_48h")
    header = MODE_LABELS.get(mode, "📩 Новая заявка СДВ")

    name = html.escape(str(data.get("name") or "Не указано"))
    phone = html.escape(str(data.get("phone") or "Не указан"))
    context_badge = html.escape(str(data.get("contextBadge") or ""))
    project_title = data.get("projectTitle")
    service_title = data.get("serviceTitle")
    area = data.get("area")
    stage = data.get("stage")
    systems = data.get("systems") or []
    comment = data.get("comment")

    tg_id = data.get("telegramUserId") or (tg_user.id if tg_user else None)
    tg_username = data.get("telegramUsername") or (tg_user.username if tg_user else None)

    lines = [
        f"<b>{header}</b>",
        f"<i>Контекст:</i> {context_badge}" if context_badge else "",
        "",
        f"👤 <b>Имя:</b> {name}",
        f"📞 <b>Телефон:</b> <code>{phone}</code>",
    ]

    if project_title:
        lines.append(f"🏛 <b>Объект:</b> {html.escape(str(project_title))}")
    if service_title:
        lines.append(f"⚙️ <b>Раздел:</b> {html.escape(str(service_title))}")
    if area:
        lines.append(f"📏 <b>Площадь:</b> {html.escape(str(area))}")
    if stage:
        lines.append(f"📌 <b>Стадия / Формат:</b> {html.escape(str(stage))}")
    if systems:
        sys_str = ", ".join(html.escape(str(s)) for s in systems)
        lines.append(f"🛠 <b>Системы:</b> {sys_str}")
    if comment:
        lines.append(f"📝 <b>Комментарий:</b> {html.escape(str(comment))}")

    if tg_id or tg_username:
        user_ref = f"@{tg_username}" if tg_username else f"ID: <code>{tg_id}</code>"
        if tg_username and tg_id:
            user_ref = f"@{tg_username} (<code>{tg_id}</code>)"
        lines.append(f"\n✈️ <b>Telegram:</b> {user_ref}")

    return "\n".join(line for line in lines if line is not None and line != "")


@router.message(CommandStart())
async def cmd_start(message: Message) -> None:
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(
                    text="🏛 Открыть СДВ Инжиниринг",
                    web_app=WebAppInfo(url=WEBAPP_URL),
                )
            ]
        ],
        resize_keyboard=True,
    )

    await message.answer(
        "<b>СДВ Инжиниринг</b> — инженерные системы премиальных домов под ключ (Москва и МО).\n\n"
        "Откройте приложение, чтобы изучить услуги, стандарты тишины ≤25 дБ, "
        "закрытые NDA-объекты и запросить план со сметой за 48 часов.",
        reply_markup=keyboard,
    )


@router.message(F.web_app_data)
async def handle_web_app_data(message: Message, bot: Bot) -> None:
    try:
        payload = json.loads(message.web_app_data.data)
    except json.JSONDecodeError:
        logger.warning("Invalid JSON from web_app_data: %s", message.web_app_data.data)
        return

    admin_text = format_admin_lead(payload, tg_user=message.from_user)
    await bot.send_message(chat_id=ADMIN_CHAT_ID, text=admin_text)

    await message.answer(
        "✅ <b>Заявка принята!</b>\n"
        "Персональный инженер-куратор СДВ свяжется с вами в течение часа."
    )


@web.middleware
async def cors_middleware(request: web.Request, handler):
    if request.method == "OPTIONS":
        resp = web.Response(status=204)
    else:
        resp = await handler(request)
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return resp


def create_http_app(bot: Bot) -> web.Application:
    app = web.Application(middlewares=[cors_middleware])

    async def health(_: web.Request) -> web.Response:
        return web.json_response({"status": "ok"})

    async def receive_lead(request: web.Request) -> web.Response:
        try:
            payload = await request.json()
        except Exception:
            return web.json_response({"error": "Invalid JSON"}, status=400)

        admin_text = format_admin_lead(payload)
        await bot.send_message(chat_id=ADMIN_CHAT_ID, text=admin_text)

        tg_user_id = payload.get("telegramUserId")
        if tg_user_id:
            try:
                await bot.send_message(
                    chat_id=int(tg_user_id),
                    text=(
                        "✅ <b>Заявка принята!</b>\n"
                        "Персональный инженер-куратор СДВ свяжется с вами в течение часа."
                    ),
                )
            except Exception as exc:
                logger.info("Could not DM user %s: %s", tg_user_id, exc)

        return web.json_response({"ok": True})

    app.router.add_get("/health", health)
    app.router.add_post("/api/lead", receive_lead)
    return app


async def on_startup(bot: Bot) -> None:
    await bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(
            text="СДВ Инжиниринг",
            web_app=WebAppInfo(url=WEBAPP_URL),
        )
    )
    logger.info("Menu Button configured -> %s", WEBAPP_URL)


async def main() -> None:
    bot = Bot(
        token=BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML),
    )
    dp = Dispatcher()
    dp.include_router(router)
    dp.startup.register(on_startup)

    http_app = create_http_app(bot)
    runner = web.AppRunner(http_app)
    await runner.setup()
    site = web.TCPSite(runner, host="0.0.0.0", port=PORT)
    await site.start()
    logger.info("HTTP lead endpoint listening on port %s", PORT)

    try:
        await dp.start_polling(bot)
    finally:
        await runner.cleanup()
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())
