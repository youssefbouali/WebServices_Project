import { API_BASE_URLS, apiFetch } from "./config";

export interface Device {
  id: number;
  name: string;
  type: string;
  status: "active" | "inactive";
  last_value: number;
  last_reading: string;
}

export interface CreateDeviceRequest {
  name: string;
  type: string;
  manufacturer?: string;
  notes?: string;
}

export interface UpdateDeviceRequest {
  name?: string;
  type?: string;
  status?: "active" | "inactive";
}

/**
 * Get all devices with optional pagination
 */
export async function getDevices(
  skip?: number,
  limit?: number,
): Promise<Device[]> {
  const queryString = new URLSearchParams();
  if (skip !== undefined) queryString.append("skip", skip.toString());
  if (limit !== undefined) queryString.append("limit", limit.toString());

  const query = queryString.toString();
  const url = query
    ? `${API_BASE_URLS.DEVICES}/devices?${query}`
    : `${API_BASE_URLS.DEVICES}/devices`;

  return apiFetch<Device[]>(url, {
    method: "GET",
  });
}

/**
 * Get a device by ID
 */
export async function getDeviceById(deviceId: number): Promise<Device> {
  return apiFetch<Device>(`${API_BASE_URLS.DEVICES}/devices/${deviceId}`, {
    method: "GET",
  });
}

/**
 * Create a new device
 */
export async function createDevice(data: CreateDeviceRequest): Promise<Device> {
  return apiFetch<Device>(`${API_BASE_URLS.DEVICES}/devices`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Update a device (updates value and sends to InfluxDB)
 */
export async function updateDevice(
  deviceId: number,
  data: UpdateDeviceRequest,
): Promise<Device> {
  return apiFetch<Device>(`${API_BASE_URLS.DEVICES}/devices/${deviceId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a device
 */
export async function deleteDevice(deviceId: number): Promise<Device> {
  return apiFetch<Device>(`${API_BASE_URLS.DEVICES}/devices/${deviceId}`, {
    method: "DELETE",
  });
}
