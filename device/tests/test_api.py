from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient
import importlib


def setup_sqlite():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    # Patch the device database before importing the app
    db = importlib.import_module("device.app.database")
    db.engine = engine
    db.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    # Create tables
    models = importlib.import_module("device.app.models")
    models.Base.metadata.create_all(bind=engine)

    # Stub InfluxDB write to avoid network
    influx = importlib.import_module("device.app.influxdb_client")
    influx.write_iot_data = lambda device_id, value: None

    return engine


def test_device_endpoints():
    setup_sqlite()
    main = importlib.import_module("device.app.main")
    client = TestClient(main.app)

    # Create
    resp = client.post("/devices/", json={"name": "DevA", "type": "sensor"})
    assert resp.status_code == 200
    data = resp.json()
    device_id = data["id"]
    assert data["name"] == "DevA"
    assert data["type"] == "sensor"
    assert data["status"] == "inactive"

    # List
    resp = client.get("/devices/")
    assert resp.status_code == 200
    arr = resp.json()
    assert any(d["id"] == device_id for d in arr)

    # Update
    resp = client.put(f"/devices/{device_id}", json={"status": "active", "last_value": 42.0})
    assert resp.status_code == 200
    upd = resp.json()
    assert upd["status"] == "active"
    assert upd["last_value"] == 42.0

    # Get by ID
    resp = client.get(f"/devices/{device_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == device_id

    # Delete
    resp = client.delete(f"/devices/{device_id}")
    assert resp.status_code == 200
    # Ensure gone
    resp = client.get(f"/devices/{device_id}")
    assert resp.status_code == 404
