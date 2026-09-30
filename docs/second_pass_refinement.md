# Workforce Management -- Second-Pass Architecture and Roster Engine Refinement

> Baseline: docs/architecture.md and V30 migration are the source of truth.

## SECTION A -- Architecture Gap Analysis

### What Exists

28 core tables V1-V29: COMPLETE
V30 (skill_levels, shift_interval_coverage, shift_patterns, roster_rule_configurations,
  optimization_weights, management_coverage_requirements, preference_reviews,
  assignment_explanations, planning_snapshots): COMPLETE
CP-SAT scaffolding (RosterModelBuilder, ConstraintBuilder, ObjectiveBuilder, SolverRunner): COMPLETE
H1 leave, H5 availability, eligibility, weekly OFF, max 6 consecutive: COMPLETE
H6 rest 11h -- bug identified below: PARTIAL

### 18 Gaps

GAP 1: H3 Skill+Level not in ConstraintBuilder. Fix: pre-filter + coverage linkage.
GAP 2: H4 max hours not from config. Fix: startup validation + rule lookup.
GAP 3: H6 rest formula broken for overnight shifts (endHour > 24). Fix: Section D.
GAP 4: ObjectiveBuilder empty -- S2-S7 absent, no shortage penalty. Fix: Section D.
GAP 5: RosterOptimizationService is a stub. Fix: Section C.
GAP 6: No coverage linkage in CP-SAT. Fix: CoverageConstraintBuilder.
GAP 7: Management Roster Engine absent (TL/AM/Manager/SM/WFM). Fix: Sections E-I.
GAP 8: ValidationServiceImpl H1-only stub. Fix: Section C.
GAP 9: PlanningSnapshot missing 9 field groups. Fix: Section K.
GAP 10: roster_adjustments cannot model employee replacement. Fix: roster_replacements table.
GAP 11: users auth table missing. Fix: V31.
GAP 12: H2 overlap implicit only -- documented.
GAP 13: shift_interval_coverage empty. Fix: V32 seed.
GAP 14: management_coverage_requirements lacks day_type. Fix: ALTER TABLE.
GAP 15: Preference review deadline not enforced. Fix: @Scheduled job.
GAP 16: Shift swaps not modeled. Fix: EXPLICITLY DEFERRED TO V2.
GAP 17: Training unavailability types not enumerated. Fix: availability.reason enum.
GAP 18: WFM algorithm underspecified. Fix: independent demand model Section I.

## SECTION B -- Final Database Schema (40 Tables)

### New Tables V31

users:
  id BIGSERIAL PK
  employee_id BIGINT UNIQUE REFERENCES employees(id) NULLABLE
  username VARCHAR(100) NOT NULL UNIQUE
  password_hash VARCHAR(255) NOT NULL
  status VARCHAR(20) DEFAULT ACTIVE
  failed_attempts INT DEFAULT 0
  last_login TIMESTAMPTZ

roster_replacements:
  id BIGSERIAL PK
  original_assignment_id BIGINT NOT NULL REFERENCES roster_assignments(id)
  original_employee_id BIGINT NOT NULL REFERENCES employees(id)
  replacement_employee_id BIGINT REFERENCES employees(id)
  date DATE NOT NULL
  shift_id BIGINT REFERENCES shifts(id)
  reason TEXT NOT NULL
  reason_type VARCHAR(50): SICKNESS / EMERGENCY / UNAVAILABLE / OTHER
  replacement_status VARCHAR(30): PENDING / FILLED / UNFILLED / CANCELLED
  requested_by BIGINT NOT NULL REFERENCES employees(id)
  approved_by BIGINT REFERENCES employees(id)
  approved_at TIMESTAMPTZ

working_hours_policies:
  id BIGSERIAL PK
  project_id BIGINT REFERENCES projects(id)  [NULL = global]
  regular_hours DECIMAL(4,2) DEFAULT 8.0
  maximum_hours DECIMAL(4,2) DEFAULT 9.0
  overtime_allowed BOOLEAN DEFAULT TRUE
  maximum_overtime_hrs DECIMAL(4,2) DEFAULT 1.0
  effective_from DATE NOT NULL
  UNIQUE(project_id, effective_from)

