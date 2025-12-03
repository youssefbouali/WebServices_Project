package com.example.suivipatients.dtos;

import java.time.LocalDateTime;

public class TreatmentRequest {
    private String patientId;
    private String medicament;
    private String dosage;
    private String frequence;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private String instructions;

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
}

