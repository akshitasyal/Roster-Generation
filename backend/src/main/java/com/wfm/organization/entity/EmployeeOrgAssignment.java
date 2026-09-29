package com.wfm.organization.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import com.wfm.project.entity.Project;
import com.wfm.team.entity.Team;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Effective-dated organizational hierarchy assignment.
 * Preserves full historical hierarchy for employees.
 * Employees can change team, TL, AM, manager, project over time.
 * effective_to = NULL means currently active.
 */
@Entity
@Table(name = "employee_org_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeOrgAssignment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    /**
     * The manager/TL this employee directly reports to.
     * For associates: their TL.
     * For TLs: their AM.
     * For AMs: their Manager.
     * For Managers: their Senior Manager.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reports_to_id")
    private Employee reportsTo;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;
    // NULL = currently active

    @Column(name = "is_primary", nullable = false)
    @Builder.Default
    private Boolean isPrimary = true;

    /**
     * Returns true if this assignment is currently active on the given date.
     */
    public boolean isActiveOn(LocalDate date) {
        return !date.isBefore(effectiveFrom) &&
               (effectiveTo == null || !date.isAfter(effectiveTo));
    }
}
