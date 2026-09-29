package com.wfm.availability.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Employee daily availability.
 * Overrides default availability.
 * UNAVAILABLE is a hard constraint (H5) for the optimizer.
 */
@Entity
@Table(name = "availability")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Availability extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "available_from")
    private LocalTime availableFrom;
    // NULL = full day availability

    @Column(name = "available_to")
    private LocalTime availableTo;

    @Column(name = "availability_status", nullable = false, length = 30)
    @Builder.Default
    private String availabilityStatus = "AVAILABLE";
    // AVAILABLE | UNAVAILABLE | PARTIAL | RESTRICTED

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    /**
     * Returns true if this employee is available to work on this date.
     * UNAVAILABLE = hard constraint violation.
     */
    public boolean isAvailable() {
        return "AVAILABLE".equals(availabilityStatus) || "PARTIAL".equals(availabilityStatus);
    }
}
