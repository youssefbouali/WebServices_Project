package ma.planification.planification.dto;


import java.time.LocalDateTime;

public record PlanificationRequest(
        Integer patientId,
        Integer doctorId,
        LocalDateTime dateRdv
) {}