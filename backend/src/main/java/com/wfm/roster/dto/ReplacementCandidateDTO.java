package com.wfm.roster.dto;
import lombok.Builder;
import lombok.Data;
@Data
@Builder
public class ReplacementCandidateDTO {
    private Long employeeId;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private double restGapHours;
}
