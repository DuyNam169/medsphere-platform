# ============================================================
# service.py — app/modules/symptom_checker/service.py
# ============================================================
import json
import logging

from app.core.config import settings
from app.core.llm_client import client
from app.shared.rag import medical_search
from app.shared.schemas import ContextChunkItem, StructuredSummary
from app.shared.specialties import ALLOWED_SPECIALTIES
from app.shared.topic_lock import (
    TOPIC_MISMATCH_MESSAGES,
    is_topic_mismatch,
    resolve_language,
)

from .constants import EMERGENCY_KEYWORDS, SEARCH_QUERY_SUFFIX
from .prompts import EMERGENCY_LEVELS, build_symptom_diff_prompt, build_system_prompt

logger = logging.getLogger(__name__)


def _contains_emergency_keyword(message: str) -> bool:
    lowered = message.lower()
    return any(keyword in lowered for keyword in EMERGENCY_KEYWORDS)


def _detect_new_symptom(message: str, known_symptoms: list[str]) -> tuple[bool, list[str]]:
    """
    Gọi AI 1 lần riêng, nhẹ, chỉ để phân loại xem tin nhắn có triệu chứng
    mới không. Nếu lỗi bất kỳ -> mặc định coi như CÓ triệu chứng mới (an
    toàn hơn: thà tìm lại nguồn dư 1 lần còn hơn bỏ sót context cần thiết).
    """
    try:
        response = client.chat.completions.create(
            model=settings.MODEL_NAME,
            messages=[
                {"role": "system", "content": build_symptom_diff_prompt(known_symptoms, message)},
            ],
            temperature=0.0,
            response_format={"type": "json_object"},
        )
        parsed = json.loads(response.choices[0].message.content)
        has_new = bool(parsed.get("hasNewSymptom", True))
        updated = parsed.get("updatedSymptoms", known_symptoms)
        if not isinstance(updated, list):
            updated = known_symptoms
        return has_new, updated
    except Exception as ex:
        logger.warning("Lỗi khi phân loại triệu chứng mới, mặc định tìm lại nguồn: %s", ex)
        return True, known_symptoms


def _parse_structured_summary(raw: dict | None) -> StructuredSummary | None:
    """
    Parse an toàn field structuredSummary từ JSON của AI. Nếu thiếu hoặc
    sai định dạng -> trả về None thay vì làm hỏng cả response (panel FE
    đã tự xử lý trường hợp None/rỗng).
    """
    if not raw or not isinstance(raw, dict):
        return None
    try:
        if raw.get("emergencyLevel") not in EMERGENCY_LEVELS:
            raw["emergencyLevel"] = "NORMAL"
        return StructuredSummary(**raw)
    except Exception as ex:
        logger.warning("Lỗi khi parse structuredSummary, bỏ qua field này: %s", ex)
        return None


