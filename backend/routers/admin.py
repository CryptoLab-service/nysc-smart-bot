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

from pydantic import BaseModel

class NewsCreate(BaseModel):
    title: str
    content: str
    type: str # Mobilization, Official, Guide
    url: str | None = None

from models import News
import datetime

@router.post("/news")
def create_news(news: NewsCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "Official":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Format date as requested by frontend: "Day, Time"
    now = datetime.datetime.now()
    formatted_date = now.strftime("%b %d, %I:%M %p") # Dec 24, 10:00 AM
    
    new_news = News(
        title=news.title,
        content=news.content,
        type=news.type,
        url=news.url,
        date=formatted_date
    )
    db.add(new_news)
    db.commit()
    return {"message": "News posted successfully"}
