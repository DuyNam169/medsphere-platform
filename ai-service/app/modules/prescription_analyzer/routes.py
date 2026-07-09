# ============================================================
# routes.py — app/modules/prescription_analyzer/routes.py
# TODO: mount this router in main.py once the feature is implemented,
# e.g. app.include_router(prescription_analyzer_routes.router, prefix="/api/...", tags=["prescription_analyzer"])
# ============================================================
from fastapi import APIRouter

from .schemas import PrescriptionAnalyzerRequest, PrescriptionAnalyzerResponse
# from .service import process

router = APIRouter()


# @router.post("/", response_model=PrescriptionAnalyzerResponse)
# def handle(request: PrescriptionAnalyzerRequest):
#     result = process(request.message, request.history)
#     return PrescriptionAnalyzerResponse(**result)
