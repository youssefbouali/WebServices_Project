from sqlalchemy import Column, Integer, String, Float, DateTime
from .database import Base
from datetime import datetime

class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    status = Column(String, default="inactive")
    last_value = Column(Float, default=0.0)
    last_reading = Column(DateTime, default=datetime.utcnow)
