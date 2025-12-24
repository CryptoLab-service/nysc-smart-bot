from fastapi import APIRouter, Depends
from models import User
from auth import get_current_user
from typing import List
import datetime

router = APIRouter(prefix="/api", tags=["Data"])

@router.get("/news")
def get_news():
    # Return news with real links and formatted times
    return [
        {
            "id": 1, 
            "title": "2025 Batch A Online Registration Starts Soon", 
            "date": "Today, 10:00 AM", 
            "type": "Mobilization",
            "url": "https://nysc.gov.ng/news-and-events"
        },
        {
            "id": 2, 
            "title": "DG NYSC Warns Against Fake News", 
            "date": "Yesterday, 4:30 PM", 
            "type": "Official",
            "url": "https://nysc.gov.ng/"
        },
        {
            "id": 3, 
            "title": "Senate List Updates for Foreign Students", 
            "date": "Dec 20, 2:15 PM", 
            "type": "Guide",
            "url": "https://portal.nysc.org.ng/nysc1/VerifySenateLists.aspx"
        },
    ]

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
