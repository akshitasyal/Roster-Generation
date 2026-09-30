package com.wfm.config.service;

import com.wfm.config.entity.WorkingHoursPolicy;
import com.wfm.config.repository.WorkingHoursPolicyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * WorkingHoursPolicyService: Resolves working hours configuration per project and date.
 *
 * Lookup priority:
 *   1. Project-specific policy effective on the planning date
 *   2. Global policy (project_id IS NULL) effective on the date
 *   3. If both absent: throws ConfigurationException (never silently defaults)
 *
 * ENGINEERING RULE: The optimizer and ValidationService MUST call this service.
 * Never hard-code 8h, 9h, or any hour value in Java business logic.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkingHoursPolicyService {

    private final WorkingHoursPolicyRepository repository;

    /**
     * Returns the active WorkingHoursPolicy for the given project and date.
     * Project-specific overrides global.
     *
     * @param projectId  ID of the project (may be null for global lookup only)
     * @param planningDate date within the planning horizon
     * @return active WorkingHoursPolicy (never null)
     * @throws IllegalStateException if no policy found (misconfiguration)
     */
    public WorkingHoursPolicy getActivePolicy(Long projectId, LocalDate planningDate) {
        if (projectId != null) {
            var projectPolicy = repository.findActiveByProjectId(projectId, planningDate);
            if (projectPolicy.isPresent()) {
                log.debug("Using project-specific working hours policy for project={} date={}",
                          projectId, planningDate);
                return projectPolicy.get();
            }
        }

        return repository.findActiveGlobal(planningDate)
                .orElseThrow(() -> new IllegalStateException(
                        "No working_hours_policy found for projectId=" + projectId
                        + " date=" + planningDate
                        + ". Please seed a global policy in working_hours_policies."));
    }

    /**
     * Convenience: returns the maximum shift hours for H4 validation.
     */
    public double getMaximumHours(Long projectId, LocalDate date) {
        return getActivePolicy(projectId, date).getMaximumHoursAsDouble();
    }

    /**
     * Convenience: returns the regular hours baseline for S4 overtime calculation.
     */
    public double getRegularHours(Long projectId, LocalDate date) {
        return getActivePolicy(projectId, date).getRegularHoursAsDouble();
    }
}
