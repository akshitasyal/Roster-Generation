package com.wfm.security;

import com.wfm.employee.entity.Employee;
import com.wfm.security.entity.WfmAuthRule;
import com.wfm.security.repository.WfmAuthRuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Stateless service that derives the portal role code from the employee's
 * authoritative data (designation + skill).
 *
 * <p>IMPORTANT: Role is NEVER taken from the frontend, JWT claims, or any
 * user-submitted value. It is always re-derived here from the employee
 * master record.</p>
 *
 * Portal role codes (match @PreAuthorize annotations throughout the codebase):
 * <ul>
 *   <li>WFM            – WFM portal access</li>
 *   <li>SENIOR_MANAGER – Senior manager portal</li>
 *   <li>MANAGER        – Manager portal</li>
 *   <li>AM             – Associate Manager portal</li>
 *   <li>TL             – Team Leader portal</li>
 *   <li>ASSOCIATE      – Associate portal (default)</li>
 * </ul>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PortalRoleResolver {

    private final WfmAuthRuleRepository wfmAuthRuleRepository;

    /**
     * Derives the portal role for the given employee.
     * WFM identification is checked first via configurable rules;
     * then falls back to direct designation mapping.
     */
    public String resolve(Employee employee) {
        if (isWfmUser(employee)) {
            return "WFM";
        }
        return mapDesignationToRole(employee.getDesignation());
    }

    /**
     * Returns true if the employee matches ANY active WFM auth rule.
     * Rules are evaluated in ascending priority order; first match wins.
     */
    public boolean isWfmUser(Employee employee) {
        List<WfmAuthRule> rules = wfmAuthRuleRepository.findByActiveTrueOrderByPriorityAsc();
        for (WfmAuthRule rule : rules) {
            if (ruleMatches(rule, employee)) {
                log.debug("Employee {} matched WFM rule '{}'", employee.getEmpId(), rule.getRuleName());
                return true;
            }
        }
        return false;
    }

    /**
     * All non-null conditions in a rule must match for the rule to apply.
     */
    private boolean ruleMatches(WfmAuthRule rule, Employee employee) {
        if (rule.getDesignationEquals() != null) {
            if (!rule.getDesignationEquals().equalsIgnoreCase(employee.getDesignation())) {
                return false;
            }
        }
        if (rule.getSkillEquals() != null) {
            if (!rule.getSkillEquals().equalsIgnoreCase(employee.getSkill())) {
                return false;
            }
        }
        return true;
    }

    /**
     * Maps the employee's designation string (from the employee master) to
     * a portal role code. Uses the exact designation values from the dataset.
     */
    private String mapDesignationToRole(String designation) {
        if (designation == null) return "ASSOCIATE";
        return switch (designation.trim()) {
            case "Senior Manager"    -> "SENIOR_MANAGER";
            case "Manager"           -> "MANAGER";
            case "Associate Manager" -> "AM";
            case "Team Leader"       -> "TL";
            case "Associate"         -> "ASSOCIATE";
            default -> {
                log.warn("Unknown designation '{}' — defaulting to ASSOCIATE", designation);
                yield "ASSOCIATE";
            }
        };
    }

    /**
     * Returns the list of permissions for a given portal role.
     * These align exactly with the permission model in the specification.
     */
    public List<String> getPermissions(String portalRole) {
        return switch (portalRole) {
            case "WFM" -> List.of(
                "ROSTER_VIEW_ALL", "ROSTER_GENERATE", "ROSTER_VALIDATE", "ROSTER_ADJUST",
                "ROSTER_LOCK", "ROSTER_APPROVE", "ROSTER_PUBLISH",
                "DEMAND_VIEW", "DEMAND_EDIT",
                "WORKFORCE_VIEW", "PREFERENCE_VIEW", "PREFERENCE_MANAGE",
                "COVERAGE_VIEW_ALL", "EXCEPTION_VIEW_ALL", "EXCEPTION_RESOLVE",
                "RULE_VIEW", "RULE_EDIT",
                "AUDIT_VIEW", "REPORT_VIEW_ALL"
            );
            case "SENIOR_MANAGER" -> List.of(
                "ROSTER_VIEW_BUSINESS", "WORKFORCE_CAPACITY_VIEW",
                "COVERAGE_VIEW_BUSINESS", "APPROVAL_REVIEW", "REPORT_VIEW_BUSINESS"
            );
            case "MANAGER" -> List.of(
                "ROSTER_VIEW_SCOPE", "COVERAGE_VIEW_SCOPE",
                "EXCEPTION_VIEW_SCOPE", "APPROVAL_REVIEW", "REPORT_VIEW_SCOPE"
            );
            case "AM" -> List.of(
                "ROSTER_VIEW_SCOPE", "COVERAGE_VIEW_SCOPE",
                "EXCEPTION_VIEW_SCOPE", "APPROVAL_REVIEW", "REPORT_VIEW_SCOPE"
            );
            case "TL" -> List.of(
                "ROSTER_VIEW_SELF", "ROSTER_VIEW_TEAM",
                "PREFERENCE_SUBMIT", "PREFERENCE_REVIEW_TEAM",
                "LEAVE_VIEW_TEAM", "LEAVE_REVIEW_TEAM", "TEAM_ISSUES_VIEW"
            );
            default -> List.of( // ASSOCIATE
                "ROSTER_VIEW_SELF", "PREFERENCE_SUBMIT",
                "LEAVE_VIEW_SELF", "LEAVE_REQUEST",
                "NOTIFICATION_VIEW", "PROFILE_VIEW_SELF"
            );
        };
    }
}
