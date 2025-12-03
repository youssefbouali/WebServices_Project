package com.example.suivipatients.dtos;

import java.time.LocalDateTime;

public class ValidateDoseRequest {
    private LocalDateTime datePrise;
    public LocalDateTime getDatePrise() { return datePrise; }
    public void setDatePrise(LocalDateTime datePrise) { this.datePrise = datePrise; }
}

