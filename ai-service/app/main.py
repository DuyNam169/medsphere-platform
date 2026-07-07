from dotenv import load_dotenv
load_dotenv()  # Đọc file .env khi chạy trực tiếp (ngoài Docker). Trong Docker,
                # biến môi trường đã được docker-compose truyền vào sẵn, dòng này
                # không gây hại gì nếu không tìm thấy file .env.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.ai_routes import router

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

app.include_router(router, prefix="/api/ai")


@app.get("/")
def root():
    return {"message": "AI Service running"}