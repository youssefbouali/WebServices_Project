package ma.planification.planification.services;


import ma.planification.planification.entities.Planification;
import ma.planification.planification.repositories.PlanificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PlanificationService {

    @Autowired
    private PlanificationRepository repository;

    public Planification scheduleAppointment(Integer patientId, Integer doctorId, LocalDateTime dateRdv) {
        Planification appointment = new Planification();
        appointment.setPatientId(patientId);
        appointment.setDoctorId(doctorId);
        appointment.setDateRdv(dateRdv);
        appointment.setStatut("confirmé");
        return repository.save(appointment);
    }

    public List<Planification> getAppointments(Integer patientId) {
        return repository.findByPatientId(patientId);
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