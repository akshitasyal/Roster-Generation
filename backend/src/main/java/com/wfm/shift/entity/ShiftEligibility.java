package com.wfm.shift.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Shift eligibility for individual employees.
 * CRITICAL: Stored as individual rows per employee per shift.
 * NOT as a comma-separated string like "M/G/E".
 *
 * Example: Employee E01 eligible for Morning and Evening = 2 rows:
 *   row 1: employee_id=E01, shift_id=Morning, is_eligible=true
 *   row 2: employee_id=E01, shift_id=Evening, is_eligible=true
 *
 * This is essential for the CP-SAT optimizer to correctly filter candidates.
 */
@Entity
@Table(name = "shift_eligibility")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftEligibility extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id", nullable = false)
    private Shift shift;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;
    // NULL = currently active

    @Column(name = "is_eligible", nullable = false)
    @Builder.Default
    private Boolean isEligible = true;

    /**
     * Returns true if this eligibility record is active on the given date.
     */
    public boolean isActiveOn(LocalDate date) {
        return !date.isBefore(effectiveFrom) &&
               (effectiveTo == null || !date.isAfter(effectiveTo));
    }
}
