package com.wfm.optimization;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class RosterGenerationOrchestrator {
    
    private final PlanningSnapshotBuilder snapshotBuilder;
    private final SolverRunner solverRunner;
    private final RosterOptimizationService optimizationService; // Could refactor to avoid cyclic dependency

    public RosterSolution generate(Long planningCycleId) {
        log.info("Starting orchestrated generation for cycle={}", planningCycleId);
        PlanningSnapshot snapshot = snapshotBuilder.buildSnapshot(planningCycleId);
        
        // Run solver
        RosterSolution solution = solverRunner.solve(snapshot);
        
        // Output / save / transform logic here...
        
        return solution;
    }
}
