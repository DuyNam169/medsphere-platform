# ============================================================
# schemas.py — app/modules/symptom_checker/schemas.py
# ChatRequest/ChatResponse giờ dùng chung từ app/shared/schemas.py.
# File này chỉ re-export để chỗ gọi cũ (from .schemas import ChatRequest,
# ChatResponse) không cần sửa lại.
# ============================================================
from app.shared.schemas import ChatRequest, ChatResponse  # noqa: F401