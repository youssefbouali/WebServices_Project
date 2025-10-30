package com.example.suivipatients.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TreatmentUpdateRequest {
    private String medicament;
    private String dosage;
    private String frequence;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private String instructions;
    private Boolean suiviCorrect;
}
