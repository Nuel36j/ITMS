from sqlalchemy.orm import Session

from app.models.user import User, UserProfile
from app.schemas.user import UserCreate, ProfileCreate, ProfileUpdate
from app.core.security import hash_password, verify_password

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id== user_id).first()
    
          
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email== email).first()
    
    
def get_user_by_matno(db: Session, mat_no: int):
    return db.query(UserProfile).filter(User.mat_no== mat_no).first()
    
    
def create_user(db: Session, user_in: UserCreate):
    db_user = User(
    email = user_in.email,
    full_name= user_in.full_name,
    hashed_password= hash_password(user_in.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
    

def create_it_profile(db: Session, profile_in: ProfileCreate, current_user: User):
    db_profile = UserProfile(
        user_id=current_user.id,
        mat_no=profile_in.mat_no,
        school_name=profile_in.school_name,
        faculty=profile_in.faculty,
        department=profile_in.department,
        course=profile_in.course,
        level=profile_in.level,
        institution=profile_in.institution,
        duration=profile_in.duration,
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile
        
        
    
def update_it_profile(db: Session, db_profile: UserProfile, profile_in: ProfileUpdate, ):
    for field, value in profile_in.model_dump(exclude_unset= True).items():
        setattr(db_log, field, value)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_user
      
      
def delete_user(db:Session, db_user: User):
    db.delete(db_user)
    db.commit()
    
    
def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user
