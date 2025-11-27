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
        List<PlanificationResponse> result = new ArrayList<>();

        for (Planification appt : appointments) {
            String doctorName = null;
            try {
                // use ProfileClient to fetch profile DTO
                ProfileDto dto = profileClient.getProfileById(appt.getDoctorId());
                if (dto != null) {
                    String fn = dto.getFirstName() == null ? "" : dto.getFirstName();
                    String ln = dto.getLastName() == null ? "" : dto.getLastName();
                    String fullname = (fn + " " + ln).trim();
                    doctorName = fullname.isEmpty() ? null : fullname;
                }
            } catch (Exception ignored) {
                // keep null doctorName on any failures
            }

            PlanificationResponse r = new PlanificationResponse();
            r.setRdvId(appt.getRdvId());
            r.setPatientId(appt.getPatientId());
            r.setDoctorId(appt.getDoctorId());
            r.setDateRdv(appt.getDateRdv());
            r.setStatut(appt.getStatut());
            r.setDoctorName(doctorName);
            result.add(r);
        }

        return result;
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
}