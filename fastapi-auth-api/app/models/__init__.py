# Re-export models and ensure they are imported when package is loaded
from .user import User  # noqa: F401
from .contact_message import ContactMessage  # noqa: F401
from .service import Service  # noqa: F401