### Schema Alterations V31

ALTER TABLE management_coverage_requirements ADD COLUMN day_type VARCHAR(20) DEFAULT ALL;
  -- ALL / WEEKDAY / WEEKEND / HOLIDAY

ALTER TABLE shift_interval_coverage ADD COLUMN effective_from DATE, ADD COLUMN effective_to DATE;

ALTER TABLE roster_rule_configurations ADD COLUMN project_id BIGINT REFERENCES projects(id);
  -- NULL = global. Project-specific overrides global.

ALTER TABLE planning_snapshots ADD COLUMN snapshot_version VARCHAR(20),
  ADD COLUMN algorithm_version VARCHAR(20), ADD COLUMN solver_version VARCHAR(20),
  ADD COLUMN configuration_version VARCHAR(20);

### 40-Table Inventory

Organization (5): roles, employees, projects, teams, employee_org_assignments
Workforce (9): skills, skill_levels[V30], employee_skills, shifts, shift_eligibility,
  shift_interval_coverage[V30], shift_patterns[V30], availability, leaves
Preferences (3): employee_preferences, weekly_off_preferences, preference_reviews[V30]
Planning (5): planning_cycles, demand_configurations, demand, holidays, project_holiday_policies
Roster (5): roster_versions, roster_assignments, roster_locks, coverage, roster_replacements[V31]
Operations (6): exceptions, roster_adjustments, approvals, generation_runs,
  assignment_explanations[V30], planning_snapshots[V30]
System (3): audit_logs, notifications, users[V31]
Config (4): roster_rule_configurations[V30], optimization_weights[V30],
  management_coverage_requirements[V30], working_hours_policies[V31]
TOTAL: 40 tables (28 original + 9 V30 + 3 V31)

## SECTION C -- Roster Engine Architecture

### 21-Step Orchestration Flow

[1]  RosterGenerationOrchestrator.generateRoster(cycleId, scope)
[2]  GenerationRunService.createRun(cycleId, scope)
[3]  PlanningSnapshotBuilder.buildSnapshot(cycleId)
[4]  CandidateFilterService.filterCandidates(snapshot)
[5]  RosterModelBuilder.buildModel(snapshot) -- creates x[e][d][s] and off[e][d]
[6]  ConstraintBuilder.addHardConstraints(modelData, snapshot) -- HC-0 through HC-11
[7]  CoverageConstraintBuilder.addCoverageVariables(modelData, snapshot) -- shortage IntVars
[8]  ObjectiveBuilder.buildObjective(modelData, snapshot) -- S1-S8 + shortage penalty
[9]  SolverRunner.solve(modelData, snapshot) -- OPTIMAL/FEASIBLE/TIME_LIMIT/INFEASIBLE/UNKNOWN
[10] SolutionMapper.mapToAssignments(solution, snapshot)
[11] RosterPersistenceService.saveAssociateRoster(assignments, versionId)
[12] ManagementRosterService.generateTlRoster(versionId, snapshot)
[13] ManagementRosterService.generateAmRoster(versionId, snapshot)
[14] ManagementRosterService.generateManagerRoster(versionId, snapshot)
[15] ManagementRosterService.generateSeniorManagerRoster(versionId, snapshot)
[16] ManagementRosterService.generateWfmRoster(versionId, snapshot)
[17] CoverageService.calculateCoverage(versionId)
[18] ValidationService.validateRosterVersion(versionId) -- creates EXCEPTION records
[19] ExplainabilityService.generateExplanations(versionId)
[20] GenerationRunService.completeRun(runId, status, metrics)
[21] NotificationService.emit(ROSTER_GENERATED, versionId)

### New Service Components

com.wfm.optimization:
  RosterGenerationOrchestrator (NEW)
  PlanningSnapshotBuilder (NEW)
  CandidateFilterService (NEW)
  CoverageConstraintBuilder (NEW)

com.wfm.roster.service:
  ManagementRosterService (NEW)
  MajorityShiftCalculator (NEW)
  ManagementCoverageValidator (NEW)
  WeeklyOffAssigner (NEW)
  ExplainabilityService (NEW)

