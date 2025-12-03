package com.example.suivipatients.controllers;

import com.example.suivipatients.dtos.TreatmentRequest;
import com.example.suivipatients.dtos.TreatmentUpdateRequest;
import com.example.suivipatients.dtos.ValidateDoseRequest;
import com.example.suivipatients.models.SuiviTraitement;
import com.example.suivipatients.services.SuiviTraitementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/treatments")
public class SuiviTraitementController {
    private final SuiviTraitementService service;
    private final RestTemplate restTemplate;

    public SuiviTraitementController(SuiviTraitementService service, RestTemplate restTemplate) {
        this.service = service;
        this.restTemplate = restTemplate;
    }

    @PostMapping
    public ResponseEntity<SuiviTraitement> create(@RequestBody TreatmentRequest req) {
        SuiviTraitement t = service.createTreatment(
                req.getPatientId(), req.getMedicament(), req.getDosage(), req.getFrequence(),
                req.getDateDebut(), req.getDateFin(), req.getInstructions()
        );
        return ResponseEntity.status(201).body(t);
    }

    @GetMapping
    public ResponseEntity<List<SuiviTraitement>> list(@RequestParam(value = "patientId", required = false) String patientId) {
        if (patientId != null && !patientId.isEmpty()) {
            return ResponseEntity.ok(service.getTreatmentsByPatient(patientId));
        }
        return ResponseEntity.ok(service.getAllTreatments());
    }

    @GetMapping("/active")
    public ResponseEntity<List<SuiviTraitement>> active() {
        return ResponseEntity.ok(service.getActiveTreatments());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuiviTraitement> update(@PathVariable Long id, @RequestBody TreatmentUpdateRequest req) {
        SuiviTraitement t = service.updateTreatment(id, req.getMedicament(), req.getDosage(), req.getFrequence(),
                req.getDateDebut(), req.getDateFin(), req.getInstructions(), req.getActif());
        return ResponseEntity.ok(t);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteTreatment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/validate-dose")
    public ResponseEntity<Void> validateDose(@PathVariable Long id, @RequestBody ValidateDoseRequest body) {
        LocalDateTime d = body.getDatePrise();
        service.validateDose(id, d);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/send-reminder")
    public ResponseEntity<Void> sendReminder(@PathVariable Long id) {
        service.sendReminder(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> stats() {
        return ResponseEntity.ok(Map.of(
                "activeTreatments", service.getActiveTreatmentsCount(),
                "treatmentsWithProblems", service.getTreatmentsWithProblemsCount()
        ));
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Map<String, Object>>> patients() {
        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                "http://profiles/api/profiles/public/patients",
                HttpMethod.GET,
                HttpEntity.EMPTY,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );
        return ResponseEntity.ok(resp.getBody());
    }
}
