package com.wfm.optimization;

import com.google.ortools.sat.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@Slf4j
public class ObjectiveBuilder {
    
    public void buildObjective(RosterModelBuilder.ModelData data, PlanningSnapshot snapshot) {
        LinearExprBuilder objective = LinearExpr.newBuilder();
        
        int E = data.employees.size();
        int D = data.dates.size();
        int S = data.shifts.size();
        PlanningSnapshot.OptimizationWeights w = snapshot.getWeights();

        // S1: Coverage Shortage penalty
        if (data.shortages != null) {
            int wShortage = w.getCoverageShortage();
            for (IntVar shortageVar : data.shortages) {
                objective.addTerm(shortageVar, wShortage);
            }
        }

        // S2: Shift Preference
        if (snapshot.getPreferredShiftByEmployee() != null) {
            for (int e = 0; e < E; e++) {
                Long empId = data.employees.get(e).getId();
                Long prefShiftId = snapshot.getPreferredShiftByEmployee().get(empId);
                if (prefShiftId != null) {
                    Integer sIdx = data.shiftIndexById.get(prefShiftId);
                    if (sIdx != null) {
                        for (int d = 0; d < D; d++) {
                            // Maximizing assignment -> minimize the negation
                            objective.addTerm(data.x[e][d][sIdx], -w.getPreferredShiftMove()); 
                        }
                    }
                }
            }
        }

        // S3: Preferred Off Days
        if (snapshot.getPreferredOffDaysByEmployee() != null) {
            for (int e = 0; e < E; e++) {
                Long empId = data.employees.get(e).getId();
                List<String> prefOffDays = snapshot.getPreferredOffDaysByEmployee().get(empId);
                if (prefOffDays != null && !prefOffDays.isEmpty()) {
                    for (int d = 0; d < D; d++) {
                        String dayName = data.dates.get(d).getDayOfWeek().name();
                        if (prefOffDays.contains(dayName)) {
                            // Maximize off[e][d]
                            objective.addTerm(data.off[e][d], -w.getWeeklyOffPreference());
                        }
                    }
                }
            }
        }

        // S4: Night Concentration (minimize Night shifts beyond a threshold)
        // Simplified: penalize total night shifts to spread them out
        for (int e = 0; e < E; e++) {
            for (int d = 0; d < D; d++) {
                for (int s = 0; s < S; s++) {
                    if (data.shifts.get(s).isOvernight()) {
                        objective.addTerm(data.x[e][d][s], w.getNightConcentration());
                    }
                }
            }
        }

        data.model.minimize(objective);
    }
}
