package com.wfm.roster.service;

import com.wfm.optimization.RosterSolution;
import com.wfm.planning.entity.PlanningCycle;
import com.wfm.planning.repository.PlanningCycleRepository;
import com.wfm.roster.entity.RosterAssignment;
import com.wfm.roster.entity.RosterException;
import com.wfm.roster.entity.RosterVersion;
import com.wfm.roster.repository.RosterAssignmentRepository;
import com.wfm.roster.repository.RosterExceptionRepository;
import com.wfm.roster.repository.RosterVersionRepository;
import com.wfm.employee.repository.EmployeeRepository;
import com.wfm.shift.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class RosterPersistenceService {

    private final RosterVersionRepository versionRepo;
    private final RosterAssignmentRepository assignmentRepo;
    private final RosterExceptionRepository exceptionRepo;
    private final PlanningCycleRepository cycleRepo;
    private final EmployeeRepository employeeRepo;
    private final ShiftRepository shiftRepo;

    @Transactional
    public void persistSolution(Long cycleId, RosterSolution solution, String versionMetadata) {
        log.info("Persisting roster solution for cycle: {}", cycleId);
        
        PlanningCycle cycle = cycleRepo.findById(cycleId).orElseThrow();
        
        // 1. Create new draft version
        int nextVersion = versionRepo.findByPlanningCycleId(cycleId).size() + 1;
        RosterVersion newVersion = RosterVersion.builder()
                .planningCycle(cycle)
                .versionNotes(versionMetadata)
                .versionNumber(nextVersion)
                .status("DRAFT")
                .build();
        versionRepo.save(newVersion);

        // 2. Persist assignments
        List<RosterAssignment> assignments = new ArrayList<>();
        if (solution.getAssignments() != null) {
            for (Map.Entry<Long, Map<LocalDate, RosterSolution.AssignmentResult>> empEntry : solution.getAssignments().entrySet()) {
                Long empId = empEntry.getKey();
                var empOpt = employeeRepo.findById(empId);
                if (empOpt.isEmpty()) continue;
                
                for (Map.Entry<LocalDate, RosterSolution.AssignmentResult> dateEntry : empEntry.getValue().entrySet()) {
                    RosterSolution.AssignmentResult res = dateEntry.getValue();
                    
                    RosterAssignment.RosterAssignmentBuilder ab = RosterAssignment.builder()
                            .rosterVersion(newVersion)
                            .employee(empOpt.get())
                            .date(res.getDate())
                            .assignmentType(res.getAssignmentType())
                            .status("DRAFT")
                            .source("SYSTEM");
                            
                    if (res.getShiftId() != null) {
                        shiftRepo.findById(res.getShiftId()).ifPresent(ab::shift);
                    }
                    assignments.add(ab.build());
                }
            }
        }
        assignmentRepo.saveAll(assignments);
        log.info("Persisted {} assignments", assignments.size());

        // 3. Persist Coverage Shortages as STAFFING_SHORTAGE exceptions
        List<RosterException> exceptions = new ArrayList<>();
        if (solution.getCoverageResults() != null) {
            for (RosterSolution.CoverageResult cr : solution.getCoverageResults()) {
                if ("SHORTAGE".equals(cr.getCoverageStatus()) && cr.getGap() > 0) {
                    exceptions.add(RosterException.builder()
                            .rosterVersion(newVersion)
                            .planningCycle(cycle)
                            .exceptionType("STAFFING_SHORTAGE")
                            .severity("HIGH")
                            .date(cr.getDate())
                            .description(String.format("Demand gap of %d for skill %d", cr.getGap(), cr.getSkillId()))
                            .build());
                }
            }
        }
        if (!exceptions.isEmpty()) {
            exceptionRepo.saveAll(exceptions);
            log.warn("Persisted {} staffing shortage exceptions", exceptions.size());
        }
    }
}
