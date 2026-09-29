package com.wfm.roster.entity;

import com.wfm.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

/**
 * Roster assignment lock.
 * WFM can lock individual assignments.
 * Locked assignments are skipped by optimizer.
 */
@Entity
@Table(name = "roster_locks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class RosterLock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roster_assignment_id", nullable = false)
    private RosterAssignment rosterAssignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "locked_by", nullable = false)
    private Employee lockedBy;

    @CreatedDate
    @Column(name = "locked_at", nullable = false, updatable = false)
    private Instant lockedAt;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;
}
