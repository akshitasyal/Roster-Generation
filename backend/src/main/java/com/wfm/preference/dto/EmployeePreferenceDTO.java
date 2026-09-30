package com.wfm.preference.dto;
import lombok.Data;
import java.time.Instant;
@Data
public class EmployeePreferenceDTO {
    private Long id;
    private Long employeeId;
    private Long planningCycleId;
    private Long preferredShiftId;
    private Integer preferenceRank;
    private Boolean tlDeclined;
    private Long tlDeclinedById;
    private Instant tlDeclinedAt;
    private String tlDeclineReason;
}
