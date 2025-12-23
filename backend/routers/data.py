from fastapi import APIRouter, Depends
from models import User
from auth import get_current_user
from typing import List
import datetime

router = APIRouter(prefix="/api", tags=["Data"])

@router.get("/news")
def get_news():
    # In a real app, this would scrape or fetch from Tavily/Google News
    # For now, we return dynamic data to prove backend integration
    return [
        {"id": 1, "title": "2025 Batch A Online Registration Starts Soon", "date": "Just now", "type": "Mobilization"},
        {"id": 2, "title": "DG NYSC Warns Against Fake News", "date": "1 hour ago", "type": "Official"},
        {"id": 3, "title": "Senate List Updates for Foreign Students", "date": "Today", "type": "Guide"},
    ]

@router.get("/timeline")
def get_timeline(user: User = Depends(get_current_user)):
    # Logic to return timeline based on user role/state
    # This proves we are using the authenticated user context
    return {
        "days_to_camp": 5, 
        "registration_status": "Open",
        "deployment_state": user.state if user.state else "Pending"
    }

@router.get("/resources")
def get_resources():
    return [
        {"id": 1, "title": "NYSC Bye-Laws (Revised 2011)", "type": "PDF", "size": "2.4 MB", "category": "Bye-Laws", "url": "/static/bye-laws.pdf"},
        {"id": 2, "title": "Camp Registration Checklist", "type": "PDF", "size": "1.1 MB", "category": "Orientation", "url": "/static/camp-checklist.pdf"},
        {"id": 3, "title": "SAED Handbook 2024", "type": "PDF", "size": "5.2 MB", "category": "Orientation", "url": "/static/saed-handbook.pdf"},
    ]
