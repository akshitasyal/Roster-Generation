package com.wfm.roster.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import com.wfm.project.entity.Project;
import com.wfm.shift.entity.Shift;
import com.wfm.team.entity.Team;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * THE CENTRAL ROSTER TABLE.
 *
 * Unified roster assignments for ALL roles:
 * Associates, TLs, AMs, Managers, Senior Managers, WFM.
 * Do NOT create separate tables per role.
 * Employee role determines the type of assignment.
 *
 * assignment_type:
 *   SHIFT      = employee is working a shift
 *   OFF        = weekly day off
 *   LEAVE      = employee on approved leave
 *   UNAVAILABLE = employee unavailable
 *
 * source:
 *   SYSTEM     = optimizer-generated
 *   MANUAL     = WFM override
 *   REPLACEMENT = post-publish replacement
 *   ADJUSTMENT  = post-publish adjustment
 *
 * locked = true: optimizer must NOT change this assignment.
 */
@Entity
@Table(name = "roster_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RosterAssignment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roster_version_id", nullable = false)
    private RosterVersion rosterVersion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id")
    private Shift shift;
    // NULL if assignment_type = OFF | LEAVE | UNAVAILABLE

    @Column(name = "assignment_type", nullable = false, length = 30)
    private String assignmentType;
    // SHIFT | OFF | LEAVE | UNAVAILABLE

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "DRAFT";
    // DRAFT | CONFIRMED | PUBLISHED | CANCELLED

    @Column(name = "source", nullable = false, length = 30)
    @Builder.Default
    private String source = "SYSTEM";
    // SYSTEM | MANUAL | REPLACEMENT | ADJUSTMENT

    @Column(name = "locked", nullable = false)
    @Builder.Default
    private Boolean locked = false;
    // If true, optimizer must not change this assignment

    /**
     * Returns true if this is a working shift assignment.
     */
    public boolean isWorkingShift() {
        return "SHIFT".equals(assignmentType) && shift != null;
    }

    /**
     * Returns true if employee is off on this day.
     */
    public boolean isOff() {
        return "OFF".equals(assignmentType);
    }

    /**
     * Returns true if employee is on leave on this day.
     */
    public boolean isLeave() {
        return "LEAVE".equals(assignmentType);
    }

    /**
     * Returns employee role code for type-based queries.
     */
    public String getEmployeeRoleCode() {
        return employee != null && employee.getRole() != null
                ? employee.getRole().getCode()
                : null;
    }
}
