package com.example.suivipatients.security;

import com.example.suivipatients.SuiviPatientsApplication;
import com.example.suivipatients.models.SuiviTraitement;
import com.example.suivipatients.services.SuiviTraitementService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = SuiviPatientsApplication.class)
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration",
        "jwt.secret=test-super-secret-should-be-long-enough-0123456789ABCDEF",
        "APP_USER=apiuser",
        "APP_PASS=apipass",
        "profiles.enabled=false"
})
class JwtSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SuiviTraitementService service;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void postTreatments_withoutToken_is401() throws Exception {
        String body = "{" +
                "\"patientId\":\"1\"," +
                "\"medicament\":\"Doliprane\"," +
                "\"dosage\":\"300mg\"," +
                "\"frequence\":\"2/jour\"," +
                "\"dateDebut\":\"2025-12-01T08:00:00\"," +
                "\"dateFin\":\"2025-12-07T08:00:00\"," +
                "\"instructions\":\"Après repas\"" +
                "}";

        mockMvc.perform(post("/treatments").contentType("application/json").content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void postTreatments_withValidToken_is201() throws Exception {
        String tokenResponse = mockMvc.perform(post("/auth/token")
                        .contentType("application/json")
                        .content("{\"username\":\"apiuser\",\"password\":\"apipass\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JsonNode node = objectMapper.readTree(tokenResponse);
        String jwt = node.get("token").asText();

        SuiviTraitement t = new SuiviTraitement();
        t.setId(1L);
        t.setPatientId("1");
        t.setMedicament("Doliprane");
        t.setDosage("300mg");
        t.setFrequence("2/jour");
        t.setDateDebut(LocalDateTime.parse("2025-12-01T08:00:00"));
        t.setDateFin(LocalDateTime.parse("2025-12-07T08:00:00"));
        t.setInstructions("Après repas");

        when(service.createTreatment(anyString(), anyString(), anyString(), anyString(), any(LocalDateTime.class), any(LocalDateTime.class), anyString()))
                .thenReturn(t);

        String body = "{" +
                "\"patientId\":\"1\"," +
                "\"medicament\":\"Doliprane\"," +
                "\"dosage\":\"300mg\"," +
                "\"frequence\":\"2/jour\"," +
                "\"dateDebut\":\"2025-12-01T08:00:00\"," +
                "\"dateFin\":\"2025-12-07T08:00:00\"," +
                "\"instructions\":\"Après repas\"" +
                "}";

        mockMvc.perform(post("/treatments")
                        .contentType("application/json")
                        .content(body)
                        .header("Authorization", "Bearer " + jwt))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.medicament", is("Doliprane")));
    }
}

