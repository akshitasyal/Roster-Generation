package com.wfm.roster.controller;
import com.wfm.roster.dto.RosterAdjustmentDTO;
import com.wfm.roster.dto.RosterLockDTO;
import com.wfm.roster.service.RosterAdjustmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/roster/adjustments")
@RequiredArgsConstructor
public class AdjustmentController {
    private final RosterAdjustmentService service;

    @PostMapping("/version/{oldVersionId}/clone")
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<Long> createNewVersion(@PathVariable Long oldVersionId, @RequestParam String newType, @RequestParam Long generatedBy, @RequestParam String notes) {
        return ResponseEntity.ok(service.createNewVersion(oldVersionId, newType, generatedBy, notes));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<RosterAdjustmentDTO> applyAdjustment(@RequestBody RosterAdjustmentDTO dto) {
        return ResponseEntity.ok(service.applyAdjustment(dto));
    }

    @PostMapping("/lock/{assignmentId}")
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<RosterLockDTO> lockAssignment(@PathVariable Long assignmentId, @RequestParam Long lockedBy, @RequestParam String reason) {
        return ResponseEntity.ok(service.lockAssignment(assignmentId, lockedBy, reason));
    }

    @DeleteMapping("/lock/{assignmentId}")
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<Void> unlockAssignment(@PathVariable Long assignmentId) {
        service.unlockAssignment(assignmentId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/version/{versionId}")
    @PreAuthorize("hasAnyAuthority('WFM', 'MANAGER')")
    public ResponseEntity<List<RosterAdjustmentDTO>> getAdjustments(@PathVariable Long versionId) {
        return ResponseEntity.ok(service.getAdjustments(versionId));
    }
}