def ask_ai(
    message: str,
    history: list[dict] | None = None,
    locked_specialty: str | None = None,
    known_symptoms: list[str] | None = None,
    cached_context_chunks: list[dict] | None = None,
) -> dict:
    """
    Calls the AI to analyze symptoms.

    Cơ chế cache nguồn tham khảo:
      - Nếu đây là tin nhắn đầu tiên (known_symptoms rỗng) HOẶC phát hiện
        triệu chứng mới -> gọi lại medical_search.retrieve() lấy nguồn mới.
      - Nếu không có gì mới -> tái sử dụng cached_context_chunks (không gọi
        Tavily lại), tiết kiệm lượt gọi và giữ nhất quán với lần trả lời trước.

    Returns a dict gồm các field cũ (reply, suggestedSpecialties, sources,
    emergency, topicMismatch) cộng thêm:
      - hasNewSymptom, updatedKnownSymptoms, contextChunksUsed (như cũ)
      - structuredSummary: bảng tổng hợp trực quan cho AiDetailPanel.
    """
    known_symptoms = known_symptoms or []
    cached_context_chunks = cached_context_chunks or []
    is_emergency = _contains_emergency_keyword(message)

    has_new_symptom, updated_symptoms = _detect_new_symptom(message, known_symptoms)

    if has_new_symptom or not cached_context_chunks:
        context_chunks = medical_search.retrieve(message, extra_query_terms=SEARCH_QUERY_SUFFIX)
    else:
        # Tái sử dụng nguyên context đã cache — không gọi Tavily lại.
        context_chunks = cached_context_chunks

    sources = [{"title": c["title"], "url": c["url"]} for c in context_chunks]

    messages = [{"role": "system", "content": build_system_prompt(context_chunks)}]
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model=settings.MODEL_NAME,
            messages=messages,
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content
        parsed = json.loads(raw)

        specialties = [
            s for s in parsed.get("suggestedSpecialties", [])
            if s in ALLOWED_SPECIALTIES
        ]
        reply = parsed.get("reply", "Xin lỗi, tôi chưa thể trả lời câu hỏi này.")
        language = resolve_language(parsed.get("language"))
        structured_summary = _parse_structured_summary(parsed.get("structuredSummary"))

        context_chunks_used = [
            ContextChunkItem(title=c.get("title", ""), url=c.get("url", ""), content=c.get("content", ""))
            for c in context_chunks
        ]

        if is_emergency:
            reply = (
                "⚠️ Triệu chứng bạn mô tả có thể là dấu hiệu cấp cứu. Vui lòng gọi ngay "
                "115 hoặc đến cơ sở y tế gần nhất để được xử lý kịp thời.\n\n" + reply
            )
            if "EMERGENCY" not in specialties:
                specialties.insert(0, "EMERGENCY")
            if structured_summary is not None:
                structured_summary.emergencyLevel = "EMERGENCY"
            reply += medical_search.format_sources_footer(sources)
            return {
                "reply": reply,
                "suggestedSpecialties": specialties,
                "sources": sources,
                "emergency": True,
                "topicMismatch": False,
                "hasNewSymptom": has_new_symptom,
                "updatedKnownSymptoms": updated_symptoms,
                "contextChunksUsed": context_chunks_used,
                "structuredSummary": structured_summary,
            }

        if is_topic_mismatch(locked_specialty, specialties):
            return {
                "reply": TOPIC_MISMATCH_MESSAGES[language],
                "suggestedSpecialties": [],
                "sources": [],
                "emergency": False,
                "topicMismatch": True,
                "hasNewSymptom": has_new_symptom,
                "updatedKnownSymptoms": updated_symptoms,
                "contextChunksUsed": context_chunks_used,
                "structuredSummary": None,
            }

        reply += medical_search.format_sources_footer(sources)

        return {
            "reply": reply,
            "suggestedSpecialties": specialties,
            "sources": sources,
            "emergency": False,
            "topicMismatch": False,
            "hasNewSymptom": has_new_symptom,
            "updatedKnownSymptoms": updated_symptoms,
            "contextChunksUsed": context_chunks_used,
            "structuredSummary": structured_summary,
        }

    except json.JSONDecodeError:
        logger.warning("AI returned invalid JSON")
        return {
            "reply": "Xin lỗi, tôi gặp sự cố khi xử lý câu trả lời. Bạn vui lòng thử lại nhé.",
            "suggestedSpecialties": ["EMERGENCY"] if is_emergency else [],
            "sources": sources,
            "emergency": is_emergency,
            "topicMismatch": False,
            "hasNewSymptom": has_new_symptom,
            "updatedKnownSymptoms": updated_symptoms,
            "contextChunksUsed": [],
            "structuredSummary": None,
        }
    except Exception as ex:
        logger.error("Error calling AI: %s", ex)
        return {
            "reply": "Xin lỗi, hệ thống đang gặp sự cố. Bạn vui lòng thử lại sau ít phút.",
            "suggestedSpecialties": ["EMERGENCY"] if is_emergency else [],
            "sources": sources,
            "emergency": is_emergency,
            "topicMismatch": False,
            "hasNewSymptom": has_new_symptom,
            "updatedKnownSymptoms": updated_symptoms,
            "contextChunksUsed": [],
            "structuredSummary": None,
        }