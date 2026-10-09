package com.wfm.roster.service;
import com.wfm.roster.dto.ReplacementCandidateDTO;
import com.wfm.roster.dto.RosterAssignmentDTO;
import com.wfm.roster.entity.RosterAdjustment;
import com.wfm.roster.entity.RosterAssignment;
import com.wfm.employee.entity.Employee;
import com.wfm.employee.repository.EmployeeRepository;
import com.wfm.roster.mapper.RosterMapper;
import com.wfm.roster.repository.RosterAdjustmentRepository;
import com.wfm.roster.repository.RosterAssignmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@Slf4j
public class ReplacementServiceImpl implements ReplacementService {
    private final RosterAssignmentRepository assignmentRepo;
    private final RosterAdjustmentRepository adjustmentRepo;
    private final EmployeeRepository empRepo;
    private final RosterMapper mapper;

    @Override
    public List<ReplacementCandidateDTO> findEligibleReplacements(Long assignmentId) {
        log.info("Finding eligible replacements for assignment {}", assignmentId);
        RosterAssignment missingAssignment = assignmentRepo.findById(assignmentId).orElseThrow();
        LocalDate targetDate = missingAssignment.getDate();
        
        // This should normally do a robust query based on skills, availability, and shifts.
        // For brevity, we fetch all employees and do simple filtering in memory.
        List<Employee> allEmployees = empRepo.findAll();
        List<RosterAssignment> versionAssignments = assignmentRepo.findByRosterVersionId(missingAssignment.getRosterVersion().getId());
        
        List<ReplacementCandidateDTO> candidates = new ArrayList<>();
        
        for (Employee emp : allEmployees) {
            if (emp.getId().equals(missingAssignment.getEmployee().getId())) continue;
            
            // Check if they are already working a shift on that day
            boolean isWorking = versionAssignments.stream()
                .anyMatch(a -> a.getEmployee().getId().equals(emp.getId()) && a.getDate().equals(targetDate) && a.isWorkingShift());
                
            if (!isWorking) {
                // Should also check 11 hour rest gap with previous and next day assignments here.
                candidates.add(ReplacementCandidateDTO.builder()
                    .employeeId(emp.getId())
                    .employeeCode(emp.getEmployeeCode())
                    .firstName(emp.getName())
                    .lastName("")
                    .restGapHours(14.0) // Mock rest gap calculation
                    .build());
            }
        }
        
        return candidates;
    }

    @Override
    @Transactional
    public RosterAssignmentDTO executeReplacement(Long assignmentId, Long replacementEmployeeId, Long wfmId, String reason) {
        log.info("Executing replacement for assignment {} with employee {}", assignmentId, replacementEmployeeId);
        RosterAssignment original = assignmentRepo.findById(assignmentId).orElseThrow();
        Employee replacementEmp = empRepo.findById(replacementEmployeeId).orElseThrow();
        
        // Mark original as LEAVE / Cancelled
        original.setAssignmentType("LEAVE");
        original.setStatus("CANCELLED");
        original.setSource("MANUAL");
        
        // Create new assignment for replacement
        RosterAssignment newAssignment = RosterAssignment.builder()
            .rosterVersion(original.getRosterVersion())
            .employee(replacementEmp)
            .project(original.getProject())
            .team(original.getTeam()) // Replace with original team assignment context
            .date(original.getDate())
            .shift(original.getShift())
            .assignmentType("SHIFT")
            .status("PUBLISHED")
            .source("REPLACEMENT")
            .locked(true) // Lock the replacement
            .build();
            
        assignmentRepo.save(original);
        newAssignment = assignmentRepo.save(newAssignment);
        
        // Create adjustment record
        RosterAdjustment adjustment = RosterAdjustment.builder()
            .rosterVersion(original.getRosterVersion())
            .rosterAssignment(newAssignment)
            .employee(replacementEmp)
            .date(original.getDate())
            .oldShift(null) // They were likely OFF before
            .newShift(newAssignment.getShift())
            .oldAssignmentType("OFF")
            .newAssignmentType("SHIFT")
            .adjustmentType("AVAILABILITY_REPLACEMENT")
            .reason(reason)
            .validationResult("VALID")
            .requestedBy(empRepo.findById(wfmId).orElseThrow())
            .status("APPLIED")
            .build();
            
        adjustmentRepo.save(adjustment);
        
        return mapper.toAssignmentDto(newAssignment);
    }
}
