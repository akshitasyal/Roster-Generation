package com.wfm.config.entity;

import com.wfm.project.entity.Project;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * WorkingHoursPolicy: Configurable working hours rules per project.
 *
 * NULL project → global default (applies to all projects).
 * Project-specific policy overrides the global default.
 *
 * ENGINEERING RULE (#4, inviolable):
 *   The optimizer and ValidationService must NEVER hard-code hour values.
 *   They must always call WorkingHoursPolicyService.getActivePolicy(projectId, date).
 *
 * Fields:
 *   regularHours:      Daily standard hours for S4 overtime calculation (default 8.0)
 *   maximumHours:      H4 hard constraint — maximum shift duration (default 9.0)
 *   overtimeAllowed:   If false, no shift may exceed regularHours
 *   maximumOvertimeHrs: Maximum overtime beyond regularHours (default 1.0)
 *
 * Lookup convention:
 *   1. Fetch project-specific policy effective on planning date
 *   2. If absent, fetch global policy (project_id IS NULL) effective on date
 *   3. If both absent, throw ConfigurationException (not silently default)
 */
@Entity
@Table(name = "working_hours_policies")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkingHoursPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;
    // NULL = global policy

    @Column(name = "regular_hours", nullable = false, precision = 4, scale = 2)
    @Builder.Default
    private BigDecimal regularHours = new BigDecimal("8.0");

    @Column(name = "maximum_hours", nullable = false, precision = 4, scale = 2)
    @Builder.Default
    private BigDecimal maximumHours = new BigDecimal("9.0");

    @Column(name = "overtime_allowed", nullable = false)
    @Builder.Default
    private Boolean overtimeAllowed = true;

    @Column(name = "maximum_overtime_hrs", nullable = false, precision = 4, scale = 2)
    @Builder.Default
    private BigDecimal maximumOvertimeHrs = new BigDecimal("1.0");

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    // -------------------------------------------------------------------------
    // Convenience helpers
    // -------------------------------------------------------------------------

    /** Returns true if this is the global default policy. */
    public boolean isGlobal() {
        return project == null;
    }

    /** Returns true if this policy is effective on the given date. */
    public boolean isEffectiveOn(LocalDate date) {
        if (date.isBefore(effectiveFrom)) return false;
        return effectiveTo == null || !date.isAfter(effectiveTo);
    }

    /** Convenience: max hours as double for CP-SAT/optimizer use. */
    public double getMaximumHoursAsDouble() {
        return maximumHours != null ? maximumHours.doubleValue() : 9.0;
    }

    /** Convenience: regular hours as double for overtime calculation. */
    public double getRegularHoursAsDouble() {
        return regularHours != null ? regularHours.doubleValue() : 8.0;
    }
}
