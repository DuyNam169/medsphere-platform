# ============================================================
# topic_lock.py — app/shared/topic_lock.py
# Cơ chế "khóa chủ đề" DÙNG CHUNG cho MỌI module AI cần trả lời y tế.
# Mỗi đoạn chat bị khóa vào 1 chuyên khoa (lockedSpecialty, xác định từ
# tin nhắn đầu tiên, lưu ở backend). Nếu câu hỏi sau đó thuộc chuyên khoa
# khác hẳn -> chặn lại, yêu cầu người dùng tạo đoạn chat mới, thay vì để
# AI trả lời (an toàn hơn: tránh AI đánh giá triệu chứng thiếu nhất quán
# khi ngữ cảnh hội thoại bị trộn nhiều chủ đề khác nhau).
#
# LƯU Ý: cờ is_emergency luôn được ưu tiên tuyệt đối ở tầng service.py của
# từng module — không bao giờ được để topic-lock chặn mất một câu hỏi có
# dấu hiệu cấp cứu. Hàm is_topic_mismatch() ở đây không tự biết về
# emergency; module gọi nó phải tự kiểm tra is_emergency trước và bỏ qua
# lời gọi này nếu is_emergency=True.
# ============================================================

TOPIC_MISMATCH_MESSAGES = {
    "vi": (
        "⚠️ Câu hỏi của bạn có vẻ thuộc một chủ đề sức khỏe khác so với "
        "nội dung đang trao đổi trong đoạn chat này. Để đảm bảo AI đánh giá "
        "chính xác và nhất quán, vui lòng tạo một đoạn chat mới để hỏi về "
        "vấn đề này."
    ),
    "en": (
        "⚠️ Your question seems to be about a different health topic than "
        "the one being discussed in this conversation. To ensure accurate "
        "and consistent assessment, please start a new conversation to ask "
        "about this."
    ),
}


def is_topic_mismatch(locked_specialty: str | None, specialties: list[str]) -> bool:
    """
    Trả về True nếu đoạn chat đã bị khóa vào 1 chuyên khoa (locked_specialty)
    nhưng câu hỏi hiện tại thuộc (các) chuyên khoa hoàn toàn khác — tức
    locked_specialty không nằm trong danh sách suggestedSpecialties vừa
    nhận được cho câu hỏi mới.
    Nếu chưa có locked_specialty (tin nhắn đầu tiên của đoạn chat) -> không
    bao giờ mismatch.
    """
    if not locked_specialty:
        return False
    return locked_specialty not in specialties


def resolve_language(language: str | None) -> str:
    """Chuẩn hóa mã ngôn ngữ do AI trả về; mặc định "vi" nếu không hợp lệ."""
    if language in TOPIC_MISMATCH_MESSAGES:
        return language
    return "vi"