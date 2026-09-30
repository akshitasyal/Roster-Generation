package com.wfm.security.entity;

import com.wfm.employee.entity.Employee;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

/**
 * WfmUser: Decoupled authentication entity.
 *
 * Separates authentication credentials from the Employee profile.
 * One user per employee (1:1 via employee_id, nullable for system/admin users).
 *
 * Named WfmUser to avoid clash with Spring Security's User class.
 *
 * Auth flow: WfmUserDetailsService loads WfmUser by username, then
 * wraps employee reference in WfmUserPrincipal for role-based authz.
 */
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WfmUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", unique = true)
    private Employee employee;
    // NULL for system/admin users without an employee record

    @Column(name = "username", nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE";
    // ACTIVE | INACTIVE | LOCKED

    @Column(name = "failed_attempts", nullable = false)
    @Builder.Default
    private Integer failedAttempts = 0;

    @Column(name = "last_login")
    private Instant lastLogin;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // -------------------------------------------------------------------------
    // Convenience helpers
    // -------------------------------------------------------------------------

    public boolean isActive() {
        return "ACTIVE".equals(status);
    }

    public boolean isLocked() {
        return "LOCKED".equals(status);
    }

    /** Returns the linked employee ID, or null for system users. */
    public Long getEmployeeId() {
        return employee != null ? employee.getId() : null;
    }
}
