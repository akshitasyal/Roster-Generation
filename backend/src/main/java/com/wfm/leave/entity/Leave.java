package com.wfm.leave.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

/**
 * Employee leave request.
 * APPROVED leave is a HARD CONSTRAINT (H1) for the optimizer.
 * The optimizer must check: for every day in [start_date, end_date]
 * where status=APPROVED, NO shift assignment is allowed.
 */
@Entity
@Table(name = "leaves")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Leave extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "leave_type", nullable = false, length = 50)
    private String leaveType;
    // CASUAL | SICK | EARNED | COMP_OFF | EMERGENCY | MATERNITY | PATERNITY | UNPAID

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "PENDING";
    // PENDING | APPROVED | REJECTED | CANCELLED | WITHDRAWN

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private Employee approvedBy;

    @Column(name = "approved_at")
    private Instant approvedAt;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    /**
     * Returns true if this leave overlaps with the given date.
     */
    public boolean coversDate(LocalDate date) {
        return !date.isBefore(startDate) && !date.isAfter(endDate);
    }

    /**
     * Returns true if this leave is approved and active constraint.
     */
    public boolean isApproved() {
        return "APPROVED".equals(status);
    }

    /**
     * Returns true if this is an approved leave covering the given date.
     * This is the hard constraint check for the optimizer.
     */
    public boolean isApprovedLeaveOn(LocalDate date) {
        return isApproved() && coversDate(date);
    }
}
