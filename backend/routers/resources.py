from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from auth import get_current_user

router = APIRouter(
    prefix="/resources",
    tags=["resources"]
)

class ResourceCreate(BaseModel):
    title: str
    category: str
    url: str

class ResourceOut(BaseModel):
    id: int
    title: str
    category: str
    url: str
    date_added: str

    class Config:
        from_attributes = True

# 1. Get All Resources
@router.get("/", response_model=List[ResourceOut])
async def get_resources(db: Session = Depends(get_db)):
    return db.query(models.Resource).all()

# 2. Add Resource (Admin Only)
@router.post("/")
async def add_resource(res: ResourceCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role not in ["Official", "Admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    new_resource = models.Resource(
        title=res.title,
        category=res.category,
        url=res.url,
        date_added=datetime.now().strftime("%Y-%m-%d")
    )
    db.add(new_resource)
    db.commit()
    return {"message": "Resource added successfully"}