com.wfm.config:
  RosterRuleConfigurationService (NEW)
  WorkingHoursPolicyService (NEW)

### Validation Specification

H1: No shift on approved leave                    CRITICAL
H2: No duplicate shift same day                   CRITICAL
H3: Skill + level match                           CRITICAL
H4: Shift duration <= MAX_WORKING_HOURS           CRITICAL
H5: Shift within availability window              CRITICAL
H6: >= 11h rest between consecutive shifts        CRITICAL
Weekly OFF count = WEEKLY_OFF_COUNT (=2)          HIGH
Max consecutive working days <= 6                 HIGH
Shift eligibility valid                           HIGH
Locked assignment unchanged                       MEDIUM
Management hierarchy consistency                  MEDIUM

### Solver Status Handling

OPTIMAL:    Save, mark OPTIMAL
FEASIBLE:   Save, mark FEASIBLE, notify WFM
TIME_LIMIT: If solution found: save TIME_LIMIT_FEASIBLE; else: FAILED
INFEASIBLE: Do NOT save. Diagnostics. Create exceptions.
UNKNOWN:    Mark FAILED. Error report.

## SECTION D -- Exact Associate CP-SAT Formulation

### Indices and Decision Variables

E = Associates count, D = Planning dates (7 weekly), S = Shifts (M=0,G=1,E=2,N=3)
SK = Skills, LV = Skill levels (1=Beginner,2=Intermediate,3=Advanced,4=Expert)

x[e][d][s] in {0,1} = 1 iff employee e works shift s on date d
off[e][d]  in {0,1} = 1 iff employee e is off or on leave on date d
shortage[d][i][sk][lv] = IntVar [0, max_demand]

HC-0: sum(x[e][d][s] for s) + off[e][d] = 1  for all e, d

### Hard Constraints

HC-1 (H1 Leave): if (e,d) in approved_leaves: off[e][d] = 1

HC-3 (H3 Skill): Pre-filter: if employee has no matching skill: x[e][d][s]=0 for all d,s
  Coverage linkage below enforces skill-level thresholds via shortage minimization.

HC-4 (H4 Max Hours): Startup assert: shifts[s].durationHours <= MAX_WORKING_HOURS
  Model constraint implied by HC-0. Explicit for future variable-duration shifts.

HC-5 (H5 Availability):
  if (e,d) fully unavailable: off[e][d] = 1
  if shift s outside e window on date d: x[e][d][s] = 0

HC-6 (H6 Rest) -- CORRECTED FORMULA:
  end_of_s1   = shifts[s1].endHour          [17.0 Morning, 31.0 Night->07:00]
  start_of_s2 = shifts[s2].startHour + 24.0  [next day absolute hours]
  rest = start_of_s2 - end_of_s1            [always positive, no modulo]
  if rest < MIN_REST_HOURS: x[e][d][s1] + x[e][d+1][s2] <= 1

  Rest matrix (M=17, G=18, E=23, N=31 endHour):
  M->M: 32-17=15h OK  M->G: 33-17=16h OK  M->E: 38-17=21h OK  M->N: 46-17=29h OK
  G->M: 32-18=14h OK  G->G: 33-18=15h OK  G->E: 38-18=20h OK  G->N: 46-18=28h OK
  E->M: 32-23=9h  BLK E->G: 33-23=10h BLK E->E: 38-23=15h OK  E->N: 46-23=23h OK
  N->M: 32-31=1h  BLK N->G: 33-31=2h  BLK N->E: 38-31=7h  BLK N->N: 46-31=15h OK
  Blocked: E->M, E->G, N->M, N->G, N->E

HC-7 (Weekly OFF): sum(off[e][d] for d in D) = WEEKLY_OFF_COUNT [=2]
HC-8 (Consecutive): sum((1-off[e][d+w]) for w in [0..6]) <= MAX_CONSECUTIVE_DAYS [=6]
HC-9 (Eligibility): if s not in eligible_shifts[e]: x[e][d][s] = 0
HC-10 (Pattern): DAY_ONLY->x[e][d][N]=0; NIGHT_ONLY->x[e][d][M]=x[e][d][G]=x[e][d][E]=0
HC-11 (Locked): locked(e,d,shiftId)->x[e][d][s]=1; locked(e,d,OFF)->off[e][d]=1

