package com.example.suivipatients.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "traitements")
public class SuiviTraitement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String patientId;
    private String medicament;
    private String dosage;
    private String frequence;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private String instructions;
    private String statut;
    private Boolean suiviCorrect;
    private LocalDateTime lastDoseAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public String getMedicament() { return medicament; }
    public void setMedicament(String medicament) { this.medicament = medicament; }
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public String getFrequence() { return frequence; }
    public void setFrequence(String frequence) { this.frequence = frequence; }
    public LocalDateTime getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDateTime dateDebut) { this.dateDebut = dateDebut; }
    public LocalDateTime getDateFin() { return dateFin; }
    public void setDateFin(LocalDateTime dateFin) { this.dateFin = dateFin; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
    public Boolean getSuiviCorrect() { return suiviCorrect; }
    public void setSuiviCorrect(Boolean suiviCorrect) { this.suiviCorrect = suiviCorrect; }
    public LocalDateTime getLastDoseAt() { return lastDoseAt; }
    public void setLastDoseAt(LocalDateTime lastDoseAt) { this.lastDoseAt = lastDoseAt; }
}

