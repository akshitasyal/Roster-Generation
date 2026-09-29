package com.wfm.roster.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import com.wfm.planning.entity.PlanningCycle;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Roster version entity.
 * Every generation creates a new version. Never overwrite.
 *
 * Version flow:
 *   DRAFT (V1) -> WFM_ADJUSTED (V2) -> PUBLISHED (V3+)
 *
 * parent_version_id tracks lineage.
 * Published versions are IMMUTABLE - changes go to roster_adjustments.
 */
@Entity
@Table(name = "roster_versions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RosterVersion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planning_cycle_id", nullable = false)
    private PlanningCycle planningCycle;

    @Column(name = "version_number", nullable = false)
    private Integer versionNumber;

    @Column(name = "version_type", nullable = false, length = 30)
    @Builder.Default
    private String versionType = "DRAFT";
    // DRAFT | WFM_ADJUSTED | APPROVED | PUBLISHED

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "ACTIVE";
    // ACTIVE | SUPERSEDED | ARCHIVED | PUBLISHED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_version_id")
    private RosterVersion parentVersion;
    // Track version lineage

    @Column(name = "scope", nullable = false, length = 50)
    @Builder.Default
    private String scope = "FULL_WEEK";
    // FULL_WEEK | SINGLE_DAY | SPECIFIC_SHIFT | SPECIFIC_TEAM | SPECIFIC_TL | STAFFING_GAP | REPLACEMENT

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generated_by")
    private Employee generatedBy;

    @Column(name = "generated_at")
    private Instant generatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private Employee approvedBy;

    @Column(name = "approved_at")
    private Instant approvedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "published_by")
    private Employee publishedBy;

    @Column(name = "published_at")
    private Instant publishedAt;

    @Column(name = "version_notes", columnDefinition = "TEXT")
    private String versionNotes;

    /**
     * Returns true if this version is published (immutable).
     */
    public boolean isPublished() {
        return "PUBLISHED".equals(status) || "PUBLISHED".equals(versionType);
    }

    /**
     * Returns true if this version can be modified.
     */
    public boolean isMutable() {
        return !isPublished();
    }
}
