import { API_BASE_URLS, apiFetch } from "./config";

export interface Treatment {
  id: number;
  patientId: string;
  medicament: string;
  dosage: string;
  frequence: string;
  dateDebut: string;
  dateFin: string;
  instructions: string;
  suiviCorrect: boolean;
  statut: "ACTIF" | "INACTIF";
  createdAt: string;
  updatedAt: string;
}

export interface CreateTreatmentRequest {
  patientId: string;
  medicament: string;
  dosage: string;
  frequence: string;
  dateDebut: string;
  dateFin: string;
  instructions: string;
}

export interface UpdateTreatmentRequest {
  medicament?: string;
  dosage?: string;
  frequence?: string;
  dateDebut?: string;
  dateFin?: string;
  instructions?: string;
  suiviCorrect?: boolean;
}

export interface ValidateDoseRequest {
  datePrise: string;
}

export interface TreatmentStatistics {
  activeTreatments: number;
  treatmentsWithProblems: number;
}

/**
 * Create a new treatment
 */
export async function createTreatment(
  data: CreateTreatmentRequest,
): Promise<Treatment> {
  return apiFetch<Treatment>(`${API_BASE_URLS.TREATMENTS}/treatments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get all treatments
 */
export async function getTreatments(): Promise<Treatment[]> {
  return apiFetch<Treatment[]>(`${API_BASE_URLS.TREATMENTS}/treatments`, {
    method: "GET",
  });
}

/**
 * Get treatments by patient
 */
export async function getPatientTreatments(
  patientId: string,
): Promise<Treatment[]> {
  return apiFetch<Treatment[]>(
    `${API_BASE_URLS.TREATMENTS}/treatments?patientId=${patientId}`,
    {
      method: "GET",
    },
  );
}

/**
 * Get active treatments
 */
export async function getActiveTreatments(): Promise<Treatment[]> {
  return apiFetch<Treatment[]>(
    `${API_BASE_URLS.TREATMENTS}/treatments/active`,
    {
      method: "GET",
    },
  );
}

/**
 * Update a treatment
 */
export async function updateTreatment(
  id: number,
  data: UpdateTreatmentRequest,
): Promise<Treatment> {
  return apiFetch<Treatment>(`${API_BASE_URLS.TREATMENTS}/treatments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Delete a treatment
 */
export async function deleteTreatment(id: number): Promise<void> {
  return apiFetch<void>(`${API_BASE_URLS.TREATMENTS}/treatments/${id}`, {
    method: "DELETE",
  });
}

/**
 * Validate a dose
 */
export async function validateDose(
  id: number,
  data: ValidateDoseRequest,
): Promise<void> {
  return apiFetch<void>(
    `${API_BASE_URLS.TREATMENTS}/treatments/${id}/validate-dose`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

/**
 * Send a reminder
 */
export async function sendReminder(id: number): Promise<void> {
  return apiFetch<void>(
    `${API_BASE_URLS.TREATMENTS}/treatments/${id}/send-reminder`,
    {
      method: "POST",
    },
  );
}

/**
 * Get treatment statistics
 */
export async function getTreatmentStatistics(): Promise<TreatmentStatistics> {
  return apiFetch<TreatmentStatistics>(
    `${API_BASE_URLS.TREATMENTS}/treatments/stats`,
    {
      method: "GET",
    },
  );
}
