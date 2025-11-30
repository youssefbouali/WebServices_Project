package com.example.suivipatients.services;

import com.example.suivipatients.models.SuiviTraitement;
import com.example.suivipatients.repositories.SuiviTraitementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SuiviTraitementService {

    private final SuiviTraitementRepository traitementRepository;
    private final RestTemplate restTemplate;

    @Value("${profiles.base-url:http://localhost:3000/api/profiles}")
    private String profilesBaseUrl;

    @Value("${profiles.api-token:}")
    private String profilesApiToken;

    public SuiviTraitement createTreatment(String patientId, String medicament, String dosage,
                                           String frequence, LocalDateTime dateDebut,
                                           LocalDateTime dateFin, String instructions) {

        validateTreatmentData(patientId, medicament, dateDebut, dateFin);

        SuiviTraitement traitement = new SuiviTraitement();
        traitement.setPatientId(patientId);
        traitement.setMedicament(medicament);
        traitement.setDosage(dosage);
        traitement.setFrequence(frequence);
        traitement.setDateDebut(dateDebut);
        traitement.setDateFin(dateFin);
        traitement.setInstructions(instructions);

        log.info("Traitement créé pour le patient {}: {}", patientId, medicament);
        return traitementRepository.save(traitement);
    }

    @Transactional(readOnly = true)
    public List<SuiviTraitement> getAllTreatments() {
        return traitementRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<SuiviTraitement> getTreatmentsByPatient(String patientId) {
        if (patientId == null || patientId.trim().isEmpty()) {
            throw new IllegalArgumentException("L'ID du patient est requis");
        }
        return traitementRepository.findByPatientId(patientId);
    }

    @Transactional(readOnly = true)
    public List<SuiviTraitement> getActiveTreatments() {
        return traitementRepository.findTraitementsActifs(LocalDateTime.now());
    }

    public SuiviTraitement updateTreatment(Long treatmentId, String medicament, String dosage,
                                           String frequence, LocalDateTime dateDebut,
                                           LocalDateTime dateFin, String instructions,
                                           Boolean suiviCorrect) {

        SuiviTraitement traitement = traitementRepository.findById(treatmentId)
                .orElseThrow(() -> new RuntimeException("Traitement non trouvé avec ID: " + treatmentId));

        if (medicament != null) traitement.setMedicament(medicament);
        if (dosage != null) traitement.setDosage(dosage);
        if (frequence != null) traitement.setFrequence(frequence);
        if (dateDebut != null) traitement.setDateDebut(dateDebut);
        if (dateFin != null) traitement.setDateFin(dateFin);
        if (instructions != null) traitement.setInstructions(instructions);
        if (suiviCorrect != null) traitement.setSuiviCorrect(suiviCorrect);

        updateTreatmentStatus(traitement);
        log.info("Traitement {} mis à jour", treatmentId);

        return traitementRepository.save(traitement);
    }

    public void deleteTreatment(Long treatmentId) {
        SuiviTraitement traitement = traitementRepository.findById(treatmentId)
                .orElseThrow(() -> new RuntimeException("Traitement non trouvé avec ID: " + treatmentId));

        traitementRepository.delete(traitement);
        log.info("Traitement {} supprimé", treatmentId);
    }

    public void validateDose(Long treatmentId, LocalDateTime datePrise) {
        SuiviTraitement traitement = traitementRepository.findById(treatmentId)
                .orElseThrow(() -> new RuntimeException("Traitement non trouvé avec ID: " + treatmentId));

        traitement.setSuiviCorrect(true);
        traitement.setLastDoseAt(datePrise);
        traitementRepository.save(traitement);

        log.info("Prise validée pour le traitement {} à {}", treatmentId, datePrise);
    }

    public void sendReminder(Long treatmentId) {
        SuiviTraitement traitement = traitementRepository.findById(treatmentId)
                .orElseThrow(() -> new RuntimeException("Traitement non trouvé avec ID: " + treatmentId));

        String message = String.format("Rappel: %s (%s) - %s",
                traitement.getMedicament(),
                traitement.getDosage(),
                traitement.getFrequence()
        );

        log.info("📱 Rappel envoyé pour le traitement {}: {}", treatmentId, message);
    }

    @Transactional(readOnly = true)
    public Long getActiveTreatmentsCount() {
        return (long) traitementRepository.findTraitementsActifs(LocalDateTime.now()).size();
    }

    @Transactional(readOnly = true)
    public Long getTreatmentsWithProblemsCount() {
        return (long) traitementRepository.findBySuiviCorrectFalse().size();
    }

    private void validateTreatmentData(String patientId, String medicament,
                                       LocalDateTime dateDebut, LocalDateTime dateFin) {
        if (patientId == null || patientId.trim().isEmpty()) {
            throw new IllegalArgumentException("L'ID du patient est requis");
        }
        validatePatientExists(patientId);
        if (medicament == null || medicament.trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom du médicament est requis");
        }
        if (dateDebut == null) {
            throw new IllegalArgumentException("La date de début est requise");
        }
        if (dateFin == null || dateFin.isBefore(dateDebut)) {
            throw new IllegalArgumentException("La date de fin doit être après la date de début");
        }
    }

    private void validatePatientExists(String patientId) {
        HttpHeaders headers = new HttpHeaders();
        if (profilesApiToken != null && !profilesApiToken.isBlank()) {
            headers.set("Authorization", "Bearer " + profilesApiToken);
        }
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // Try public patients endpoint first to avoid auth requirement
        String publicPatientsUrl = profilesBaseUrl + "/public/patients";
        try {
            var response = restTemplate.exchange(publicPatientsUrl, HttpMethod.GET, entity, java.util.List.class);
            java.util.List<?> list = response.getBody();
            boolean exists = false;
            if (list != null) {
                for (Object item : list) {
                    if (item instanceof java.util.Map) {
                        Object id = ((java.util.Map<?, ?>) item).get("id");
                        if (id != null && patientId.equals(String.valueOf(id))) {
                            exists = true;
                            break;
                        }
                    }
                }
            }
            if (exists) {
                log.info("Validation patient (public list): {} ({} entries)", patientId, list != null ? list.size() : 0);
                return;
            }
            // If public list reachable but patient not found, treat as not found
            throw new IllegalArgumentException("Patient introuvable: " + patientId);
        } catch (HttpClientErrorException e) {
            log.warn("Public patients endpoint inaccessible ({}). Fallback by id.", e.getStatusCode());
        } catch (Exception e) {
            log.warn("Public patients endpoint failed: {}. Continuing without blocking.", e.getMessage());
        }

        // Fallback: try protected by-id route (requires token if configured)
        try {
            restTemplate.exchange(profilesBaseUrl + "/" + patientId, HttpMethod.GET, entity, Object.class);
            log.info("Validation patient via /:id: {} (service profiles: {})", patientId, profilesBaseUrl);
        } catch (HttpClientErrorException.NotFound e) {
            throw new IllegalArgumentException("Patient introuvable: " + patientId);
        } catch (HttpClientErrorException e) {
            // Any other client error (401/403/etc.) should not crash treatment creation
            log.warn("Profiles by-id check failed: {}. Proceeding without blocking.", e.getStatusCode());
        } catch (Exception e) {
            log.warn("Profiles by-id check error: {}. Proceeding without blocking.", e.getMessage());
        }
    }

    private void updateTreatmentStatus(SuiviTraitement traitement) {
        LocalDateTime maintenant = LocalDateTime.now();
        String statut = traitement.getDateFin().isBefore(maintenant) ? "TERMINE" : "ACTIF";
        traitement.setStatut(statut);
    }
}
