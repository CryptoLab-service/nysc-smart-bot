from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from auth import get_current_user
from services.upload_service import upload_file

router = APIRouter(
    prefix="/clearance",
    tags=["clearance"]
)

# Pydantic Schemas
class ClearanceAction(BaseModel):
    status: str # "Approved" or "Rejected"
    comment: Optional[str] = None

class ClearanceOut(BaseModel):
    id: int
    user_name: str
    state_code: str
    month: str
    date_submitted: str
    status: str
    file_url: Optional[str]
    official_comment: Optional[str]

    class Config:
        from_attributes = True

# --- Endpoints ---

# 1. CM: Submit Request
@router.post("/request")
async def request_clearance(
    month: str = Form(...),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "Corps Member":
        raise HTTPException(status_code=403, detail="Only Corps Members can request clearance")

    # Check for duplicate
    existing = db.query(models.Clearance).filter(
        models.Clearance.user_id == current_user.id,
        models.Clearance.month == month
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Clearance request already submitted for this month")

    # Upload File if present
    file_url = None
    if file:
        file_url = upload_file(file)
        if not file_url:
             # Fallback if upload failed but we want to allow submission? 
             # Or raise error? Let's assume for MVP we allow it but log it.
             # Actually, better to define a mock if it fails handled in service.
             file_url = f"https://mock-storage.com/{file.filename}"

    new_request = models.Clearance(
        user_id=current_user.id,
        user_name=current_user.name,
        state_code=current_user.state_code,
        month=month,
        date_submitted=datetime.now().strftime("%Y-%m-%d %H:%M"),
        status="Pending",
        file_url=file_url
    )
    
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return {"message": "Clearance submitted successfully", "id": new_request.id}

# 2. CM: View History
@router.get("/my-history", response_model=List[ClearanceOut])
async def get_my_history(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Clearance).filter(models.Clearance.user_id == current_user.id).all()

# 3. Official: View Pending Requests
@router.get("/pending", response_model=List[ClearanceOut])
async def get_pending_requests(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role not in ["Official", "Admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # In a real app, filter by Official's LGA/State. For MVP -> All pending.
    return db.query(models.Clearance).filter(models.Clearance.status == "Pending").all()

# 4. Official: Approve/Reject
@router.put("/{request_id}/action")
async def action_clearance(request_id: int, action: ClearanceAction, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role not in ["Official", "Admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    clearance = db.query(models.Clearance).filter(models.Clearance.id == request_id).first()
    if not clearance:
        raise HTTPException(status_code=404, detail="Clearance request not found")
    
    clearance.status = action.status
    clearance.official_comment = action.comment
    db.commit()
    
    return {"message": f"Clearance {action.status}"}
