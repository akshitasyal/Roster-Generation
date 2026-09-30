package com.wfm.demand.controller;
import com.wfm.demand.service.ManagementDemandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/management-demand")
@RequiredArgsConstructor
public class ManagementDemandController {
    private final ManagementDemandService managementDemandService;

    @PostMapping("/calculate/{cycleId}")
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<String> calculateManagementDemand(@PathVariable Long cycleId) {
        managementDemandService.calculateManagementDemand(cycleId);
        return ResponseEntity.ok("Management demand calculated successfully.");
    }
}
