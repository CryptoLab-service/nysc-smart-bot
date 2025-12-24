from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User
from auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    role: str = "Corps Member"
    state: str = None
    gender: str = None
    phone: str = None
    state_code: str = None
    mobilization_date: str = None
    pop_date: str = None
    cds_group: str = None
    lga: str = None # PPA LGA
    state_residence: str = None
    lga_residence: str = None
    address: str = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserSocialLogin(BaseModel):
    email: str
    name: str = None
    provider: str
    photo_url: str = None

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    roles: str = "Corps Member"
    state: str | None
    cds_group: str | None = None
    lga: str | None = None
    state_residence: str | None = None
    lga_residence: str | None = None
    address: str | None = None
    phone: str | None = None
    mobilization_date: str | None = None
    pop_date: str | None = None
    token: str | None = None

    class Config:
        orm_mode = True

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        hashed_password=hashed_password,
        name=user.name,
        role=user.role,
        state=user.state,
        gender=user.gender,
        phone=user.phone,
        state_code=user.state_code,
        mobilization_date=user.mobilization_date,
        pop_date=user.pop_date
    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        print(f"------------ SIGNUP ERROR ------------")
        print(f"Error creating user: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
    # Auto-login after signup
    access_token = create_access_token(data={"sub": new_user.email})
    
    # Create response object manually since Pydantic/SQLAlchemy mapping can be tricky with extra fields
    return UserResponse(
        id=new_user.id,
        email=new_user.email,
        name=new_user.name,
        role=new_user.role,
        state=new_user.state,
        token=access_token
    )

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": db_user.email})
    
    return {
        "id": db_user.id,
        "email": db_user.email,
        "name": db_user.name,
        "role": db_user.role,
        "state": db_user.state,
        "token": access_token
    }

@router.post("/social-login", response_model=UserResponse)
def social_login(user: UserSocialLogin, db: Session = Depends(get_db)):
    # 1. Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if not db_user:
        # 2. If not, create a new user with a random password
        import secrets
        random_password = secrets.token_urlsafe(16)
        hashed_password = get_password_hash(random_password)
        
        new_user = User(
            email=user.email,
            hashed_password=hashed_password,
            name=user.name or "Social User",
            role="Corps Member",  # Default role
            state="Pending"       # Default state
        )
        try:
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            db_user = new_user
        except Exception as e:
            print(f"------------ SOCIAL SIGNUP ERROR ------------")
            print(f"Error creating social user: {e}")
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
    # 3. Generate Access Token
    access_token = create_access_token(data={"sub": db_user.email})
    
    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        name=db_user.name,
        role=db_user.role,
        state=db_user.state,
        token=access_token
    )

class UserUpdate(BaseModel):
    name: str = None
    role: str = None
    state: str = None
    cds_group: str = None
    lga: str = None
    state_residence: str = None
    lga_residence: str = None
    address: str = None
    phone: str = None
    pop_date: str = None

@router.put("/profile", response_model=UserResponse)
def update_profile(user_update: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Update fields if provided
    if user_update.name: current_user.name = user_update.name
    if user_update.role: current_user.role = user_update.role
    if user_update.state: current_user.state = user_update.state
    if user_update.cds_group: current_user.cds_group = user_update.cds_group
    if user_update.lga: current_user.lga = user_update.lga
    if user_update.state_residence: current_user.state_residence = user_update.state_residence
    if user_update.lga_residence: current_user.lga_residence = user_update.lga_residence
    if user_update.address: current_user.address = user_update.address
    if user_update.phone: current_user.phone = user_update.phone
    if user_update.pop_date: current_user.pop_date = user_update.pop_date

    try:
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        state=current_user.state,
        cds_group=current_user.cds_group,
        lga=current_user.lga,
        state_residence=current_user.state_residence,
        lga_residence=current_user.lga_residence,
        address=current_user.address,
        phone=current_user.phone,
        mobilization_date=current_user.mobilization_date,
        pop_date=current_user.pop_date,
        token=None # No new token needed
    )

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    # Create response compatible with UserResponse
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        state=current_user.state,
        cds_group=current_user.cds_group,
        lga=current_user.lga,
        state_residence=current_user.state_residence,
        lga_residence=current_user.lga_residence,
        address=current_user.address,
        phone=current_user.phone,
        mobilization_date=current_user.mobilization_date,
        pop_date=current_user.pop_date,
        token=None # No new token needed
    )
