# ============================================================
# constants.py — app/modules/symptom_checker/constants.py
# Chỉ còn lại phần ĐẶC THÙ RIÊNG của symptom_checker. ALLOWED_SPECIALTIES
# và TOPIC_MISMATCH_MESSAGES đã chuyển lên app/shared để dùng chung mọi module.
# ============================================================

# Hard safety net enforced in code — NOT solely reliant on the AI following
# the prompt. If the message matches any keyword below, force emergency=True
# and always surface the emergency notice, regardless of what the LLM returns.
# (Kept in Vietnamese since these must match literal user input.)
EMERGENCY_KEYWORDS = [
    "đau ngực dữ dội", "đau ngực dữ", "khó thở nặng", "khó thở dữ dội",
    "không thở được", "chảy máu không cầm", "chảy máu nhiều không ngừng",
    "mất ý thức", "ngất xỉu", "bất tỉnh", "co giật", "đột quỵ", "liệt nửa người",
    "méo miệng", "nói ngọng đột ngột", "nôn ra máu", "đi ngoài ra máu nhiều",
    "đau bụng dữ dội đột ngột", "tự tử", "tự sát", "muốn chết",
]

# Extra terms appended to the user's message when searching trusted sources —
# biases Tavily results toward symptom/cause/first-aid content specifically.
SEARCH_QUERY_SUFFIX = "triệu chứng nguyên nhân sơ cứu"