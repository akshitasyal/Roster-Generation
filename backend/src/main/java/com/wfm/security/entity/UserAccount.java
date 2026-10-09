package com.wfm.security.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * Authentication account — 1:1 with an Employee record.
 * <p>
 * Stores ONLY credentials and session state.
 * Designation, LOB, skill, manager hierarchy, etc. live exclusively
 * in the employees table and are never duplicated here.
 * </p>
 *
 * Constraint: emp_id UNIQUE, email UNIQUE.
 * One employee can have at most ONE account.
 */
@Entity
@Table(name = "user_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Foreign key to employees.emp_id (organizational identity). */
    @Column(name = "emp_id", nullable = false, unique = true, length = 50)
    private String empId;

    /** Must match employees.email exactly. Stored for fast lookup on login. */
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    /**
     * Authentication status (separate from employees.status which is employment status).
     * Values: ACTIVE | LOCKED | PENDING_VERIFICATION | DISABLED
     */
    @Column(name = "account_status", nullable = false, length = 30)
    @Builder.Default
    private String accountStatus = "ACTIVE";

    @Column(name = "email_verified", nullable = false)
    @Builder.Default
    private Boolean emailVerified = true;

    @Column(name = "failed_login_attempts", nullable = false)
    @Builder.Default
    private Integer failedLoginAttempts = 0;

    @Column(name = "locked_until")
    private Instant lockedUntil;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    @Builder.Default
    private Instant updatedAt = Instant.now();
}
