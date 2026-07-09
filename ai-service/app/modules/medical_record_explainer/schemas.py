# ============================================================
# schemas.py — app/modules/medical_record_explainer/schemas.py
# TODO: define the real request/response fields when this feature is built.
# This is a placeholder skeleton so the module structure is ready in advance.
# ============================================================
from pydantic import BaseModel


class MedicalRecordExplainerRequest(BaseModel):
    message: str
    history: list[dict] = []


class MedicalRecordExplainerResponse(BaseModel):
    reply: str
    sources: list[dict] = []
