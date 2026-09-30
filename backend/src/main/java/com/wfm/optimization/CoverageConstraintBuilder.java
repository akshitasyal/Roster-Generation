package com.wfm.optimization;

import com.google.ortools.sat.CpModel;
import com.google.ortools.sat.LinearExpr;
import com.google.ortools.sat.LinearExprBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Adds coverage (demand satisfaction) constraints to the model.
 * Associates demand shortages with CP-SAT variables.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class CoverageConstraintBuilder {

    public void addCoverageConstraints(RosterModelBuilder.ModelData data, PlanningSnapshot snapshot) {
        CpModel model = data.model;
        List<PlanningSnapshot.DemandSnapshot> demands = snapshot.getDemands();
        if (demands == null || demands.isEmpty()) return;

        Map<Long, Map<Long, Integer>> skillLevels = snapshot.getSkillLevelsByEmployee();
        Map<Long, List<PlanningSnapshot.IntervalCoverage>> shiftCoverages = snapshot.getShiftIntervalCoverage();

        for (int i = 0; i < demands.size(); i++) {
            PlanningSnapshot.DemandSnapshot demand = demands.get(i);
            LocalDate dDate = demand.getDate();
            Integer dIdx = data.dateIndexByDate.get(dDate);
            if (dIdx == null) continue;

            LinearExprBuilder supplied = LinearExpr.newBuilder();

            // Accumulate coverage from all employees who are working any shift on this date
            for (int e = 0; e < data.employees.size(); e++) {
                Long empId = data.employees.get(e).getId();
                
                // Check if employee has required skill and sufficient level
                Map<Long, Integer> empSkills = skillLevels != null ? skillLevels.get(empId) : null;
                Integer empLevelWeight = (empSkills != null && demand.getSkillId() != null) ? empSkills.get(demand.getSkillId()) : null;
                
                // If they have the skill and meet minimum level weight
                if (empLevelWeight != null && empLevelWeight >= demand.getSkillLevelWeight()) {
                    for (int s = 0; s < data.shifts.size(); s++) {
                        Long shiftId = data.shifts.get(s).getId();
                        
                        // Check if this shift covers the demand interval
                        List<PlanningSnapshot.IntervalCoverage> intervals = shiftCoverages != null ? shiftCoverages.get(shiftId) : null;
                        double shiftFactor = 0.0;
                        if (intervals != null) {
                            for (PlanningSnapshot.IntervalCoverage ic : intervals) {
                                // Simple mapping for stub: assuming interval strings match or factor=1
                                // Real implementation checks if demand.getInterval() matches ic.start + "-" + ic.end
                                // For now, we assume factor 1 if intervals exist.
                                shiftFactor = Math.max(shiftFactor, ic.getFactor());
                            }
                        } else {
                            // default fallback
                            shiftFactor = 1.0;
                        }

                        // We can't use fractional coefficients directly in LinearExpr without scaling.
                        // Here we multiply both sides by 10 or cast to int. Assuming int for headcount.
                        int coverageContribution = (int) Math.round(empLevelWeight * shiftFactor);
                        
                        if (coverageContribution > 0) {
                            supplied.addTerm(data.x[e][dIdx][s], coverageContribution);
                        }
                    }
                }
            }

            // supplied + shortage >= required
            supplied.add(data.shortages[i]);
            model.addGreaterOrEqual(supplied, demand.getRequiredHeadcount());
        }
    }
}