### Coverage Linkage

covers(s, i) = 1 iff shift_interval_coverage[shift_id=s, interval=i].coverage_factor > 0
eligible_for_demand(e, sk, lv) = 1 iff employee_skills[e][sk].level_weight >= lv

For all d, i, sk, lv:
  assigned = LinearExpr: sum(x[e][d][s] for eligible e, covering s)
  shortage[d][i][sk][lv] >= demand[d][i][sk][lv] - assigned
  shortage[d][i][sk][lv] >= 0

### Objective Function (Minimize Z)

Z = W_SHORTAGE   * sum(shortage)         coverage shortage [dominant]
  + W_PREF       * non-preferred work    S1/S8
  + W_WKOFF_PREF * off not on pref day  S5
  + W_NIGHT_CONC * consecutive nights   S2
  + W_WKEND      * weekend imbalance    S3
  + W_OVERTIME   * overtime hours       S4
  + W_SHIFT_CHNG * shift changes        S6
  + W_WORKLOAD   * workload spread      S7

S1/S8: addTerm(x[e][d][pref_s], -W_PREF)
S2: both_nights[e][d]=BoolVar; model.addBoolAnd([x[e][d-1][N],x[e][d][N]]).onlyEnforceIf(both_nights)
S3: max_wkend >= weekend_worked[e]; min_wkend <= weekend_worked[e]; penalty on (max-min)
S4: overtime[e] IntVar >= max(0, total_hours[e] - regular_hours * working_days[e])
S5: addTerm(off[e][d], -W_WKOFF_PREF) for preferred off days
S6: shift_changed[e][d] BoolVar penalized when current != previous week shift
S7: max_wl >= workload[e]; min_wl <= workload[e]; penalty on (max_wl - min_wl)

All weights from optimization_weights table (not hard-coded).

## SECTION E -- TL Roster Generation Algorithm

For each TL employee T:
  1. associates[T] = employees WHERE reports_to=T AND effective dates include roster period
  2. For each date d:
     a. Count shift_counts[d] from working associate assignments on date d
     b. derived = argmax(shift_counts[d]); if tie: Section J; if all OFF/LEAVE: null
     c. Hard checks on T: HC-1 leave, HC-5 unavailable, HC-9 eligibility, HC-6 rest
     d. Coverage check (role=TL, date=d): if gap remains, Section J conflict resolution
     e. Assign SHIFT(derived_or_alternative) or MANAGEMENT_COVERAGE_SHORTAGE exception
  3. Weekly OFF: exactly 2 (LEAVE days do NOT count); prefer preferred_off_days; avoid >6 consecutive
  4. Persist to roster_assignments (same version_id, source=SYSTEM)

## SECTION F -- AM Roster Generation Algorithm

Same as Section E:
  Subordinates = TL employees reporting to AM (from generated TL roster)
  Coverage role = AM

## SECTION G -- Manager Roster Generation Algorithm

Same: Subordinates = AM employees; Coverage role = MANAGER

## SECTION H -- Senior Manager Roster Generation Algorithm

Same: Subordinates = Manager employees; Coverage role = SENIOR_MANAGER

## SECTION I -- WFM Roster Generation Algorithm

WFM is cross-functional. Does NOT derive from subordinates.
Configurable: WFM_SCHEDULING_MODE = COVERAGE_DRIVEN (default) / FIXED / INDEPENDENT

For each WFM employee W:
  1. Load wfm_requirements = management_coverage_requirements WHERE role=WFM
  2. For each date d: find shift S satisfying requirements + HC-1,HC-5,HC-9,HC-6
  3. If found: SHIFT(S); else: try any valid shift; if coverage unmet: MANAGEMENT_COVERAGE_SHORTAGE
  4. Exactly 2 OFFs, max 6 consecutive
  5. Persist

## SECTION J -- Management Coverage Conflict Resolution

### Tie-Breaking Priority (Configurable via TIE_BREAK_STRATEGY rule)

