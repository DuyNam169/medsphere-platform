# ============================================================
# routes.py — app/modules/drug_qa/routes.py
# TODO: mount this router in main.py once the feature is implemented,
# e.g. app.include_router(drug_qa_routes.router, prefix="/api/...", tags=["drug_qa"])
# ============================================================
from fastapi import APIRouter

from .schemas import DrugQaRequest, DrugQaResponse
# from .service import process

router = APIRouter()


# @router.post("/", response_model=DrugQaResponse)
# def handle(request: DrugQaRequest):
#     result = process(request.message, request.history)
#     return DrugQaResponse(**result)
