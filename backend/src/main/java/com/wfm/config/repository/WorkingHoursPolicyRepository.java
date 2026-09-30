package com.wfm.config.repository;

import com.wfm.config.entity.WorkingHoursPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface WorkingHoursPolicyRepository extends JpaRepository<WorkingHoursPolicy, Long> {

    /**
     * Fetch the active project-specific policy for a given date.
     * effective_from <= date AND (effective_to IS NULL OR effective_to >= date)
     */
    @Query("""
           SELECT w FROM WorkingHoursPolicy w
           WHERE w.project.id = :projectId
             AND w.effectiveFrom <= :date
             AND (w.effectiveTo IS NULL OR w.effectiveTo >= :date)
           ORDER BY w.effectiveFrom DESC
           LIMIT 1
           """)
    Optional<WorkingHoursPolicy> findActiveByProjectId(Long projectId, LocalDate date);

    /**
     * Fetch the active global policy (project_id IS NULL) for a given date.
     */
    @Query("""
           SELECT w FROM WorkingHoursPolicy w
           WHERE w.project IS NULL
             AND w.effectiveFrom <= :date
             AND (w.effectiveTo IS NULL OR w.effectiveTo >= :date)
           ORDER BY w.effectiveFrom DESC
           LIMIT 1
           """)
    Optional<WorkingHoursPolicy> findActiveGlobal(LocalDate date);
}
