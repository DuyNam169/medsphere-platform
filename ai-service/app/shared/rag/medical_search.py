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

# ── Cơ chế lọc số lượng nguồn linh động theo relevance score ──
# Không lấy cố định N link. Thay vào đó: gọi Tavily với số lượng RAW cao
# hơn mức cần dùng, sau đó lọc theo score và cắt trong khoảng [MIN, MAX].
RAW_FETCH_COUNT = 10          # số lượng xin từ Tavily (trước khi lọc)
MIN_SOURCES = 2               # sàn — nếu không đủ, nới ngưỡng score xuống
MAX_SOURCES = 6               # trần — tránh trả về quá nhiều, trùng lặp
SCORE_THRESHOLD_PRIMARY = 0.5   # ngưỡng ưu tiên
SCORE_THRESHOLD_FALLBACK = 0.3  # ngưỡng nới ra nếu không đủ MIN_SOURCES


def _dedupe_by_domain(results: list[dict]) -> list[dict]:
    """Ưu tiên đa dạng nguồn: không lấy 2 kết quả cùng domain khi còn dư lựa chọn khác."""
    seen_domains = set()
    unique, rest = [], []
    for r in results:
        domain = r["url"].split("/")[2] if "://" in r["url"] else r["url"]
        if domain not in seen_domains:
            seen_domains.add(domain)
            unique.append(r)
        else:
            rest.append(r)
    return unique + rest  # domain mới đứng trước, trùng domain xếp sau làm dự phòng


def retrieve(query: str, extra_query_terms: str = "") -> list[dict]:
    """
    Searches for medical information related to the given query, restricted
    to whitelisted sources. `extra_query_terms` lets each module bias the
    search toward its own use case (e.g. symptom_checker adds
    "triệu chứng nguyên nhân sơ cứu", drug_qa might add "công dụng liều dùng").

    Số lượng nguồn trả về LINH ĐỘNG theo relevance score (không cố định):
      1. Xin RAW_FETCH_COUNT kết quả từ Tavily.
      2. Lọc những kết quả có score >= SCORE_THRESHOLD_PRIMARY.
      3. Nếu lọc xong còn dưới MIN_SOURCES -> nới ngưỡng xuống
         SCORE_THRESHOLD_FALLBACK và lọc lại trên CÙNG bộ kết quả đã có
         (không gọi thêm Tavily request).
      4. Ưu tiên đa dạng domain, cắt còn tối đa MAX_SOURCES.

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
            max_results=RAW_FETCH_COUNT,
        )
        raw_results = result.get("results", [])

        if not raw_results:
            logger.info("No results found within TRUSTED_DOMAINS for query: %s", full_query)
            return []

        filtered = [r for r in raw_results if r.get("score", 0) >= SCORE_THRESHOLD_PRIMARY]

        if len(filtered) < MIN_SOURCES:
            logger.info(
                "Only %d source(s) passed threshold %.2f, widening to %.2f for query: %s",
                len(filtered), SCORE_THRESHOLD_PRIMARY, SCORE_THRESHOLD_FALLBACK, full_query,
            )
            filtered = [r for r in raw_results if r.get("score", 0) >= SCORE_THRESHOLD_FALLBACK]

        # Sắp theo score giảm dần trước khi khử trùng domain, để domain nào
        # có kết quả điểm cao nhất được ưu tiên giữ lại.
        filtered.sort(key=lambda r: r.get("score", 0), reverse=True)
        filtered = _dedupe_by_domain(filtered)[:MAX_SOURCES]

        if not filtered:
            logger.info("No source passed even the fallback threshold for query: %s", full_query)

        return [
            {
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "content": (item.get("content") or "")[:MAX_CONTENT_LENGTH_PER_RESULT],
            }
            for item in filtered
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