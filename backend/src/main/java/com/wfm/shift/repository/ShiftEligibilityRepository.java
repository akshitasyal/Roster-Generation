package com.wfm.shift.repository;

import com.wfm.shift.entity.ShiftEligibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShiftEligibilityRepository extends JpaRepository<ShiftEligibility, Long> {

    /**
     * Find all eligible shifts for an employee on a given date.
     * Filters by effective date range and is_eligible=true.
     */
    @Query("""
        SELECT se FROM ShiftEligibility se
        WHERE se.employee.id = :employeeId
          AND se.isEligible = true
          AND se.effectiveFrom <= :date
          AND (se.effectiveTo IS NULL OR se.effectiveTo >= :date)
        """)
    List<ShiftEligibility> findEligibleShiftsForEmployee(
            @Param("employeeId") Long employeeId,
            @Param("date") LocalDate date);

    /**
     * Check if an employee is eligible for a specific shift on a given date.
     */
    @Query("""
        SELECT COUNT(se) > 0 FROM ShiftEligibility se
        WHERE se.employee.id = :employeeId
          AND se.shift.id = :shiftId
          AND se.isEligible = true
          AND se.effectiveFrom <= :date
          AND (se.effectiveTo IS NULL OR se.effectiveTo >= :date)
        """)
    boolean isEmployeeEligibleForShift(
            @Param("employeeId") Long employeeId,
            @Param("shiftId") Long shiftId,
            @Param("date") LocalDate date);

    /**
     * Find all employees eligible for a given shift on a date.
     * Used by optimizer to build candidate sets.
     */
    @Query("""
        SELECT se FROM ShiftEligibility se
        WHERE se.shift.id = :shiftId
          AND se.isEligible = true
          AND se.effectiveFrom <= :date
          AND (se.effectiveTo IS NULL OR se.effectiveTo >= :date)
        """)
    List<ShiftEligibility> findEligibleEmployeesForShift(
            @Param("shiftId") Long shiftId,
            @Param("date") LocalDate date);

    /**
     * Find eligibility for a list of employees for a list of shifts.
     * Bulk query for optimizer model building.
     */
    @Query("""
        SELECT se FROM ShiftEligibility se
        WHERE se.employee.id IN :employeeIds
          AND se.isEligible = true
          AND se.effectiveFrom <= :date
          AND (se.effectiveTo IS NULL OR se.effectiveTo >= :date)
        """)
    List<ShiftEligibility> findEligibilityForEmployees(
            @Param("employeeIds") List<Long> employeeIds,
            @Param("date") LocalDate date);
}
