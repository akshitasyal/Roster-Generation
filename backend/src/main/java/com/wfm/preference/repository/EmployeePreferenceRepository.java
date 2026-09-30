package com.wfm.preference.repository;

import com.wfm.preference.entity.EmployeePreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeePreferenceRepository extends JpaRepository<EmployeePreference, Long> {

    List<EmployeePreference> findByEmployeeIdAndPlanningCycleId(Long employeeId, Long cycleId);

    List<EmployeePreference> findByPlanningCycleIdOrderByPreferenceRank(Long cycleId);

    /**
     * Find active (non-declined) preferences for employees in a planning cycle.
     */
    @Query("""
        SELECT ep FROM EmployeePreference ep
        WHERE ep.planningCycle.id = :cycleId
          AND ep.employee.id IN :employeeIds
          AND ep.tlDeclined = false
        ORDER BY ep.employee.id, ep.preferenceRank
        """)
    List<EmployeePreference> findActivePreferencesForEmployees(
            @Param("cycleId") Long cycleId,
            @Param("employeeIds") List<Long> employeeIds);

    /**
     * Find preferences awaiting TL review (submitted, not yet declined, cycle in review window).
     */
    @Query("""
        SELECT ep FROM EmployeePreference ep
        WHERE ep.planningCycle.id = :cycleId
          AND ep.employee.id IN :teamEmployeeIds
          AND ep.tlDeclined = false
        """)
    List<EmployeePreference> findPreferencesForTLReview(
            @Param("cycleId") Long cycleId,
            @Param("teamEmployeeIds") List<Long> teamEmployeeIds);
}
