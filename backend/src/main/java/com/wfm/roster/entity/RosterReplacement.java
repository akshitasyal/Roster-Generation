package com.wfm.roster.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import com.wfm.shift.entity.Shift;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

/**
 * RosterReplacement: Post-publish employee replacement record.
 *
 * When a published assignment must change the EMPLOYEE (e.g., sickness),
 * a RosterReplacement record is created. The original published assignment
 * is marked CANCELLED (never deleted — immutable audit record). A new
 * roster_assignment row with source=REPLACEMENT is inserted in the same
 * roster version.
 *
 * This is distinct from RosterAdjustment which handles shift-time changes.
 *
 * IMMUTABILITY GUARANTEE (Engineering Rule #3):
 *   Published assignments are NEVER modified in-place.
 *   originalAssignment.status → CANCELLED (kept for audit trail)
 *   New RosterAssignment inserted with source=REPLACEMENT, status=PUBLISHED
 *
 * Status lifecycle:
 *   PENDING  → algorithm running
 *   FILLED   → replacement found and published
 *   UNFILLED → all candidates eliminated by hard constraints
 *   CANCELLED → replacement request withdrawn
 */
@Entity
@Table(name = "roster_replacements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RosterReplacement extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "original_assignment_id", nullable = false)
    private RosterAssignment originalAssignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "original_employee_id", nullable = false)
    private Employee originalEmployee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "replacement_employee_id")
    private Employee replacementEmployee;
    // NULL when no eligible replacement found (UNFILLED)

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id")
    private Shift shift;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "reason_type", nullable = false, length = 50)
    private String reasonType;
    // SICKNESS | EMERGENCY | UNAVAILABLE | OTHER

    @Column(name = "replacement_status", nullable = false, length = 30)
    @Builder.Default
    private String replacementStatus = "PENDING";
    // PENDING | FILLED | UNFILLED | CANCELLED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by", nullable = false)
    private Employee requestedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private Employee approvedBy;

    @Column(name = "approved_at")
    private Instant approvedAt;

    // -------------------------------------------------------------------------
    // Convenience helpers
    // -------------------------------------------------------------------------

    public boolean isFilled() {
        return "FILLED".equals(replacementStatus);
    }

    public boolean isUnfilled() {
        return "UNFILLED".equals(replacementStatus);
    }

    public boolean isPending() {
        return "PENDING".equals(replacementStatus);
    }

    public boolean isCancelled() {
        return "CANCELLED".equals(replacementStatus);
    }
}
