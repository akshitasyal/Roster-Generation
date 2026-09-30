package com.wfm.optimization;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Immutable planning snapshot passed to the optimization engine.
 *
 * This is the contract between the persistence layer and the optimizer.
 * The optimizer never reads from the database directly - it works entirely
 * from this snapshot, ensuring clean separation of concerns.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanningSnapshot {

    private Long planningCycleId;
    private Long projectId;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<LocalDate> planningDates;

    // Employees to schedule
    private List<EmployeeSnapshot> employees;

    // Available shifts
    private List<ShiftSnapshot> shifts;

    // Demand per date/interval/skill/level
    private List<DemandSnapshot> demands;

    // Hard constraint data
    private Map<Long, Set<LocalDate>> approvedLeavesByEmployee;
    private Map<Long, Set<LocalDate>> unavailableDatesByEmployee;
    private Map<Long, Set<Long>> eligibleShiftsByEmployee;
    private Map<Long, Map<Long, Integer>> skillLevelsByEmployee; // employeeId -> skillId -> levelWeight

    // V31 additions
    private Map<Long, List<IntervalCoverage>> shiftIntervalCoverage; // shiftId -> interval list
    private Map<Long, String> shiftPatternByEmployee;                // employeeId -> pattern_code
    
    // Config values
    private WorkingHoursPolicySnapshot workingHoursPolicy;
    private SchedulingRules rules;
    private Set<DayOfWeek> weekendDays;
    private Map<LocalDate, HolidayPolicy> holidayPolicies;
    private String tieBreakStrategy;

    // Management hierarchy and requirements
    private Map<Long, List<Long>> reportsByManager; // managerId -> subordinate IDs
    private List<ManagementCoverageRequirementSnapshot> mgmtCoverageRequirements;

    // Previous roster (for continuity soft constraint)
    private Map<Long, Map<LocalDate, Long>> previousRosterByEmployee; // employeeId -> date -> shiftId

    // Preferences (soft constraints)
    private Map<Long, Long> preferredShiftByEmployee;                // employeeId -> preferred shiftId
    private Map<Long, List<String>> preferredOffDaysByEmployee;      // employeeId -> preferred off days

    // Locked assignments (optimizer must not touch these)
    private Map<Long, Map<LocalDate, LockedAssignment>> lockedAssignments; // employeeId -> date -> lock

    // Optimization weights
    private OptimizationWeights weights;

    // Solver configuration
    private int timeLimitSeconds;
    private int solutionLimit;
    
    // Metadata
    private String snapshotVersion;
    private String algorithmVersion;
    private String solverVersion;
    private String configurationVersion;
    private Instant snapshotCreatedAt;

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class EmployeeSnapshot {
        private Long id;
        private String employeeCode;
        private String roleCode;
        private Long teamId;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ShiftSnapshot {
        private Long id;
        private String shiftCode;
        private String shiftType;
        private double startHour;
        private double endHour;
        private double durationHours;
        private boolean overnight;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DemandSnapshot {
        private LocalDate date;
        private String interval; // e.g. "08:00-09:00"
        private Long skillId;
        private Integer skillLevelWeight; // e.g., 2 for Intermediate
        private int requiredHeadcount;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class LockedAssignment {
        private Long rosterAssignmentId;
        private Long shiftId;
        private String assignmentType;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class OptimizationWeights {
        @Builder.Default private int coverageShortage    = 10000;
        @Builder.Default private int morningPreference   = 50;
        @Builder.Default private int weeklyOffPreference = 150;
        @Builder.Default private int nightConcentration  = 40;
        @Builder.Default private int weekendImbalance    = 60;
        @Builder.Default private int overtime            = -50;
        @Builder.Default private int shiftChange         = 30;
        @Builder.Default private int workloadImbalance   = 70;
        @Builder.Default private int preferredShiftMove  = 100;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class IntervalCoverage {
        private LocalTime start;
        private LocalTime end;
        private double factor;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class WorkingHoursPolicySnapshot {
        private double regularHours;
        private double maximumHours;
        private boolean overtimeAllowed;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SchedulingRules {
        private int minRestHours;
        private int weeklyOffCount;
        private int maxConsecutiveDays;
        private boolean leaveCountsAsOff;
        private String wfmSchedulingMode;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class HolidayPolicy {
        private String status; // CLOSED, OPERATIONAL, PARTIAL
        private boolean allowWork;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ManagementCoverageRequirementSnapshot {
        private Long roleId;
        private String roleCode;
        private Long shiftId;
        private int minRequired;
        private String dayType; // ALL, WEEKDAY, WEEKEND, HOLIDAY
    }
}
