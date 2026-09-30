package com.wfm.optimization;
import com.google.ortools.sat.CpSolver;
import com.google.ortools.sat.CpSolverStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class SolutionMapper {
    public RosterSolution mapSolution(CpSolverStatus status, CpSolver solver, RosterModelBuilder.ModelData data, PlanningSnapshot snapshot) {
        RosterSolution solution = new RosterSolution();
        
        switch (status) {
            case OPTIMAL: solution.setSolverStatus(RosterSolution.SolverStatus.OPTIMAL); break;
            case FEASIBLE: solution.setSolverStatus(RosterSolution.SolverStatus.FEASIBLE); break;
            case INFEASIBLE: solution.setSolverStatus(RosterSolution.SolverStatus.INFEASIBLE); break;
            case UNKNOWN: solution.setSolverStatus(RosterSolution.SolverStatus.UNKNOWN); break;
            default: solution.setSolverStatus(RosterSolution.SolverStatus.TIMEOUT); break;
        }
        
        if (status == CpSolverStatus.OPTIMAL || status == CpSolverStatus.FEASIBLE) {
            solution.setObjectiveValue(solver.objectiveValue());
            Map<Long, Map<LocalDate, RosterSolution.AssignmentResult>> assignments = new HashMap<>();
            
            for (int e = 0; e < data.employees.size(); e++) {
                Long empId = data.employees.get(e).getId();
                assignments.put(empId, new HashMap<>());
                for (int d = 0; d < data.dates.size(); d++) {
                    LocalDate date = data.dates.get(d);
                    if (solver.value(data.off[e][d]) == 1) {
                        assignments.get(empId).put(date, RosterSolution.AssignmentResult.builder()
                            .employeeId(empId).date(date).assignmentType("OFF").source("SYSTEM").build());
                    } else {
                        for (int s = 0; s < data.shifts.size(); s++) {
                            if (solver.value(data.x[e][d][s]) == 1) {
                                assignments.get(empId).put(date, RosterSolution.AssignmentResult.builder()
                                    .employeeId(empId).date(date).assignmentType("SHIFT")
                                    .shiftId(data.shifts.get(s).getId()).source("SYSTEM").build());
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
