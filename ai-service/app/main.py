from fastapi import FastAPI
from app.api.routes.ai_routes import router

app = FastAPI()

app.include_router(router, prefix="/api/ai")

@app.get("/")
def root():
    return {"message": "AI Service running"}