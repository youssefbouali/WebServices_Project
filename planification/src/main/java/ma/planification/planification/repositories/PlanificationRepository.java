package ma.planification.planification.repositories;

import ma.planification.planification.entities.Planification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlanificationRepository extends JpaRepository<Planification, Long> {
    List<Planification> findByPatientId(Integer patientId);
}
