package com.wfm.preference.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import com.wfm.planning.entity.PlanningCycle;
import jakarta.persistence.*;
import lombok.*;

/**
 * Employee weekly-off day preference per planning cycle.
 * Employee receives exactly 2 OFF days per week (configurable).
 * The two OFF days do NOT have to be consecutive.
 * Weekly-off preference is SOFT constraint (S5).
 */
@Entity
@Table(name = "weekly_off_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyOffPreference extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planning_cycle_id", nullable = false)
    private PlanningCycle planningCycle;

    @Column(name = "day_of_week", nullable = false, length = 10)
    private String dayOfWeek;
    // MONDAY | TUESDAY | WEDNESDAY | THURSDAY | FRIDAY | SATURDAY | SUNDAY

    @Column(name = "preference_rank", nullable = false)
    @Builder.Default
    private Integer preferenceRank = 1;
    // 1 = most preferred off day
}
