import os


class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"
    # llama-3.3-70b-versatile: chất lượng cao, phù hợp phân tích triệu chứng.
    # Có thể đổi sang "qwen/qwen3-32b" nếu muốn thử model Qwen (cũng miễn phí qua Groq).
    MODEL_NAME: str = os.getenv("AI_MODEL_NAME", "llama-3.3-70b-versatile")


settings = Settings()