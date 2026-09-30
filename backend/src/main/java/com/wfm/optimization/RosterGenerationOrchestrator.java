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
    private final com.wfm.roster.service.RosterPersistenceService persistenceService;

    @org.springframework.transaction.annotation.Transactional
    public RosterSolution generate(Long planningCycleId) {
        log.info("Starting orchestrated generation for cycle={}", planningCycleId);
        PlanningSnapshot snapshot = snapshotBuilder.buildSnapshot(planningCycleId);
        
        // Run solver
        RosterSolution solution = solverRunner.solve(snapshot);
        
        // Persist solution to database
        if (solution.getSolverStatus() == RosterSolution.SolverStatus.OPTIMAL || 
            solution.getSolverStatus() == RosterSolution.SolverStatus.FEASIBLE) {
            
            String metadata = String.format("Draft version - CP-SAT (%s)", solution.getSolverStatus().name());
            persistenceService.persistSolution(planningCycleId, solution, metadata);
            log.info("Solution persisted successfully.");
        } else {
            log.error("Solver failed to find a feasible solution. Status: {}", solution.getSolverStatus());
        }
        
        return solution;
    }
}
