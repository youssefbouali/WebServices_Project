package com.example.suivipatients.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
public class TreatmentRequest {
    @NotNull
    private Long patientId;
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
