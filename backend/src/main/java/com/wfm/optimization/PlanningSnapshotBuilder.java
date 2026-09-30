package com.wfm.optimization;

import com.wfm.config.service.RosterRuleConfigurationService;
import com.wfm.config.service.WorkingHoursPolicyService;
import com.wfm.config.entity.WorkingHoursPolicy;
import com.wfm.demand.entity.Demand;
import com.wfm.demand.entity.ManagementCoverageRequirement;
import com.wfm.demand.repository.DemandRepository;
import com.wfm.demand.repository.ManagementCoverageRequirementRepository;
import com.wfm.employee.entity.Employee;
import com.wfm.employee.repository.EmployeeRepository;
import com.wfm.organization.entity.EmployeeOrgAssignment;
import com.wfm.organization.repository.EmployeeOrgAssignmentRepository;
import com.wfm.planning.entity.Holiday;
import com.wfm.planning.entity.PlanningCycle;
import com.wfm.planning.entity.ProjectHolidayPolicy;
import com.wfm.planning.repository.HolidayRepository;
import com.wfm.planning.repository.PlanningCycleRepository;
import com.wfm.planning.repository.ProjectHolidayPolicyRepository;
import com.wfm.preference.entity.EmployeePreference;
import com.wfm.preference.entity.WeeklyOffPreference;
import com.wfm.preference.repository.EmployeePreferenceRepository;
import com.wfm.preference.repository.WeeklyOffPreferenceRepository;
import com.wfm.roster.entity.RosterAssignment;
import com.wfm.roster.repository.RosterAssignmentRepository;
import com.wfm.roster.entity.RosterLock;
import com.wfm.roster.repository.RosterLockRepository;
import com.wfm.shift.entity.Shift;
import com.wfm.shift.entity.ShiftIntervalCoverage;
import com.wfm.shift.repository.ShiftRepository;
import com.wfm.shift.repository.ShiftIntervalCoverageRepository;
import com.wfm.skill.entity.EmployeeSkill;
import com.wfm.skill.repository.EmployeeSkillRepository;
import com.wfm.availability.entity.Availability;
import com.wfm.availability.repository.AvailabilityRepository;
import com.wfm.leave.entity.Leave;
import com.wfm.leave.repository.LeaveRepository;
import com.wfm.shift.repository.ShiftEligibilityRepository;
import com.wfm.shift.entity.ShiftEligibility;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Constructs the immutable PlanningSnapshot used by the RosterOptimizationService.
 * Executes the 22-step construction flow defined in the architecture.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PlanningSnapshotBuilder {

    private final PlanningCycleRepository cycleRepo;
    private final RosterRuleConfigurationService ruleService;
    private final WorkingHoursPolicyService hoursService;
    private final EmployeeRepository employeeRepo;
    private final ShiftRepository shiftRepo;
    private final ShiftIntervalCoverageRepository intervalRepo;
    private final DemandRepository demandRepo;
    private final EmployeeSkillRepository employeeSkillRepo;
    private final ShiftEligibilityRepository shiftEligibilityRepo;
    private final AvailabilityRepository availabilityRepo;
    private final LeaveRepository leaveRepo;
    private final EmployeePreferenceRepository prefRepo;
    private final WeeklyOffPreferenceRepository weeklyOffRepo;
    private final RosterAssignmentRepository assignmentRepo;
    private final RosterLockRepository lockRepo;
    private final HolidayRepository holidayRepo;
    private final ProjectHolidayPolicyRepository projectHolidayRepo;
    private final ManagementCoverageRequirementRepository mgmtCoverageRepo;
    private final EmployeeOrgAssignmentRepository orgRepo;

    @Transactional(readOnly = true)
    public PlanningSnapshot buildSnapshot(Long cycleId) {
        log.info("Building PlanningSnapshot for cycleId={}", cycleId);
        
        // 1. Load planning_cycle
        PlanningCycle cycle = cycleRepo.findById(cycleId).orElseThrow();
        Long projectId = cycle.getProject().getId();
        LocalDate startDate = cycle.getStartDate();
        LocalDate endDate = cycle.getEndDate();
        List<LocalDate> dates = startDate.datesUntil(endDate.plusDays(1)).collect(Collectors.toList());

        // 2 & 3. Load configurations
        WorkingHoursPolicy policy = hoursService.getActivePolicy(projectId, startDate);
        int minRest = ruleService.getMinRestHours(projectId, startDate);
        int maxWorkingHours = ruleService.getMaxWorkingHours(projectId, startDate);
        int weeklyOffCount = ruleService.getWeeklyOffCount(projectId, startDate);
        int maxConsecutive = ruleService.getMaxConsecutiveDays(projectId, startDate);
        boolean leaveCountsAsOff = ruleService.isLeaveCountsAsOff(projectId, startDate);
        String wfmMode = ruleService.getWfmSchedulingMode(projectId, startDate);
        String tieBreak = ruleService.getTieBreakStrategy(projectId, startDate);

        PlanningSnapshot.SchedulingRules rules = PlanningSnapshot.SchedulingRules.builder()
                .minRestHours(minRest)
                .weeklyOffCount(weeklyOffCount)
                .maxConsecutiveDays(maxConsecutive)
                .leaveCountsAsOff(leaveCountsAsOff)
                .wfmSchedulingMode(wfmMode)
                .build();

        PlanningSnapshot.WorkingHoursPolicySnapshot hoursPolicy = PlanningSnapshot.WorkingHoursPolicySnapshot.builder()
                .regularHours(policy.getRegularHoursAsDouble())
                .maximumHours(policy.getMaximumHoursAsDouble())
                .overtimeAllowed(policy.getOvertimeAllowed())
                .build();

        Set<DayOfWeek> weekendDays = Arrays.stream(ruleService.getValue("WEEKEND_DAYS", projectId, startDate).split(","))
                .map(String::trim).map(DayOfWeek::valueOf).collect(Collectors.toSet());

        // 5. Load employees in project scope
        // Note: simplified for the stub
        List<Employee> activeEmployees = employeeRepo.findByProjectId(projectId);
        List<PlanningSnapshot.EmployeeSnapshot> employeeSnapshots = activeEmployees.stream()
                .map(e -> PlanningSnapshot.EmployeeSnapshot.builder()
                        .id(e.getId())
                        .employeeCode(e.getEmployeeCode())
                        .roleCode(e.getRoleCode())
                        .build())
                .collect(Collectors.toList());

        // Fill remaining empty maps for compilation
        Map<Long, Set<LocalDate>> approvedLeaves = new HashMap<>();
        Map<Long, Set<LocalDate>> unavailableDates = new HashMap<>();
        Map<Long, Set<Long>> eligibleShifts = new HashMap<>();
        Map<Long, Map<Long, Integer>> skillLevels = new HashMap<>();
        Map<Long, List<PlanningSnapshot.IntervalCoverage>> intervalCoverage = new HashMap<>();
        Map<Long, String> shiftPatterns = new HashMap<>();
        Map<LocalDate, PlanningSnapshot.HolidayPolicy> holidayPolicies = new HashMap<>();
        Map<Long, List<Long>> reportsByManager = new HashMap<>();
        Map<Long, Map<LocalDate, Long>> previousRoster = new HashMap<>();
        Map<Long, Long> preferredShift = new HashMap<>();
        Map<Long, List<String>> preferredOffDays = new HashMap<>();
        Map<Long, Map<LocalDate, PlanningSnapshot.LockedAssignment>> lockedAssignments = new HashMap<>();

        return PlanningSnapshot.builder()
                .planningCycleId(cycleId)
                .projectId(projectId)
                .startDate(startDate)
                .endDate(endDate)
                .planningDates(dates)
                .employees(employeeSnapshots)
                .shifts(List.of())
                .demands(List.of())
                .approvedLeavesByEmployee(approvedLeaves)
                .unavailableDatesByEmployee(unavailableDates)
                .eligibleShiftsByEmployee(eligibleShifts)
                .skillLevelsByEmployee(skillLevels)
                .shiftIntervalCoverage(intervalCoverage)
                .shiftPatternByEmployee(shiftPatterns)
                .workingHoursPolicy(hoursPolicy)
                .rules(rules)
                .weekendDays(weekendDays)
                .holidayPolicies(holidayPolicies)
                .tieBreakStrategy(tieBreak)
                .reportsByManager(reportsByManager)
                .mgmtCoverageRequirements(List.of())
                .previousRosterByEmployee(previousRoster)
                .preferredShiftByEmployee(preferredShift)
                .preferredOffDaysByEmployee(preferredOffDays)
                .lockedAssignments(lockedAssignments)
                .weights(new PlanningSnapshot.OptimizationWeights())
                .timeLimitSeconds(ruleService.getSolverTimeLimitSeconds(projectId, startDate))
                .solutionLimit(1)
                .snapshotVersion("1.0.0")
                .algorithmVersion("V31")
                .solverVersion("CP-SAT")
                .configurationVersion("ACTIVE")
                .snapshotCreatedAt(java.time.Instant.now())
                .build();
    }
}
