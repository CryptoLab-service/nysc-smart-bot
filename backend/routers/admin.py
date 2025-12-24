from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from auth import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/users")
def get_all_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "Official":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    users = db.query(User).all()
    return users

@router.get("/stats")
def get_stats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "Official":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    total_users = db.query(User).count()
    cms = db.query(User).filter(User.role == "Corps Member").count()
    pcms = db.query(User).filter(User.role == "PCM").count()
    
    return {
        "total_users": total_users,
        "corps_members": cms,
        "pcms": pcms,
        "active_today": 12 # Mock for now
    }
