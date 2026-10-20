from datetime import date, timedelta

from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.core.exceptions import DuplicateSummary, InvalidDateRange
from app.models.log import Summary, LogSummaryLink, Log
from app.core.sumutils import (
    get_default_week_start,
    get_interval_bounds,
    summarize_data,
)


def create_summary(
    db: Session,
    user_id: int,
    interval_type: str,
    start_date: date | None = None,
    end_date=None,
    overwrite: bool = False,
):
    start_date = start_date or get_default_week_start()
    start, end_exclusive = get_interval_bounds(start_date, interval_type)

    existing = db.query(Summary).filter_by(
        user_id=user_id, interval_type=interval_type, start_date=start,
    ).first()

    # Check before calling Gemini so a blocked duplicate costs no API request
    if existing and not overwrite:
        raise DuplicateSummary("You already have a summary for this period.", existing.id)

    logs = (
        db.query(Log)
        .filter(Log.user_id == user_id, Log.date >= start, Log.date < end_exclusive)
        .order_by(Log.date, Log.id)
        .all()
    )
    if not logs:
        return None

    summary_text = summarize_data(logs)
    if summary_text is None:
        # Raised before any DB change, so an existing summary is never wiped by a failed regeneration
        raise HTTPException(status_code=503, detail="AI summary service is unavailable, try again later")

    end_inclusive = end_exclusive - timedelta(days=1)

    if existing:
        existing.summary_text = summary_text
        existing.end_date = end_inclusive
        record = existing
        # Drop old links so they don't go stale or hit a unique constraint
        db.query(LogSummaryLink).filter(
            LogSummaryLink.summary_id == record.id
        ).delete(synchronize_session=False)
    else:
        record = Summary(
            user_id=user_id,
            interval_type=interval_type,
            start_date=start,
            end_date=end_inclusive,
            summary_text=summary_text,
        )
        db.add(record)
        db.flush()  # assigns record.id for the links below

    for log in logs:
        db.add(LogSummaryLink(log_id=log.id, summary_id=record.id))

    db.commit()  # one commit, so the summary and its links save together
    db.refresh(record)
    return record

# READ
def get_summary(db: Session, summary_id: int):
    summary = db.query(Summary).filter(Summary.id == summary_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")
    return summary

def get_user_summaries(db: Session, user_id: int):
    return db.query(Summary).filter(Summary.user_id == user_id).all()

# UPDATE
def update_summary(db: Session, summary: Summary, new_text: str) -> Summary:
    text = new_text.strip()
    if not text:
        raise HTTPException(status_code=422, detail="Summary text can't be empty")
    summary.summary_text = text
    db.commit()
    db.refresh(summary)
    return summary

# DELETE
def delete_summary(db: Session, summary_id: int):
    summary = db.query(Summary).filter(Summary.id == summary_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")
    db.delete(summary)
    db.commit()
    return {"detail": "Summary deleted successfully"}