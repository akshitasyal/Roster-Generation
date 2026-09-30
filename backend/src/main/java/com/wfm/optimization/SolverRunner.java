package com.wfm.optimization;
import com.google.ortools.Loader;
import com.google.ortools.sat.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class SolverRunner {
    static {
        Loader.loadNativeLibraries();
    }
    
    private final RosterModelBuilder modelBuilder;
    private final ConstraintBuilder constraintBuilder;
    private final CoverageConstraintBuilder coverageConstraintBuilder;
    private final ObjectiveBuilder objectiveBuilder;
    private final SolutionMapper solutionMapper;

    public RosterSolution solve(PlanningSnapshot snapshot) {
        log.info("Initializing solver for cycle: {}", snapshot.getPlanningCycleId());
        
        RosterModelBuilder.ModelData data = modelBuilder.buildModel(snapshot);
        constraintBuilder.addHardConstraints(data, snapshot);
        coverageConstraintBuilder.addCoverageConstraints(data, snapshot);
        objectiveBuilder.buildObjective(data, snapshot);

        CpSolver solver = new CpSolver();
        solver.getParameters().setMaxTimeInSeconds(snapshot.getTimeLimitSeconds() > 0 ? snapshot.getTimeLimitSeconds() : 60);
        
        log.info("Starting CP-SAT Solver...");
        CpSolverStatus status = solver.solve(data.model);
        log.info("Solver status: {}", status);
        
        return solutionMapper.mapSolution(status, solver, data, snapshot);
    }
}