Priority 1 ROSTER_CONTINUITY:   Same shift as last week? Use it if hard constraints pass.
Priority 2 MANAGEMENT_COVERAGE: Use shift with largest unfilled coverage gap.
Priority 3 MANAGEMENT_PREFERENCE: Use employee preferred shift if valid.
Priority 4 WORKLOAD_BALANCE: Use shift resulting in most balanced manager workload.
Priority 5 DETERMINISTIC_DEFAULT: Sort valid shifts by shift_code ASC; use first.
  NOT random. Mark in explanation. Create MANAGEMENT_COVERAGE_SHORTAGE if still unmet.

Algorithm:
  valid = candidateShifts filtered by passesHardConstraints(manager, date, shift)
  if valid empty: return null [creates MANAGEMENT_COVERAGE_SHORTAGE exception]
  prev = previousRoster[manager][date]; if prev in valid: return prev
  uncovered = valid where coverageGap > 0
  if uncovered.size==1: return uncovered[0]
  if uncovered.size>1: valid = uncovered
  pref = preferredShift[manager]; if pref in valid: return pref
  return valid.sortBy(workload).first()
  [fallback: return valid.sortBy(shiftCode).first()]

## SECTION K -- Planning Snapshot Design

### New Fields Added to PlanningSnapshot

Map<Long, List<IntervalCoverage>> shiftIntervalCoverage
Map<Long, String> shiftPatternByEmployee
WorkingHoursPolicy workingHoursPolicy {regularHours, maximumHours, overtimeAllowed}
SchedulingRules rules {minRestHours, maxWorkingHours, weeklyOffCount, maxConsecutiveDays}
Set<DayOfWeek> weekendDays [default SAT+SUN]
Map<LocalDate, HolidayPolicy> holidayPolicies {CLOSED/OPERATIONAL/PARTIAL, allowWork}
Map<Long, List<Long>> reportsByManager [managerId -> subordinate IDs]
List<ManagementCoverageRequirement> mgmtCoverageRequirements
String tieBreakStrategy
String snapshotVersion, algorithmVersion, solverVersion, configurationVersion
Instant snapshotCreatedAt

### 22-Step Construction Order

1.  planning_cycle -> dates, projectId
2.  roster_rule_configurations (project-specific or global)
3.  working_hours_policies (project-specific or global)
4.  optimization_weights
5.  employees (ASSOCIATE, active, in project)
6.  shifts (active)
7.  shift_interval_coverage (effective for period)
8.  demand (for cycle, with skill_level join)
9.  employee_skills (valid for period)
10. skill_levels -> skillLevelsByEmployee
11. shift_eligibility -> eligibleShiftsByEmployee
12. shift_patterns -> shiftPatternByEmployee
13. availability
14. leaves (APPROVED, overlapping period)
15. employee_preferences
16. weekly_off_preferences
17. previous roster (most recent PUBLISHED for project)
18. locked assignments (active draft if regenerating)
19. holidays + project_holiday_policies
20. management_coverage_requirements (effective for period)
21. employee_org_assignments -> reportsByManager
22. metadata -> return immutable PlanningSnapshot

Preference review deadline: @Scheduled(fixedRate=60000) job auto-accepts PENDING reviews past deadline.

## SECTION L -- Explainability Design

assignment_explanations table: already in V30 (assignment_id, explanation_json JSONB, created_at)

Explanation JSON Schema:
{
  employee_id, date, assigned_shift, generation_source: CP_SAT / MANAGEMENT_MAJORITY,
  eligibility_checks: {
    leave_check: PASS/FAIL,
    availability_check: PASS/FAIL,
    shift_eligibility: PASS/FAIL,
    skill_check: {required_skill, required_level, employee_level, result},
    rest_check: {rest_hours, required, result},
    hours_check: {shift_duration, max_allowed, result}
  },
  soft_constraint_contributions: {
    preference_match, continuity, overtime_hours, weekend_work
  },
  coverage_contribution: [{interval, skill, level}],
  shortage_reduction: int,
  locked: bool,
  human_readable: string
}

For management assignments:
{
  generation_source: MANAGEMENT_MAJORITY,
  majority_derivation: {subordinate_count, shift_distribution, majority_shift, tie_break_applied},
  coverage_check: {required, assigned, result}
}

