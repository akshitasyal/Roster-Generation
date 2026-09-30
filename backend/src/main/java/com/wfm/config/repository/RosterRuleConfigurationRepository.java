package com.wfm.config.repository;

import com.wfm.roster.entity.RosterRuleConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

/**
 * Repository for RosterRuleConfiguration.
 * Supports project-scoped lookup with global fallback.
 */
@Repository
public interface RosterRuleConfigurationRepository extends JpaRepository<RosterRuleConfiguration, Long> {

    /**
     * Fetch the most recently effective project-specific rule for a key and project.
     * effective_date <= planningDate, ordered descending (most recent first).
     */
    @Query("""
           SELECT r FROM RosterRuleConfiguration r
           WHERE r.ruleKey = :key
             AND r.project.id = :projectId
             AND r.effectiveDate <= :date
           ORDER BY r.effectiveDate DESC
           LIMIT 1
           """)
    Optional<RosterRuleConfiguration> findActiveByKeyAndProject(String key, Long projectId, LocalDate date);

    /**
     * Fetch the most recently effective global rule (project_id IS NULL) for a key.
     */
    @Query("""
           SELECT r FROM RosterRuleConfiguration r
           WHERE r.ruleKey = :key
             AND r.project IS NULL
             AND r.effectiveDate <= :date
           ORDER BY r.effectiveDate DESC
           LIMIT 1
           """)
    Optional<RosterRuleConfiguration> findActiveGlobal(String key, LocalDate date);
}
