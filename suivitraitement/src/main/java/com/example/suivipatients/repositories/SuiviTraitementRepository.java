package com.example.suivipatients.repositories;

import com.example.suivipatients.models.SuiviTraitement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SuiviTraitementRepository extends JpaRepository<SuiviTraitement, Long> {

    List<SuiviTraitement> findByPatientId(Long patientId);
    List<SuiviTraitement> findByStatut(String statut);
    List<SuiviTraitement> findBySuiviCorrectFalse();

    @Query("SELECT t FROM SuiviTraitement t WHERE t.dateFin > :now")
    List<SuiviTraitement> findTraitementsActifs(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(t) FROM SuiviTraitement t WHERE t.patientId = :patientId AND t.statut = 'ACTIF'")
    Long countTraitementsActifsByPatient(@Param("patientId") Long patientId);
}
