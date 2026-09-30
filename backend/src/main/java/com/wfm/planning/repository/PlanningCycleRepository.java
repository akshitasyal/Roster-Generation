package com.wfm.planning.repository;

import com.wfm.planning.entity.PlanningCycle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlanningCycleRepository extends JpaRepository<PlanningCycle, Long> {

    List<PlanningCycle> findByProjectIdOrderByStartDateDesc(Long projectId);
    Page<PlanningCycle> findByProjectId(Long projectId, Pageable pageable);

    Optional<PlanningCycle> findByProjectIdAndStatus(Long projectId, String status);

    List<PlanningCycle> findByStatus(String status);

    /**
     * Find planning cycles whose preference window is currently open.
     */
    @Query("""
        SELECT pc FROM PlanningCycle pc
        WHERE pc.status = 'PREFERENCE_OPEN'
          AND pc.preferenceOpenAt <= :now
          AND pc.preferenceLockAt > :now
        """)
    List<PlanningCycle> findOpenPreferenceCycles(
            @Param("now") java.time.Instant now);

    /**
     * Find active cycle for a project on a given date.
     */
    @Query("""
        SELECT pc FROM PlanningCycle pc
        WHERE pc.project.id = :projectId
          AND pc.startDate <= :date
          AND pc.endDate >= :date
          AND pc.status NOT IN ('CLOSED', 'DRAFT')
        """)
    Optional<PlanningCycle> findActiveCycleForProjectOnDate(
            @Param("projectId") Long projectId,
            @Param("date") LocalDate date);
}
