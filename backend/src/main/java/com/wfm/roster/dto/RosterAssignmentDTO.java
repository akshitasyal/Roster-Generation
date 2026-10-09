package com.wfm.roster.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class RosterAssignmentDTO {
    private Long id;
    private Long rosterVersionId;
    private Long employeeId;
    private Long projectId;
    private Long teamId;
    private LocalDate date;
    private Long shiftId;
    private String assignmentType;
    private String status;
    private String source;
    private Boolean locked;
    private String employeeName;
    private String employeeCode;
    private String shiftCode;
}
