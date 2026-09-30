package com.wfm.demand.repository;

import com.wfm.demand.entity.Demand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DemandRepository extends JpaRepository<Demand, Long> {

    List<Demand> findByPlanningCycleId(Long cycleId);

    /**
     * Find all demand for a planning cycle - used by optimizer to load demand snapshot.
     */
    @Query("""
        SELECT d FROM Demand d
        LEFT JOIN FETCH d.shift
        LEFT JOIN FETCH d.skill
        LEFT JOIN FETCH d.role
        WHERE d.planningCycle.id = :cycleId
        ORDER BY d.date, d.intervalStart
        """)
    List<Demand> findDemandForCycle(@Param("cycleId") Long cycleId);

    /**
     * Find associate-level demand for a planning cycle.
     */
    @Query("""
        SELECT d FROM Demand d
        WHERE d.planningCycle.id = :cycleId
          AND d.role.code = 'ASSOCIATE'
        ORDER BY d.date, d.intervalStart
        """)
    List<Demand> findAssociateDemandForCycle(@Param("cycleId") Long cycleId);

    /**
     * Find management coverage demand for a planning cycle.
     */
    @Query("""
        SELECT d FROM Demand d
        WHERE d.planningCycle.id = :cycleId
          AND d.role.code IN ('TL', 'AM', 'MANAGER', 'SENIOR_MANAGER', 'WFM')
        ORDER BY d.date, d.role.code, d.intervalStart
        """)
    List<Demand> findManagementDemandForCycle(@Param("cycleId") Long cycleId);

    /**
     * Find demand for a specific date and shift.
     */
    @Query("""
        SELECT d FROM Demand d
        WHERE d.planningCycle.id = :cycleId
          AND d.date = :date
          AND d.shift.id = :shiftId
        """)
    List<Demand> findByDateAndShift(
            @Param("cycleId") Long cycleId,
            @Param("date") LocalDate date,
            @Param("shiftId") Long shiftId);
}
