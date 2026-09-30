package com.wfm.optimization;

import com.google.ortools.sat.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;

/**
 * Builds the CP-SAT constraint model from the planning snapshot.
 *
 * Decision variable:
 *   x[e][d][s] ∈ {0,1} = 1 if employee e works shift s on date d
 *
 * Also:
 *   off[e][d] ∈ {0,1} = 1 if employee e has a weekly off on date d
 *
 * This class creates all decision variables and is consumed by:
 *   - ConstraintBuilder (hard constraints)
 *   - ObjectiveBuilder (soft constraints / penalties)
 */
@Component
@Slf4j
public class RosterModelBuilder {

    /**
     * The built model data - all variables indexed for use by constraint/objective builders.
     */
    public static class ModelData {
        public final CpModel model;
        public final List<PlanningSnapshot.EmployeeSnapshot> employees;
        public final List<PlanningSnapshot.ShiftSnapshot> shifts;
        public final List<LocalDate> dates;

        // Primary decision variables: x[employeeIdx][dateIdx][shiftIdx]
        public final BoolVar[][][] x;

        // Off variable: off[employeeIdx][dateIdx]
        public final BoolVar[][] off;

        // Demand shortages: shortage[demandIdx]
        public final IntVar[] shortages;

        // Index maps for lookup
        public final Map<Long, Integer> employeeIndexById;
        public final Map<Long, Integer> shiftIndexById;
        public final Map<LocalDate, Integer> dateIndexByDate;

        public ModelData(CpModel model,
                         List<PlanningSnapshot.EmployeeSnapshot> employees,
                         List<PlanningSnapshot.ShiftSnapshot> shifts,
                         List<LocalDate> dates,
                         BoolVar[][][] x,
                         BoolVar[][] off,
                         IntVar[] shortages,
                         Map<Long, Integer> employeeIndexById,
                         Map<Long, Integer> shiftIndexById,
                         Map<LocalDate, Integer> dateIndexByDate) {
            this.model = model;
            this.employees = employees;
            this.shifts = shifts;
            this.dates = dates;
            this.x = x;
            this.off = off;
            this.shortages = shortages;
            this.employeeIndexById = employeeIndexById;
            this.shiftIndexById = shiftIndexById;
            this.dateIndexByDate = dateIndexByDate;
        }
    }

    /**
     * Build the CP-SAT model from the planning snapshot.
     * Creates all decision variables and ensures exactly one assignment per employee per day.
     */
    public ModelData buildModel(PlanningSnapshot snapshot) {
        CpModel model = new CpModel();

        List<PlanningSnapshot.EmployeeSnapshot> employees = snapshot.getEmployees();
        List<PlanningSnapshot.ShiftSnapshot> shifts = snapshot.getShifts();
        List<LocalDate> dates = snapshot.getPlanningDates();

        int E = employees.size();
        int D = dates.size();
        int S = shifts.size();

        log.info("Building CP-SAT model: {} employees, {} dates, {} shifts = {} variables",
                E, D, S, E * D * (S + 1));

        // Build index maps
        Map<Long, Integer> empIdx = new HashMap<>();
        Map<Long, Integer> shiftIdx = new HashMap<>();
        Map<LocalDate, Integer> dateIdx = new HashMap<>();

        for (int i = 0; i < E; i++) empIdx.put(employees.get(i).getId(), i);
        for (int j = 0; j < S; j++) shiftIdx.put(shifts.get(j).getId(), j);
        for (int d = 0; d < D; d++) dateIdx.put(dates.get(d), d);

        // Create decision variables
        BoolVar[][][] x = new BoolVar[E][D][S];
        BoolVar[][] off = new BoolVar[E][D];

        for (int e = 0; e < E; e++) {
            for (int d = 0; d < D; d++) {
                off[e][d] = model.newBoolVar("off_" + e + "_" + d);
                for (int s = 0; s < S; s++) {
                    x[e][d][s] = model.newBoolVar("x_" + e + "_" + d + "_" + s);
                }
            }
        }

        // Exactly one assignment per employee per day (shift XOR off)
        // An employee is either working one specific shift OR has the day off
        for (int e = 0; e < E; e++) {
            for (int d = 0; d < D; d++) {
                // Sum of all shift vars + off = 1
                LinearExprBuilder dayAssignment = LinearExpr.newBuilder();
                dayAssignment.add(off[e][d]);
                for (int s = 0; s < S; s++) {
                    dayAssignment.add(x[e][d][s]);
                }
                model.addEquality(dayAssignment, 1);
            }
        }

        // Handle locked assignments - fix variables immediately
        Map<Long, Map<LocalDate, PlanningSnapshot.LockedAssignment>> locked =
                snapshot.getLockedAssignments();
        if (locked != null) {
            for (var empEntry : locked.entrySet()) {
                Long employeeId = empEntry.getKey();
                Integer eIdx = empIdx.get(employeeId);
                if (eIdx == null) continue;

                for (var dateEntry : empEntry.getValue().entrySet()) {
                    LocalDate date = dateEntry.getKey();
                    Integer dIdx = dateIdx.get(date);
                    if (dIdx == null) continue;

                    PlanningSnapshot.LockedAssignment lock = dateEntry.getValue();

                    if ("OFF".equals(lock.getAssignmentType()) ||
                        "LEAVE".equals(lock.getAssignmentType()) ||
                        "UNAVAILABLE".equals(lock.getAssignmentType())) {
                        // Force off=1
                        model.addEquality(off[eIdx][dIdx], 1);
                    } else if (lock.getShiftId() != null) {
                        // Force specific shift
                        Integer sIdx = shiftIdx.get(lock.getShiftId());
                        if (sIdx != null) {
                            model.addEquality(x[eIdx][dIdx][sIdx], 1);
                        }
                    }
                }
            }
        }

        // Create shortage variables for each demand
        List<PlanningSnapshot.DemandSnapshot> demands = snapshot.getDemands() != null ? snapshot.getDemands() : Collections.emptyList();
        IntVar[] shortages = new IntVar[demands.size()];
        for (int i = 0; i < demands.size(); i++) {
            // max shortage is the required headcount
            shortages[i] = model.newIntVar(0, demands.get(i).getRequiredHeadcount(), "shortage_" + i);
        }

        return new ModelData(model, employees, shifts, dates, x, off, shortages,
                empIdx, shiftIdx, dateIdx);
    }
}
