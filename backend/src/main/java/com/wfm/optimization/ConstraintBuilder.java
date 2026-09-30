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

        // REST GAP (H6: Minimum Rest)
        // If assigned shift s1 on day d, cannot assign shift s2 on day d+1 if gap < minRestHours
        int minRest = snapshot.getRules() != null ? snapshot.getRules().getMinRestHours() : 11;
        for (int e = 0; e < E; e++) {
            for (int d = 0; d < D - 1; d++) {
                for (int s1 = 0; s1 < S; s1++) {
                    for (int s2 = 0; s2 < S; s2++) {
                        PlanningSnapshot.ShiftSnapshot sh1 = data.shifts.get(s1);
                        PlanningSnapshot.ShiftSnapshot sh2 = data.shifts.get(s2);
                        
                        double gap = (sh2.getStartHour() + 24.0) - sh1.getEndHour();

                        if (gap < minRest) {
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
