import { API_BASE_URLS, apiFetch } from "./config";

export interface Appointment {
  rdvId: number;
  patientId: number;
  doctorId: number;
  // optional: planification service may return doctorName (we prefer this, avoids extra profile call)
  doctorName?: string | null;
  dateRdv: string;
  statut: "confirmé" | "en attente" | "annulé";
}

export interface CreateAppointmentRequest {
  patientId: number;
  doctorId: number;
  dateRdv: string;
}

/**
 * Schedule a new appointment
 */
export async function scheduleAppointment(
  data: CreateAppointmentRequest,
): Promise<Appointment> {
  const base = API_BASE_URLS.APPOINTMENTS.replace(/\/$/, "");
  const appointmentsBase = base.endsWith("/api") ? `${base}/appointments` : `${base}/api/appointments`;

  return apiFetch<Appointment>(
    `${appointmentsBase}/schedule`,
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
  patientId: number,
): Promise<Appointment[]> {
  const base = API_BASE_URLS.APPOINTMENTS.replace(/\/$/, "");
  const appointmentsBase = base.endsWith("/api") ? `${base}/appointments` : `${base}/api/appointments`;

  return apiFetch<Appointment[]>(
    `${appointmentsBase}/patient/${patientId}`,
    {
      method: "GET",
    },
  );
}

/**
 * Get all appointments (admin view)
 */
export async function getAllAppointments(): Promise<Appointment[]> {
  const base = API_BASE_URLS.APPOINTMENTS.replace(/\/$/, "");
  const appointmentsBase = base.endsWith("/api") ? `${base}/appointments` : `${base}/api/appointments`;

  return apiFetch<Appointment[]>(
    `${appointmentsBase}`,
    {
      method: "GET",
    },
  );
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(rdvId: number): Promise<void> {
  const base = API_BASE_URLS.APPOINTMENTS.replace(/\/$/, "");
  const appointmentsBase = base.endsWith("/api") ? `${base}/appointments` : `${base}/api/appointments`;

  return apiFetch<void>(
    `${appointmentsBase}/cancel/${rdvId}`,
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
  const base = API_BASE_URLS.APPOINTMENTS.replace(/\/$/, "");
  const appointmentsBase = base.endsWith("/api") ? `${base}/appointments` : `${base}/api/appointments`;

  return apiFetch<Appointment>(
    `${appointmentsBase}/update/${rdvId}?${query}`,
    {
      method: "PUT",
    },
  );
}
