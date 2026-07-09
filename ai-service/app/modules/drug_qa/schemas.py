# ============================================================
# schemas.py — app/modules/drug_qa/schemas.py
# TODO: define the real request/response fields when this feature is built.
# This is a placeholder skeleton so the module structure is ready in advance.
# ============================================================
from pydantic import BaseModel


class DrugQaRequest(BaseModel):
    message: str
    history: list[dict] = []


class DrugQaResponse(BaseModel):
    reply: str
    sources: list[dict] = []
