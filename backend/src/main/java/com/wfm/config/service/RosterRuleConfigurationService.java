package com.wfm.config.service;

import com.wfm.roster.entity.RosterRuleConfiguration;
import com.wfm.roster.repository.RosterRuleConfigurationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * RosterRuleConfigurationService: Single access point for all scheduling rule values.
 *
 * Lookup priority:
 *   1. Project-specific rule for (key, projectId) effective on date
 *   2. Global rule (project_id IS NULL) for key effective on date
 *   3. Throws IllegalStateException if not found (missing seed data — do not silently default)
 *
 * Standard rule keys are documented in RosterRuleConfiguration.java.
 * Results are cached to avoid repeated DB hits during solver execution.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RosterRuleConfigurationService {

    private final RosterRuleConfigurationRepository repository;

    /**
     * Returns the active configuration record for a rule key.
     * Project-specific overrides global.
     */
    @Cacheable(value = "rosterRules", key = "#key + ':' + #projectId + ':' + #date")
    public RosterRuleConfiguration getActiveRule(String key, Long projectId, LocalDate date) {
        if (projectId != null) {
            var projectRule = repository.findActiveByKeyAndProject(key, projectId, date);
            if (projectRule.isPresent()) {
                log.debug("Using project-specific rule key={} project={} date={}", key, projectId, date);
                return projectRule.get();
            }
        }
        return repository.findActiveGlobal(key, date)
                .orElseThrow(() -> new IllegalStateException(
                        "No roster_rule_configuration found for key='" + key
                        + "' projectId=" + projectId + " date=" + date
                        + ". Please ensure seed data is present."));
    }

    /** Returns the rule value as a raw string. */
    public String getValue(String key, Long projectId, LocalDate date) {
        return getActiveRule(key, projectId, date).getRuleValue();
    }

    /** Returns the rule value as an integer. */
    public int getIntValue(String key, Long projectId, LocalDate date) {
        return getActiveRule(key, projectId, date).getIntValue();
    }

    /** Returns the rule value as a double. */
    public double getDoubleValue(String key, Long projectId, LocalDate date) {
        return getActiveRule(key, projectId, date).getDoubleValue();
    }

    /** Returns the rule value as a boolean. */
    public boolean getBooleanValue(String key, Long projectId, LocalDate date) {
        return getActiveRule(key, projectId, date).getBooleanValue();
    }

    // -------------------------------------------------------------------------
    // Named convenience methods for the most-used rules
    // -------------------------------------------------------------------------

    public int getMinRestHours(Long projectId, LocalDate date) {
        return getIntValue("MIN_REST_HOURS", projectId, date);
    }

    public int getMaxWorkingHours(Long projectId, LocalDate date) {
        return getIntValue("MAX_WORKING_HOURS", projectId, date);
    }

    public int getMaxConsecutiveDays(Long projectId, LocalDate date) {
        return getIntValue("MAX_CONSECUTIVE_DAYS", projectId, date);
    }

    public int getWeeklyOffCount(Long projectId, LocalDate date) {
        return getIntValue("WEEKLY_OFF_COUNT", projectId, date);
    }

    public int getSolverTimeLimitSeconds(Long projectId, LocalDate date) {
        return getIntValue("SOLVER_TIME_LIMIT_SECONDS", projectId, date);
    }

    public int getSolverNumWorkers(Long projectId, LocalDate date) {
        return getIntValue("SOLVER_NUM_WORKERS", projectId, date);
    }

    public boolean isLeaveCountsAsOff(Long projectId, LocalDate date) {
        return getBooleanValue("LEAVE_COUNTS_AS_OFF", projectId, date);
    }

    public String getWfmSchedulingMode(Long projectId, LocalDate date) {
        return getValue("WFM_SCHEDULING_MODE", projectId, date);
    }

    public String getTieBreakStrategy(Long projectId, LocalDate date) {
        return getValue("TIE_BREAK_STRATEGY", projectId, date);
    }
}
