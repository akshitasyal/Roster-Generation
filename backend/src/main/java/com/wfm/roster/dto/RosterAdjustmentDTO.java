package com.wfm.roster.dto;
import lombok.Data;
import java.time.LocalDate;
import java.util.Map;
@Data
public class RosterAdjustmentDTO {
    private Long id;
    private Long rosterVersionId;
    private Long rosterAssignmentId;
    private Long employeeId;
    private LocalDate date;
    private Long oldShiftId;
    private Long newShiftId;
    private String oldAssignmentType;
    private String newAssignmentType;
    private String adjustmentType;
    private String reason;
    private String validationResult;
    private Map<String, Object> validationErrors;
    private Long requestedById;
    private Long approvedById;
    private String status;
}
