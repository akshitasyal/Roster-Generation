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
