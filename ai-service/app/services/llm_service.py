import json
import logging
from openai import OpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url=settings.GROQ_BASE_URL,
)

# Danh sách chuyên khoa CỐ ĐỊNH — phải khớp CHÍNH XÁC với enum MedicalSpecialty
# bên backend Java (com.medsphere.modules.auth.enums.MedicalSpecialty).
# AI chỉ được chọn trong danh sách này, không được tự bịa ra chuyên khoa khác.
ALLOWED_SPECIALTIES = [
    "GENERAL_INTERNAL_MEDICINE", "CARDIOLOGY", "GASTROENTEROLOGY", "PULMONOLOGY",
    "NEUROLOGY", "NEPHROLOGY_UROLOGY_INTERNAL", "ENDOCRINOLOGY", "HEMATOLOGY",
    "ALLERGY_IMMUNOLOGY", "INFECTIOUS_DISEASE", "GENERAL_SURGERY", "NEUROSURGERY",
    "CARDIOTHORACIC_SURGERY", "UROLOGY_SURGERY", "ORTHOPEDIC_TRAUMATOLOGY",
    "MUSCULOSKELETAL", "OBSTETRICS_GYNECOLOGY", "PEDIATRICS", "FERTILITY_REPRODUCTIVE",
    "ENT", "OPHTHALMOLOGY", "DENTISTRY", "DERMATOLOGY", "ANDROLOGY", "ONCOLOGY",
    "GERIATRICS", "PSYCHOLOGY", "PSYCHIATRY", "REHABILITATION", "TRADITIONAL_MEDICINE",
    "NUTRITION", "EMERGENCY", "INTENSIVE_CARE", "ANESTHESIOLOGY", "RADIOLOGY",
    "LABORATORY_TESTING", "OTHER",
]

SYSTEM_PROMPT = f"""Bạn là trợ lý sức khỏe của Medsphere, hỗ trợ người dùng tại Việt Nam.

NHIỆM VỤ: Dựa trên triệu chứng người dùng mô tả, hãy:
1. Trả lời bằng tiếng Việt, giọng điệu ấm áp, dễ hiểu, ngắn gọn (3-5 câu).
2. Gợi ý 1-2 chuyên khoa phù hợp nhất để người dùng đi khám, CHỈ ĐƯỢC chọn
   trong danh sách mã chuyên khoa sau đây, không được tự tạo mã khác:
   {", ".join(ALLOWED_SPECIALTIES)}

QUY TẮC AN TOÀN — BẮT BUỘC TUÂN THỦ, KHÔNG NGOẠI LỆ:
- TUYỆT ĐỐI KHÔNG chẩn đoán bệnh cụ thể (không nói "bạn bị bệnh X").
  Chỉ được nói triệu chứng "có thể liên quan đến" nhóm vấn đề sức khỏe nào.
- TUYỆT ĐỐI KHÔNG kê đơn thuốc, không gợi ý tên thuốc hay liều lượng.
- LUÔN kết thúc câu trả lời bằng câu nhắc: đây chỉ là gợi ý tham khảo sơ bộ,
  không thay thế chẩn đoán của bác sĩ, người dùng nên đến cơ sở y tế để được khám trực tiếp.
- Nếu triệu chứng nghe có vẻ khẩn cấp (đau ngực dữ dội, khó thở nặng, chảy máu
  nhiều, mất ý thức...), PHẢI khuyên người dùng đến cấp cứu (EMERGENCY) ngay lập tức,
  ưu tiên câu này lên đầu câu trả lời.

ĐỊNH DẠNG BẮT BUỘC: Trả lời CHỈ bằng JSON hợp lệ, không thêm markdown, không thêm
lời dẫn nào khác ngoài JSON, theo đúng cấu trúc:
{{
  "reply": "câu trả lời đầy đủ bằng tiếng Việt, gồm cả câu nhắc an toàn ở cuối",
  "suggestedSpecialties": ["MÃ_CHUYÊN_KHOA_1", "MÃ_CHUYÊN_KHOA_2"]
}}
"""


def ask_ai(message: str, history: list[dict] | None = None) -> dict:
    """
    Gọi AI phân tích triệu chứng, trả về dict gồm:
      - reply: câu trả lời hiển thị trong khung chat
      - suggestedSpecialties: danh sách mã chuyên khoa (dùng để tìm cơ sở y tế sau này)
    """
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model=settings.MODEL_NAME,
            messages=messages,
            temperature=0.3,  # thấp để câu trả lời ổn định, ít "sáng tạo" lệch hướng
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content
        parsed = json.loads(raw)

        # Lọc lại — chỉ giữ những chuyên khoa nằm đúng trong danh sách cho phép,
        # phòng trường hợp AI vẫn lỡ trả về mã không hợp lệ.
        specialties = [
            s for s in parsed.get("suggestedSpecialties", [])
            if s in ALLOWED_SPECIALTIES
        ]

        return {
            "reply": parsed.get("reply", "Xin lỗi, tôi chưa thể trả lời câu hỏi này."),
            "suggestedSpecialties": specialties,
        }

    except json.JSONDecodeError:
        logger.warning("AI trả về không đúng định dạng JSON, raw: %s", raw)
        return {
            "reply": "Xin lỗi, tôi gặp sự cố khi xử lý câu trả lời. Bạn vui lòng thử lại nhé.",
            "suggestedSpecialties": [],
        }
    except Exception as ex:
        logger.error("Lỗi khi gọi AI: %s", ex)
        return {
            "reply": "Xin lỗi, hệ thống đang gặp sự cố. Bạn vui lòng thử lại sau ít phút.",
            "suggestedSpecialties": [],
        }