package ma.planification.planification.services;

import ma.planification.planification.dto.PlanificationResponse;
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

    private final PlanificationRepository repository;
    private final RestTemplate restTemplate;

    @Value("${profiles.base-url}")
    private String profilesBaseUrl;

    @Autowired
    public PlanificationService(PlanificationRepository repository, RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

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
                String url = profilesBaseUrl + "/" + appt.getDoctorId();
                Map<?, ?> profile = restTemplate.getForObject(url, Map.class);
                if (profile != null) {
                    Object first = profile.get("firstName");
                    Object last = profile.get("lastName");
                    String fn = first == null ? "" : first.toString();
                    String ln = last == null ? "" : last.toString();
                    String fullname = (fn + " " + ln).trim();
                    doctorName = fullname.isEmpty() ? null : fullname;
                }
            } catch (RestClientException ignored) {
                // ignore and continue without doctorName
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