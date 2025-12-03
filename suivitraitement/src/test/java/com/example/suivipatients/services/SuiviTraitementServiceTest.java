package com.example.suivipatients.services;

import com.example.suivipatients.models.SuiviTraitement;
import com.example.suivipatients.repositories.SuiviTraitementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SuiviTraitementServiceTest {

    @Mock
    private SuiviTraitementRepository repository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private SuiviTraitementService service;

    @BeforeEach
    void setup() {
        ReflectionTestUtils.setField(service, "profilesBaseUrl", "http://profiles/api/profiles");
        ReflectionTestUtils.setField(service, "profilesApiToken", "");
    }

    @Test
    void createTreatment_success_withValidPatient() {
        Map<String, Object> patient = new HashMap<>();
        patient.put("id", "1");
        List<Map<String, Object>> patients = List.of(patient);
        org.mockito.Mockito.lenient().when(restTemplate.exchange(
                eq("http://profiles/api/profiles/public/patients"),
                eq(HttpMethod.GET),
                any(HttpEntity.class),
                org.mockito.ArgumentMatchers.<org.springframework.core.ParameterizedTypeReference<List<Map<String,Object>>>>any()
        )).thenReturn(ResponseEntity.ok((List) patients));

        SuiviTraitement saved = new SuiviTraitement();
        saved.setId(1L);
        saved.setPatientId("1");
        saved.setMedicament("Doliprane");
        saved.setDosage("300mg");
        saved.setFrequence("2 fois par jour");
        saved.setDateDebut(LocalDateTime.now());
        saved.setDateFin(LocalDateTime.now().plusDays(3));
        saved.setInstructions("Après repas");
        when(repository.save(any(SuiviTraitement.class))).thenReturn(saved);

        SuiviTraitement out = service.createTreatment(
                "1", "Doliprane", "300mg", "2 fois par jour",
                LocalDateTime.now(), LocalDateTime.now().plusDays(3), "Après repas");

        assertNotNull(out.getId());
        assertEquals("Doliprane", out.getMedicament());
        verify(repository, times(1)).save(any(SuiviTraitement.class));
    }

    @Test
    void createTreatment_fail_invalidDates() {
        Map<String, Object> patient = new HashMap<>();
        patient.put("id", "1");
        List<Map<String, Object>> patients = List.of(patient);
        // Pas de stubbing RestTemplate ici: la validation des dates échoue avant l'appel Profiles

        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.minusDays(1);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                service.createTreatment("1", "Aspirine", "100mg", "1/jour", start, end, "notes")
        );
        assertTrue(ex.getMessage().contains("après la date de début"));
        verify(repository, never()).save(any());
    }

    @Test
    void getActiveTreatments_returnsList() {
        List<SuiviTraitement> list = Arrays.asList(new SuiviTraitement(), new SuiviTraitement());
        when(repository.findTraitementsActifs(any(LocalDateTime.class))).thenReturn(list);
        List<SuiviTraitement> out = service.getActiveTreatments();
        assertEquals(2, out.size());
        verify(repository).findTraitementsActifs(any(LocalDateTime.class));
    }

    @Test
    void updateTreatment_updatesFieldsAndStatus() {
        SuiviTraitement existing = new SuiviTraitement();
        existing.setId(10L);
        existing.setPatientId("1");
        existing.setMedicament("Old");
        existing.setDateDebut(LocalDateTime.now().minusDays(1));
        existing.setDateFin(LocalDateTime.now().plusDays(5));
        existing.setStatut("ACTIF");
        when(repository.findById(10L)).thenReturn(Optional.of(existing));

        ArgumentCaptor<SuiviTraitement> captor = ArgumentCaptor.forClass(SuiviTraitement.class);
        when(repository.save(any(SuiviTraitement.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SuiviTraitement out = service.updateTreatment(10L, "NewMed", "200mg", "1/jour",
                null, LocalDateTime.now().plusDays(10), "instructions", true);

        assertEquals("NewMed", out.getMedicament());
        assertEquals("ACTIF", out.getStatut());
        verify(repository).save(captor.capture());
        assertEquals("NewMed", captor.getValue().getMedicament());
    }

    @Test
    void validateDose_setsFlags() {
        SuiviTraitement existing = new SuiviTraitement();
        existing.setId(5L);
        existing.setPatientId("1");
        existing.setDateDebut(LocalDateTime.now().minusDays(1));
        existing.setDateFin(LocalDateTime.now().plusDays(1));
        when(repository.findById(5L)).thenReturn(Optional.of(existing));
        when(repository.save(any(SuiviTraitement.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LocalDateTime prise = LocalDateTime.now();
        service.validateDose(5L, prise);
        verify(repository).save(any(SuiviTraitement.class));
        assertTrue(existing.getSuiviCorrect());
        assertEquals(prise, existing.getLastDoseAt());
    }

    @Test
    void deleteTreatment_callsRepositoryDelete() {
        SuiviTraitement existing = new SuiviTraitement();
        existing.setId(9L);
        when(repository.findById(9L)).thenReturn(Optional.of(existing));
        service.deleteTreatment(9L);
        verify(repository, times(1)).delete(existing);
    }

    @Test
    void statsCounts_returnedFromRepositorySizes() {
        when(repository.findTraitementsActifs(any(LocalDateTime.class))).thenReturn(Arrays.asList(new SuiviTraitement()));
        when(repository.findBySuiviCorrectFalse()).thenReturn(Arrays.asList(new SuiviTraitement(), new SuiviTraitement()));

        assertEquals(1L, service.getActiveTreatmentsCount());
        assertEquals(2L, service.getTreatmentsWithProblemsCount());
    }
}
