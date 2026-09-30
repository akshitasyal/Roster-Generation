package com.wfm.roster.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import com.wfm.shift.entity.Shift;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.Map;

/**
 * Roster adjustment - all manual changes to roster assignments.
 * WFM manual overrides, replacements, post-publish changes.
 * All changes to published rosters MUST go through adjustments.
 * validation_errors stores why an adjustment was rejected.
 */
@Entity
@Table(name = "roster_adjustments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RosterAdjustment extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roster_version_id", nullable = false)
    private RosterVersion rosterVersion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roster_assignment_id", nullable = false)
    private RosterAssignment rosterAssignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "old_shift_id")
    private Shift oldShift;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "new_shift_id")
    private Shift newShift;

    @Column(name = "old_assignment_type", length = 30)
    private String oldAssignmentType;

    @Column(name = "new_assignment_type", length = 30)
    private String newAssignmentType;

    @Column(name = "adjustment_type", nullable = false, length = 50)
    private String adjustmentType;
    // SHIFT_CHANGE | AVAILABILITY_REPLACEMENT | WFM_OVERRIDE | POST_PUBLISH_CHANGE | COVERAGE_ADJUSTMENT

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "validation_result", nullable = false, length = 30)
    @Builder.Default
    private String validationResult = "PENDING";
    // PENDING | VALID | INVALID

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "validation_errors", columnDefinition = "jsonb")
    private Map<String, Object> validationErrors;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by")
    private Employee requestedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private Employee approvedBy;

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "PENDING";
    // PENDING | APPROVED | REJECTED | APPLIED | REVERTED
}
