import os, sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool, create_engine
from alembic import context

# Подключаем корень проекта, чтобы работали импорты app.*
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Alembic Config объект, даёт доступ к данным из alembic.ini
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Импортируем Base и модели, чтобы metadata знал о таблицах
from app.core.database import Base  # noqa: E402
# Импортируем пакет моделей, чтобы все модели зарегистрировались на Base
from app import models as _models  # noqa: F401, E402

target_metadata = Base.metadata


def get_database_url() -> str:
    """Resolve DB URL preferring env var DATABASE_URL over alembic.ini.

    This allows running inside Docker where the service hostname is not localhost.
    """
    env_url = os.getenv("DATABASE_URL")
    if env_url:
        return env_url
    return config.get_main_option("sqlalchemy.url")


def run_migrations_offline():
    url = get_database_url()
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    # Prefer explicit URL to avoid alembic.ini hardcoding
    url = get_database_url()
    try:
        # mask password in logs
        from sqlalchemy.engine import make_url
        u = make_url(url)
        safe_url = u._replace(password="***").render_as_string(hide_password=False)
    except Exception:
        safe_url = url
    print(f"[alembic] Using database URL: {safe_url}")
    # Use create_engine directly with resolved URL
    connectable = create_engine(url, poolclass=pool.NullPool)
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
