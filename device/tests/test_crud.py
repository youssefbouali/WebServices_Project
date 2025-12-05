from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app import models, crud, schemas


def setup_sqlite_session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    models.Base.metadata.create_all(bind=engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return TestingSessionLocal()


def test_create_and_list_devices():
    db = setup_sqlite_session()
    dev = crud.create_device(db, schemas.DeviceCreate(name="Temp Sensor", type="sensor"))
    assert dev.id is not None
    assert dev.name == "Temp Sensor"
    assert dev.type == "sensor"
    assert dev.status == "inactive"
    assert dev.last_value == 0.0

    devices = crud.get_devices(db)
    assert len(devices) == 1
    assert devices[0].id == dev.id


def test_get_update_delete_device():
    db = setup_sqlite_session()
    dev = crud.create_device(db, schemas.DeviceCreate(name="Pulse", type="sensor"))

    fetched = crud.get_device(db, dev.id)
    assert fetched is not None
    prev_reading = fetched.last_reading

    updated = crud.update_device(db, dev.id, schemas.DeviceUpdate(status="active", last_value=12.34))
    assert updated is not None
    assert updated.status == "active"
    assert updated.last_value == 12.34
    assert updated.last_reading >= prev_reading

    deleted = crud.delete_device(db, dev.id)
    assert deleted is not None
    assert crud.get_device(db, dev.id) is None
