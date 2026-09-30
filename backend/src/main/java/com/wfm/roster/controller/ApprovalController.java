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
