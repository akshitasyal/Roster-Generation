# Second-Pass Architecture & Roster Engine Refinement

## SECTION A: Architecture Gap Analysis
The baseline architecture successfully defined the operational flow, but required deeper specifications to translate into a deterministic, explainable, constraint-based optimizer. The following gaps were identified and resolved:
1. **Interval Coverage Mapping:** The engine lacked a bridging model between continuous shifts (08:00-17:00) and discrete interval demand (08:00-09:00 = 5 heads).
2. **Skill Level Standardization:** Skill matching lacked quantifiable grading (e.g., L1 to L4).
3. **Shift Pattern Consistency:** The model risked oscillating associates between Day and Night shifts arbitrarily within a week.
4. **Hierarchical Management Generation:** The logic for building rosters for TLs, AMs, Managers, Sr Managers, and WFM was implicit, risking simple copy-pasting instead of full 7-day compliant schedule generation.
5. **Configuration Decoupling:** Hardcoded constraints (e.g., 9-hour limit, 11-hour rest) lacked a configuration layer.
6. **Explainability & Replacement:** Post-publish adjustments required a deterministic candidate-finding algorithm without breaking published lineage.

---

## SECTION B: Final Database Schema
Below is the refined schema incorporating the new requirements.

*Core Additions:*
- `users`: (id, employee_id, username, password_hash, role_id) - Decoupled auth.
- `skill_levels`: (id, level_code, level_weight) - e.g., 1=Beginner, 4=Expert.
- `shift_interval_coverage`: (id, shift_id, interval_time, coverage_factor)
- `shift_patterns`: (id, pattern_code, pattern_type) - e.g., ROTATIONAL, DAY_ONLY.
- `roster_rule_configurations`: (id, rule_key, rule_value, effective_date)
- `optimization_weights`: (id, objective_key, weight_value)
- `management_coverage_requirements`: (id, org_level, shift_id, min_required)
- `preference_reviews`: (id, preference_id, reviewer_id, status)
- `assignment_explanations`: (id, assignment_id, explanation_json)
- `planning_snapshots`: (id, generation_run_id, payload_json)

*Constraint Integrity:*
- `UNIQUE(roster_version_id, employee_id, date)` on `roster_assignments`.

---

## SECTION C: Roster Engine Architecture
**Flow of Operations:**
1. **Planning Snapshot:** Freeze all inputs (demand, employees, skills, availability, rules).
2. **Associate Candidate Generation:** Filter mathematically impossible candidates.
3. **CP-SAT Associate Optimization:** Run Google OR-Tools to solve the 7-day associate matrix.
4. **Management Derivations:** Pass 1 (TLs), Pass 2 (AMs), Pass 3 (Managers), Pass 4 (Sr Mgrs), Pass 5 (WFM).
5. **Full Validation:** Cross-check the entire combined roster against hard constraints.
6. **Exceptions Generation:** Flag STAFFING_SHORTAGE and MANAGEMENT_SHORTAGE.
7. **Explainability Logging:** Save deterministic reasons for assignments.

---

## SECTION D: Exact Associate CP-SAT Formulation
**Variables:**
- `x[e][d][s]` ∈ {0,1}: Employee `e` works shift `s` (or OFF) on day `d`.
- `shortage[d][i][sk][lvl]` ≥ 0: Shortage of skill `sk` at level `lvl` on interval `i`.

**Hard Constraints:**
1. **Exactly One State:** `∑(s) x[e][d][s] = 1`
2. **Leave (H1):** `x[e][d][s] = 0` for all work shifts if `e` is on leave day `d`.
3. **Max Hours (H4):** `∑(s) x[e][d][s] * duration(s) <= MAX_HOURS`
4. **Availability (H5):** `x[e][d][s] = 0` if `s` falls outside `e`'s availability.
5. **Rest (H6):** `x[e][d][s1] + x[e][d+1][s2] <= 1` if `rest(s1, s2) < MIN_REST`.
6. **Weekly Offs:** `∑(d) x[e][d][OFF] = WEEKLY_OFF_COUNT`
7. **Max Consecutive Days:** `∑(j=0 to 6) x[e][d+j][s!=OFF] <= MAX_CONSECUTIVE_DAYS`
8. **Shift Patterns:** Restrict allowable sequences of `s` based on employee's pattern.

**Coverage Linkage:**
`assigned[d][i][sk][lvl] = ∑(e with sk>=lvl) ∑(s covering i) x[e][d][s]`
`shortage[d][i][sk][lvl] >= demand[d][i][sk][lvl] - assigned[d][i][sk][lvl]`

**Objective Function (Maximize):**
`Z = - (W_SHORTAGE * ∑ shortage)`
`    + (W_PREF * ∑ x[e][d][s] where s is preferred)`
`    + (W_WEEKLY_OFF * ∑ x[e][d][OFF] where d is preferred)`
`    - (W_OVERTIME * ∑ overtime)`

---

