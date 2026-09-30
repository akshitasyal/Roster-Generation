package com.wfm.preference.repository;

import com.wfm.preference.entity.WeeklyOffPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeeklyOffPreferenceRepository extends JpaRepository<WeeklyOffPreference, Long> {

    List<WeeklyOffPreference> findByEmployeeIdAndPlanningCycleId(Long employeeId, Long cycleId);

    /**
     * Find weekly-off preferences for all employees in a planning cycle.
     * Used by optimizer for soft constraint S5.
     */
    @Query("""
        SELECT wop FROM WeeklyOffPreference wop
        WHERE wop.planningCycle.id = :cycleId
          AND wop.employee.id IN :employeeIds
        ORDER BY wop.employee.id, wop.preferenceRank
        """)
    List<WeeklyOffPreference> findForEmployeesInCycle(
            @Param("cycleId") Long cycleId,
            @Param("employeeIds") List<Long> employeeIds);
}
