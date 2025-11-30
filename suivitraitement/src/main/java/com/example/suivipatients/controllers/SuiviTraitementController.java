package com.example.suivipatients.controllers;

import com.example.suivipatients.dtos.TreatmentRequest;
import com.example.suivipatients.models.SuiviTraitement;
import com.example.suivipatients.services.SuiviTraitementService;
import com.example.suivipatients.dtos.TreatmentUpdateRequest;
import com.example.suivipatients.dtos.ValidateDoseRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/treatments")
@RequiredArgsConstructor
public class SuiviTraitementController {

    private final SuiviTraitementService traitementService;
    private final RestTemplate restTemplate;

    @Value("${profiles.base-url:http://localhost:3000/api/profiles}")
    private String profilesBaseUrl;

    @PostMapping
    public ResponseEntity<SuiviTraitement> createTreatment(@Valid @RequestBody TreatmentRequest request) {
        SuiviTraitement traitement = traitementService.createTreatment(
                request.getPatientId(),
                request.getMedicament(),
                request.getDosage(),
                request.getFrequence(),
                request.getDateDebut(),
                request.getDateFin(),
                request.getInstructions()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(traitement);
    }

    @GetMapping
    public ResponseEntity<List<SuiviTraitement>> getAllTreatments() {
        return ResponseEntity.ok(traitementService.getAllTreatments());
    }

    @GetMapping(params = "patientId")
    public ResponseEntity<List<SuiviTraitement>> getTreatmentsByPatient(@RequestParam String patientId) {
        return ResponseEntity.ok(traitementService.getTreatmentsByPatient(patientId));
    }

    @GetMapping("/active")
    public ResponseEntity<List<SuiviTraitement>> getActiveTreatments() {
        return ResponseEntity.ok(traitementService.getActiveTreatments());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuiviTraitement> updateTreatment(
            @PathVariable Long id,
            @Valid @RequestBody TreatmentUpdateRequest request) {
        SuiviTraitement traitement = traitementService.updateTreatment(
                id,
                request.getMedicament(),
                request.getDosage(),
                request.getFrequence(),
                request.getDateDebut(),
                request.getDateFin(),
                request.getInstructions(),
                request.getSuiviCorrect()
        );
        return ResponseEntity.ok(traitement);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTreatment(@PathVariable Long id) {
        traitementService.deleteTreatment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/validate-dose")
    public ResponseEntity<Void> validateDose(
            @PathVariable Long id,
            @Valid @RequestBody ValidateDoseRequest request) {
        traitementService.validateDose(id, request.getDatePrise());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/send-reminder")
    public ResponseEntity<Void> sendReminder(@PathVariable Long id) {
        traitementService.sendReminder(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStatistics() {
        return ResponseEntity.ok(Map.of(
                "activeTreatments", traitementService.getActiveTreatmentsCount(),
                "treatmentsWithProblems", traitementService.getTreatmentsWithProblemsCount()
        ));
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Map<String, Object>>> getPatientsFromProfiles() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);
        try {
            ResponseEntity<List> response = restTemplate.exchange(
                    profilesBaseUrl + "/public/patients",
                    HttpMethod.GET,
                    entity,
                    List.class
            );
            List<Map<String, Object>> patients = response.getBody();
            return ResponseEntity.ok(patients == null ? List.of() : patients);
        } catch (Exception e) {
            return ResponseEntity.status(503).body(List.of());
        }
    }
}
