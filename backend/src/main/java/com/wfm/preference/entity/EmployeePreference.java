package com.wfm.preference.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import com.wfm.planning.entity.PlanningCycle;
import com.wfm.shift.entity.Shift;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Employee shift preference per planning cycle.
 * preference_rank: 1 = most preferred.
 * TL can DECLINE (not approve) a preference before deadline.
 * Preferences are SOFT constraints (S1, S8) - honored where possible, not mandatory.
 */
@Entity
@Table(name = "employee_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeePreference extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planning_cycle_id", nullable = false)
    private PlanningCycle planningCycle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "preferred_shift_id", nullable = false)
    private Shift preferredShift;

    @Column(name = "preference_rank", nullable = false)
    @Builder.Default
    private Integer preferenceRank = 1;
    // 1 = most preferred

    @Column(name = "tl_declined", nullable = false)
    @Builder.Default
    private Boolean tlDeclined = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tl_declined_by")
    private Employee tlDeclinedBy;

    @Column(name = "tl_declined_at")
    private Instant tlDeclinedAt;

    @Column(name = "tl_decline_reason", columnDefinition = "TEXT")
    private String tlDeclineReason;

    /**
     * Returns true if this preference is active (not declined by TL).
     */
    public boolean isActive() {
        return !Boolean.TRUE.equals(tlDeclined);
    }
}
