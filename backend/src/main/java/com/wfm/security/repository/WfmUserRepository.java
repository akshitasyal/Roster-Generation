package com.wfm.security.repository;

import com.wfm.security.entity.WfmUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for WfmUser authentication entity.
 * Used by WfmUserDetailsService and auth endpoints.
 */
@Repository
public interface WfmUserRepository extends JpaRepository<WfmUser, Long> {

    Optional<WfmUser> findByUsername(String username);

    @Query("SELECT u FROM WfmUser u WHERE u.employee.id = :employeeId")
    Optional<WfmUser> findByEmployeeId(Long employeeId);

    boolean existsByUsername(String username);

    /** Lookup by the employee's email — backward-compatible with existing auth flow. */
    @Query("SELECT u FROM WfmUser u WHERE u.employee.email = :email")
    Optional<WfmUser> findByEmployeeEmail(String email);
}
