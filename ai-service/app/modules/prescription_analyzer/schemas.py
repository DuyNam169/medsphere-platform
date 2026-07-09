# ============================================================
# schemas.py — app/modules/prescription_analyzer/schemas.py
# TODO: define the real request/response fields when this feature is built.
# This is a placeholder skeleton so the module structure is ready in advance.
# ============================================================
from pydantic import BaseModel


class PrescriptionAnalyzerRequest(BaseModel):
    message: str
    history: list[dict] = []


class PrescriptionAnalyzerResponse(BaseModel):
    reply: str
    sources: list[dict] = []
