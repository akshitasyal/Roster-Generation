package com.wfm.planning.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import com.wfm.project.entity.Project;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

/**
 * Weekly planning cycle entity.
 * Typical cycle: Monday-Sunday or configured 7-day period.
 *
 * Status flow:
 * DRAFT -> PREFERENCE_OPEN -> PREFERENCE_LOCKED -> GENERATING ->
 * GENERATED -> VALIDATED -> APPROVED -> PUBLISHED -> CLOSED
 *
 * Preference window and TL review deadlines are configurable per cycle.
 */
@Entity
@Table(name = "planning_cycles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanningCycle extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "cycle_name", nullable = false, length = 200)
    private String cycleName;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "DRAFT";
    // DRAFT | PREFERENCE_OPEN | PREFERENCE_LOCKED | GENERATING | GENERATED
    // | VALIDATED | APPROVED | PUBLISHED | CLOSED

    @Column(name = "preference_open_at")
    private Instant preferenceOpenAt;

    @Column(name = "preference_lock_at")
    private Instant preferenceLockAt;

    @Column(name = "tl_review_open_at")
    private Instant tlReviewOpenAt;

    @Column(name = "tl_review_close_at")
    private Instant tlReviewCloseAt;

    @Column(name = "generation_started_at")
    private Instant generationStartedAt;

    @Column(name = "generation_completed_at")
    private Instant generationCompletedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Employee createdBy;

    /**
     * Returns true if preferences can still be submitted.
     */
    public boolean isPreferenceOpen() {
        return "PREFERENCE_OPEN".equals(status);
    }

    /**
     * Returns true if this cycle can be generated.
     */
    public boolean isReadyForGeneration() {
        return "PREFERENCE_LOCKED".equals(status) || "GENERATED".equals(status);
    }

    /**
     * Returns true if the cycle has been published.
     */
    public boolean isPublished() {
        return "PUBLISHED".equals(status);
    }
}
