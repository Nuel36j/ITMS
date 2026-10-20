import datetime

from pydantic import BaseModel, EmailStr,  ConfigDict, Field
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str | None = None
    
    
class UserCreate(UserBase):
    password: str
    
class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes = True)
    id: int
    email: EmailStr
    full_name: str | None = None

 

class ProfileBase(BaseModel):
    mat_no: str
    school_name: str
    faculty: str | None = None
    department: str | None = None
    course: str
    level: int | None = Field(default=None, ge=100, le=800)
    institution: str
    duration: str | None = None


class ProfileCreate(ProfileBase):
    pass


class ProfileUpdate(BaseModel):
    mat_no: str | None = None
    school_name: str | None = None
    faculty: str | None = None
    department: str | None = None
    course: str | None = None
    level: int | None = Field(default=None, ge=100, le=800)
    institution: str | None = None
    duration: str | None = None


class UserProfileResponse(ProfileBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    
    
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: str | None = None
