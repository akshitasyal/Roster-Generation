package com.wfm.roster.controller;

import com.wfm.optimization.RosterGenerationOrchestrator;
import com.wfm.optimization.RosterSolution;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roster/generation")
@RequiredArgsConstructor
@Slf4j
public class RosterGenerationController {

    private final RosterGenerationOrchestrator orchestrator;

    /**
     * Triggers the CP-SAT engine to generate a roster for a given planning cycle.
     * The orchestrator automatically persists the result as a new DRAFT version
     * and maps coverage shortages to exceptions.
     *
     * @param cycleId The planning cycle ID
     * @return Summary of the generated solution
     */
    @PostMapping("/cycle/{cycleId}")
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<RosterSolution> generateRoster(@PathVariable Long cycleId) {
        log.info("REST request to generate roster for planning cycle: {}", cycleId);
        RosterSolution solution = orchestrator.generate(cycleId);
        return ResponseEntity.ok(solution);
    }
}
