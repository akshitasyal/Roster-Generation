package com.wfm.leave.repository;

import com.wfm.leave.entity.Leave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {

    List<Leave> findByEmployeeIdOrderByStartDateDesc(Long employeeId);

    List<Leave> findByEmployeeIdAndStatus(Long employeeId, String status);

    /**
     * Find approved leaves for an employee overlapping with any date in [from, to].
     * Used by optimizer to enforce H1 (no assignment on approved leave).
     */
    @Query("""
        SELECT l FROM Leave l
        WHERE l.employee.id = :employeeId
          AND l.status = 'APPROVED'
          AND l.startDate <= :toDate
          AND l.endDate >= :fromDate
        """)
    List<Leave> findApprovedLeaveInRange(
            @Param("employeeId") Long employeeId,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);

    /**
     * Bulk: Find approved leaves for multiple employees in a date range.
     * Critical optimizer query - called once per planning cycle load.
     */
    @Query("""
        SELECT l FROM Leave l
        WHERE l.employee.id IN :employeeIds
          AND l.status = 'APPROVED'
          AND l.startDate <= :toDate
          AND l.endDate >= :fromDate
        """)
    List<Leave> findApprovedLeavesForEmployees(
            @Param("employeeIds") List<Long> employeeIds,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);

    /**
     * Find pending leave requests that need review (for TL/AM portal).
     */
    @Query("""
        SELECT l FROM Leave l
        WHERE l.employee.id IN :employeeIds
          AND l.status = 'PENDING'
        ORDER BY l.startDate ASC
        """)
    List<Leave> findPendingLeavesForTeam(@Param("employeeIds") List<Long> employeeIds);

    /**
     * Check if an employee has approved leave on a specific date.
     */
    @Query("""
        SELECT COUNT(l) > 0 FROM Leave l
        WHERE l.employee.id = :employeeId
          AND l.status = 'APPROVED'
          AND l.startDate <= :date
          AND l.endDate >= :date
        """)
    boolean hasApprovedLeaveOn(
            @Param("employeeId") Long employeeId,
            @Param("date") LocalDate date);
}
