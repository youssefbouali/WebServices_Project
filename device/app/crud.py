from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime

def get_device(db: Session, device_id: int):
    return db.query(models.Device).filter(models.Device.id == device_id).first()

def get_devices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Device).offset(skip).limit(limit).all()

def create_device(db: Session, device: schemas.DeviceCreate):
    db_device = models.Device(name=device.name, type=device.type)
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

def update_device(db: Session, device_id: int, updates: schemas.DeviceUpdate):
    db_device = get_device(db, device_id)
    if not db_device:
        return None
    for key, value in updates.dict(exclude_unset=True).items():
        setattr(db_device, key, value)
    db_device.last_reading = datetime.utcnow()
    db.commit()
    db.refresh(db_device)
    return db_device

def delete_device(db: Session, device_id: int):
    db_device = get_device(db, device_id)
    if db_device:
        db.delete(db_device)
        db.commit()
    return db_device
