from sqlalchemy.orm import Session
from datetime import date, datetime, time, timedelta

from app.core.exceptions import InvalidLogDate, DuplicateLog
from app.models.log import Log
from app.schemas.log import LogEntry, LogUpdate


def get_logs(db: Session, user_id: int, skip: int=0, limit: int= 50):
    return(
    db.query(Log)
    .filter(Log.user_id== user_id)
    .order_by(Log.date.desc())
    .offset(skip)
    .limit(limit)
    .all()
    )    
    
def get_log(db: Session, user_id: int, log_id: int):
    return (
    db.query(Log)
    .filter(Log.id== log_id, Log.user_id== user_id)
    .first()
    )
    

def get_logs_by_date(db: Session, user_id: int, log_date: date):
    start = datetime.combine(log_date, time.min)
    end = start + timedelta(days=1)
    return (
        db.query(Log)
        .filter(Log.user_id == user_id, Log.date >= start, Log.date < end)
        .all()
    )
    
    
def create_log(db: Session, log_entry: LogEntry, user_id: int):
    if log_entry.date:
        log_date = log_entry.date.date()

    if log_date.weekday() == 6:
        raise InvalidLogDate("Logs can only be entered for Monday to Saturday.")

    if get_logs_by_date(db, user_id, log_date):
        raise DuplicateLog(f"A log entry for {log_date} already exists.")
    
    db_log = Log(**log_entry.model_dump(exclude_unset=True), user_id= user_id)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
    
    
def update_log(db: Session, db_log: Log, log_entry: LogUpdate, ):
    for field, value in log_entry.model_dump(exclude_unset= True).items():
        setattr(db_log, field, value)
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
    
    
def delete_log(db: Session, db_log: Log):
    db.delete(db_log)
    db.commit()