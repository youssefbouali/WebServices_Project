package ma.planification.planification.dto;

import java.time.LocalDateTime;

public class PlanificationResponse {
    private Long rdvId;
    private Integer patientId;
    private Integer doctorId;
    private LocalDateTime dateRdv;
    private String statut;
    private String doctorName;

    public PlanificationResponse() {}

    public Long getRdvId() { return rdvId; }
    public void setRdvId(Long rdvId) { this.rdvId = rdvId; }

    public Integer getPatientId() { return patientId; }
    public void setPatientId(Integer patientId) { this.patientId = patientId; }

    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }

    public LocalDateTime getDateRdv() { return dateRdv; }
    public void setDateRdv(LocalDateTime dateRdv) { this.dateRdv = dateRdv; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
}
