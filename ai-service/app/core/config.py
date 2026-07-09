# ============================================================
# config.py — app/core/config.py
# Dùng pydantic-settings để tự validate kiểu dữ liệu và đọc từ biến môi
# trường / file .env — tương đương @ConfigurationProperties bên Java
# (xem JwtConfig.java, core/config bên backend Spring Boot).
# ============================================================
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    GROQ_API_KEY: str = ""
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"

    # llama-3.3-70b-versatile: high quality, well suited for medical text tasks.
    # Can be swapped to "qwen/qwen3-32b" to try the Qwen model (also free on Groq).
    AI_MODEL_NAME: str = "llama-3.3-70b-versatile"

    # Tavily — searches trusted medical sources (see shared/rag/medical_search.py).
    # Free tier: 1,000 credits/month, enough for the dev environment.
    TAVILY_API_KEY: str = ""

    # System default language — fallback whenever a module cannot confidently
    # detect the user's input language. Keep in sync with
    # frontend/src/core/config/app.config.ts -> defaultLanguage.
    SYSTEM_DEFAULT_LANGUAGE: str = "Vietnamese"

    @property
    def MODEL_NAME(self) -> str:
        """Alias giữ nguyên tên cũ (settings.MODEL_NAME) để không phải sửa
        lại chỗ gọi ở các module đã viết trước đó."""
        return self.AI_MODEL_NAME


settings = Settings()
