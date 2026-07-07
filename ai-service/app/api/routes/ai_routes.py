from fastapi import APIRouter
from pydantic import BaseModel
from app.services.llm_service import ask_ai

router = APIRouter()


class ChatHistoryItem(BaseModel):
    role: str  # "user" hoặc "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatHistoryItem] = []


class ChatResponse(BaseModel):
    reply: str
    suggestedSpecialties: list[str] = []


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    history_dicts = [item.model_dump() for item in request.history]
    result = ask_ai(request.message, history_dicts)
    return ChatResponse(**result)