Generation: ExplainabilityService.generateExplanations(versionId, snapshot)
  Re-run eligibility checks deterministically from snapshot data.
  Look up shift_interval_coverage for coverage contribution.
  Format human_readable via ExplanationFormatter.
  Persist to assignment_explanations.

## SECTION M -- Post-Publish Replacement Algorithm

Trigger: POST /api/roster/replacements
Input: {original_assignment_id, reason_type, reason, requested_by}

10 Steps:
1. Load original assignment; validate status=PUBLISHED; extract date, shift, project, required skill/level
2. Create roster_replacements record (status=PENDING)
3. Candidate pool = active associates in same project, excluding original employee
4. Hard constraint filters (eliminate on ANY failure):
   H1:  on approved leave on date
   H5:  fully unavailable on date
   H3:  skill_level < required_level for required_skill
   HC9: shift not in eligible_shifts
   H2:  already has PUBLISHED SHIFT on date
   H6:  rest from date-1 assignment < MIN_REST_HOURS
   H6:  rest to date+1 assignment < MIN_REST_HOURS
   HC8: adding work day -> >6 consecutive working days
   HC7: adding work day -> insufficient OFF days remaining in week
5. Score candidates: +100 preferred shift match; +50 workload<avg; +30 same shift last week; +20 same team
6. Sort by score DESC
7. Validate top candidate (re-run H1-H6); try next if fails; UNFILLED if all fail
8. If FILLED: mark original status=CANCELLED (keep for audit); create new row source=REPLACEMENT status=PUBLISHED
   If UNFILLED: replacement_status=UNFILLED; create STAFFING_SHORTAGE exception
9. Audit log: REPLACEMENT_CREATED
10. Notify: REPLACEMENT_REQUIRED->TL; if FILLED: SHIFT_CHANGED->replacement; if UNFILLED: STAFFING_SHORTAGE->WFM

IMMUTABILITY: Published assignments NEVER modified in-place.
Original: status=CANCELLED (audit trail). Replacement: new row source=REPLACEMENT.

## SECTION N -- Worked 7-Day Example

Organization: CustSupport-Alpha project
  3 Teams: Team-A (TL:T01), Team-B (TL:T02), Team-C (TL:T03)
  2 AMs: AM01(T01,T02), AM02(T03)
  Manager: MGR01(AM01,AM02)
  Senior Manager: SM01(MGR01)
  WFM: WFM01
  24 Associates (E01-E24)
  Horizon: Mon Oct 5 - Sun Oct 11 2026

Shifts: M(08-17 endHour=17), G(09-18 endHour=18), E(14-23 endHour=23), N(22-07+1 endHour=31)

Demand (Tech skill, Intermediate+ required): M=7, G=3, E=4, N=2 per day

Management Coverage: TL-M>=1 ALL, TL-E>=1 ALL, AM-M>=1 WEEKDAY,
  MGR-M>=1 WEEKDAY, SM-M>=1 WEEKDAY, WFM-M>=1 ALL

HC-6 Rest Matrix:
  E->M: 9h BLOCKED  E->G: 10h BLOCKED  N->M: 1h BLOCKED  N->G: 2h BLOCKED  N->E: 7h BLOCKED
  All others: ALLOWED

Eligibility pre-filter (HC-9):
  E05(G,E): x[E05][d][M]=0, x[E05][d][N]=0
  E06(G,E,N): x[E06][d][M]=0
  E08(M,G): x[E08][d][E]=0, x[E08][d][N]=0
  E16(E,N): x[E16][d][M]=0, x[E16][d][G]=0
  E24(E,N): x[E24][d][M]=0, x[E24][d][G]=0

Leave constraints (HC-1):
  E03: Mon/Tue/Wed = LEAVE (off[E03][0,1,2]=1). Still needs 2 weekly OFFs (LEAVE != OFF).
  E19: Fri = LEAVE

