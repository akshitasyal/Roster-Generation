package com.wfm.availability.dto;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class AvailabilityDTO {
    private Long id;
    private Long employeeId;
    private LocalDate date;
    private LocalTime availableFrom;
    private LocalTime availableTo;
    private String availabilityStatus;
    private String reason;
}
