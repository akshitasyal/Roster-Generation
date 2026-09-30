package com.wfm.roster.service;
import com.wfm.roster.dto.ApprovalDTO;
import com.wfm.roster.entity.Approval;
import com.wfm.roster.entity.RosterAssignment;
import com.wfm.roster.entity.RosterVersion;
import com.wfm.planning.entity.PlanningCycle;
import com.wfm.roster.mapper.ApprovalMapper;
import com.wfm.roster.repository.ApprovalRepository;
import com.wfm.roster.repository.RosterAssignmentRepository;
import com.wfm.roster.repository.RosterVersionRepository;
import com.wfm.planning.repository.PlanningCycleRepository;
import com.wfm.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@Slf4j
public class ApprovalServiceImpl implements ApprovalService {
    private final ApprovalRepository approvalRepo;
    private final RosterVersionRepository versionRepo;
    private final RosterAssignmentRepository assignmentRepo;
    private final PlanningCycleRepository cycleRepo;
    private final EmployeeRepository empRepo;
    private final ApprovalMapper mapper;

    @Override
    @Transactional
    public ApprovalDTO requestApproval(Long versionId, String level, Long approverId) {
        log.info("Requesting approval level {} for version {}", level, versionId);
        Approval approval = Approval.builder()
            .rosterVersion(versionRepo.findById(versionId).orElseThrow())
            .approvalLevel(level)
            .approver(empRepo.findById(approverId).orElseThrow())
            .status("PENDING")
            .build();
        return mapper.toDto(approvalRepo.save(approval));
    }

    @Override
    @Transactional
    public ApprovalDTO approve(Long approvalId, Long approverId, String comments) {
        Approval approval = approvalRepo.findById(approvalId).orElseThrow();
        approval.setStatus("APPROVED");
        approval.setComments(comments);
        approval.setApprovedAt(Instant.now());
        
        RosterVersion version = approval.getRosterVersion();
        version.setApprovedBy(empRepo.findById(approverId).orElseThrow());
        version.setApprovedAt(Instant.now());
        version.setStatus("APPROVED");
        versionRepo.save(version);
        
        return mapper.toDto(approvalRepo.save(approval));
    }

    @Override
    @Transactional
    public ApprovalDTO reject(Long approvalId, Long approverId, String comments) {
        Approval approval = approvalRepo.findById(approvalId).orElseThrow();
        approval.setStatus("REJECTED");
        approval.setComments(comments);
        approval.setApprovedAt(Instant.now()); // Serves as resolution time
        return mapper.toDto(approvalRepo.save(approval));
    }

    @Override
    @Transactional
    public void publishRoster(Long versionId, Long publisherId) {
        log.info("Publishing roster version {}", versionId);
        RosterVersion version = versionRepo.findById(versionId).orElseThrow();
        version.setVersionType("PUBLISHED");
        version.setStatus("PUBLISHED");
        version.setPublishedBy(empRepo.findById(publisherId).orElseThrow());
        version.setPublishedAt(Instant.now());
        versionRepo.save(version);
        
        PlanningCycle cycle = version.getPlanningCycle();
        cycle.setStatus("PUBLISHED");
        cycleRepo.save(cycle);
        
        List<RosterAssignment> assignments = assignmentRepo.findByRosterVersionId(versionId);
        assignments.forEach(a -> a.setStatus("PUBLISHED"));
        assignmentRepo.saveAll(assignments);
        
        log.info("Roster {} successfully published to all associates.", versionId);
    }
    
    @Override
    public List<ApprovalDTO> getApprovals(Long versionId) {
        return approvalRepo.findByRosterVersionId(versionId).stream().map(mapper::toDto).collect(Collectors.toList());
    }
}