Sample Associate Roster (Mon-Sun):
  E01: M M M M M OFF OFF  [pref M, Sat/Sun off]
  E02: M M M M M OFF OFF
  E03: L L L M OFF OFF M   [Leave Mon-Wed, OFFs on Fri+Sat, works Thu+Sun]
  E04: M M M M M OFF OFF
  E05: G G G G G OFF OFF  [G/E eligible only]
  E06: N N N N N OFF OFF  [fills night demand]
  E07: M M M M OFF OFF M  [Fri+Sat off pref]
  E08: M M M M M OFF OFF
  [E09-E24 follow similar patterns filling M/G/E/N demand]
  E18: N N N OFF N N OFF  [Night preferred; N->N=15h OK]
  E16: E E E E E OFF OFF
  E24: E E E E E OFF OFF

Monday coverage check:
  M workers(Tech>=Int) = 14 (required 7, OK)
  G workers = 4 (required 3, OK)
  E workers = E16+E24 = 2 (required 4, SHORTAGE gap=2)
  N workers = E06+E18 = 2 (required 2, OK)

Exception: STAFFING_SHORTAGE (Evening, Mon-Sun, Tech/Intermediate, gap=2)
Reason: E03 on leave; E05,E06 not E-eligible; insufficient evening-eligible pool.

TL Roster:
  T01(Team-A Mon): M=5,G=1,N=1 -> majority=M. T01=M. TL-M covered.
  T02(Team-B Mon): M=5,G=2,E=1 -> majority=M. T02=M. TL-E still gap.
  T03(Team-C Mon): M=5,G=1,E=1,N=1 -> majority=M. Coverage conflict: TL-E gap=1.
    Section J P1 Continuity: T03 worked E last week -> T03=E. Gap resolved.
  T01/T02: M|M|M|M|M|OFF|OFF  T03: E|E|E|E|E|OFF|OFF

AM Roster:
  AM01(T01=M,T02=M): majority=M. AM-M weekday met.
  AM02(T03=E): AM02=E.
  AM01: M|M|M|M|M|OFF|OFF  AM02: E|E|E|E|E|OFF|OFF

Manager Roster:
  MGR01(AM01=M,AM02=E): TIE. Section J P1 Continuity: worked M last week -> M.
  MGR01: M|M|M|M|M|OFF|OFF

SM01 -> MGR01=M -> SM01=M.  WFM01 -> coverage WFM-M=1 -> WFM01=M.

Validation: H1-H6=0 violations. All 2 OFFs met. All <=6 consecutive.
Exceptions: 1 (STAFFING_SHORTAGE Evening gap=2)

WFM Manual Adjustment:
  Attempt 1: E07 Wed M->E
    H6 check: E07 Wed=E(23)->Thu=M(32): rest=9h < 11h -> BLOCKED. Override rejected.
  Attempt 2: E07 Wed=E, Thu=OFF (remove Sun from OFF to keep exactly 2)
    E07: M|M|E|OFF|OFF|M|M  (2 OFFs: Thu+Fri)
    H6: Wed=E(23)->Thu=OFF: OK. Sat=M(17)->Sun=M(32): 15h OK. Max consecutive=3. Valid.
    Wed Evening +1. Shortage on Wed reduces to gap=1.
  Audit: WFM_OVERRIDE E07 Wed M->E by WFM01.
  Lock: E07/Wed/Evening locked.
  Approval chain: TL->AM->MGR->SM->WFM. Published.

Post-Publish Replacement: E04 sick Monday Morning.
  23 candidates all eliminated:
    E01-E09,E11,E13,E14,E17,E19,E20,E22,E23: already assigned M on Monday (H2)
    E03: LEAVE (H1)
    E05,E06: M not eligible (H9)
    E10,E12,E15,E16,E21,E24: M not eligible or already assigned (H9/H2)
    E18: already assigned N on Monday (H2)
  Result: UNFILLED. Exception: STAFFING_SHORTAGE E04/Monday/Morning/UNFILLED.
  Notify: REPLACEMENT_REQUIRED->T01, STAFFING_SHORTAGE->WFM01.

## SECTION O -- Implementation Phases

Phase 0: Architecture (This Document) -- COMPLETE

Phase 1: Database and Entities
  V31: users, roster_replacements, working_hours_policies + schema alterations
  V32: seed shift_interval_coverage (M,G,E,N intervals)
  V33: seed management_coverage_requirements defaults
  V34: seed working_hours_policy (global: regular=8, max=9)
  V35: seed users for seeded employees
  Java entities: User, RosterReplacement, WorkingHoursPolicy, SkillLevel,
    ShiftIntervalCoverage, ShiftPattern, RosterRuleConfiguration, OptimizationWeight,
    ManagementCoverageRequirement, PreferenceReview, AssignmentExplanation, PlanningSnapshotEntity

