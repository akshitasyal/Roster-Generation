package com.wfm.roster.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.project.entity.Project;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * RosterRuleConfiguration: Key-value configuration store for scheduling rules.
 *
 * NULL project_id = global rule (applies to all projects).
 * Non-NULL project_id = project-specific override that takes precedence over global.
 *
 * Standard keys (do NOT hard-code their values elsewhere):
 *   MIN_REST_HOURS          H6 minimum rest between consecutive shifts
 *   MAX_WORKING_HOURS       H4 maximum shift duration
 *   MAX_CONSECUTIVE_DAYS    HC-8 maximum working days in a row
 *   WEEKLY_OFF_COUNT        HC-7 required weekly off days
 *   REGULAR_HOURS           S4 baseline for overtime calculation
 *   WEEKEND_DAYS            Comma-separated DayOfWeek names
 *   WFM_SCHEDULING_MODE     COVERAGE_DRIVEN | FIXED | INDEPENDENT
 *   TIE_BREAK_STRATEGY      Comma-separated priority list
 *   LEAVE_COUNTS_AS_OFF     true | false
 *   WFM_HARD_CONSTRAINT_BYPASS  always false
 *   MANAGEMENT_REPLACEMENT  MANUAL | AUTOMATED
 *   SOLVER_TIME_LIMIT_SECONDS
 *   SOLVER_NUM_WORKERS
 *
 * Lookup: RosterRuleConfigurationService.getValue(key, projectId, date)
 */
@Entity
@Table(name = "roster_rule_configurations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RosterRuleConfiguration extends BaseEntity {

    @Column(name = "rule_key", nullable = false, length = 100)
    private String ruleKey;

    @Column(name = "rule_value", nullable = false, length = 200)
    private String ruleValue;

    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    @Column(name = "description")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;
    // NULL = global rule; non-null = project-specific override

    // -------------------------------------------------------------------------
    // Typed value accessors (avoids scattered Integer.parseInt / Boolean.parseBoolean)
    // -------------------------------------------------------------------------

    public int getIntValue() {
        return Integer.parseInt(ruleValue.trim());
    }

    public double getDoubleValue() {
        return Double.parseDouble(ruleValue.trim());
    }

    public boolean getBooleanValue() {
        return Boolean.parseBoolean(ruleValue.trim());
    }

    /** Returns true if this is a global (non-project-specific) rule. */
    public boolean isGlobal() {
        return project == null;
    }
}

