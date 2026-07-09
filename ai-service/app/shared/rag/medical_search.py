# ============================================================
# medical_search.py — app/shared/rag/medical_search.py
# Retrieves medical information from whitelisted trusted sources
# (live search via Tavily, constrained to a fixed domain whitelist).
# Shared across ALL modules (symptom_checker, prescription_analyzer,
# medical_record_explainer, drug_qa) — do not duplicate this per module.
# ============================================================
import logging

from tavily import TavilyClient

from app.core.config import settings

logger = logging.getLogger(__name__)

_client = TavilyClient(api_key=settings.TAVILY_API_KEY) if settings.TAVILY_API_KEY else None

# Only these medical sources are trusted — this whitelist is the guardrail
# applied on top of Tavily's live search. Add/remove sources here.
#
# NOTE: keeping this list too narrow means many queries return ZERO results
# after domain filtering (Tavily still finds pages, but none match these
# domains), which makes "sources" silently empty for that reply. That is
# why this list was widened from the original 8 domains — the goal is to
# maximize the chance of a match while staying strictly within reputable,
# medically-recognized sources (no forums, no unverified blogs).
TRUSTED_DOMAINS = [
    # International organizations
    "who.int",
    "cdc.gov",
    "nih.gov",
    "medlineplus.gov",

    # International hospitals / clinics
    "mayoclinic.org",
    "clevelandclinic.org",
    "nhs.uk",
    "msdmanuals.com",
    "healthline.com",

    # Vietnam — government / official
    "moh.gov.vn",
    "bachmai.gov.vn",
    "suckhoedoisong.vn",

    # Vietnam — hospitals
    "vinmec.com",
    "tamanhhospital.vn",
    "choray.vn",
    "umc.edu.vn",

    # Vietnam — doctor-reviewed health content
    "hellobacsi.com",
]

MAX_CONTENT_LENGTH_PER_RESULT = 800


def retrieve(query: str, extra_query_terms: str = "", max_results: int = 4) -> list[dict]:
    """
    Searches for medical information related to the given query, restricted
    to whitelisted sources. `extra_query_terms` lets each module bias the
    search toward its own use case (e.g. symptom_checker adds
    "triệu chứng nguyên nhân sơ cứu", drug_qa might add "công dụng liều dùng").

    Returns a list of [{title, url, content}]; returns [] if the API key
    isn't configured or if the Tavily call fails (never blocks the caller).
    """
    if _client is None:
        logger.warning("TAVILY_API_KEY is not configured — skipping source retrieval.")
        return []

    full_query = f"{query} {extra_query_terms}".strip()

    try:
        result = _client.search(
            query=full_query,
            search_depth="basic",
            include_domains=TRUSTED_DOMAINS,
            max_results=max_results,
        )
        results = result.get("results", [])

        if not results:
            logger.info("No results found within TRUSTED_DOMAINS for query: %s", full_query)

        return [
            {
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "content": (item.get("content") or "")[:MAX_CONTENT_LENGTH_PER_RESULT],
            }
            for item in results
        ]
    except Exception as ex:
        logger.error("Error searching medical sources via Tavily: %s", ex)
        return []


def format_sources_footer(sources: list[dict]) -> str:
    """
    Renders a plain-text "Nguồn tham khảo" footer listing each source's
    title and link, ready to be appended to any module's reply text.
    Returns an empty string if there are no sources.
    """
    if not sources:
        return ""

    lines = "\n".join(f"- {s['title']}: {s['url']}" for s in sources if s.get("url"))
    if not lines:
        return ""

    return f"\n\nNguồn tham khảo:\n{lines}"