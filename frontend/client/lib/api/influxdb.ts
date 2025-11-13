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
          Accept: "application/csv",
        },
        body: JSON.stringify({ query }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to query InfluxDB`);
    }

    const csv = await response.text();
    return parseInfluxCSV(csv);
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
 * Parse annotated CSV returned by InfluxDB v2 /api/v2/query
 */
function parseInfluxCSV(csv: string): MeasurementData[] {
  const lines = csv.split(/\r?\n/).filter((l) => l.length > 0);
  const dataLines: string[] = [];
  let header: string[] | null = null;

  for (const line of lines) {
    if (line.startsWith("#")) continue; // skip metadata lines (#datatype, #group, #default)
    if (!header) {
      header = parseCSVLine(line);
      continue;
    }
    dataLines.push(line);
  }

  // Handle case where InfluxDB returned header and row values on the same line
  // e.g. ",result,table,_start,_stop,_time,_value,_field,_measurement,device_id ,_result,0,2025-..."
  // In that situation `lines` will be a single non-comment line containing both header names and values.
  if (header && dataLines.length === 0) {
    // If header contains an ISO timestamp token we can split header into headerNames and the data values
    const isoIndex = header.findIndex((tok) =>
      /^\d{4}-\d{2}-\d{2}T/.test(String(tok)),
    );
    if (isoIndex > 0) {
      const headerNames = header.slice(0, isoIndex).map((s) => String(s));
      const values = header.slice(isoIndex).map((s) => String(s));
      // Build a single data line from values using commas (we already have parsed tokens)
      header = headerNames;
      dataLines.push(values.join(","));
    }
  }

  if (!header) return [];

  const colIndex = (name: string) => header!.indexOf(name);
  const idxTime = colIndex("_time");
  const idxValue = colIndex("_value");
  const idxDevice = colIndex("device_id");
  const idxMeas = colIndex("_measurement");
  const idxField = colIndex("_field");

  const out: MeasurementData[] = [];

  for (const line of dataLines) {
    const cols = parseCSVLine(line);
    const time = idxTime >= 0 ? cols[idxTime] : undefined;
    const value = idxValue >= 0 ? cols[idxValue] : undefined;
    const device = idxDevice >= 0 ? cols[idxDevice] : undefined;
    const meas = idxMeas >= 0 ? cols[idxMeas] : undefined;
    const field = idxField >= 0 ? cols[idxField] : undefined;

    if (time !== undefined && value !== undefined) {
      out.push({
        _time: String(time),
        _value: Number(value),
        device_id: device ?? "unknown",
        _measurement: meas ?? "device_measurement",
        _field: field,
      });
    }
  }

  return out;
}

// Minimal CSV parser that handles commas within quoted fields and escaped quotes
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
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
