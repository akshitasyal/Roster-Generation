package com.wfm.availability.repository;

import com.wfm.availability.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    Optional<Availability> findByEmployeeIdAndDate(Long employeeId, LocalDate date);

    /**
     * Find all availability records for a list of employees in a date range.
     * Bulk query for optimizer.
     */
    @Query("""
        SELECT a FROM Availability a
        WHERE a.employee.id IN :employeeIds
          AND a.date >= :fromDate
          AND a.date <= :toDate
        """)
    List<Availability> findForEmployeesInRange(
            @Param("employeeIds") List<Long> employeeIds,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);

    /**
     * Find UNAVAILABLE records for employees in a date range.
     * Hard constraint H5 check.
     */
    @Query("""
        SELECT a FROM Availability a
        WHERE a.employee.id IN :employeeIds
          AND a.date >= :fromDate
          AND a.date <= :toDate
          AND a.availabilityStatus = 'UNAVAILABLE'
        """)
    List<Availability> findUnavailableInRange(
            @Param("employeeIds") List<Long> employeeIds,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);
}
