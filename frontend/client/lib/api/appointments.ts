import { API_BASE_URLS, apiFetch } from "./config";

export interface Appointment {
  rdvId: number;
  patientId: string;
  doctorId: string;
  dateRdv: string;
  doctorName : string;
  patientName: string | null;
  statut: "confirmé" | "en attente" | "annulé";
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  dateRdv: string;
}

/**
 * Schedule a new appointment
 */
export async function scheduleAppointment(
  data: CreateAppointmentRequest,
): Promise<Appointment> {
  return apiFetch<Appointment>(
    `${API_BASE_URLS.APPOINTMENTS}/api/appointments/schedule`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

/**
 * Get all appointments for a patient
 */
export async function getPatientAppointments(
  patientId: string,
): Promise<Appointment[]> {
  return apiFetch<Appointment[]>(
    `${API_BASE_URLS.APPOINTMENTS}/api/appointments/patient/${patientId}`,
    {
      method: "GET",
    },
  );
}

/**
 * Get all appointments for a doctor
 */
export async function getDoctorAppointments(
  doctorId: string,
): Promise<Appointment[]> {
  return apiFetch<Appointment[]>(
    `${API_BASE_URLS.APPOINTMENTS}/api/appointments/doctor/${doctorId}`,
    {
      method: "GET",
    },
  );
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(rdvId: number): Promise<void> {
  return apiFetch<void>(
    `${API_BASE_URLS.APPOINTMENTS}/api/appointments/cancel/${rdvId}`,
    {
      method: "PUT",
    },
  );
}

/**
 * Update an appointment date
 */
export async function updateAppointment(
  rdvId: number,
  nouvelleDate: string,
): Promise<Appointment> {
  const query = new URLSearchParams({ nouvelleDate });
  return apiFetch<Appointment>(
    `${API_BASE_URLS.APPOINTMENTS}/api/appointments/update/${rdvId}?${query}`,
    {
      method: "PUT",
    },
  );
}

/**
 * Delete an appointment
 */
export async function deleteAppointment(rdvId: number): Promise<void> {
  return apiFetch<void>(
    `${API_BASE_URLS.APPOINTMENTS}/api/appointments/${rdvId}`,
    {
      method: "DELETE",
    },
  );
}

export async function confirmAppointment(rdvId: number): Promise<void> {
  return apiFetch<void>(
    `${API_BASE_URLS.APPOINTMENTS}/api/appointments/confirm/${rdvId}`,
    {
      method: "PUT",
    },
  );
}
