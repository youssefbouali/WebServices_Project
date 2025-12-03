try:
    from pydantic import BaseModel, ConfigDict
    _HAS_PYDANTIC_V2 = True
except ImportError:
    from pydantic import BaseModel  # type: ignore
    ConfigDict = None  # type: ignore
    _HAS_PYDANTIC_V2 = False
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

# Enable Pydantic v2 attribute parsing when available
if _HAS_PYDANTIC_V2 and ConfigDict is not None:
    Device.model_config = ConfigDict(from_attributes=True)
