# ============================================================
# rag_service.py — ai-service/app/services/rag_service.py
# Retrieves medical information from whitelisted trusted sources
# (live search via Tavily, constrained to a fixed domain whitelist).
# ============================================================
import logging

from tavily import TavilyClient

from app.core.config import settings

logger = logging.getLogger(__name__)

_client = TavilyClient(api_key=settings.TAVILY_API_KEY) if settings.TAVILY_API_KEY else None

# Only these medical sources are trusted — this whitelist is the guardrail
# applied on top of Tavily's live search. Add/remove sources here.
TRUSTED_DOMAINS = [
    "who.int",
    "moh.gov.vn",
    "medlineplus.gov",
    "mayoclinic.org",
    "msdmanuals.com",
    "vinmec.com",
    "tamanhhospital.vn",
    "bachmai.gov.vn",
]

MAX_CONTENT_LENGTH_PER_RESULT = 800


def retrieve(query: str, max_results: int = 4) -> list[dict]:
    """
    Searches for medical information related to the given symptom query,
    restricted to whitelisted sources. Returns a list of
    [{title, url, content}]; returns [] if the API key isn't configured or
    if the Tavily call fails (never blocks the main chat flow).
    """
    if _client is None:
        logger.warning("TAVILY_API_KEY is not configured — skipping source retrieval.")
        return []

    try:
        result = _client.search(
            query=f"{query} triệu chứng nguyên nhân sơ cứu",
            search_depth="basic",
            include_domains=TRUSTED_DOMAINS,
            max_results=max_results,
        )
        return [
            {
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "content": (item.get("content") or "")[:MAX_CONTENT_LENGTH_PER_RESULT],
            }
            for item in result.get("results", [])
        ]
    except Exception as ex:
        logger.error("Error searching medical sources via Tavily: %s", ex)
        return []