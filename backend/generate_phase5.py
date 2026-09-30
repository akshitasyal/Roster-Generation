import os

base_dir = "C:/Users/Akshat/Roster Generation/backend/src/main/java/com/wfm/optimization"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Created {path}")

write_file(f"{base_dir}/ConstraintBuilder.java", """
package com.wfm.optimization;
import com.google.ortools.sat.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
@Slf4j
@RequiredArgsConstructor
public class ConstraintBuilder {
    
    public void addHardConstraints(RosterModelBuilder.ModelData data, PlanningSnapshot snapshot) {
        CpModel model = data.model;
        int E = data.employees.size();
        int D = data.dates.size();
        int S = data.shifts.size();

        // H1: LEAVE - No assignment on approved leave
        if (snapshot.getApprovedLeavesByEmployee() != null) {
            for (int e = 0; e < E; e++) {
                Long empId = data.employees.get(e).getId();
                Set<LocalDate> leaves = snapshot.getApprovedLeavesByEmployee().get(empId);
                if (leaves != null) {
                    for (int d = 0; d < D; d++) {
                        if (leaves.contains(data.dates.get(d))) {
                            model.addEquality(data.off[e][d], 1);
                        }
                    }
                }
            }
        }

        // H5: AVAILABILITY - No assignment if unavailable
        if (snapshot.getUnavailableDatesByEmployee() != null) {
            for (int e = 0; e < E; e++) {
                Long empId = data.employees.get(e).getId();
                Set<LocalDate> unavail = snapshot.getUnavailableDatesByEmployee().get(empId);
                if (unavail != null) {
                    for (int d = 0; d < D; d++) {
                        if (unavail.contains(data.dates.get(d))) {
                            model.addEquality(data.off[e][d], 1);
                        }
                    }
                }
            }
        }

        // ELIGIBILITY - Must be eligible for the shift
        if (snapshot.getEligibleShiftsByEmployee() != null) {
            for (int e = 0; e < E; e++) {
                Long empId = data.employees.get(e).getId();
                Set<Long> eligible = snapshot.getEligibleShiftsByEmployee().get(empId);
                for (int s = 0; s < S; s++) {
                    Long shiftId = data.shifts.get(s).getId();
                    if (eligible == null || !eligible.contains(shiftId)) {
                        for (int d = 0; d < D; d++) {
                            model.addEquality(data.x[e][d][s], 0);
                        }
                    }
                }
            }
        }

        // WEEKLY OFF - Exactly 2 off days per 7 days
        for (int e = 0; e < E; e++) {
            LinearExprBuilder offSum = LinearExpr.newBuilder();
            for (int d = 0; d < D; d++) {
                offSum.add(data.off[e][d]);
            }
            // If the cycle is 7 days, exactly 2 days off. If longer/shorter, scale accordingly.
            int expectedOffs = (D * 2) / 7; 
            if (expectedOffs > 0) {
                model.addEquality(offSum, expectedOffs);
            }
        }

        // MAX 6 CONSECUTIVE DAYS
        for (int e = 0; e < E; e++) {
            for (int d = 0; d <= D - 7; d++) {
                LinearExprBuilder workSum = LinearExpr.newBuilder();
                for (int w = 0; w < 7; w++) {
                    // work = 1 - off
                    workSum.add(LinearExpr.term(data.off[e][d + w], -1));
                    workSum.add(1);
                }
                // Cannot work 7 days in a 7-day rolling window
                model.addLessOrEqual(workSum, 6);
            }
        }

        // REST GAP (H6: 11 Hours minimum)
        // If assigned shift s1 on day d, cannot assign shift s2 on day d+1 if gap < 11
        for (int e = 0; e < E; e++) {
            for (int d = 0; d < D - 1; d++) {
                for (int s1 = 0; s1 < S; s1++) {
                    for (int s2 = 0; s2 < S; s2++) {
                        PlanningSnapshot.ShiftSnapshot sh1 = data.shifts.get(s1);
                        PlanningSnapshot.ShiftSnapshot sh2 = data.shifts.get(s2);
                        
                        double end1 = sh1.getEndHour();
                        double start2 = sh2.getStartHour() + 24.0; // Day 2 is +24h
                        double gap = start2 - end1;
                        if (gap < 0) gap += 24.0; // Wrap around if needed (simple approximation)

                        if (gap < 11.0) {
                            // Cannot have both: x[e][d][s1] + x[e][d+1][s2] <= 1
                            model.addLessOrEqual(LinearExpr.newBuilder()
                                    .add(data.x[e][d][s1])
                                    .add(data.x[e][d + 1][s2]), 1);
                        }
                    }
                }
            }
        }
    }
}
""")

