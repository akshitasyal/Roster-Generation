package com.wfm.organization.repository;

import com.wfm.organization.entity.EmployeeOrgAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeOrgAssignmentRepository extends JpaRepository<EmployeeOrgAssignment, Long> {

    /**
     * Find the currently active primary org assignment for an employee.
     */
    @Query("""
        SELECT a FROM EmployeeOrgAssignment a
        WHERE a.employee.id = :employeeId
          AND a.isPrimary = true
          AND a.effectiveFrom <= :date
          AND (a.effectiveTo IS NULL OR a.effectiveTo >= :date)
        ORDER BY a.effectiveFrom DESC
        """)
    Optional<EmployeeOrgAssignment> findCurrentAssignment(
            @Param("employeeId") Long employeeId,
            @Param("date") LocalDate date);

    /**
     * Find all currently active employees under a TL (direct reports).
     */
    @Query("""
        SELECT a FROM EmployeeOrgAssignment a
        WHERE a.reportsTo.id = :tlId
          AND a.isPrimary = true
          AND a.effectiveFrom <= :date
          AND (a.effectiveTo IS NULL OR a.effectiveTo >= :date)
        """)
    List<EmployeeOrgAssignment> findDirectReports(
            @Param("tlId") Long tlId,
            @Param("date") LocalDate date);

    /**
     * Find all employees in a team on a given date.
     */
    @Query("""
        SELECT a FROM EmployeeOrgAssignment a
        WHERE a.team.id = :teamId
          AND a.isPrimary = true
          AND a.effectiveFrom <= :date
          AND (a.effectiveTo IS NULL OR a.effectiveTo >= :date)
        """)
    List<EmployeeOrgAssignment> findTeamMembers(
            @Param("teamId") Long teamId,
            @Param("date") LocalDate date);

    /**
     * Find all employees in a project on a given date.
     */
    @Query("""
        SELECT a FROM EmployeeOrgAssignment a
        WHERE a.project.id = :projectId
          AND a.isPrimary = true
          AND a.effectiveFrom <= :date
          AND (a.effectiveTo IS NULL OR a.effectiveTo >= :date)
        """)
    List<EmployeeOrgAssignment> findProjectMembers(
            @Param("projectId") Long projectId,
            @Param("date") LocalDate date);

    /**
     * Find TLs who report to a given AM on a given date.
     */
    @Query("""
        SELECT a FROM EmployeeOrgAssignment a
        WHERE a.reportsTo.id = :amId
          AND a.employee.role.code = 'TL'
          AND a.isPrimary = true
          AND a.effectiveFrom <= :date
          AND (a.effectiveTo IS NULL OR a.effectiveTo >= :date)
        """)
    List<EmployeeOrgAssignment> findTLsUnderAM(
            @Param("amId") Long amId,
            @Param("date") LocalDate date);
}
