package com.wfm.leave.dto;
import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;
@Data
public class LeaveDTO {
    private Long id;
    private Long employeeId;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Long approvedById;
    private Instant approvedAt;
    private String reason;
}
