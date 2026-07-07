# ============================================================
# llm_service.py — ai-service/app/services/llm_service.py
# ============================================================
import json
import logging
from openai import OpenAI
from app.core.config import settings
from app.services import rag_service

logger = logging.getLogger(__name__)

client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url=settings.GROQ_BASE_URL,
)

# Fixed specialty list — MUST match exactly the MedicalSpecialty enum on the
# Java backend (com.medsphere.modules.auth.enums.MedicalSpecialty).
# The AI may only pick from this list, never invent a new code.
ALLOWED_SPECIALTIES = [
    "GENERAL_INTERNAL_MEDICINE", "CARDIOLOGY", "GASTROENTEROLOGY", "PULMONOLOGY",
    "NEUROLOGY", "NEPHROLOGY_UROLOGY_INTERNAL", "ENDOCRINOLOGY", "HEMATOLOGY",
    "ALLERGY_IMMUNOLOGY", "INFECTIOUS_DISEASE", "GENERAL_SURGERY", "NEUROSURGERY",
    "CARDIOTHORACIC_SURGERY", "UROLOGY_SURGERY", "ORTHOPEDIC_TRAUMATOLOGY",
    "MUSCULOSKELETAL", "OBSTETRICS_GYNECOLOGY", "PEDIATRICS", "FERTILITY_REPRODUCTIVE",
    "ENT", "OPHTHALMOLOGY", "DENTISTRY", "DERMATOLOGY", "ANDROLOGY", "ONCOLOGY",
    "GERIATRICS", "PSYCHOLOGY", "PSYCHIATRY", "REHABILITATION", "TRADITIONAL_MEDICINE",
    "NUTRITION", "EMERGENCY", "INTENSIVE_CARE", "ANESTHESIOLOGY", "RADIOLOGY",
    "LABORATORY_TESTING", "OTHER",
]

# System default language — used as a fallback whenever the AI cannot
# confidently detect the user's input language. Keep in sync with
# frontend/src/core/config/app.config.ts -> defaultLanguage.
SYSTEM_DEFAULT_LANGUAGE = "Vietnamese"

# Hard safety net enforced in code — NOT solely reliant on the AI following
# the prompt. If the message matches any keyword below, force emergency=True
# and always surface the emergency notice, regardless of what the LLM returns.
# (Kept in Vietnamese since these must match literal user input.)
EMERGENCY_KEYWORDS = [
    "đau ngực dữ dội", "đau ngực dữ", "khó thở nặng", "khó thở dữ dội",
    "không thở được", "chảy máu không cầm", "chảy máu nhiều không ngừng",
    "mất ý thức", "ngất xỉu", "bất tỉnh", "co giật", "đột quỵ", "liệt nửa người",
    "méo miệng", "nói ngọng đột ngột", "nôn ra máu", "đi ngoài ra máu nhiều",
    "đau bụng dữ dội đột ngột", "tự tử", "tự sát", "muốn chết",
]


def _contains_emergency_keyword(message: str) -> bool:
    lowered = message.lower()
    return any(keyword in lowered for keyword in EMERGENCY_KEYWORDS)


