# ============================================================
# schemas.py — app/shared/schemas.py
# Kiểu dữ liệu request/response DÙNG CHUNG cho MỌI module AI
# (symptom_checker, drug_qa, prescription_analyzer,
# medical_record_explainer...). Mọi module import ChatRequest/ChatResponse
# từ đây, KHÔNG tự định nghĩa lại — để đảm bảo mọi chức năng AI đều có
# cùng cơ chế "sources" (nguồn tham khảo) và "topicMismatch" (khóa chủ đề).
# ============================================================
from pydantic import BaseModel


class ChatHistoryItem(BaseModel):
    role: str  # "user" hoặc "assistant"
    content: str


class SourceItem(BaseModel):
    title: str
    url: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatHistoryItem] = []
    # Chuyên khoa đã "khóa" cho đoạn chat này (lấy từ suggestedSpecialties
    # của tin nhắn đầu tiên trong conversation), do backend gửi sang.
    # None/"" nếu đây là tin nhắn đầu tiên (chưa có gì để khóa).
    lockedSpecialty: str | None = None


class ChatResponse(BaseModel):
    reply: str
    suggestedSpecialties: list[str] = []
    # Nguồn tham khảo (link) thực sự đã dùng để trả lời — BẮT BUỘC với
    # mọi module có dùng medical_search, không phụ thuộc AI có tự nhắc hay không.
    sources: list[SourceItem] = []
    emergency: bool = False
    # True nếu câu hỏi khác chủ đề với lockedSpecialty của đoạn chat.
    topicMismatch: bool = False