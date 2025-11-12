from pydantic import BaseModel
from datetime import datetime

class DeviceBase(BaseModel):
    name: str
    type: str

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    status: str | None = None
    last_value: float | None = None

class Device(DeviceBase):
    id: int
    status: str
    last_value: float
    last_reading: datetime

    class Config:
        orm_mode = True
