package com.wfm.optimization;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Output of the optimizer - the roster solution.
 * Contains all assignments and metrics for the planning cycle.
 * The SolutionMapper converts this into RosterAssignment entities.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RosterSolution {

    private SolverStatus solverStatus;
    private double objectiveValue;
    private long executionTimeMs;

    // Core assignments: employeeId -> date -> AssignmentResult
    private Map<Long, Map<LocalDate, AssignmentResult>> assignments;

    // Coverage results
    private List<CoverageResult> coverageResults;

    // Soft constraint metrics
    private SoftConstraintMetrics metrics;

    // Hard violations (should be 0 in a valid solution)
    private List<String> hardViolations;

    public enum SolverStatus {
        OPTIMAL,
        FEASIBLE,
        INFEASIBLE,
        UNKNOWN,
        TIMEOUT
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignmentResult {
        private Long employeeId;
        private LocalDate date;
        private Long shiftId;             // null if OFF/LEAVE/UNAVAILABLE
        private String assignmentType;    // SHIFT | OFF | LEAVE | UNAVAILABLE
        private boolean satisfiedPreference;
        private boolean satisfiedWeeklyOff;
        private String source;            // SYSTEM | LOCKED (preserved from input)
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CoverageResult {
        private LocalDate date;
        private Long shiftId;
        private Long skillId;
        private Long roleId;
        private int requiredHeadcount;
        private int assignedHeadcount;
        private int gap;
        private int excess;
        private String coverageStatus;    // COVERED | SHORTAGE | EXCESS | NO_DEMAND
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SoftConstraintMetrics {
        private double morningPreferenceSatisfactionPct;
        private double weeklyOffPreferenceSatisfactionPct;
        private double weekendFairnessPct;
        private int overtimeEmployeeCount;
        private int shiftChangeCount;
        private double workloadBalancePct;
        private double preferredShiftRetentionPct;
        private int nightShiftConcentrationViolations;
        private int totalCoverageGap;
        private int managementCoverageGap;
        private int hardViolationCount;
    }
}
