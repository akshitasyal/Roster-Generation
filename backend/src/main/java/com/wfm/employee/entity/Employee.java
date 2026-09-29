package com.wfm.employee.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.organization.entity.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

/**
 * Core employee entity.
 * Skills, eligibility, preferences, leave stored in separate tables.
 * This entity is the authentication principal.
 */
@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee extends BaseEntity {

    @Column(name = "employee_code", nullable = false, unique = true, length = 50)
    private String employeeCode;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(name = "employment_status", nullable = false, length = 30)
    @Builder.Default
    private String employmentStatus = "ACTIVE";
    // ACTIVE | ON_NOTICE | TERMINATED | ON_LEAVE

    @Column(name = "employment_type", nullable = false, length = 30)
    @Builder.Default
    private String employmentType = "FULL_TIME";
    // FULL_TIME | PART_TIME | CONTRACT

    @Column(name = "date_of_joining", nullable = false)
    private LocalDate dateOfJoining;

    @Column(name = "last_working_date")
    private LocalDate lastWorkingDate;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "gender", length = 10)
    private String gender;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    /**
     * Returns full name for display purposes.
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }

    /**
     * Returns the role code (used for authorization).
     */
    public String getRoleCode() {
        return role != null ? role.getCode() : null;
    }
}
