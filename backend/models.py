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
    lga = Column(String, nullable=True) # PPA LGA
    address = Column(String, nullable=True)
    state_residence = Column(String, nullable=True)
    lga_residence = Column(String, nullable=True)

