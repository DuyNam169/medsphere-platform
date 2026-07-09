# ============================================================
# routes.py — app/modules/medical_record_explainer/routes.py
# TODO: mount this router in main.py once the feature is implemented,
# e.g. app.include_router(medical_record_explainer_routes.router, prefix="/api/...", tags=["medical_record_explainer"])
# ============================================================
from fastapi import APIRouter

from .schemas import MedicalRecordExplainerRequest, MedicalRecordExplainerResponse
# from .service import process

router = APIRouter()


# @router.post("/", response_model=MedicalRecordExplainerResponse)
# def handle(request: MedicalRecordExplainerRequest):
#     result = process(request.message, request.history)
#     return MedicalRecordExplainerResponse(**result)
