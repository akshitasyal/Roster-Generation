package com.wfm.planning.dto;
import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;
@Data
public class PlanningCycleDTO {
    private Long id;
    private Long projectId;
    private String cycleName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Instant preferenceOpenAt;
    private Instant preferenceLockAt;
    private Instant tlReviewOpenAt;
    private Instant tlReviewCloseAt;
    private Instant generationStartedAt;
    private Instant generationCompletedAt;
    private Long createdById;
}
