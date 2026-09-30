package com.wfm.roster.service;
import com.wfm.roster.dto.RosterExceptionDTO;
import com.wfm.roster.entity.RosterAssignment;
import com.wfm.roster.entity.RosterException;
import com.wfm.roster.entity.RosterVersion;
import com.wfm.leave.entity.Leave;
import com.wfm.leave.repository.LeaveRepository;
import com.wfm.roster.mapper.RosterMapper;
import com.wfm.roster.repository.RosterAssignmentRepository;
import com.wfm.roster.repository.RosterExceptionRepository;
import com.wfm.roster.repository.RosterVersionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@Slf4j
public class ValidationServiceImpl implements ValidationService {
    private final RosterVersionRepository versionRepository;
    private final RosterAssignmentRepository assignmentRepository;
    private final LeaveRepository leaveRepository;
    private final RosterExceptionRepository exceptionRepository;
    private final RosterMapper rosterMapper;

    @Override
    @Transactional
    public List<RosterExceptionDTO> validateRosterVersion(Long rosterVersionId) {
        log.info("Validating roster version: {}", rosterVersionId);
        RosterVersion version = versionRepository.findById(rosterVersionId).orElseThrow();
        List<RosterAssignment> assignments = assignmentRepository.findByRosterVersionId(rosterVersionId);
        List<Leave> allLeaves = leaveRepository.findAll(); 
        List<RosterException> violations = new ArrayList<>();

        for (RosterAssignment a : assignments) {
            // H1: Leave overlap check
            if (a.isWorkingShift()) {
                boolean overlapsLeave = allLeaves.stream()
                    .anyMatch(l -> l.getEmployee().getId().equals(a.getEmployee().getId()) 
                                && l.isApprovedLeaveOn(a.getDate()));
                if (overlapsLeave) {
                    violations.add(RosterException.builder()
                        .rosterVersion(version)
                        .planningCycle(version.getPlanningCycle())
                        .exceptionType("MANUAL_OVERRIDE_REQUIRED") // Overriding approved leave is a severe violation
                        .severity("CRITICAL")
                        .employee(a.getEmployee())
                        .date(a.getDate())
                        .shift(a.getShift())
                        .description("Employee assigned to shift during approved leave")
                        .build());
                }
            }
        }
        
        // In full implementation, add H2-H6 here exactly the same way.
        exceptionRepository.saveAll(violations);
        
        return exceptionRepository.findByRosterVersionId(rosterVersionId).stream()
            .map(rosterMapper::toExceptionDto).collect(Collectors.toList());
    }
}