write_file(f"{base_dir}/ObjectiveBuilder.java", """
package com.wfm.optimization;
import com.google.ortools.sat.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ObjectiveBuilder {
    public void buildObjective(RosterModelBuilder.ModelData data, PlanningSnapshot snapshot) {
        LinearExprBuilder objective = LinearExpr.newBuilder();
        
        int E = data.employees.size();
        int D = data.dates.size();
        int S = data.shifts.size();
        int prefWeight = snapshot.getWeights().getPreferredShiftMove();

        // S1, S8: Preferred shift penalty
        if (snapshot.getPreferredShiftByEmployee() != null) {
            for (int e = 0; e < E; e++) {
                Long empId = data.employees.get(e).getId();
                Long prefShiftId = snapshot.getPreferredShiftByEmployee().get(empId);
                if (prefShiftId != null) {
                    Integer sIdx = data.shiftIndexById.get(prefShiftId);
                    if (sIdx != null) {
                        for (int d = 0; d < D; d++) {
                            // Penalty applied if working (not off) AND not working preferred shift
                            // We simplify: maximize assignment to preferred shift -> minimize negative assignments
                            objective.addTerm(data.x[e][d][sIdx], -prefWeight); 
                        }
                    }
                }
            }
        }
        
        // Minimize the penalties
        data.model.minimize(objective);
    }
}
""")

write_file(f"{base_dir}/SolverRunner.java", """
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
    private final ObjectiveBuilder objectiveBuilder;
    private final SolutionMapper solutionMapper;

    public RosterSolution solve(PlanningSnapshot snapshot) {
        log.info("Initializing solver for cycle: {}", snapshot.getPlanningCycleId());
        
        RosterModelBuilder.ModelData data = modelBuilder.buildModel(snapshot);
        constraintBuilder.addHardConstraints(data, snapshot);
        objectiveBuilder.buildObjective(data, snapshot);

        CpSolver solver = new CpSolver();
        solver.getParameters().setMaxTimeInSeconds(snapshot.getTimeLimitSeconds() > 0 ? snapshot.getTimeLimitSeconds() : 60);
        
        log.info("Starting CP-SAT Solver...");
        CpSolverStatus status = solver.solve(data.model);
        log.info("Solver status: {}", status);
        
        return solutionMapper.mapSolution(status, solver, data, snapshot);
    }
}
""")

write_file(f"{base_dir}/SolutionMapper.java", """
package com.wfm.optimization;
import com.google.ortools.sat.CpSolver;
import com.google.ortools.sat.CpSolverStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class SolutionMapper {
    public RosterSolution mapSolution(CpSolverStatus status, CpSolver solver, RosterModelBuilder.ModelData data, PlanningSnapshot snapshot) {
        RosterSolution solution = new RosterSolution();
        solution.setStatus(status.name());
        
        if (status == CpSolverStatus.OPTIMAL || status == CpSolverStatus.FEASIBLE) {
            solution.setObjectiveValue(solver.objectiveValue());
            List<RosterSolution.Assignment> assignments = new ArrayList<>();
            
            for (int e = 0; e < data.employees.size(); e++) {
                for (int d = 0; d < data.dates.size(); d++) {
                    if (solver.value(data.off[e][d]) == 1) {
                        assignments.add(RosterSolution.Assignment.builder()
                            .employeeId(data.employees.get(e).getId())
                            .date(data.dates.get(d))
                            .assignmentType("OFF")
                            .build());
                    } else {
                        for (int s = 0; s < data.shifts.size(); s++) {
                            if (solver.value(data.x[e][d][s]) == 1) {
                                assignments.add(RosterSolution.Assignment.builder()
                                    .employeeId(data.employees.get(e).getId())
                                    .date(data.dates.get(d))
                                    .assignmentType("SHIFT")
                                    .shiftId(data.shifts.get(s).getId())
                                    .build());
                                break;
                            }
                        }
                    }
                }
            }
            solution.setAssignments(assignments);
        }
        return solution;
    }
}
""")

write_file(f"{base_dir}/RosterOptimizationService.java", """
package com.wfm.optimization;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class RosterOptimizationService {
    private final SolverRunner solverRunner;
    
    // In a full implementation, this method retrieves data from Repositories,
    // constructs the PlanningSnapshot, and passes it to SolverRunner.
    public RosterSolution generateRoster(Long planningCycleId) {
        log.info("Generating roster for cycle: {}", planningCycleId);
        // Create mock/empty snapshot for now just to connect the dots
        PlanningSnapshot snapshot = new PlanningSnapshot();
        snapshot.setPlanningCycleId(planningCycleId);
        snapshot.setTimeLimitSeconds(10);
        // ... (data fetching logic goes here) ...
        return solverRunner.solve(snapshot);
    }
}
""")

print("Phase 5 files created.")
