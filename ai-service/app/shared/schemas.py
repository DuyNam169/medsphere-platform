# ============================================================
# schemas.py — app/shared/schemas.py
# Kiểu dữ liệu request/response DÙNG CHUNG cho MỌI module AI.
# Mọi module import ChatRequest/ChatResponse từ đây, KHÔNG tự định nghĩa
# lại — để đảm bảo mọi chức năng AI đều có cùng cơ chế "sources",
# "topicMismatch" (khóa chủ đề), và "knownSymptoms/cachedContext"
# (chỉ tìm lại nguồn khi có triệu chứng mới).
# ============================================================
from pydantic import BaseModel


class ChatHistoryItem(BaseModel):
    role: str  # "user" hoặc "assistant"
    content: str


class SourceItem(BaseModel):
    title: str
    url: str


class ContextChunkItem(BaseModel):
    """
    1 đoạn nội dung đã lấy được từ 1 nguồn tin cậy — gồm cả `content` (khác
    với SourceItem chỉ có title/url) vì cần giữ lại nội dung để tái sử dụng
    khi không cần tìm lại (không có triệu chứng mới).
    """
    title: str
    url: str
    content: str = ""


class StructuredSummary(BaseModel):
    """
    Bảng tổng hợp trực quan hiển thị ở AiDetailPanel — được AI sinh ra CÙNG
    lúc với "reply" (không tốn thêm 1 lần gọi model riêng). Mọi field đều
    optional/default rỗng vì không phải câu hỏi nào cũng đủ dữ kiện để
    điền đầy đủ (ví dụ câu hỏi làm rõ thêm, không phải mô tả triệu chứng mới).
    """
    quickSummary: str = ""  # tóm tắt 1-2 câu
    emergencyLevel: str = "NORMAL"  # NORMAL | MONITOR | SEE_DOCTOR_SOON | EMERGENCY
    symptoms: list[str] = []
    commonCauses: list[str] = []
    rareCauses: list[str] = []
    seriousCauses: list[str] = []
    consequences: str = ""
    selfCareActions: list[str] = []
    whenToSeeDoctor: list[str] = []


class ChatRequest(BaseModel):
    message: str
    history: list[ChatHistoryItem] = []
    lockedSpecialty: str | None = None
    # Các triệu chứng đã "biết" từ trước trong đoạn chat này (do backend lưu
    # và gửi lại). Dùng để so sánh xem câu hỏi mới có gì mới không.
    knownSymptoms: list[str] = []
    # Context (link + nội dung) đã lấy được ở lượt hỏi gần nhất — tái sử
    # dụng nếu câu hỏi mới không có triệu chứng nào mới.
    cachedContextChunks: list[ContextChunkItem] = []


class ChatResponse(BaseModel):
    reply: str
    suggestedSpecialties: list[str] = []
    sources: list[SourceItem] = []
    emergency: bool = False
    topicMismatch: bool = False
    # True nếu phát hiện triệu chứng mới -> đã tìm lại nguồn thay vì dùng cache.
    hasNewSymptom: bool = False
    # Danh sách triệu chứng đã biết SAU khi xử lý tin nhắn này (đã gộp thêm
    # triệu chứng mới nếu có) — backend lưu lại để dùng cho lần hỏi sau.
    updatedKnownSymptoms: list[str] = []
    # Context THỰC SỰ đã dùng để trả lời lượt này (dù là mới lấy hay tái sử
    # dụng cache) — backend lưu lại làm cache cho lần hỏi sau.
    contextChunksUsed: list[ContextChunkItem] = []
    # Bảng tổng hợp trực quan cho AiDetailPanel. None nếu AI không đủ dữ
    # kiện để tổng hợp (ví dụ topicMismatch=True thì không có field này).
    structuredSummary: StructuredSummary | None = None