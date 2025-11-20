package com.example.suivipatients.models;

import lombok.Data;

@Data
public class ProfileSummary {
    private String id;
    private String firstName;
    private String lastName;
    private String role;
    private Boolean isActive;
}