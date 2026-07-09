# ============================================================
# prompts.py — app/modules/medical_record_explainer/prompts.py
# TODO: write the system prompt for this feature here — keep it separate
# from service.py so the medical wording can be reviewed independently.
# Follow the same pattern as app/modules/symptom_checker/prompts.py:
# language detection, safety rules, no diagnosis, no medication dosing,
# required JSON output format, and a mandatory disclaimer.
# ============================================================
from app.core.config import settings


def build_system_prompt(context_chunks: list[dict]) -> str:
    raise NotImplementedError(
        "Write the medical_record_explainer system prompt here before wiring this module up."
    )
