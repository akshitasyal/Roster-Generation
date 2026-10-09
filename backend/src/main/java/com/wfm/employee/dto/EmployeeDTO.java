package com.wfm.employee.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class EmployeeDTO {
    private Long id;
    private String empId;
    private String employeeCode;
    private String name;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String designation;
    private String skill;
    private String status;
    private String empType;
    private String employmentStatus;
    private String employmentType;
    private LocalDate joiningDate;
    private LocalDate dateOfJoining;
    private String location;
    private String center;
    private String lob;
    private String channel;
    private String country;
    private String agentStatus;
    private String modeOfWork;
    private String gender;
    private Boolean isActive;
}
