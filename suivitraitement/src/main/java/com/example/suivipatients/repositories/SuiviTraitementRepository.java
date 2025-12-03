package com.example.suivipatients.repositories;

import com.example.suivipatients.models.SuiviTraitement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SuiviTraitementRepository extends JpaRepository<SuiviTraitement, Long> {
    List<SuiviTraitement> findByPatientId(String patientId);
    List<SuiviTraitement> findByStatut(String statut);
    List<SuiviTraitement> findBySuiviCorrectFalse();

    @Query("select t from SuiviTraitement t where (t.dateDebut <= :now and t.dateFin >= :now) and (t.statut is null or t.statut = 'ACTIF')")
    List<SuiviTraitement> findTraitementsActifs(@Param("now") LocalDateTime now);
}

