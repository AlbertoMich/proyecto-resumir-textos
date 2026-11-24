# summary_routes.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
import re
import models
from database import get_db
from auth import get_current_user  # <-- tu función JWT
from datetime import datetime

router = APIRouter(prefix="/summaries", tags=["summaries"])


class SummaryRequest(BaseModel):
    text: str

class SummaryResponse(BaseModel):
    id: int
    texto_original: str
    resumen: str
    created_at: datetime


def generate_summary(text: str) -> str:
    sentences = re.split(r'(?<=[.!?]) +', text)
    return " ".join(sentences[:3]) 


@router.post("/", response_model=SummaryResponse)
def create_summary(
    request: SummaryRequest,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    resumen = generate_summary(request.text)
    summary = models.Summary(
        user_id=user.id,
        texto_original=request.text,
        resumen=resumen
    )
    db.add(summary)
    db.commit()
    db.refresh(summary)
    return summary


@router.get("/", response_model=List[SummaryResponse])
def list_summaries(
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    summaries = db.query(models.Summary).filter(models.Summary.user_id == user.id)\
                                         .order_by(models.Summary.created_at.desc())\
                                         .all()
    return summaries
