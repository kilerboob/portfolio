import os
from pathlib import Path
import configparser
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load .env robustly from project root (fastapi-auth-api/.env)
_here = Path(__file__).resolve()
_project_root = _here.parents[2]  # .../fastapi-auth-api
_env_path = _project_root / ".env"
load_dotenv(dotenv_path=_env_path, override=False)

def _resolve_db_url() -> str | None:
    # 1) .env / env vars
    url = os.getenv("DATABASE_URL")
    if url:
        return url
    # 2) if running under alembic, read from its config
    try:
        from alembic import context  # type: ignore
        cfg = context.config
        if cfg is not None:
            val = cfg.get_main_option("sqlalchemy.url")
            if val:
                return val
    except Exception:
        pass
    # 3) parse .env directly
    try:
        for line in _env_path.read_text(encoding="utf-8").splitlines():
            if line.startswith("DATABASE_URL="):
                return line.split("=", 1)[1].strip().strip('"')
    except Exception:
        pass
    # 4) fallback to alembic.ini in project root
    try:
        ini_path = _project_root / "alembic.ini"
        cp = configparser.ConfigParser()
        cp.read(ini_path)
        val = cp.get("alembic", "sqlalchemy.url", fallback=None)
        if val:
            return val
    except Exception:
        pass
    return None

DATABASE_URL = _resolve_db_url()
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set (check .env or alembic.ini sqlalchemy.url)")

engine = create_engine(DATABASE_URL, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency for FastAPI routes (sync SQLAlchemy session)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