def _build_system_prompt(context_chunks: list[dict]) -> str:
    if context_chunks:
        context_text = "\n\n".join(
            f"[Source: {c['title']} — {c['url']}]\n{c['content']}"
            for c in context_chunks
        )
        context_block = f"""
REFERENCE INFORMATION FROM TRUSTED MEDICAL SOURCES (you may only use the
content below as grounding — do NOT invent any medical information beyond it):

{context_text}
"""
    else:
        context_block = """
NO REFERENCE INFORMATION WAS FOUND for this query.
Answer with extra caution, keep any assessment very general, and emphasize
that the user should visit a healthcare facility soon for a proper check-up.
"""

    return f"""You are Medsphere's health assistant, supporting users in Vietnam.
{context_block}
LANGUAGE: Detect the language the user is writing in (from their latest
message and conversation history) and reply in that SAME language. If you
cannot confidently detect the language, default to {SYSTEM_DEFAULT_LANGUAGE}.
Do not mix languages in a single reply.

TASK: Based on the symptoms described by the user AND the reference information above:
1. Warm tone, easy to understand, concise (3-5 sentences), in the detected language.
2. Express uncertainty naturally in that language — for example, in Vietnamese
   you might say "Triệu chứng của bạn có thể liên quan đến..." or in English
   "Your symptoms may be related to...". Pick ONE natural phrasing in the
   target language; never output multiple alternative phrasings joined by "/".
   Never assert a specific disease with certainty.
3. If appropriate, give AT MOST 1 very basic temporary first-aid tip
   (e.g. use a bandage to stop bleeding from a cut, apply a cold compress to
   swelling, rest, drink plenty of water). NEVER provide a treatment protocol,
   NEVER suggest any medication name or dosage, not even over-the-counter drugs.
4. If you mention a medical specialty inside the "reply" text, describe it as
   a natural phrase in the detected language (e.g. "khoa Tâm lý" in Vietnamese,
   "Psychology" in English) — NEVER print the raw internal code (such as
   "GENERAL_INTERNAL_MEDICINE" or "PSYCHOLOGY" in all caps). The exact codes
   belong ONLY in the separate "suggestedSpecialties" field below, never in
   the "reply" text itself.
5. Suggest 1-2 specialties the user should consult for "suggestedSpecialties",
   ONLY from this exact list of codes — never invent another code:
   {", ".join(ALLOWED_SPECIALTIES)}

SAFETY RULES — MANDATORY, NO EXCEPTIONS:
- NEVER diagnose a specific disease (never say "you definitely have disease X").
- NEVER prescribe medication, never suggest a drug name or dosage.
- ALWAYS end the reply with a disclaimer, in the detected language: this is
  only a general reference suggestion, it does not replace a doctor's
  diagnosis, and the user should visit a healthcare facility for an
  in-person examination.
- If the symptoms sound like an emergency (severe chest pain, severe difficulty
  breathing, heavy bleeding, loss of consciousness...), you MUST advise the
  user to seek emergency care immediately, in the detected language, and put
  this sentence at the very beginning of the reply.

REQUIRED OUTPUT FORMAT: Reply with ONLY valid JSON, no markdown, no preamble
other than the JSON itself, in exactly this structure:
{{
  "reply": "full reply in the detected language, including the safety disclaimer at the end",
  "suggestedSpecialties": ["SPECIALTY_CODE_1", "SPECIALTY_CODE_2"]
}}
"""


def ask_ai(message: str, history: list[dict] | None = None) -> dict:
    """
    Calls the AI to analyze symptoms. Returns a dict with:
      - reply: the message shown in the chat window (in the user's detected language)
      - suggestedSpecialties: list of specialty codes
      - sources: list of reference sources actually used (attached by our code,
        never invented by the AI)
      - emergency: True if an emergency pattern was detected (hard keyword check)
    """
    is_emergency = _contains_emergency_keyword(message)
    context_chunks = rag_service.retrieve(message)

    messages = [{"role": "system", "content": _build_system_prompt(context_chunks)}]
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": message})

    sources = [{"title": c["title"], "url": c["url"]} for c in context_chunks]

    try:
        response = client.chat.completions.create(
            model=settings.MODEL_NAME,
            messages=messages,
            temperature=0.3,  # low temperature keeps answers stable, less "creative" drift
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content
        parsed = json.loads(raw)

        specialties = [
            s for s in parsed.get("suggestedSpecialties", [])
            if s in ALLOWED_SPECIALTIES
        ]
        reply = parsed.get("reply", "Sorry, I could not answer this question.")

        if is_emergency:
            # Emergency notice kept in Vietnamese since the app's primary
            # audience is Vietnamese users; adjust here if you later want
            # this notice to also follow the detected language.
            reply = (
                "⚠️ Triệu chứng bạn mô tả có thể là dấu hiệu cấp cứu. Vui lòng gọi ngay "
                "115 hoặc đến cơ sở y tế gần nhất để được xử lý kịp thời.\n\n" + reply
            )
            if "EMERGENCY" not in specialties:
                specialties.insert(0, "EMERGENCY")

        return {
            "reply": reply,
            "suggestedSpecialties": specialties,
            "sources": sources,
            "emergency": is_emergency,
        }

    except json.JSONDecodeError:
        logger.warning("AI returned invalid JSON")
        return {
            "reply": "Xin lỗi, tôi gặp sự cố khi xử lý câu trả lời. Bạn vui lòng thử lại nhé.",
            "suggestedSpecialties": ["EMERGENCY"] if is_emergency else [],
            "sources": sources,
            "emergency": is_emergency,
        }
    except Exception as ex:
        logger.error("Error calling AI: %s", ex)
        return {
            "reply": "Xin lỗi, hệ thống đang gặp sự cố. Bạn vui lòng thử lại sau ít phút.",
            "suggestedSpecialties": ["EMERGENCY"] if is_emergency else [],
            "sources": sources,
            "emergency": is_emergency,
        }