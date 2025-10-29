from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, models, schemas, database, influxdb_client

app = FastAPI(title="Device Module")

models.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


from .database import engine, Base

Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Hello World"}


@app.post("/devices/", response_model=schemas.Device)
def create_device(device: schemas.DeviceCreate, db: Session = Depends(get_db)):
    return crud.create_device(db, device)

@app.get("/devices/", response_model=list[schemas.Device])
def list_devices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_devices(db, skip, limit)

@app.get("/devices/{device_id}", response_model=schemas.Device)
def get_device(device_id: int, db: Session = Depends(get_db)):
    db_device = crud.get_device(db, device_id)
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")
    return db_device

@app.put("/devices/{device_id}", response_model=schemas.Device)
def update_device(device_id: int, updates: schemas.DeviceUpdate, db: Session = Depends(get_db)):
    db_device = crud.update_device(db, device_id, updates)
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")
    # send to influxdb if last_value updated
    if updates.last_value is not None:
        influxdb_client.write_iot_data(device_id, updates.last_value)
    return db_device

@app.delete("/devices/{device_id}", response_model=schemas.Device)
def delete_device(device_id: int, db: Session = Depends(get_db)):
    db_device = crud.delete_device(db, device_id)
    if not db_device:
        raise HTTPException(status_code=404, detail="Device not found")
    return db_device
