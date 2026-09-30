package com.wfm.employee.dto;
import lombok.Data;
import java.time.LocalDate;

@Data
public class EmployeeDTO {
    private Long id;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Long roleId;
    private String roleCode;
    private String employmentStatus;
    private String employmentType;
    private LocalDate dateOfJoining;
    private LocalDate lastWorkingDate;
    private String location;
    private String gender;
    private Boolean isActive;
}
