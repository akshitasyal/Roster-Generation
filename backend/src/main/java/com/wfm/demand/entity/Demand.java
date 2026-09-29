package com.wfm.demand.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.organization.entity.Role;
import com.wfm.planning.entity.PlanningCycle;
import com.wfm.project.entity.Project;
import com.wfm.shift.entity.Shift;
import com.wfm.skill.entity.Skill;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Demand data per planning cycle interval.
 * Supports ASSOCIATE demand and MANAGEMENT COVERAGE demand.
 *
 * Associate demand example:
 *   role=ASSOCIATE, skill=TECHNICAL_SUPPORT, required_headcount=8
 *
 * Management coverage demand example:
 *   role=TL, skill=NULL, required_headcount=2
 *
 * required_headcount=0 is allowed (no demand for that interval).
 */
@Entity
@Table(name = "demand")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Demand extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planning_cycle_id", nullable = false)
    private PlanningCycle planningCycle;

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
    // NULL = demand applies to any shift

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id")
    private Skill skill;
    // NULL = management coverage (no skill requirement)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;
    // NULL = demand applies to any role

    @Column(name = "required_headcount", nullable = false)
    @Builder.Default
    private Integer requiredHeadcount = 0;

    @Column(name = "source", nullable = false, length = 30)
    @Builder.Default
    private String source = "MANUAL";
    // MANUAL | CALCULATED | IMPORTED | FORECAST

    /**
     * Returns true if this is a management coverage demand (not associate-level).
     */
    public boolean isManagementDemand() {
        return role != null && !"ASSOCIATE".equals(role.getCode());
    }
}
