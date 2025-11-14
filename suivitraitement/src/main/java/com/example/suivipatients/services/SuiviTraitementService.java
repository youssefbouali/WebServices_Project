package com.example.suivipatients.services;

import com.example.suivipatients.models.SuiviTraitement;
import com.example.suivipatients.repositories.SuiviTraitementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SuiviTraitementService {

    private final SuiviTraitementRepository traitementRepository;

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

    private void updateTreatmentStatus(SuiviTraitement traitement) {
        LocalDateTime maintenant = LocalDateTime.now();
        String statut = traitement.getDateFin().isBefore(maintenant) ? "TERMINE" : "ACTIF";
        traitement.setStatut(statut);
    }
}
