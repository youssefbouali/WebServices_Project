import os

POSTGRES_USER = os.getenv("POSTGRES_USER", "device_user")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "device_pass")
POSTGRES_DB = os.getenv("POSTGRES_DB", "device_db")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "db")
POSTGRES_PORT = 5432

INFLUX_URL = os.getenv("INFLUX_URL", "http://influx:8086")
INFLUX_TOKEN = os.getenv("INFLUX_TOKEN", "my-token")
INFLUX_ORG = os.getenv("INFLUX_ORG", "my-org")
INFLUX_BUCKET = os.getenv("INFLUX_BUCKET", "iot_data")
