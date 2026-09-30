package com.wfm.preference.dto;
import lombok.Data;
@Data
public class WeeklyOffPreferenceDTO {
    private Long id;
    private Long employeeId;
    private Long planningCycleId;
    private String dayOfWeek;
    private Integer preferenceRank;
}
