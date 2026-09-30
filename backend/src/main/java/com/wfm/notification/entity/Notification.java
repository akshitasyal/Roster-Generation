package com.wfm.notification.entity;

import com.wfm.common.entity.BaseEntity;
import com.wfm.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * In-app notification for all users.
 */
@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_employee_id", nullable = false)
    private Employee recipient;

    @Column(name = "notification_type", nullable = false, length = 50)
    private String notificationType;
    // ROSTER_PUBLISHED | LEAVE_STATUS | PREFERENCE_LOCKED | REPLACEMENT_NEEDED
    // STAFFING_SHORTAGE | ROSTER_ADJUSTED | APPROVAL_REQUIRED | GENERAL

    @Column(name = "title", nullable = false, length = 300)
    private String title;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "reference_type", length = 50)
    private String referenceType;
    // PLANNING_CYCLE | ROSTER_VERSION | LEAVE | ROSTER_ASSIGNMENT | EXCEPTION

    @Column(name = "reference_id", length = 100)
    private String referenceId;

    @Column(name = "priority", nullable = false, length = 20)
    @Builder.Default
    private String priority = "NORMAL";
    // LOW | NORMAL | HIGH | URGENT

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "read_at")
    private Instant readAt;

    @Column(name = "expires_at")
    private Instant expiresAt;
}
