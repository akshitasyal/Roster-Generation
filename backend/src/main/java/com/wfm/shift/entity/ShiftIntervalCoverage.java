package com.wfm.shift.entity;

import com.wfm.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Table(name = "shift_interval_coverage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftIntervalCoverage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id", nullable = false)
    private Shift shift;

    @Column(name = "interval_start", nullable = false)
    private LocalTime intervalStart;

    @Column(name = "interval_end", nullable = false)
    private LocalTime intervalEnd;

    @Column(name = "coverage_factor", nullable = false)
    @Builder.Default
    private BigDecimal coverageFactor = BigDecimal.ONE;

    @Column(name = "effective_from", nullable = false)
    private java.time.LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private java.time.LocalDate effectiveTo;
}
