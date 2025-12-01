package com.example.suivipatients.controllers;

import com.example.suivipatients.dtos.TreatmentUpdateRequest;
import com.example.suivipatients.models.SuiviTraitement;
import com.example.suivipatients.services.SuiviTraitementService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SuiviTraitementController.class)
@AutoConfigureMockMvc(addFilters = false)
class SuiviTraitementControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SuiviTraitementService service;

    @MockBean
    private RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void postCreateTreatment_returns201() throws Exception {
        SuiviTraitement t = new SuiviTraitement();
        t.setId(1L);
        t.setPatientId("1");
        t.setMedicament("Doliprane");
        t.setDosage("300mg");
        t.setFrequence("2/jour");
        t.setDateDebut(LocalDateTime.now());
        t.setDateFin(LocalDateTime.now().plusDays(3));
        t.setInstructions("note");
        when(service.createTreatment(
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.any(LocalDateTime.class),
                org.mockito.ArgumentMatchers.any(LocalDateTime.class),
                org.mockito.ArgumentMatchers.anyString()))
                .thenReturn(t);

        String body = "{" +
                "\"patientId\":\"1\"," +
                "\"medicament\":\"Doliprane\"," +
                "\"dosage\":\"300mg\"," +
                "\"frequence\":\"2 fois par jour\"," +
                "\"dateDebut\":\"2025-12-01T08:00:00\"," +
                "\"dateFin\":\"2025-12-07T08:00:00\"," +
                "\"instructions\":\"Après repas\"" +
                "}";

        mockMvc.perform(post("/treatments")
                        .contentType("application/json")
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.medicament", is("Doliprane")));
    }

    @Test
    void getAllTreatments_returnsList() throws Exception {
        SuiviTraitement t1 = new SuiviTraitement(); t1.setId(1L);
        SuiviTraitement t2 = new SuiviTraitement(); t2.setId(2L);
        when(service.getAllTreatments()).thenReturn(List.of(t1, t2));

        mockMvc.perform(get("/treatments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void getByPatient_returnsList() throws Exception {
        SuiviTraitement t1 = new SuiviTraitement(); t1.setId(1L);
        when(service.getTreatmentsByPatient(org.mockito.ArgumentMatchers.eq("1"))).thenReturn(List.of(t1));

        mockMvc.perform(get("/treatments").param("patientId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void getActive_returnsList() throws Exception {
        when(service.getActiveTreatments()).thenReturn(List.of());
        mockMvc.perform(get("/treatments/active"))
                .andExpect(status().isOk());
    }

    @Test
    void putUpdate_returns200() throws Exception {
        SuiviTraitement t = new SuiviTraitement();
        t.setId(1L);
        t.setMedicament("Ibuprofène");
        when(service.updateTreatment(
                org.mockito.ArgumentMatchers.eq(1L),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.any()))
                .thenReturn(t);

        TreatmentUpdateRequest req = new TreatmentUpdateRequest();
        req.setMedicament("Ibuprofène");
        String json = objectMapper.writeValueAsString(req);

        mockMvc.perform(put("/treatments/1").contentType("application/json").content(json))
                .andExpect(status().isOk());
    }

    @Test
    void delete_returns204() throws Exception {
        Mockito.doNothing().when(service).deleteTreatment(1L);
        mockMvc.perform(delete("/treatments/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void validateDose_returns200() throws Exception {
        Mockito.doNothing().when(service).validateDose(
                org.mockito.ArgumentMatchers.eq(1L),
                org.mockito.ArgumentMatchers.any(LocalDateTime.class));
        String body = "{\"datePrise\":\"2025-12-01T12:00:00\"}";
        mockMvc.perform(post("/treatments/1/validate-dose").contentType("application/json").content(body))
                .andExpect(status().isOk());
    }

    @Test
    void sendReminder_returns200() throws Exception {
        Mockito.doNothing().when(service).sendReminder(1L);
        mockMvc.perform(post("/treatments/1/send-reminder"))
                .andExpect(status().isOk());
    }

    @Test
    void stats_returnsMap() throws Exception {
        when(service.getActiveTreatmentsCount()).thenReturn(7L);
        when(service.getTreatmentsWithProblemsCount()).thenReturn(2L);
        mockMvc.perform(get("/treatments/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activeTreatments", is(7)))
                .andExpect(jsonPath("$.treatmentsWithProblems", is(2)));
    }

    @Test
    void patients_proxy_returnsList() throws Exception {
        List<Map<String, Object>> patients = List.of(Map.of("id", "1", "firstName", "Jane"));
        when(restTemplate.exchange(
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.eq(HttpMethod.GET),
                org.mockito.ArgumentMatchers.<HttpEntity<?>>any(),
                org.mockito.ArgumentMatchers.eq(List.class)))
                .thenReturn(ResponseEntity.ok((List) patients));

        mockMvc.perform(get("/treatments/patients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is("1")));
    }
}
