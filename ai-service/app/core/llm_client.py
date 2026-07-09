# ============================================================
# llm_client.py — app/core/llm_client.py
# Single shared OpenAI-compatible client (Groq) used by every module.
# Each module's service.py imports `client` and `settings.MODEL_NAME`
# from here instead of creating its own OpenAI() instance.
# ============================================================
from openai import OpenAI
from app.core.config import settings

client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url=settings.GROQ_BASE_URL,
)
