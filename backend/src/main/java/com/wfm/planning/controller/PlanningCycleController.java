package com.wfm.planning.controller;
import com.wfm.planning.dto.PlanningCycleDTO;
import com.wfm.planning.service.PlanningCycleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/planning-cycles")
@RequiredArgsConstructor
public class PlanningCycleController {
    private final PlanningCycleService service;
    
    @GetMapping
    @PreAuthorize("hasAnyAuthority('WFM', 'SENIOR_MANAGER', 'MANAGER', 'AM', 'TL')")
    public ResponseEntity<List<PlanningCycleDTO>> getAll() {
        return ResponseEntity.ok(service.getAllPlanningCycles());
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('WFM', 'SENIOR_MANAGER', 'MANAGER', 'AM', 'TL')")
    public ResponseEntity<PlanningCycleDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPlanningCycleById(id));
    }
    @PostMapping
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<PlanningCycleDTO> create(@RequestBody PlanningCycleDTO dto) {
        return ResponseEntity.ok(service.createPlanningCycle(dto));
    }
}
