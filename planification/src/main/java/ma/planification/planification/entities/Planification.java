package ma.planification.planification.entities;

import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "appointments") // Nom de la table générée
@Data
public class Planification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incrément pour SQL Server
    private Long rdvId; // ID rendez-vous

    @Column(nullable = false)
    private Integer patientId; // Référence au patient (de Profile)

    @Column(nullable = false)
    private Integer doctorId; // Référence au docteur (de Profile)

    @Column(name = "date_rdv", nullable = false)
    private LocalDateTime dateRdv; // Date du rendez-vous (utilisez LocalDateTime pour datetime)

    @Column(length = 50)
    private String statut; // Statut (e.g., "confirmé", "annulé")

    public Long getRdvId() {
        return rdvId;
    }

    public void setRdvId(Long rdvId) {
        this.rdvId = rdvId;
    }

    public Integer getPatientId() {
        return patientId;
    }

    public void setPatientId(Integer patientId) {
        this.patientId = patientId;
    }

    public Integer getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Integer doctorId) {
        this.doctorId = doctorId;
    }

    public LocalDateTime getDateRdv() {
        return dateRdv;
    }

    public void setDateRdv(LocalDateTime dateRdv) {
        this.dateRdv = dateRdv;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }
}