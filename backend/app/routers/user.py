from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.user import UserResponse, UserProfileResponse, ProfileCreate
from app.models.user import User, UserProfile
from app.crud import user as user_crud
from app.core.database import get_db
from app.routers.auth import get_current_user

router= APIRouter(prefix= "/users", tags =["users"])

@router.post("/createprofile", response_model=UserProfileResponse, status_code=status.HTTP_201_CREATED)
async def register(profile_in: ProfileCreate, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    return user_crud.create_it_profile(db, profile_in, current_user)


@router.get("/me", response_model=  UserResponse)
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user
    
    
@router.get("/myprofile", response_model=UserProfileResponse)
async def read_current_user_profile(current_user: User = Depends(get_current_user)):
    if current_user.profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Create one first."
        )
    return current_user.profile
