import os

base_dir = "C:/Users/Akshat/Roster Generation/backend/src/main/java/com/wfm/roster"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Created {path}")

write_file(f"{base_dir}/dto/ApprovalDTO.java", """
package com.wfm.roster.dto;
import lombok.Data;
import java.time.Instant;
@Data
public class ApprovalDTO {
    private Long id;
    private Long rosterVersionId;
    private String approvalLevel;
    private Long approverId;
    private String status;
    private String comments;
    private Instant approvedAt;
}
""")

write_file(f"{base_dir}/mapper/ApprovalMapper.java", """
package com.wfm.roster.mapper;
import com.wfm.roster.dto.ApprovalDTO;
import com.wfm.roster.entity.Approval;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ApprovalMapper {
    @Mapping(target = "rosterVersionId", source = "rosterVersion.id")
    @Mapping(target = "approverId", source = "approver.id")
    ApprovalDTO toDto(Approval entity);
}
""")

write_file(f"{base_dir}/repository/ApprovalRepository.java", """
package com.wfm.roster.repository;
import com.wfm.roster.entity.Approval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    List<Approval> findByRosterVersionId(Long versionId);
}
""")

write_file(f"{base_dir}/service/ApprovalService.java", """
package com.wfm.roster.service;
import com.wfm.roster.dto.ApprovalDTO;
import java.util.List;
public interface ApprovalService {
    ApprovalDTO requestApproval(Long versionId, String level, Long approverId);
    ApprovalDTO approve(Long approvalId, Long approverId, String comments);
    ApprovalDTO reject(Long approvalId, Long approverId, String comments);
    void publishRoster(Long versionId, Long publisherId);
    List<ApprovalDTO> getApprovals(Long versionId);
}
""")

write_file(f"{base_dir}/service/ApprovalServiceImpl.java", """
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
""")

write_file(f"{base_dir}/controller/ApprovalController.java", """
package com.wfm.roster.controller;
import com.wfm.roster.dto.ApprovalDTO;
import com.wfm.roster.service.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/roster/approvals")
@RequiredArgsConstructor
public class ApprovalController {
    private final ApprovalService service;

    @PostMapping("/request")
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<ApprovalDTO> requestApproval(@RequestParam Long versionId, @RequestParam String level, @RequestParam Long approverId) {
        return ResponseEntity.ok(service.requestApproval(versionId, level, approverId));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyAuthority('WFM', 'SENIOR_MANAGER', 'MANAGER', 'AM', 'TL')")
    public ResponseEntity<ApprovalDTO> approve(@PathVariable Long id, @RequestParam Long approverId, @RequestParam(required = false) String comments) {
        return ResponseEntity.ok(service.approve(id, approverId, comments));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyAuthority('WFM', 'SENIOR_MANAGER', 'MANAGER', 'AM', 'TL')")
    public ResponseEntity<ApprovalDTO> reject(@PathVariable Long id, @RequestParam Long approverId, @RequestParam String comments) {
        return ResponseEntity.ok(service.reject(id, approverId, comments));
    }

    @PostMapping("/version/{versionId}/publish")
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<String> publishRoster(@PathVariable Long versionId, @RequestParam Long publisherId) {
        service.publishRoster(versionId, publisherId);
        return ResponseEntity.ok("Roster successfully published");
    }
    
    @GetMapping("/version/{versionId}")
    @PreAuthorize("hasAnyAuthority('WFM', 'SENIOR_MANAGER', 'MANAGER', 'AM', 'TL')")
    public ResponseEntity<List<ApprovalDTO>> getApprovals(@PathVariable Long versionId) {
        return ResponseEntity.ok(service.getApprovals(versionId));
    }
}
""")

print("Phase 9 files created.")
