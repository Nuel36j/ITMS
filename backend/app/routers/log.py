from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.exceptions import InvalidLogDate, DuplicateLog
from app.crud import log as log_crud
from app.models.user import User
from app.routers.auth import get_current_user
from app.core.database import get_db
from app.schemas.log import LogEntry, LogResponse, LogUpdate

router = APIRouter(prefix="/logs", tags=["logs"])


@router.post("/", response_model=LogResponse, status_code=status.HTTP_201_CREATED)
def create_log(
    log_entry: LogEntry,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return log_crud.create_log(db, log_entry, user_id=current_user.id)
    except InvalidLogDate as e:
        raise HTTPException(status_code=400, detail=str(e))
    except DuplicateLog as e:
        raise HTTPException(status_code=409, detail=str(e))


@router.get("/", response_model=list[LogResponse])
def list_logs(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return log_crud.get_logs(db, user_id=current_user.id, skip=skip, limit=limit)


@router.get("/by-date/{log_date}", response_model=list[LogResponse])
def logs_by_date(
    log_date: date,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return log_crud.get_logs_by_date(db, user_id=current_user.id, log_date=log_date)


@router.get("/{log_id}", response_model=LogResponse)
def get_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    log = log_crud.get_log(db, user_id=current_user.id, log_id=log_id)
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log


@router.put("/{log_id}", response_model=LogResponse)
def edit_log(
    log_id: int,
    log_entry: LogUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    log = log_crud.get_log(db, user_id=current_user.id, log_id=log_id)
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    return log_crud.update_log(db, log, log_entry)


@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    log = log_crud.get_log(db, user_id=current_user.id, log_id=log_id)
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    log_crud.delete_log(db, log)
    return Response(status_code=status.HTTP_204_NO_CONTENT)