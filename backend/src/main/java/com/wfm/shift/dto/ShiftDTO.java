package com.wfm.shift.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalTime;
@Data
public class ShiftDTO {
    private Long id;
    private String shiftCode;
    private String shiftName;
    private String shiftType;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal durationHours;
    private Boolean isOvernight;
    private String status;
}
