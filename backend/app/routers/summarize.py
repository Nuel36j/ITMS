from typing import Literal
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.exceptions import DuplicateSummary, InvalidDateRange
from app.core.database import get_db
from app.schemas.log import SummaryResponse, SummaryUpdate
from app.crud import summary
from app.routers.auth import get_current_user
from app.models.user import User

router = APIRouter()


def get_owned_summary(db: Session, summary_id: int, user: User):
    item = summary.get_summary(db, summary_id)
    if not item or item.user_id != user.id:
        raise HTTPException(status_code=404, detail="Summary not found")
    return item


@router.post("/summarize/", response_model=SummaryResponse)
def summarize(
    interval_type: Literal["weekly", "monthly"],
    start_date: date | None = None,
    end_date: date | None = None,
    overwrite: bool = False,                      # new
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        result = summary.create_summary(
            db=db, user_id=current_user.id, interval_type=interval_type,
            start_date=start_date, end_date=end_date,
            overwrite=overwrite,                  # new
        )
    except InvalidDateRange as e:
        raise HTTPException(status_code=400, detail=str(e))
    except DuplicateSummary as e:
        raise HTTPException(                      # changed: detail is now a dict
            status_code=409,
            detail={"message": str(e), "summary_id": e.summary_id},
        )

    if not result:
        raise HTTPException(status_code=404, detail="No logs found for the selected date range")
    return result


@router.get("/summaries/", response_model=list[SummaryResponse])
def list_summaries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return summary.get_user_summaries(db, current_user.id)


@router.get("/summaries/{summary_id}", response_model=SummaryResponse)
def read_summary(
    summary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_owned_summary(db, summary_id, current_user)


@router.put("/summaries/{summary_id}", response_model=SummaryResponse)
def update_summary(
    summary_id: int,
    payload: SummaryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    owned = get_owned_summary(db, summary_id, current_user)  # 404/403 if missing or not theirs
    return summary.update_summary(db, owned, payload.summary_text)


@router.delete("/summaries/{summary_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_summary(
    summary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_owned_summary(db, summary_id, current_user)
    summary.delete_summary(db, summary_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)