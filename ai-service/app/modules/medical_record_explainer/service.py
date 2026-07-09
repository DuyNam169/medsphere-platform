# ============================================================
# service.py — app/modules/medical_record_explainer/service.py
# TODO: implement the real logic — follow the same pattern as
# app/modules/symptom_checker/service.py:
#   1. medical_search.retrieve(...) to fetch trusted-source context
#   2. build_system_prompt(context_chunks) from prompts.py
#   3. call app.core.llm_client.client.chat.completions.create(...)
#   4. append medical_search.format_sources_footer(sources) to the reply
# ============================================================
from app.shared.rag import medical_search  # noqa: F401  (use when implementing)


def process(message: str, history: list[dict] | None = None) -> dict:
    raise NotImplementedError(f"Implement the medical_record_explainer logic here.")
