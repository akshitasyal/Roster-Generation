package com.wfm.roster.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Multi-level approval workflow for roster versions.
 * Levels: TL_REVIEW | AM_REVIEW | MANAGER_REVIEW | SENIOR_MANAGER_REVIEW | WFM_APPROVAL
 * WFM is the final approval authority.
 */
@Entity
@Table(name = "approvals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Approval extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roster_version_id", nullable = false)
    private RosterVersion rosterVersion;

    @Column(name = "approval_level", nullable = false, length = 50)
    private String approvalLevel;
    // TL_REVIEW | AM_REVIEW | MANAGER_REVIEW | SENIOR_MANAGER_REVIEW | WFM_APPROVAL

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_employee_id", nullable = false)
    private Employee approver;

    @Column(name = "status", nullable = false, length = 30)
    @Builder.Default
    private String status = "PENDING";
    // PENDING | APPROVED | REJECTED | SKIPPED

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @Column(name = "approved_at")
    private Instant approvedAt;
}
