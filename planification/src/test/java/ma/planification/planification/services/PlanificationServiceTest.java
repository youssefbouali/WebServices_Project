package ma.planification.planification.services;

import ma.planification.planification.client.ProfileClient;
import ma.planification.planification.dto.PlanificationResponse;
import ma.planification.planification.dto.ProfileDto;
import ma.planification.planification.entities.Planification;
import ma.planification.planification.repositories.PlanificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PlanificationServiceTest {

    private PlanificationRepository repository;
    private ProfileClient profileClient;
    private PlanificationService service;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(PlanificationRepository.class);
        profileClient = Mockito.mock(ProfileClient.class);
        service = new PlanificationService();
        // use reflection to inject mocks because fields are private and autowired
        TestUtils.setField(service, "repository", repository);
        TestUtils.setField(service, "profileClient", profileClient);
    }

    @Test
    void getAppointmentsWithDoctorNames_shouldAttachDoctorName_whenProfileFound() {
        Planification p = new Planification();
        p.setRdvId(1L);
        p.setPatientId(10);
        p.setDoctorId(99);
        p.setDateRdv(LocalDateTime.of(2025,1,1,10,0));
        p.setStatut("confirmé");

        when(repository.findByPatientId(10)).thenReturn(List.of(p));

        ProfileDto profile = new ProfileDto();
        profile.setId("99");
        profile.setFirstName("John");
        profile.setLastName("Doe");

        when(profileClient.getProfileById(99)).thenReturn(profile);

        List<PlanificationResponse> responses = service.getAppointmentsWithDoctorNames(10);

        assertEquals(1, responses.size());
        assertEquals("John Doe", responses.get(0).getDoctorName());
    }

    @Test
    void getAppointmentsWithDoctorNames_shouldHaveNullName_whenProfileNotFound() {
        Planification p = new Planification();
        p.setRdvId(2L);
        p.setPatientId(11);
        p.setDoctorId(55);
        p.setDateRdv(LocalDateTime.now());

        when(repository.findByPatientId(11)).thenReturn(List.of(p));
        when(profileClient.getProfileById(55)).thenReturn(null);

        List<PlanificationResponse> responses = service.getAppointmentsWithDoctorNames(11);

        assertEquals(1, responses.size());
        assertNull(responses.get(0).getDoctorName());
    }
}
