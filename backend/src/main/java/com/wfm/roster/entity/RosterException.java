package com.wfm.roster.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import com.wfm.organization.entity.Role;
import com.wfm.planning.entity.PlanningCycle;
import com.wfm.project.entity.Project;
import com.wfm.shift.entity.Shift;
import com.wfm.skill.entity.Skill;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

/**
 * Exceptions generated during roster creation and validation.
 * Staffing shortage is NOT a hard failure - creates an OPEN exception.
 * Exceptions require WFM human attention and resolution.
 *
 * Types: STAFFING_SHORTAGE | SKILL_SHORTAGE | NO_ELIGIBLE_EMPLOYEE
 *   | AVAILABILITY_CONFLICT | MANUAL_OVERRIDE_REQUIRED | REST_VIOLATION
 *   | CONSECUTIVE_DAY_VIOLATION | MANAGEMENT_COVERAGE_CONFLICT
 *   | PREFERENCE_VIOLATION | OTHER
 */
@Entity
@Table(name = "exceptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RosterException extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roster_version_id", nullable = false)
    private RosterVersion rosterVersion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planning_cycle_id", nullable = false)
    private PlanningCycle planningCycle;

    @Column(name = "exception_type", nullable = false, length = 50)
    private String exceptionType;

    @Column(name = "severity", nullable = false, length = 20)
    @Builder.Default
    private String severity = "WARNING";
    // INFO | WARNING | ERROR | CRITICAL

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name = "date")
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id")
    private Shift shift;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(name = "required_count")
    private Integer requiredCount;

    @Column(name = "assigned_count")
    private Integer assignedCount;

    @Column(name = "gap")
    private Integer gap;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "OPEN";
    // OPEN | ACKNOWLEDGED | RESOLVED | ESCALATED | DISMISSED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by")
    private Employee resolvedBy;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;
}
