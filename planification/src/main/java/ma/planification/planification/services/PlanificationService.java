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

    public Planification scheduleAppointment(Integer patientId, Integer doctorId, LocalDateTime dateRdv) {
        Planification appointment = new Planification();
        appointment.setPatientId(patientId);
        appointment.setDoctorId(doctorId);
        appointment.setDateRdv(dateRdv);
        appointment.setStatut("confirmé");
        return repository.save(appointment);
    }

    public List<PlanificationResponse> getAppointments(Integer patientId) {
        List<Planification> appointments = repository.findByPatientId(patientId);
        return buildResponses(appointments);
    }

    public List<PlanificationResponse> getAllAppointments() {
        List<Planification> appointments = repository.findAll();
        return buildResponses(appointments);
    }

    // Backwards-compatible helper used in tests / older callers
    public List<PlanificationResponse> getAppointmentsWithDoctorNames(Integer patientId) {
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

    private String resolveDoctorName(Integer doctorId) {
        try {
            ProfileDto dto = profileClient.getProfileById(doctorId);
            if (dto == null) {
                return null;
            }
            String fn = dto.getFirstName() == null ? "" : dto.getFirstName();
            String ln = dto.getLastName() == null ? "" : dto.getLastName();
            String fullname = (fn + " " + ln).trim();
            return fullname.isEmpty() ? null : fullname;
        } catch (Exception ignored) {
            return null;
        }
    }
}