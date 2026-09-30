package com.wfm.demand.controller;
import com.wfm.demand.dto.DemandDTO;
import com.wfm.demand.service.DemandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/demand")
@RequiredArgsConstructor
public class DemandController {
    private final DemandService service;
    @GetMapping("/cycle/{cycleId}")
    @PreAuthorize("hasAnyAuthority('WFM', 'SENIOR_MANAGER', 'MANAGER')")
    public ResponseEntity<List<DemandDTO>> getForCycle(@PathVariable Long cycleId) {
        return ResponseEntity.ok(service.getDemandForCycle(cycleId));
    }
    @PostMapping
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<DemandDTO> create(@RequestBody DemandDTO dto) {
        return ResponseEntity.ok(service.createDemand(dto));
    }
}
