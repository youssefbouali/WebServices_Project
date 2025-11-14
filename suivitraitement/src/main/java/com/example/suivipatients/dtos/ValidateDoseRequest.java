package com.example.suivipatients.dtos;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
public class ValidateDoseRequest {
    @NotNull
    private LocalDateTime datePrise;
}
