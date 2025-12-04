package ma.planification.planification.services;

import ma.planification.planification.client.ProfileClient;
import ma.planification.planification.dto.PlanificationResponse;
import ma.planification.planification.dto.ProfileDto;
import ma.planification.planification.entities.Planification;
import ma.planification.planification.repositories.PlanificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ma.planification.planification.TestUtils;
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
        p.setPatientId("10");
        p.setDoctorId("99");
        p.setDateRdv(LocalDateTime.of(2025,1,1,10,0));
        p.setStatut("confirmé");

        when(repository.findByPatientId("10")).thenReturn(List.of(p));

        ProfileDto profile = new ProfileDto();
        profile.setId("99");
        profile.setFirstName("John");
        profile.setLastName("Doe");

        when(profileClient.getProfileById("99")).thenReturn(profile);

        List<PlanificationResponse> responses = service.getAppointmentsWithDoctorNames("10");

        assertEquals(1, responses.size());
        assertEquals("John Doe", responses.get(0).getDoctorName());
    }

    @Test
    void getAppointmentsWithDoctorNames_shouldHaveNullName_whenProfileNotFound() {
        Planification p = new Planification();
        p.setRdvId(2L);
        p.setPatientId("11");
        p.setDoctorId("55");
        p.setDateRdv(LocalDateTime.now());

        when(repository.findByPatientId("11")).thenReturn(List.of(p));
        when(profileClient.getProfileById("55")).thenReturn(null);

        List<PlanificationResponse> responses = service.getAppointmentsWithDoctorNames("11");

        assertEquals(1, responses.size());
        assertNull(responses.get(0).getDoctorName());
    }

    @Test
    void scheduleAppointment_shouldCreatePendingAppointment_withStringIds() {
        LocalDateTime at = LocalDateTime.of(2025, 2, 1, 9, 30);
        Mockito.when(repository.save(Mockito.any())).thenAnswer(inv -> inv.getArgument(0));

        Planification created = service.scheduleAppointment("p1", "d1", at);

        assertEquals("p1", created.getPatientId());
        assertEquals("d1", created.getDoctorId());
        assertEquals(at, created.getDateRdv());
        assertEquals("en attente", created.getStatut());
    }

    @Test
    void updateAppointment_shouldSetStatusEnAttente_andChangeDate() {
        Planification existing = new Planification();
        existing.setRdvId(5L);
        existing.setPatientId("p5");
        existing.setDoctorId("d5");
        existing.setDateRdv(LocalDateTime.of(2025, 1, 1, 10, 0));
        existing.setStatut("confirmé");

        when(repository.findById(5L)).thenReturn(java.util.Optional.of(existing));
        when(repository.save(Mockito.any())).thenAnswer(inv -> inv.getArgument(0));

        LocalDateTime newDate = LocalDateTime.of(2025, 1, 2, 11, 0);
        Planification updated = service.updateAppointment(5L, newDate);

        assertEquals(newDate, updated.getDateRdv());
        assertEquals("en attente", updated.getStatut());
    }

    @Test
    void cancelAppointment_shouldSetStatusAnnule() {
        Planification existing = new Planification();
        existing.setRdvId(6L);
        existing.setPatientId("p6");
        existing.setDoctorId("d6");
        existing.setDateRdv(LocalDateTime.of(2025, 3, 1, 8, 0));
        existing.setStatut("confirmé");

        when(repository.findById(6L)).thenReturn(java.util.Optional.of(existing));
        when(repository.save(Mockito.any())).thenAnswer(inv -> inv.getArgument(0));

        service.cancelAppointment(6L);

        verify(repository).save(Mockito.argThat(a -> "annulé".equals(a.getStatut())));
    }

    @Test
    void confirmAppointment_shouldSetStatusConfirme() {
        Planification existing = new Planification();
        existing.setRdvId(7L);
        existing.setPatientId("p7");
        existing.setDoctorId("d7");
        existing.setDateRdv(LocalDateTime.of(2025, 3, 1, 8, 0));
        existing.setStatut("en attente");

        when(repository.findById(7L)).thenReturn(java.util.Optional.of(existing));
        when(repository.save(Mockito.any())).thenAnswer(inv -> inv.getArgument(0));

        service.confirmAppointment(7L);

        verify(repository).save(Mockito.argThat(a -> "confirmé".equals(a.getStatut())));
    }

    @Test
    void getDoctorAppointments_shouldEnrichWithPatientNames_andDoctorName() {
        Planification a1 = new Planification();
        a1.setRdvId(10L);
        a1.setPatientId("p1");
        a1.setDoctorId("d1");
        a1.setDateRdv(LocalDateTime.of(2025, 4, 1, 9, 0));
        a1.setStatut("confirmé");

        Planification a2 = new Planification();
        a2.setRdvId(11L);
        a2.setPatientId("p2");
        a2.setDoctorId("d1");
        a2.setDateRdv(LocalDateTime.of(2025, 4, 2, 10, 0));
        a2.setStatut("en attente");

        when(repository.findByDoctorId("d1")).thenReturn(List.of(a1, a2));

        ProfileDto doctor = new ProfileDto();
        doctor.setId("d1");
        doctor.setFirstName("Alice");
        doctor.setLastName("Smith");

        ProfileDto patient1 = new ProfileDto();
        patient1.setId("p1");
        patient1.setFirstName("Bob");
        patient1.setLastName("Brown");

        when(profileClient.getProfileById("d1")).thenReturn(doctor);
        when(profileClient.getProfileById("p1")).thenReturn(patient1);
        when(profileClient.getProfileById("p2")).thenReturn(null);

        List<PlanificationResponse> out = service.getDoctorAppointments("d1");

        assertEquals(2, out.size());
        assertEquals("Alice Smith", out.get(0).getDoctorName());
        assertEquals("Bob Brown", out.get(0).getPatientName());
        assertNull(out.get(1).getPatientName());
    }
}
