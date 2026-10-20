import datetime
from sqlalchemy import String, Date, DateTime, Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    daily_activity = Column(String)
    date = Column(Date, nullable=False, default=datetime.date.today, index=True)

    user = relationship("User", back_populates="logs")
    summary_links = relationship("LogSummaryLink", back_populates="log", cascade="all, delete-orphan")


class Summary(Base):
    __tablename__ = "summaries"
    __table_args__ = (
        UniqueConstraint("user_id", "interval_type", "start_date",  name="uq_summary_period"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    interval_type = Column(String(50), nullable=False)  # "weekly" or "monthly"
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    summary_text = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="summaries")
    logs = relationship("LogSummaryLink", back_populates="summary", cascade="all, delete-orphan")


class LogSummaryLink(Base):
    __tablename__ = "log_summary_links"
    __table_args__ = (UniqueConstraint("log_id", "summary_id", name="uq_log_summary"),)

    id = Column(Integer, primary_key=True)
    log_id = Column(Integer, ForeignKey("logs.id"), nullable=False)
    summary_id = Column(Integer, ForeignKey("summaries.id"), nullable=False)

    log = relationship("Log", back_populates="summary_links")
    summary = relationship("Summary", back_populates="logs")