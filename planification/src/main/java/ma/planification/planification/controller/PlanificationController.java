package ma.planification.planification.controller;

import ma.planification.planification.dto.PlanificationRequest;
import ma.planification.planification.dto.PlanificationResponse;
import ma.planification.planification.entities.Planification;
import ma.planification.planification.services.PlanificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class PlanificationController {

    @Autowired
    private PlanificationService service;

    // PLANIFIER UN RDV - Accepte du JSON
    @PostMapping("/schedule")
    public ResponseEntity<Planification> schedule( @RequestBody PlanificationRequest request) {
        Planification appointment = service.scheduleAppointment(
                request.patientId(),
                request.doctorId(),
                request.dateRdv()
        );
        return ResponseEntity.ok(appointment);
    }

    // LISTER TOUS LES RDV
    @GetMapping
    public ResponseEntity<List<PlanificationResponse>> getAllAppointments() {
        return ResponseEntity.ok(service.getAllAppointments());
    }

    // LISTER LES RDV D'UN PATIENT
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PlanificationResponse>> getAppointments(@PathVariable Integer patientId) {
        return ResponseEntity.ok(service.getAppointments(patientId));
    }

    // ANNULER UN RDV
    @PutMapping("/cancel/{rdvId}")
    public ResponseEntity<Void> cancel(@PathVariable Long rdvId) {
        service.cancelAppointment(rdvId);
        return ResponseEntity.ok().build();
    }

    // MODIFIER UN RDV
    @PutMapping("/update/{rdvId}")
    public ResponseEntity<Planification> update(
            @PathVariable Long rdvId,
            @RequestParam LocalDateTime nouvelleDate) {
        Planification updated = service.updateAppointment(rdvId, nouvelleDate);
        return ResponseEntity.ok(updated);
    }
}