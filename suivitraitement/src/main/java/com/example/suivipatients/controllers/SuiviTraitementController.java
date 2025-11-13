package com.example.suivipatients.controllers;

import com.example.suivipatients.dtos.TreatmentRequest;
import com.example.suivipatients.models.SuiviTraitement;
import com.example.suivipatients.services.SuiviTraitementService;
import com.example.suivipatients.dto.TreatmentUpdateRequest;
import com.example.suivipatients.dto.ValidateDoseRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/treatments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SuiviTraitementController {

    private final SuiviTraitementService traitementService;

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
    public ResponseEntity<List<SuiviTraitement>> getTreatmentsByPatient(@RequestParam Long patientId) {
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
}
