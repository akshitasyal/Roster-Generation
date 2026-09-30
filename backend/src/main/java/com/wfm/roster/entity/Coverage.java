package com.wfm.roster.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import com.wfm.organization.entity.Role;
import com.wfm.project.entity.Project;
import com.wfm.shift.entity.Shift;
import com.wfm.skill.entity.Skill;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Coverage calculation result per roster version.
 * gap and excess are computed columns in the DB.
 * SHORTAGE does not fail the roster - it creates an exception.
 */
@Entity
@Table(name = "coverage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coverage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roster_version_id", nullable = false)
    private RosterVersion rosterVersion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "interval_start", nullable = false)
    private LocalTime intervalStart;

    @Column(name = "interval_end", nullable = false)
    private LocalTime intervalEnd;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id")
    private Shift shift;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(name = "required_headcount", nullable = false)
    @Builder.Default
    private Integer requiredHeadcount = 0;

    @Column(name = "assigned_headcount", nullable = false)
    @Builder.Default
    private Integer assignedHeadcount = 0;

    // gap and excess are GENERATED ALWAYS columns in PostgreSQL.
    // We declare them as insertable=false, updatable=false so JPA doesn't try to write them.
    @Column(name = "gap", insertable = false, updatable = false)
    private Integer gap;

    @Column(name = "excess", insertable = false, updatable = false)
    private Integer excess;

    @Column(name = "coverage_status", nullable = false, length = 30)
    @Builder.Default
    private String coverageStatus = "COVERED";
    // COVERED | SHORTAGE | EXCESS | NO_DEMAND

    /**
     * Compute coverage status from headcount values (used before DB write).
     */
    public String computeStatus() {
        if (requiredHeadcount == 0) return "NO_DEMAND";
        if (assignedHeadcount >= requiredHeadcount) return "COVERED";
        return "SHORTAGE";
    }
}
