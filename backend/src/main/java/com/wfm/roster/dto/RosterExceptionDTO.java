package com.wfm.roster.dto;
import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;
@Data
public class RosterExceptionDTO {
    private Long id;
    private Long rosterVersionId;
    private Long planningCycleId;
    private String exceptionType;
    private String severity;
    private Long employeeId;
    private LocalDate date;
    private Long shiftId;
    private Long skillId;
    private Long roleId;
    private Integer requiredCount;
    private Integer assignedCount;
    private Integer gap;
    private String description;
    private String status;
    private Long resolvedById;
    private Instant resolvedAt;
    private String resolutionNotes;
}
