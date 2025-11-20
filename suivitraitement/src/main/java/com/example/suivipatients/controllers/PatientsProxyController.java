package com.example.suivipatients.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientsProxyController {

    private final RestTemplate restTemplate;

    @Value("${profiles.base-url:http://localhost:3000}")
    private String profilesBaseUrl; // CORRECTION: Enlever /api/profiles

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getPatients() {
        try {
            System.out.println("🔄 Tentative de connexion au service Profiles...");
            System.out.println("URL: " + profilesBaseUrl + "/api/profiles/public/patients");
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            // CORRECTION: Utiliser le bon endpoint MongoDB
            ResponseEntity<List> response = restTemplate.exchange(
                profilesBaseUrl + "/api/profiles/public/patients", // ENDPOINT CORRECT
                HttpMethod.GET, 
                entity, 
                List.class
            );

            if (response.getBody() != null) {
                List<Map<String, Object>> patients = response.getBody();
                System.out.println("✅ " + patients.size() + " patients récupérés depuis MongoDB");
                return ResponseEntity.ok(patients);
            }
            
        } catch (Exception e) {
            System.err.println("❌ ERREUR - Service Profiles inaccessible: " + e.getMessage());
            System.err.println("URL essayée: " + profilesBaseUrl + "/api/profiles/public/patients");
            // NE PAS retourner les données temporaires - laisser l'erreur remonter
            return ResponseEntity.status(503).body(null);
        }

        return ResponseEntity.ok(List.of()); // Liste vide si pas de données
    }
}