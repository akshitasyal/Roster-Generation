package com.wfm.employee.entity;

import com.wfm.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Employee master record — organizational source of truth.
 * <p>
 * Contains ALL identity and org data from the TechMahindra workforce dataset.
 * Authentication credentials live in {@code user_accounts} (1:1 mapping).
 * Portal role is NEVER stored here — it is derived dynamically from
 * {@code designation} + {@code skill} via {@code PortalRoleResolver}.
 * </p>
 */
@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee extends BaseEntity {

    @Column(name = "emp_id", nullable = false, unique = true, length = 50)
    private String empId;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "gender", length = 10)
    private String gender;

    @Column(name = "emp_type", length = 50)
    private String empType;

    /** Exact designation string from the dataset: Associate, Team Leader, Associate Manager, Manager, Senior Manager */
    @Column(name = "designation", length = 100)
    private String designation;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "modification_date")
    private LocalDate modificationDate;

    @Column(name = "manager1_emp_id", length = 50)
    private String manager1EmpId;

    @Column(name = "manager1_name", length = 200)
    private String manager1Name;

    @Column(name = "manager2_emp_id", length = 50)
    private String manager2EmpId;

    @Column(name = "manager2_name", length = 200)
    private String manager2Name;

    @Column(name = "manager3_emp_id", length = 50)
    private String manager3EmpId;

    @Column(name = "manager3_name", length = 200)
    private String manager3Name;

    @Column(name = "manager4_emp_id", length = 50)
    private String manager4EmpId;

    @Column(name = "manager4_name", length = 200)
    private String manager4Name;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "center", length = 100)
    private String center;

    /** Employment eligibility. Active | Inactive. Source of truth for login eligibility. */
    @Column(name = "status", length = 50)
    @Builder.Default
    private String status = "Active";

    @Column(name = "lob", length = 100)
    private String lob;

    @Column(name = "channel", length = 100)
    private String channel;

    /** Used by PortalRoleResolver for WFM identification (e.g., 'Workforce Management'). */
    @Column(name = "skill", length = 255)
    private String skill;

    @Column(name = "agent_status", length = 100)
    private String agentStatus;

    @Column(name = "mode_of_work", length = 50)
    private String modeOfWork;

    /** Corporate email — organizational identity key. Must match user_accounts.email. */
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "shift_pattern_id")
    private Long shiftPatternId;

    // ── Convenience methods ──────────────────────────────────────────────────

    public String getFullName() {
        return name;
    }

    public String getEmployeeCode() {
        return empId;
    }
}
