package com.example.suivipatients.dtos;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
public class TreatmentRequest {
    @NotNull
    private String patientId;
    @NotNull
    private String medicament;
    private String dosage;
    private String frequence;
    @NotNull
    private LocalDateTime dateDebut;
    @NotNull
    private LocalDateTime dateFin;
    private String instructions;
}
