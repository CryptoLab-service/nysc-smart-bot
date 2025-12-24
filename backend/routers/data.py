from fastapi import APIRouter, Depends
from models import User, News
from database import get_db
from sqlalchemy.orm import Session
from auth import get_current_user
from typing import List
import datetime

router = APIRouter(prefix="/api", tags=["Data"])

from models import News

@router.get("/news")
def get_news(db: Session = Depends(get_db)):
    news_items = db.query(News).order_by(News.id.desc()).limit(10).all()
    if not news_items:
        # Fallback for initial load
        return [
            {
                "id": 1, 
                "title": "2025 Batch A Online Registration Starts Soon", 
                "date": "Today, 10:00 AM", 
                "type": "Mobilization", 
                "url": "https://nysc.gov.ng"
            }
        ]
    return news_items

@router.get("/timeline")
def get_timeline(user: User = Depends(get_current_user)):
    # Role-based timeline data
    # PCM: Days to Camp, Registration
    # Corps Member: Deployment State, POP Date
    
    # Defaults
    days_to_camp = 14
    reg_status = "Open"
    deployment_state = user.state if user.state else "Pending"
    pop_date = user.pop_date if user.pop_date else "Oct 2025"
    
    return {
        "user_role": user.role, # 'PCM', 'Corps Member', 'Official'
        "days_to_camp": days_to_camp, 
        "registration_status": reg_status,
        "deployment_state": deployment_state,
        "pop_date": pop_date
    }

@router.get("/resources")
def get_resources():
    return [
        {"id": 1, "title": "NYSC Bye-Laws (Revised 2011)", "type": "PDF", "size": "2.4 MB", "category": "Bye-Laws", "url": "https://nysc.gov.ng/downloads/nysc-bye-laws.pdf"},
        {"id": 2, "title": "Camp Registration Checklist", "type": "PDF", "size": "1.1 MB", "category": "Orientation", "url": "https://nysc.gov.ng/downloads/camp-requirements.pdf"},
        {"id": 3, "title": "SAED Handbook 2024", "type": "PDF", "size": "5.2 MB", "category": "Orientation", "url": "https://nysc.gov.ng/saed"},
    ]
