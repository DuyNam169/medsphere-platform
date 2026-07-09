from dotenv import load_dotenv
load_dotenv()  # Đọc file .env khi chạy trực tiếp (ngoài Docker). Trong Docker,
                # biến môi trường đã được docker-compose truyền vào sẵn, dòng này
                # không gây hại gì nếu không tìm thấy file .env.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.modules.symptom_checker.routes import router as symptom_checker_router
# from app.modules.prescription_analyzer.routes import router as prescription_analyzer_router
# from app.modules.medical_record_explainer.routes import router as medical_record_explainer_router
# from app.modules.drug_qa.routes import router as drug_qa_router

app = FastAPI()

# Cho phép frontend (chạy ở origin khác, ví dụ localhost:3000) gọi sang
# ai-service (localhost:8000) — nếu không có, trình duyệt sẽ tự chặn request.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ở production nên giới hạn lại đúng domain frontend, không để "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mỗi module một prefix riêng — giữ nguyên "/api/ai" cho symptom_checker
# để frontend (VITE_AI_SERVICE_URL + "/api/ai/chat") không cần đổi gì.
app.include_router(symptom_checker_router, prefix="/api/ai", tags=["symptom-checker"])

# Mở khóa dần khi từng module được triển khai thật:
# app.include_router(prescription_analyzer_router, prefix="/api/prescription", tags=["prescription-analyzer"])
# app.include_router(medical_record_explainer_router, prefix="/api/medical-record", tags=["medical-record-explainer"])
# app.include_router(drug_qa_router, prefix="/api/drug-qa", tags=["drug-qa"])


@app.get("/")
def root():
    return {"message": "AI Service running"}