## SECTION E: TL Roster Generation Algorithm
1. **Input:** The published (or optimized) Associate Roster for the 7-day horizon.
2. **Subordinate Mapping:** For each TL, fetch all reporting Associates.
3. **Majority Derivation:** For each day `d`, count the shift distribution of subordinates. Shift with highest count = `Derived_Shift`.
4. **Hard Constraints Check:** Verify TL's leave, availability, 11-hour rest, max hours, and exact 2 OFF days.
5. **Management Coverage Check:** Ensure TL coverage logic across the team is satisfied.
6. **Conflict Resolution:** If `Derived_Shift` violates a hard constraint or coverage rule, evaluate alternative shifts using Section J tie-breaking.
7. **Weekly Roster Output:** Complete 7-day schedule generated for TL.

---

## SECTION F: AM Roster Generation Algorithm
1. **Input:** The generated TL Roster.
2. **Logic:** Repeat Section E, but map AMs to their subordinate TLs. AM's `Derived_Shift` follows the majority shift of their TLs.

---

## SECTION G: Manager Roster Generation Algorithm
1. **Input:** The generated AM Roster.
2. **Logic:** Repeat Section E, mapping Managers to AMs. 

---

## SECTION H: Senior Manager Roster Generation Algorithm
1. **Input:** The generated Manager Roster.
2. **Logic:** Repeat Section E, mapping Sr. Managers to Managers.

---

## SECTION I: WFM Roster Generation Algorithm
1. **Input:** Planning Configurations.
2. **Logic:** WFM roster does not strictly derive from subordinates. It follows a configured independent demand model (e.g., 1 WFM agent required per site per shift).
3. **Execution:** CP-SAT or Rule-based assignment strictly matching WFM shift coverage configurations, respecting standard hard constraints (Leave, Rest, Hours).

---

## SECTION J: Management Coverage Conflict Resolution
If deriving the "majority shift" violates a management coverage requirement (e.g., no TL on the Night Shift, but one is required), the engine uses this tie-breaking cascade to shift a manager to the needed slot:
1. **Roster Continuity:** Who worked this shift last week?
2. **Management Coverage Priority:** Satisfy the strict minimum coverage.
3. **Management Preference:** Who bid for this shift?
4. **Workload Balance:** Who has the lowest accumulated overtime?

---

## SECTION K: Planning Snapshot Design
**Purpose:** Ensure reproducibility and isolate the solver from live transactional database changes.
**Mechanism:** Before CP-SAT executes, a JSON or normalized relational payload is generated combining:
- Target Dates, Rule Configurations, Demand Intervals.
- Employee pool with their mapped static attributes (Skills, Shift Patterns) and dynamic attributes (Leave, Availability).
Stored in `planning_snapshots`, referencing a `generation_run_id`.

---

## SECTION L: Explainability Design
For every assigned shift, the engine generates an object stored in `assignment_explanations`:
```json
{
  "employee_id": "E100", "date": "2026-10-05", "shift": "MORNING",
  "eligibility": {"leave": "PASS", "rest": "PASS(14h)", "skill": "PASS(L3>L2)"},
  "soft_constraints": {"preference": "MATCHED", "continuity": "BROKEN"},
  "coverage_contribution": ["09:00-10:00(L2)"],
  "generation_source": "CP-SAT_SOLVER"
}
```

---

## SECTION M: Post-Publish Replacement Algorithm
When an employee `E001` calls in sick post-publish:
1. **Do NOT** regenerate the entire roster.
2. **Find Shift Requirements:** e.g., Morning, Tech Skill L2.
3. **Query Candidates:** `SELECT e FROM employees WHERE skill >= L2 AND shift_eligible(Morning) AND NOT on_leave AND (rest_from_yesterday >= 11) AND (rest_to_tomorrow >= 11) AND (weekly_offs == 2 if working today) AND (working_days <= 6)`.
4. **Rank Candidates:** By Overtime accumulation, then Preference matching.
5. **Apply Swap/Replacement:** Create a new `roster_assignments` row linked to the active `roster_version_id`, flagged as `MANUAL_REPLACEMENT`.

---

## SECTION N: Worked 7-Day Example (Conceptual)
**Scenario:** 10 Associates, 2 TLs. 7 Days.
- **Demand:** 5 Morning, 5 Night per day.
- **Associate Solve:** CP-SAT assigns 5 to Morning, 5 to Night. E01-E05 get Morning, E06-E10 get Night. Exactly 2 offs distributed per employee using constraints.
- **TL Solve:** TL1 manages E01-E05 (Morning majority). TL2 manages E06-E10 (Night majority).
- TL1 is assigned Morning. TL2 is assigned Night.
- TL1 requests Friday OFF. Hard constraint triggers. TL2 covers Friday Morning, but TL2 needs 11h rest from Thursday Night.
- Engine uses Conflict Resolution (Section J): Assigns TL1 OFF on Friday. TL2 cannot cover Morning due to 11h rest constraint. Engine outputs `MANAGEMENT_COVERAGE_SHORTAGE` for Friday Morning.

---

## SECTION O: Implementation Phases
**PHASE 0:** Architecture Refinement (This Document)
**PHASE 1:** DB Schema & Entity Refinement (Flyway V30-V35, Entities)
**PHASE 2:** Configuration & Planning Snapshot Layer
**PHASE 3:** CP-SAT Roster Engine (Associates)
**PHASE 4:** Management Roster Derivation Engine (TL -> WFM)
**PHASE 5:** Roster Validation & Explainability Logging
**PHASE 6:** WFM API Integration & Post-Publish Adjustments
**PHASE 7:** Frontend UI Integration
