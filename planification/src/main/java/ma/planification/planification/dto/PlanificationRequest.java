package ma.planification.planification.dto;


import java.time.LocalDateTime;

public record PlanificationRequest(
        String patientId,
        String doctorId,
        LocalDateTime dateRdv
) {}
