package com.wfm.roster.controller;

import com.wfm.roster.dto.RosterAssignmentDTO;
import com.wfm.roster.mapper.RosterMapper;
import com.wfm.roster.repository.RosterAssignmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/roster")
@RequiredArgsConstructor
@Slf4j
public class RosterController {

    private final RosterAssignmentRepository assignmentRepo;
    private final RosterMapper mapper;

    /**
     * Get assignments for a specific draft or published version.
     */
    @GetMapping("/version/{versionId}")
    @PreAuthorize("hasAnyAuthority('WFM', 'MANAGER')")
    public ResponseEntity<List<RosterAssignmentDTO>> getAssignmentsByVersion(@PathVariable Long versionId) {
        log.info("REST request to get assignments for version: {}", versionId);
        List<RosterAssignmentDTO> assignments = assignmentRepo.findByRosterVersionId(versionId).stream()
                .map(mapper::toAssignmentDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(assignments);
    }

    /**
     * Get published assignments for a specific employee within a date range.
     * Primarily used by ASSOCIATES to view their own schedule.
     */
    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyAuthority('WFM', 'MANAGER', 'ASSOCIATE')")
    public ResponseEntity<List<RosterAssignmentDTO>> getEmployeeRoster(
            @PathVariable Long employeeId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        log.info("REST request to get published assignments for employee: {} between {} and {}", employeeId, startDate, endDate);
        // Note: For simplicity we rely on findByEmployeeId. In production, filter by STATUS='PUBLISHED' and date range.
        List<RosterAssignmentDTO> assignments = assignmentRepo.findAll().stream()
                .filter(a -> a.getEmployee().getId().equals(employeeId))
                .filter(a -> !a.getDate().isBefore(startDate) && !a.getDate().isAfter(endDate))
                .filter(a -> "PUBLISHED".equals(a.getStatus()))
                .map(mapper::toAssignmentDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(assignments);
    }
}