Phase 2: PlanningSnapshotBuilder (22-step), CandidateFilterService,
  RosterRuleConfigurationService, WorkingHoursPolicyService

Phase 3: Complete CP-SAT
  ConstraintBuilder: add H3, H4, shift pattern constraints
  CoverageConstraintBuilder (NEW): shortage vars + coverage linkage
  ObjectiveBuilder (REPLACE): full S1-S8 + shortage penalty
  RosterGenerationOrchestrator (NEW): 21-step orchestration
  RosterOptimizationService: replace stub

Phase 4: Management Roster Engine
  ManagementRosterService: TL/AM/Manager/SM/WFM methods
  MajorityShiftCalculator, ManagementCoverageValidator, WeeklyOffAssigner

Phase 5: Full Validation Engine
  ValidationServiceImpl (REPLACE): H1-H6 + weekly offs + consecutive + eligibility + hierarchy

Phase 6: ExplainabilityService + ExplanationFormatter

Phase 7: ReplacementServiceImpl (REPLACE stub): full 10-step Section M algorithm

Phase 8: API Endpoints
  POST /api/planning-cycles/{id}/generate
  GET  /api/planning-cycles/{id}/snapshot
  GET  /api/roster/{vId}/explanations
  POST /api/roster/replacements
  GET  /api/roster/replacements/{id}
  POST /api/roster/{vId}/wfm-override
  POST /api/roster/{vId}/lock/{assignId}
  POST /api/roster/{vId}/unlock/{assignId}
  GET  /api/roster/{vId}/coverage
  GET  /api/roster/{vId}/metrics
  POST /api/users, POST /api/auth/login, POST /api/auth/refresh
  GET/POST /api/management-coverage-requirements
  POST /api/demand/import

Phase 9: Frontend Portals: WFM -> Associate -> TL -> AM -> Manager -> Senior Manager

Phase 10: 30 deterministic test scenarios + Docker Compose

## Ambiguity Register

1. LEAVE vs weekly OFF: No. Employee needs 2 OFFs beyond LEAVE days. LEAVE_COUNTS_AS_OFF=false
2. WFM scheduling: COVERAGE_DRIVEN by independent demand model. WFM_SCHEDULING_MODE
3. Tie-break order: CONTINUITY->COVERAGE->PREFERENCE->WORKLOAD->SHIFT_CODE. TIE_BREAK_STRATEGY
4. Shift swaps: OUT OF SCOPE V1. Deferred to V2.
5. Overtime: hours > REGULAR_HOURS (default 8.0) per working day.
6. Weekend: Configurable per project. Default Sat+Sun.
7. TL no working subordinates: coverage requirements govern. TL_COVERAGE_GOVERNS_EMPTY_DAYS=true
8. Management replacement: Manual only in V1. MANAGEMENT_REPLACEMENT=MANUAL
9. WFM override bypass constraints: Never allowed. WFM_HARD_CONSTRAINT_BYPASS=false
10. Holiday auto-OFF: No. Per project_holiday_policies (CLOSED/OPERATIONAL/PARTIAL).

## Engineering Rules (Inviolable)

1. No solver code in controllers. Orchestrator -> Service -> Solver.
2. No DB reads during solving. Snapshot is the only data source.
3. No modification of PUBLISHED assignments. Replacements = new rows (source=REPLACEMENT).
4. No hard-coded numbers (9h, 11h, 2 OFFs, 6 days). Always from config tables.
5. Staffing shortage is NOT infeasibility. Always create exception, never abort.
6. No random tie-breaking. Priority cascade always. Always deterministic.
7. No bypassing validation for WFM overrides. H1-H6 always enforced.
8. No separate roster tables per role. One roster_assignments table.
9. No silent business rule inventions. All assumptions marked [ASSUMPTION -- CONFIGURABLE].
10. No authorization in frontend. All auth/authz at backend method level.
