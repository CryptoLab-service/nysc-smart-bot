from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    role = Column(String, default="Corps Member")  # PCM, Corps Member, Official
    state = Column(String, nullable=True) # State of deployment
    gender = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    state_code = Column(String, nullable=True)
    mobilization_date = Column(String, nullable=True)
    pop_date = Column(String, nullable=True)
    cds_group = Column(String, nullable=True)
    cds_day = Column(String, nullable=True) # Mon-Fri
    lga = Column(String, nullable=True) # PPA LGA
    address = Column(String, nullable=True)
    state_residence = Column(String, nullable=True)
    lga_residence = Column(String, nullable=True)

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String) # Summary or simple content
    date = Column(String) # For now keeping string as per frontend request "Today, 10:00 AM" or ISO
    type = Column(String) # Mobilization, Official, Guide
    url = Column(String, nullable=True)

class Clearance(Base):
    __tablename__ = "clearances"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True) # ForeignKey relation manual for simplicity or add ForeignKey
    user_name = Column(String) # Denormalized for easy display
    state_code = Column(String)
    month = Column(String) # e.g. "January 2026"
    date_submitted = Column(String)
    status = Column(String, default="Pending") # Pending, Approved, Rejected
    file_url = Column(String, nullable=True) # URL to uploaded letter
    official_comment = Column(String, nullable=True)

