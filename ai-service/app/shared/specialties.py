# ============================================================
# specialties.py — app/shared/specialties.py
# Danh sách chuyên khoa DÙNG CHUNG cho MỌI module AI. MUST match exactly
# the MedicalSpecialty enum on the Java backend
# (com.medsphere.modules.auth.enums.MedicalSpecialty).
# Mọi module chỉ được chọn chuyên khoa trong danh sách này, không được tự
# định nghĩa danh sách riêng — để "topicMismatch" so sánh đồng nhất giữa
# các module (vd: symptom_checker khóa CARDIOLOGY, sau đó drug_qa cũng
# hiểu đúng mã CARDIOLOGY này).
# ============================================================
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