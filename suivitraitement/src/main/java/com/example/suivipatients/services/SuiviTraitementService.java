package com.example.suivipatients.services;

import com.example.suivipatients.models.SuiviTraitement;
import com.example.suivipatients.repositories.SuiviTraitementRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.ParameterizedTypeReference;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SuiviTraitementService {
    private final SuiviTraitementRepository repository;
    private final RestTemplate restTemplate;

    @Value("${profiles.base-url:http://profiles/api/profiles}")
    private String profilesBaseUrl;

    @Value("${profiles.api-token:}")
    private String profilesApiToken;

    @Value("${profiles.enabled:true}")
    private boolean profilesEnabled;

    public SuiviTraitementService(SuiviTraitementRepository repository, RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    public SuiviTraitement createTreatment(String patientId, String medicament, String dosage, String frequence,
                                           LocalDateTime dateDebut, LocalDateTime dateFin, String instructions) {
        if (dateDebut != null && dateFin != null && dateFin.isBefore(dateDebut)) {
            throw new IllegalArgumentException("La date de fin doit être après la date de début");
        }
        if (profilesEnabled) {
            validatePatientExists(patientId);
        }
        SuiviTraitement t = new SuiviTraitement();
        t.setPatientId(patientId);
        t.setMedicament(medicament);
        t.setDosage(dosage);
        t.setFrequence(frequence);
        t.setDateDebut(dateDebut);
        t.setDateFin(dateFin);
        t.setInstructions(instructions);
        t.setStatut("ACTIF");
        t.setSuiviCorrect(Boolean.FALSE);
        return repository.save(t);
    }

    public List<SuiviTraitement> getAllTreatments() {
        return repository.findAll();
    }

    public List<SuiviTraitement> getTreatmentsByPatient(String patientId) {
        return repository.findByPatientId(patientId);
    }

    public List<SuiviTraitement> getActiveTreatments() {
        return repository.findTraitementsActifs(LocalDateTime.now());
    }

    public SuiviTraitement updateTreatment(Long id, String medicament, String dosage, String frequence,
                                           LocalDateTime dateDebut, LocalDateTime dateFin,
                                           String instructions, Boolean actif) {
        Optional<SuiviTraitement> opt = repository.findById(id);
        if (opt.isEmpty()) throw new IllegalArgumentException("Traitement introuvable");
        SuiviTraitement t = opt.get();
        if (medicament != null) t.setMedicament(medicament);
        if (dosage != null) t.setDosage(dosage);
        if (frequence != null) t.setFrequence(frequence);
        if (dateDebut != null) t.setDateDebut(dateDebut);
        if (dateFin != null) t.setDateFin(dateFin);
        if (instructions != null) t.setInstructions(instructions);
        if (actif != null) t.setStatut(actif ? "ACTIF" : "INACTIF");
        return repository.save(t);
    }

    public void deleteTreatment(Long id) {
        Optional<SuiviTraitement> opt = repository.findById(id);
        opt.ifPresent(repository::delete);
    }

    public void validateDose(Long id, LocalDateTime datePrise) {
        Optional<SuiviTraitement> opt = repository.findById(id);
        if (opt.isEmpty()) throw new IllegalArgumentException("Traitement introuvable");
        SuiviTraitement t = opt.get();
        t.setSuiviCorrect(Boolean.TRUE);
        t.setLastDoseAt(datePrise);
        repository.save(t);
    }

    public void sendReminder(Long id) {}

    public long getActiveTreatmentsCount() {
        return repository.findTraitementsActifs(LocalDateTime.now()).size();
    }

    public long getTreatmentsWithProblemsCount() {
        return repository.findBySuiviCorrectFalse().size();
    }

    public List<Map<String, Object>> fetchPatients() {
        HttpHeaders headers = new HttpHeaders();
        if (profilesApiToken != null && !profilesApiToken.isEmpty()) {
            headers.set("Authorization", "Bearer " + profilesApiToken);
        }
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                profilesBaseUrl + "/public/patients",
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );
        return resp.getBody();
    }

    private void validatePatientExists(String patientId) {
        List<Map<String, Object>> patients = fetchPatients();
        boolean ok = patients != null && patients.stream().anyMatch(p -> patientId.equals(String.valueOf(p.get("id"))));
        if (!ok) throw new IllegalArgumentException("Patient introuvable");
    }
}

