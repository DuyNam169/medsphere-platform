# ============================================================
# routes.py — app/modules/symptom_checker/routes.py
# ============================================================
from fastapi import APIRouter

from .schemas import ChatRequest, ChatResponse
from .service import ask_ai

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    history_dicts = [item.model_dump() for item in request.history]
    result = ask_ai(request.message, history_dicts, request.lockedSpecialty)
    return ChatResponse(**result)