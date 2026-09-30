package com.wfm.roster.controller;
import com.wfm.roster.dto.ReplacementCandidateDTO;
import com.wfm.roster.dto.RosterAssignmentDTO;
import com.wfm.roster.service.ReplacementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/roster/replacements")
@RequiredArgsConstructor
public class ReplacementController {
    private final ReplacementService service;

    @GetMapping("/{assignmentId}/candidates")
    @PreAuthorize("hasAnyAuthority('WFM', 'MANAGER', 'AM', 'TL')")
    public ResponseEntity<List<ReplacementCandidateDTO>> findEligibleReplacements(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(service.findEligibleReplacements(assignmentId));
    }

    @PostMapping("/{assignmentId}/execute")
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<RosterAssignmentDTO> executeReplacement(@PathVariable Long assignmentId, @RequestParam Long replacementEmpId, @RequestParam Long wfmId, @RequestParam String reason) {
        return ResponseEntity.ok(service.executeReplacement(assignmentId, replacementEmpId, wfmId, reason));
    }
}
