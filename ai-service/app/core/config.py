import os


class Settings:
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"
    # llama-3.3-70b-versatile: high quality, well suited for symptom analysis.
    # Can be swapped to "qwen/qwen3-32b" to try the Qwen model (also free on Groq).
    MODEL_NAME: str = os.getenv("AI_MODEL_NAME", "llama-3.3-70b-versatile")

    # Tavily — searches trusted medical sources (see rag_service.py).
    # Free tier: 1,000 credits/month, enough for the dev environment.
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")


settings = Settings()