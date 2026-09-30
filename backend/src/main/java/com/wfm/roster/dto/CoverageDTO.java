package com.wfm.roster.dto;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class CoverageDTO {
    private Long id;
    private Long rosterVersionId;
    private Long projectId;
    private LocalDate date;
    private LocalTime intervalStart;
    private LocalTime intervalEnd;
    private Long shiftId;
    private Long skillId;
    private Long roleId;
    private Integer requiredHeadcount;
    private Integer assignedHeadcount;
    private Integer gap;
    private Integer excess;
    private String coverageStatus;
}
