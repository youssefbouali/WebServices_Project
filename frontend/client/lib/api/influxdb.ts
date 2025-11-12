/**
 * InfluxDB API client for querying IoT measurements
 */

export interface MeasurementData {
  _time: string;
  _value: number;
  device_id: string;
  _measurement: string;
  _field?: string;
}

export interface QueryResult {
  series?: Array<{
    name: string;
    columns: string[];
    values: Array<Array<string | number | null>>;
  }>;
}

/**
 * Extract host from VITE_DEVICES and use port 8086 for InfluxDB
 */
function getInfluxDBURL(): string {
  const devicesUrl = import.meta.env.VITE_DEVICES || "http://localhost:8000";
  try {
    const url = new URL(devicesUrl);
    return `${url.protocol}//${url.hostname}:8086`;
  } catch {
    return "http://localhost:8086";
  }
}

const INFLUXDB_URL = getInfluxDBURL();
const INFLUXDB_ORG = import.meta.env.VITE_INFLUXDB_ORG || "my-org";
const INFLUXDB_BUCKET = import.meta.env.VITE_INFLUXDB_BUCKET || "iot_data";
const INFLUXDB_TOKEN = import.meta.env.VITE_INFLUXDB_TOKEN || "my-token";

/**
 * Query measurements from InfluxDB
 */
export async function queryMeasurements(
  query: string,
): Promise<MeasurementData[]> {
  try {
    const response = await fetch(
      `${INFLUXDB_URL}/api/v2/query?org=${INFLUXDB_ORG}`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${INFLUXDB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to query InfluxDB`);
    }

    const data = await response.json();
    return parseInfluxDBResponse(data);
  } catch (error) {
    console.error("InfluxDB query error:", error);
    throw error;
  }
}

/**
 * Get all measurements for the last N hours
 */
export async function getMeasurementsLastHours(
  hours: number = 1,
): Promise<MeasurementData[]> {
  const query = `from(bucket:"${INFLUXDB_BUCKET}") 
    |> range(start: -${hours}h) 
    |> filter(fn: (r) => r._measurement == "device_measurement")`;

  return queryMeasurements(query);
}

/**
 * Get measurements for a specific device
 */
export async function getDeviceMeasurements(
  deviceId: string | number,
  hours: number = 1,
): Promise<MeasurementData[]> {
  const query = `from(bucket:"${INFLUXDB_BUCKET}") 
    |> range(start: -${hours}h) 
    |> filter(fn: (r) => r._measurement == "device_measurement" and r.device_id == "${deviceId}")`;

  return queryMeasurements(query);
}

/**
 * Parse InfluxDB API v2 response format to flat array
 */
function parseInfluxDBResponse(response: any): MeasurementData[] {
  const results: MeasurementData[] = [];

  if (!response || !response.results || response.results.length === 0) {
    return results;
  }

  for (const result of response.results) {
    if (!result.series) continue;

    for (const serie of result.series) {
      const { columns, values, tags } = serie;

      if (!columns || !values) continue;

      const timeIndex = columns.indexOf("time");
      const valueIndex = columns.indexOf("value");

      for (const row of values) {
        if (timeIndex >= 0 && valueIndex >= 0) {
          results.push({
            _time: String(row[timeIndex]),
            _value: Number(row[valueIndex]),
            device_id: tags?.device_id || "unknown",
            _measurement: tags?.["_measurement"] || "device_measurement",
          });
        }
      }
    }
  }

  return results;
}

/**
 * Write a measurement to InfluxDB (for testing purposes)
 */
export async function writeMeasurement(
  deviceId: number,
  value: number,
  measurement: string = "device_measurement",
): Promise<void> {
  const timestamp = Math.floor(Date.now() / 1000);
  const lineProtocol = `${measurement},device_id=${deviceId} value=${value} ${timestamp}`;

  try {
    const response = await fetch(
      `${INFLUXDB_URL}/api/v2/write?org=${INFLUXDB_ORG}&bucket=${INFLUXDB_BUCKET}&precision=s`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${INFLUXDB_TOKEN}`,
          "Content-Type": "text/plain; charset=utf-8",
        },
        body: lineProtocol,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to write to InfluxDB`);
    }
  } catch (error) {
    console.error("InfluxDB write error:", error);
    throw error;
  }
}
