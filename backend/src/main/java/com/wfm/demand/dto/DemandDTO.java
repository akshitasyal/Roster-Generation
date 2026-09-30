package com.wfm.demand.dto;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class DemandDTO {
    private Long id;
    private Long planningCycleId;
    private Long projectId;
    private LocalDate date;
    private LocalTime intervalStart;
    private LocalTime intervalEnd;
    private Long shiftId;
    private Long skillId;
    private Long roleId;
    private Integer requiredHeadcount;
    private String source;
}
