package com.wfm.shift.entity;

import com.wfm.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;

/**
 * Shift master entity.
 * Shift timings are configurable - NEVER hard-coded.
 * is_overnight = true when shift crosses midnight (e.g. 22:00-07:00).
 * Minimum rest between shifts: 11 hours (configurable in application.yml).
 */
@Entity
@Table(name = "shifts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shift extends BaseEntity {

    @Column(name = "shift_code", nullable = false, unique = true, length = 50)
    private String shiftCode;

    @Column(name = "shift_name", nullable = false, length = 200)
    private String shiftName;

    @Column(name = "shift_type", nullable = false, length = 30)
    private String shiftType;
    // MORNING | GENERAL | EVENING | NIGHT | CUSTOM | OFF

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "duration_hours", nullable = false, precision = 5, scale = 2)
    private BigDecimal durationHours;

    @Column(name = "is_overnight", nullable = false)
    @Builder.Default
    private Boolean isOvernight = false;
    // true when shift crosses midnight

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "ACTIVE";
    // ACTIVE | INACTIVE

    /**
     * Calculates the rest gap in hours between this shift's end and the next shift's start.
     * Handles overnight shifts correctly.
     *
     * @param nextShift the next shift to check rest gap against
     * @return rest gap in hours
     */
    public double calculateRestGapHours(Shift nextShift) {
        // Convert to minutes from midnight for calculation
        int thisEndMinutes = endTime.getHour() * 60 + endTime.getMinute();
        if (Boolean.TRUE.equals(isOvernight)) {
            thisEndMinutes += 24 * 60; // Add 24 hours for overnight shifts
        }
        int nextStartMinutes = nextShift.getStartTime().getHour() * 60 + nextShift.getStartTime().getMinute();

        int gapMinutes = nextStartMinutes - thisEndMinutes;
        if (gapMinutes < 0) {
            gapMinutes += 24 * 60; // Wrap around midnight
        }
        return gapMinutes / 60.0;
    }

    /**
     * Returns true if this shift is a working shift (not OFF).
     */
    public boolean isWorkingShift() {
        return !"OFF".equals(shiftType);
    }
}
