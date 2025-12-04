package ma.planification.planification.dto;

import java.time.LocalDateTime;

public class PlanificationResponse {
    private Long rdvId;
    private String patientId;
    private String doctorId;
    private LocalDateTime dateRdv;
    private String statut;
    private String doctorName;
    private String patientName;

    public PlanificationResponse() {}

    public Long getRdvId() { return rdvId; }
    public void setRdvId(Long rdvId) { this.rdvId = rdvId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public LocalDateTime getDateRdv() { return dateRdv; }
    public void setDateRdv(LocalDateTime dateRdv) { this.dateRdv = dateRdv; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
}
