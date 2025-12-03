package ma.planification.planification.services;

import ma.planification.planification.dto.PlanificationResponse;
import ma.planification.planification.client.ProfileClient;
import ma.planification.planification.dto.ProfileDto;
import ma.planification.planification.entities.Planification;
import ma.planification.planification.repositories.PlanificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PlanificationService {

    @Autowired
    private PlanificationRepository repository;

    @Autowired
    private ProfileClient profileClient;

    public Planification scheduleAppointment(String patientId, String doctorId, LocalDateTime dateRdv) {
        Planification appointment = new Planification();
        appointment.setPatientId(patientId);
        appointment.setDoctorId(doctorId);
        appointment.setDateRdv(dateRdv);
        appointment.setStatut("confirmé");
        return repository.save(appointment);
    }

    public List<PlanificationResponse> getAppointments(String patientId) {
        List<Planification> appointments = repository.findByPatientId(patientId);
        return buildResponses(appointments);
    }

    public List<PlanificationResponse> getAllAppointments() {
        List<Planification> appointments = repository.findAll();
        return buildResponses(appointments);
    }

    // Backwards-compatible helper used in tests / older callers
    public List<PlanificationResponse> getAppointmentsWithDoctorNames(String patientId) {
        return getAppointments(patientId);
    }

    public void cancelAppointment(Long rdvId) {
        Planification appointment = repository.findById(rdvId).orElseThrow();
        appointment.setStatut("annulé");
        repository.save(appointment);
    }

    public Planification updateAppointment(Long rdvId, LocalDateTime nouvelleDate) {
        Planification appointment = repository.findById(rdvId).orElseThrow();
        appointment.setDateRdv(nouvelleDate);
        appointment.setStatut("en attente");
        return repository.save(appointment);
    }

    private List<PlanificationResponse> buildResponses(List<Planification> appointments) {
        List<PlanificationResponse> result = new ArrayList<>();
        for (Planification appt : appointments) {
            result.add(mapToResponse(appt));
        }
        return result;
    }

    private PlanificationResponse mapToResponse(Planification appt) {
        PlanificationResponse response = new PlanificationResponse();
        response.setRdvId(appt.getRdvId());
        response.setPatientId(appt.getPatientId());
        response.setDoctorId(appt.getDoctorId());
        response.setDateRdv(appt.getDateRdv());
        response.setStatut(appt.getStatut());
        response.setDoctorName(resolveDoctorName(appt.getDoctorId()));
        return response;
    }

    private String resolveDoctorName(String doctorId) {
  try {
    ProfileDto dto = profileClient.getProfileById(doctorId);
    if (dto == null) {
      return null;
    }
    String fn = dto.getFirstName() == null ? "" : dto.getFirstName();
    System.out.println("First Name: " + fn);
    String ln = dto.getLastName() == null ? "" : dto.getLastName();
    System.out.println("Last Name: " + ln);
    String fullname = (fn + " " + ln).trim();
    return fullname.isEmpty() ? null : fullname;
  } catch (Exception e) {
    System.out.println("❌ ERREUR lors de l'appel à ProfileClient :file planificationservice");
    e.printStackTrace();
    return null;
  }
}
}
