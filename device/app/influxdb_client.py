from influxdb_client import InfluxDBClient, Point, WritePrecision, WriteOptions
from .config import INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET
from datetime import datetime

client = InfluxDBClient(url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG)

write_api = client.write_api(write_options=WriteOptions())

def write_iot_data(device_id: int, value: float):
    point = Point("device_measurement") \
        .tag("device_id", str(device_id)) \
        .field("value", value) \
        .time(datetime.utcnow(), WritePrecision.NS)
    write_api.write(bucket=INFLUX_BUCKET, org=INFLUX_ORG, record=point)
