from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    # One User → Many Logs
    logs = relationship(
        "Log",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    # One User → One UserProfile
    profile = relationship(
        "UserProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )
    
    summaries = relationship(
        "Summary",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    

class UserProfile(Base):
    __tablename__ = "userprofile"

    id = Column(Integer, primary_key=True, autoincrement= True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    mat_no = Column(String, unique=True, index=True)
    school_name = Column(String, nullable=False)
    faculty = Column(String)
    department = Column(String)
    course = Column(String, nullable=False)
    level = Column(Integer)
    institution = Column(String, nullable=False)
    duration = Column(String)

    # Connect back to User
    user = relationship(
        "User",
        back_populates="profile"
    )