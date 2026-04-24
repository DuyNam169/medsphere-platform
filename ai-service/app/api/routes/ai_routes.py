from fastapi import APIRouter
from app.services.llm_service import ask_ai

router = APIRouter()

@router.post("/ask")
def ask(question: str):
    return {"answer": ask_ai(question)}