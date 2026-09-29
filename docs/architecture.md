# Workforce Management & Roster Generation System — Architecture

## Overview

Enterprise-grade Workforce Management and Roster Generation System modeled for large-scale BPO/IT service organizations (Tech Mahindra scale). The system automates shift-roster generation across a full organizational hierarchy using constraint-based optimization.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React, TypeScript, Tailwind CSS |
| Backend | Java 17, Spring Boot 3.x, Spring Security, Spring Data JPA |
| Database | PostgreSQL 15 |
| Optimization | Google OR-Tools CP-SAT (Java bindings) |
| Cache | Redis (session caching, background jobs) |
| Migrations | Flyway |
| Documentation | Swagger/OpenAPI 3 |
| Containerization | Docker, Docker Compose |
| Auth | JWT (Spring Security) |
| Logging | SLF4J + Logback (structured JSON) |

---

## Organizational Hierarchy

```
Senior Manager
      |
Manager
      |
Associate Manager (AM)
      |
Team Leader (TL)
      |
Associate

WFM (cross-functional)
```

---

## Roster Generation Flow

```
BUSINESS DEMAND
      |
ASSOCIATE ROSTER   <- CP-SAT Optimization
      |
TL ROSTER          <- Hierarchical Majority + Coverage
      |
AM ROSTER          <- Hierarchical Majority + Coverage
      |
MANAGER ROSTER     <- Hierarchical Majority + Coverage
      |
SENIOR MANAGER ROSTER
      |
WFM ROSTER
      |
COMPLETE ROSTER
      |
VALIDATION         <- Independent Validation Engine
      |
EXCEPTIONS         <- Created for issues, not failures
      |
WFM ADJUSTMENT     <- Manual Override with Re-Validation
      |
RE-VALIDATION
      |
WFM APPROVAL
      |
PUBLISH            <- Immutable Published Version
```

---

## Backend Package Architecture

```
com.wfmYou are a senior enterprise software architect, backend engineer, frontend engineer, database architect, and optimization/scheduling engineer.

You are going to develop a complete production-level Workforce Management and Roster Generation System for an enterprise environment similar to Tech Mahindra.

This is NOT a demo, toy project, CRUD-only application, or simple employee shift scheduler.

Build the system as a production-grade full-stack application with:

Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Enterprise SaaS UI

Backend:
- Java
- Spring Boot
- Spring Security
- REST APIs
- PostgreSQL
- JPA/Hibernate

Optimization:
- Java-based scheduling engine
- Prefer Google OR-Tools CP-SAT for the optimization layer because this is a constraint-heavy discrete scheduling problem.
- Keep the optimization engine modular so the solver implementation can be replaced later if required.

Infrastructure:
- Docker
- Docker Compose
- PostgreSQL
- Redis if genuinely useful for caching/background jobs
- OpenAPI/Swagger
- Flyway or Liquibase for database migrations
- Unit/integration testing
- Production-ready logging
- Audit logging
- Exception handling
- Role-based access control

The final application must be runnable locally with Docker Compose and must have realistic seeded data so the complete roster-generation workflow can be demonstrated.

============================================================
1. BUSINESS PURPOSE
============================================================

The system manages workforce planning and roster generation.

The core problem is:

Given:

- business demand
- projects
- teams
- employees
- organizational hierarchy
- skills
- skill levels
- shift definitions
- shift eligibility
- availability
- approved leave
- employee shift preferences
- weekly-off preferences
- holidays
- management coverage requirements
- previous roster/history
- hard scheduling constraints
- soft scheduling objectives

the system must automatically generate a weekly roster.

The generation process is hierarchical:

Associate Roster
        ↓
TL Roster
        ↓
AM Roster
        ↓
Manager Roster
        ↓
Senior Manager Roster
        ↓
WFM Roster

The final roster contains assignments for the entire organization.

The system must NOT create separate roster tables for each role.

Use one centralized roster assignment model, where the employee's role determines the type of roster assignment.

============================================================
2. ORGANIZATIONAL HIERARCHY
============================================================

The hierarchy is:

Senior Manager
      ↓
Manager
      ↓
Associate Manager (AM)
      ↓
Team Leader (TL)
      ↓
Associate

WFM is a specialized workforce-management function operating across the organization.

Roles:

- ASSOCIATE
- TL
- AM
- MANAGER
- SENIOR_MANAGER
- WFM

One project can contain multiple teams.

One team belongs to a project and has a TL.

Project != Team != Shift.

Employees can change:

- team
- TL
- AM
- manager
- project

over time.

Historical organizational relationships must be preserved.

Use effective-dated organizational assignments rather than overwriting historical relationships.

============================================================
3. PORTALS
============================================================

Build separate role-based portals.

------------------------------------------------------------
ASSOCIATE PORTAL
------------------------------------------------------------

Pages:

- Dashboard
- My Roster
- Submit Preferences
- My Leaves
- Notifications
- Profile
- Help & Support

Associate can:

- view own published roster
- submit shift preferences
- submit weekly-off preferences
- request leave
- view leave status
- view notifications
- view profile

Associate cannot modify the published roster.

------------------------------------------------------------
TL PORTAL
------------------------------------------------------------

Pages:

- Dashboard
- My Team
- Preferences / Leave Review
- Team Roster
- Team Issues
- Notifications
- Profile
- Help & Support

TL can:

- view associates assigned to them
- review employee preferences
- review leave requests according to permissions
- view team roster
- identify team staffing issues
- view team coverage
- review roster
- submit issues/feedback

------------------------------------------------------------
AM PORTAL
------------------------------------------------------------

Pages:

- Dashboard
- My TLs / Teams
- Team Rosters
- Coverage
- Exceptions
- Reviews / Approvals
- Reports
- Notifications
- Profile

AM can view/manage all TLs and teams within scope.

------------------------------------------------------------
MANAGER PORTAL
------------------------------------------------------------

Pages:

- Dashboard
- Organization Overview
- AM / Team Overview
- Roster Review
- Coverage
- Exceptions
- Approvals
- Reports
- Notifications
- Profile

------------------------------------------------------------
SENIOR MANAGER PORTAL
------------------------------------------------------------

Pages:

- Dashboard
- Business / Project Overview
- Workforce Capacity
- Cross-Team Coverage
- Roster Review
- Approvals
- Reports
- Notifications
- Profile

------------------------------------------------------------
WFM PORTAL
------------------------------------------------------------

Pages:

- Dashboard
- Planning Cycles
- Demand Management
- Workforce / Employee Data
- Preferences
- TL / Management Review
- Roster Generation
- Validation & Exceptions
- Roster Adjustments
- Published Rosters
- Reports
- Notifications
- Help & Support

WFM has full operational planning authority.

WFM can:

- generate rosters
- regenerate selected scopes
- review exceptions
- manually modify assignments
- lock assignments
- unlock assignments where authorized
- approve the final roster
- publish the roster
- perform targeted post-publish adjustments

============================================================
4. DATABASE ARCHITECTURE
============================================================

Use PostgreSQL.

Design a normalized relational schema.

Do NOT put everything into a single employee table.

The production database should contain approximately these 28 business tables.

------------------------------------------------------------
ORGANIZATION
------------------------------------------------------------

1. roles

Fields:

- id PK
- code UNIQUE
- name
- description
- created_at
- updated_at

Roles:

ASSOCIATE
TL
AM
MANAGER
SENIOR_MANAGER
WFM

------------------------------------------------------------

2. employees

Fields:

- id PK
- employee_code UNIQUE
- first_name
- last_name
- email
- phone
- role_id FK
- employment_status
- employment_type
- date_of_joining
- last_working_date
- location
- gender
- is_active
- created_at
- updated_at

Do not store skills, eligibility, leave, preferences, or availability directly in this table.

------------------------------------------------------------

3. projects

Fields:

- id PK
- project_code UNIQUE
- project_name
- description
- status
- start_date
- end_date
- timezone
- location
- created_at
- updated_at

------------------------------------------------------------

4. teams

Fields:

- id PK
- team_code UNIQUE
- team_name
- project_id FK
- tl_employee_id FK
- status
- created_at
- updated_at

------------------------------------------------------------

5. employee_org_assignments

Fields:

- id PK
- employee_id FK
- project_id FK
- team_id FK
- reports_to_id FK
- effective_from
- effective_to
- is_primary
- created_at
- updated_at

This table preserves historical hierarchy.

------------------------------------------------------------
WORKFORCE / SKILLS
------------------------------------------------------------

6. skills

Fields:

- id PK
- skill_code UNIQUE
- skill_name
- description
- status
- created_at
- updated_at

------------------------------------------------------------

7. employee_skills

Fields:

- id PK
- employee_id FK
- skill_id FK
- skill_level
- certified
- valid_from
- valid_to
- created_at
- updated_at

------------------------------------------------------------

8. shifts

Fields:

- id PK
- shift_code UNIQUE
- shift_name
- shift_type
- start_time
- end_time
- duration_hours
- is_overnight
- status
- created_at
- updated_at

Example shifts:

M = Morning
G = General
E = Evening
N = Night

Shift timings must be configurable.

Do not hard-code shift timings in Java.

The ONLY universal shift-gap requirement currently defined is:

Minimum 11 hours rest between two shifts.

------------------------------------------------------------

9. shift_eligibility

Fields:

- id PK
- employee_id FK
- shift_id FK
- effective_from
- effective_to
- is_eligible
- created_at
- updated_at

Do NOT store eligibility as a string such as:

"M/G/E"

Instead create individual rows:

employee E01 → Morning
employee E01 → General
employee E01 → Evening

This is important for the scheduling engine.

------------------------------------------------------------

10. availability

Fields:

- id PK
- employee_id FK
- date
- available_from
- available_to
- availability_status
- reason
- created_at
- updated_at

------------------------------------------------------------

11. leaves

Fields:

- id PK
- employee_id FK
- leave_type
- start_date
- end_date
- status
- approved_by
- approved_at
- reason
- created_at
- updated_at

Approved leave is a hard constraint.

------------------------------------------------------------
PREFERENCES
------------------------------------------------------------

12. employee_preferences

Fields:

- id PK
- employee_id FK
- planning_cycle_id FK
- preferred_shift_id FK
- preference_rank
- created_at
- updated_at

------------------------------------------------------------

13. weekly_off_preferences

Fields:

- id PK
- employee_id FK
- planning_cycle_id FK
- day_of_week
- preference_rank
- created_at
- updated_at

Weekly-off preference is a soft constraint.

The employee receives exactly 2 weekly OFF days.

The two OFF days do NOT have to be consecutive.

No employee may work more than 6 consecutive working days.

------------------------------------------------------------
PLANNING / DEMAND
------------------------------------------------------------

14. planning_cycles

Fields:

- id PK
- project_id FK
- cycle_name
- start_date
- end_date
- status
- preference_open_at
- preference_lock_at
- generation_started_at
- generation_completed_at
- created_by
- created_at
- updated_at

Typical cycle:

Monday–Sunday or configured 7-day period.

------------------------------------------------------------

15. demand_configurations

Fields:

- id PK
- project_id FK
- name
- formula_type
- aht
- shrinkage
- occupancy
- utilization
- service_level
- interval_minutes
- effective_from
- effective_to
- is_active
- created_at
- updated_at

Demand formula must be configurable.

Do NOT hard-code demand calculation logic around one formula.

Parameters such as:

LH
AHT
SHR
UT
OCC

may be configured according to the business formula.

If the exact formula is not provided, create a configurable formula framework and clearly mark the formula implementation point instead of inventing a business formula.

------------------------------------------------------------

16. demand

Fields:

- id PK
- planning_cycle_id FK
- project_id FK
- date
- interval_start
- interval_end
- shift_id nullable
- skill_id nullable
- role_id nullable
- required_headcount
- source
- created_at
- updated_at

This table must support both:

ASSOCIATE DEMAND

and

MANAGEMENT COVERAGE DEMAND.

Example:

Associate:

role = ASSOCIATE
skill = TECHNICAL_SUPPORT
required_headcount = 8

Management:

role = TL
skill = null
required_headcount = 2

------------------------------------------------------------

17. holidays

Fields:

- id PK
- holiday_name
- holiday_date
- holiday_type
- country
- state
- location
- is_optional
- created_at
- updated_at

------------------------------------------------------------

18. project_holiday_policies

Fields:

- id PK
- project_id FK
- holiday_id FK
- policy
- required_staffing
- allow_work
- comp_off_enabled
- created_at
- updated_at

Holiday policy can be:

CLOSED
OPERATIONAL
PARTIAL

Public holiday does NOT automatically mean everyone is off.

------------------------------------------------------------
ROSTER
------------------------------------------------------------

19. roster_versions

Fields:

- id PK
- planning_cycle_id FK
- version_number
- version_type
- status
- parent_version_id nullable
- generated_by
- generated_at
- approved_by
- approved_at
- published_at
- created_at
- updated_at

Every generation should create a version.

Never overwrite the original generated roster.

------------------------------------------------------------

20. roster_assignments

THIS IS THE CENTRAL ROSTER TABLE.

Fields:

- id PK
- roster_version_id FK
- employee_id FK
- project_id FK
- team_id FK nullable
- date
- shift_id FK nullable
- assignment_type
- status
- source
- locked
- created_at
- updated_at

assignment_type can include:

SHIFT
OFF
LEAVE
UNAVAILABLE

The same table must store:

Associates
TLs
AMs
Managers
Senior Managers
WFM

Do NOT create:

tl_roster
am_roster
manager_roster

as separate tables.

------------------------------------------------------------

21. roster_locks

Fields:

- id PK
- roster_assignment_id FK
- locked_by
- locked_at
- reason

Locked assignments cannot be modified by the optimizer.

------------------------------------------------------------

22. coverage

Fields:

- id PK
- roster_version_id FK
- project_id FK
- date
- interval_start
- interval_end
- shift_id nullable
- skill_id nullable
- role_id nullable
- required_headcount
- assigned_headcount
- gap
- excess
- coverage_status
- created_at
- updated_at

Coverage status:

COVERED
SHORTAGE
EXCESS

------------------------------------------------------------
VALIDATION / OPERATIONS
------------------------------------------------------------

23. exceptions

Fields:

- id PK
- roster_version_id FK
- planning_cycle_id FK
- exception_type
- severity
- employee_id nullable
- date nullable
- shift_id nullable
- skill_id nullable
- required_count nullable
- assigned_count nullable
- gap nullable
- description
- status
- resolved_by
- resolved_at
- created_at
- updated_at

Examples:

STAFFING_SHORTAGE
SKILL_SHORTAGE
NO_ELIGIBLE_EMPLOYEE
AVAILABILITY_CONFLICT
MANUAL_OVERRIDE_REQUIRED
REST_VIOLATION
OTHER

------------------------------------------------------------

24. roster_adjustments

Fields:

- id PK
- roster_version_id FK
- roster_assignment_id FK
- employee_id FK
- date
- old_shift_id nullable
- new_shift_id nullable
- adjustment_type
- reason
- requested_by
- approved_by
- status
- created_at
- updated_at

Used for:

- WFM manual overrides
- replacements
- post-publish changes
- employee unavailability
- coverage adjustments

------------------------------------------------------------

25. approvals

Fields:

- id PK
- roster_version_id FK
- approval_level
- approver_employee_id FK
- status
- comments
- approved_at
- created_at
- updated_at

Possible levels:

TL_REVIEW
AM_REVIEW
MANAGER_REVIEW
SENIOR_MANAGER_REVIEW
WFM_APPROVAL

WFM is the final approval authority in the current design.

------------------------------------------------------------

26. generation_runs

Fields:

- id PK
- planning_cycle_id FK
- roster_version_id FK
- scope
- algorithm_name
- algorithm_version
- solver_name
- started_at
- completed_at
- status
- objective_value
- hard_violations
- coverage_gap
- execution_time_ms
- error_message
- created_by

This is important for production debugging.

------------------------------------------------------------

27. audit_logs

Fields:

- id PK
- entity_type
- entity_id
- action
- old_value
- new_value
- performed_by
- performed_at
- ip_address
- metadata

All important roster modifications must be auditable.

------------------------------------------------------------

28. notifications

Fields:

- id PK
- recipient_employee_id FK
- notification_type
- title
- message
- reference_type
- reference_id
- is_read
- created_at
- read_at

============================================================
5. FINAL HARD CONSTRAINTS
============================================================

These are the finalized HARD constraints.

H1:
An employee cannot be assigned when they are on approved leave.

H2:
An employee cannot work two overlapping shifts.

H3:
An employee must have the required skill and skill level for the assignment.

H4:
An employee cannot exceed 9 working hours.

H5:
An employee cannot be assigned outside their permitted availability.

H6:
At least 11 hours of rest must exist between two shifts.

IMPORTANT:

Minimum staffing is NOT a universal hard constraint.

If there are insufficient eligible employees, the engine must be able to generate a roster with a staffing gap and create an exception.

Never fake coverage.

Never assign an ineligible employee simply to satisfy demand.

============================================================
6. FINAL SOFT CONSTRAINTS
============================================================

The optimization engine should attempt to optimize:

S1:
Employees prefer morning shifts.

S2:
Avoid too many consecutive night shifts.

S3:
Distribute weekend work fairly.

S4:
Minimize overtime.

S5:
Honor employee preferred weekly offs.

S6:
Minimize shift changes.

S7:
Balance workload fairly among associates.

S8:
Minimize the number of employees moved away from their preferred shift.

These are NOT hard pass/fail rules.

The optimizer should calculate a weighted objective.

Weights must be configurable rather than hard-coded throughout the code.

============================================================
7. ASSOCIATE ROSTER GENERATION
============================================================

The associate roster is generated first.

Process:

1. Load planning cycle.
2. Load demand.
3. Load employees.
4. Load skills.
5. Load shift definitions.
6. Load shift eligibility.
7. Load availability.
8. Load approved leave.
9. Load preferences.
10. Load weekly-off preferences.
11. Load previous roster/history.
12. Load holidays and project holiday policy.
13. Generate candidate assignments.
14. Apply hard constraints.
15. Generate weekly OFF assignments.
16. Generate associate shift assignments.
17. Calculate coverage.
18. Optimize soft constraints.
19. Recalculate coverage.
20. Repeat optimization until no meaningful improvement or configured optimization limit.
21. Produce final associate roster.

The engine must optimize across the FULL planning horizon.

Do NOT make isolated Monday decisions without considering Tuesday-Sunday.

Weekly OFF, 6-consecutive-day rules, rest requirements, workload and shift continuity all interact across days.

============================================================
8. DECISION VARIABLE
============================================================

Model assignment conceptually as:

x[e][d][s] = 1

if employee e works shift s on date d.

Otherwise:

x[e][d][s] = 0.

OFF should also be represented in the scheduling model.

Use OR-Tools CP-SAT in Java unless there is a compelling technical reason not to.

Create a dedicated optimization module.

Do NOT put solver code directly inside REST controllers or JPA entities.

Recommended structure:

optimization/
    RosterOptimizationService
    RosterModelBuilder
    ConstraintBuilder
    ObjectiveBuilder
    SolverRunner
    SolutionMapper

============================================================
9. HARD CONSTRAINT IMPLEMENTATION
============================================================

The optimization model must enforce:

LEAVE:

If employee has approved leave on date d:

employee cannot receive a shift assignment.

OVERLAP:

Two overlapping shifts cannot be assigned to the same employee.

SKILL:

Employee must possess the required skill and skill level.

MAX HOURS:

Total assigned hours for the relevant scheduling period/day must not exceed configured maximum.

Current maximum = 9 hours.

AVAILABILITY:

Shift must fall within employee's permitted availability.

REST:

For every pair of shifts assigned on consecutive work periods:

rest >= 11 hours.

Do not hard-code only Night → Morning.

Build a generalized shift compatibility/rest matrix.

WEEKLY OFF:

Employee must receive exactly 2 OFF days per planning week.

No employee may work more than 6 consecutive working days.

============================================================
10. COVERAGE MODEL
============================================================

Coverage must be evaluated by:

- date
- interval
- shift
- project
- role
- skill where applicable

Example:

Required:

Evening = 5

Assigned:

Evening = 4

Result:

gap = 1

Do not make this automatically infeasible.

Create:

STAFFING_SHORTAGE exception.

The engine should try to reduce the gap through optimization.

If no valid employee exists, leave the gap and escalate it.

============================================================
11. MANAGEMENT ROSTER GENERATION
============================================================

THIS IS CRITICAL.

After the associate roster is stabilized, generate management rosters.

Hierarchy:

Associate
   ↓
TL
   ↓
AM
   ↓
Manager
   ↓
Senior Manager
   ↓
WFM

------------------------------------------------------------
TL ROSTER
------------------------------------------------------------

For every TL and every day:

Look at the shifts of the associates under that TL.

Example:

Morning = 5
General = 1
Evening = 2

TL shift:

Morning

This is the majority-shift rule.

But the TL must still receive a COMPLETE weekly roster.

Example:

Mon → Morning
Tue → Morning
Wed → Morning
Thu → OFF
Fri → Morning
Sat → OFF
Sun → Morning

TL roster must respect:

- leave
- availability
- shift eligibility
- max 9 hours
- 11-hour rest
- maximum 6 consecutive working days
- management coverage requirements

Do NOT assume TL works every day.

------------------------------------------------------------
AM ROSTER
------------------------------------------------------------

For each AM:

Look at TL rosters under that AM.

Example:

TL01 → Morning
TL02 → Morning
TL03 → Evening

AM shift:

Morning

Generate a full weekly AM roster, including OFF days.

------------------------------------------------------------
MANAGER ROSTER
------------------------------------------------------------

Look at AM rosters under the Manager.

Use the same hierarchical majority concept.

Generate complete weekly Manager roster.

------------------------------------------------------------
SENIOR MANAGER ROSTER
------------------------------------------------------------

Look at Manager rosters.

Generate complete weekly Senior Manager roster.

------------------------------------------------------------
WFM ROSTER
------------------------------------------------------------

Generate WFM roster based on senior-management/business coverage requirements and configured WFM scheduling rules.

============================================================
12. MANAGEMENT COVERAGE
============================================================

Do NOT simply calculate majority and ignore coverage.

Management scheduling has two checks:

1. Derived shift from subordinate roster.

2. Required management coverage.

Example:

Required:

Morning TL coverage = 1
Evening TL coverage = 1

If all TLs are derived as Morning, create a management coverage conflict.

The system should:

- evaluate whether another valid assignment is possible
- optimize management coverage
- respect hard constraints
- create an exception if the requirement cannot be met

Do not silently violate the management requirement.

============================================================
13. TIE BREAKING
============================================================

If there is a tie in majority shift:

Example:

Morning = 3
Evening = 3

Do NOT randomly choose.

Use a configurable tie-breaking strategy.

Possible priority:

1. Existing/previous roster continuity
2. Management coverage requirement
3. Employee/management preference
4. WFM decision/exception

Make this configurable.

============================================================
14. COMPLETE ROSTER MODEL
============================================================

The final roster must look conceptually like:

Employee | Role | Date | Shift

E001 | Associate | Monday | Morning
E002 | Associate | Monday | Morning
E003 | Associate | Monday | Evening

TL01 | TL | Monday | Morning
TL02 | TL | Monday | Evening

AM01 | AM | Monday | Morning

Manager01 | Manager | Monday | Morning

SM01 | Senior Manager | Monday | Morning

WFM01 | WFM | Monday | Morning

All assignments must live in roster_assignments.

============================================================
15. ROSTER VERSIONING
============================================================

Never overwrite generated rosters.

Use:

Version 1:
Algorithm-generated draft

Version 2:
WFM-adjusted draft

Version 3:
Final approved/published roster

Use parent_version_id to track lineage.

============================================================
16. WFM MANUAL OVERRIDE
============================================================

WFM can change:

E08
Thursday
Morning → Evening

Before saving, run validation.

Check:

- skill
- shift eligibility
- availability
- leave
- overlap
- 9-hour limit
- 11-hour rest
- weekly-off rules
- coverage impact

If valid:

accept override.

If invalid:

reject and explain exactly why.

Example:

"Override rejected:
Employee E08 does not have Evening shift eligibility."

Do not allow invalid assignments to be saved.

============================================================
17. LOCKED ASSIGNMENTS
============================================================

WFM can lock an assignment.

Example:

E08
Thursday
Evening
LOCKED

The optimizer must not modify locked assignments.

The UI must clearly show locked assignments.

============================================================
18. POST-PUBLISH UNAVAILABILITY
============================================================

If an employee becomes unavailable after publication:

DO NOT regenerate the entire roster.

Process:

Employee unavailable
        ↓
Find published assignment
        ↓
Identify date/shift/project/team/skill
        ↓
Recalculate coverage
        ↓
If coverage remains sufficient:
    keep roster unchanged except availability status
        ↓
If shortage:
    find replacement candidates
        ↓
apply hard constraints
        ↓
rank using soft constraints
        ↓
select replacement
        ↓
create roster adjustment
        ↓
audit
        ↓
notify relevant users

Candidate replacement rules:

- correct project where required
- required skill
- correct skill level
- shift eligible
- available
- not on leave
- no overlap
- max 9 hours
- 11-hour rest
- weekly-off rules
- minimize overtime
- minimize disruption
- prefer lower workload where possible

If no replacement exists:

create unresolved staffing shortage exception.

============================================================
19. PREFERENCE WORKFLOW
============================================================

Current workflow:

Monday 09:00:
WFM opens preference submission.

Employees submit next week's preferences.

Tuesday 11:00:
Preference submission closes.

Preferences lock.

Preferences are routed to TLs.

TL review period:

Tuesday 12:00 through Thursday 10:00.

TL can DECLINE a preference.

TL does not "approve" the preference.

If TL does not decline before deadline:

preference is automatically accepted.

If TL is absent:

auto-accept.

After lock:

WFM uses:

- demand
- employee data
- skills
- availability
- leave
- shift eligibility
- preferences
- TL review outcome

to generate the roster.

Make these deadlines configurable per planning cycle.

============================================================
20. VALIDATION ENGINE
============================================================

Build a completely separate validation service.

Before WFM receives the draft, validate:

H1 Leave violations = 0
H2 Overlap violations = 0
H3 Skill violations = 0
H4 >9-hour violations = 0
H5 Availability violations = 0
H6 <11-hour rest violations = 0

Also validate:

- weekly OFF count
- >6 consecutive work days
- invalid shift eligibility
- management hierarchy consistency
- roster assignment integrity

Coverage is evaluated separately.

Minimum staffing shortage is NOT a hard validation failure.

It becomes an exception.

============================================================
21. SOFT-CONSTRAINT METRICS
============================================================

After generation calculate:

- morning preference satisfaction %
- weekly-off preference satisfaction %
- weekend fairness
- overtime count/hours
- shift changes
- workload balance
- preferred-shift retention %
- night-shift distribution
- staffing gaps
- management coverage

Show these metrics in the WFM UI.

Example:

Morning Preference: 82%
Weekly-Off Preference: 75%
Overtime: 0
Shift Changes: 3
Coverage Gaps: 2
Hard Violations: 0

Do not represent soft metrics as hard failures.

============================================================
22. API ARCHITECTURE
============================================================

Use REST APIs.

Organize backend packages approximately:

com.company.wfm

    config/
    security/

    employee/
    organization/
    project/
    team/
    skill/
    shift/
    availability/
    leave/
    preference/
    planning/
    demand/

    roster/
        controller/
        service/
        repository/
        entity/
        dto/

    optimization/
        RosterOptimizationService
        RosterModelBuilder
        ConstraintBuilder
        ObjectiveBuilder
        SolverRunner

    coverage/
    validation/
    exception/
    adjustment/
    approval/
    notification/
    audit/

Use:

Controller
    ↓
Service
    ↓
Repository

Do not put business logic in controllers.

Do not expose JPA entities directly through APIs.

Use DTOs.

============================================================
23. IMPORTANT API ENDPOINTS
============================================================

Build APIs such as:

POST /api/planning-cycles

GET /api/planning-cycles

GET /api/planning-cycles/{id}

POST /api/planning-cycles/{id}/generate

POST /api/planning-cycles/{id}/validate

GET /api/planning-cycles/{id}/roster

GET /api/planning-cycles/{id}/coverage

GET /api/planning-cycles/{id}/exceptions

POST /api/roster/{versionId}/adjustments

POST /api/roster/{versionId}/lock

POST /api/roster/{versionId}/unlock

POST /api/roster/{versionId}/approve

POST /api/roster/{versionId}/publish

GET /api/employees

GET /api/employees/{id}

POST /api/employees

PUT /api/employees/{id}

GET /api/employees/{id}/roster

GET /api/teams/{id}/roster

GET /api/tl/{id}/team-roster

GET /api/management-roster

POST /api/preferences

POST /api/leaves

GET /api/coverage

GET /api/exceptions

GET /api/audit

Implement proper authorization on every endpoint.

============================================================
24. ROLE-BASED ACCESS CONTROL
============================================================

Associate:

Can see own information.

TL:

Can see/manage assigned team.

AM:

Can see/manage teams/TLs under scope.

Manager:

Can see/manage AMs/TLs/Associates under scope.

Senior Manager:

Can see broader organization/project scope.

WFM:

Can operate across workforce/project scope according to permissions.

Never rely on frontend hiding buttons for security.

Every API must enforce authorization.

============================================================
25. FRONTEND ARCHITECTURE
============================================================

Use:

Next.js App Router
TypeScript
Tailwind CSS

Create:

app/
    dashboard/
    associate/
    tl/
    am/
    manager/
    senior-manager/
    wfm/

Use reusable components:

- DataTable
- RosterGrid
- ShiftBadge
- CoverageCard
- ExceptionCard
- PreferenceCard
- EmployeeSelector
- ShiftSelector
- RosterCell
- RosterTimeline
- ApprovalPanel
- AdjustmentModal
- ValidationSummary
- OptimizationMetrics
- FilterBar

The roster UI should support:

- weekly grid
- employee rows
- days as columns
- shift values inside cells
- OFF
- leave
- unavailable
- locked assignment indicators
- coverage indicators
- exceptions
- filtering by team/role/shift/date
- search
- export

Use a professional enterprise UI.

Tech Mahindra-inspired visual direction:

- dark navy sidebar
- red accent
- light workspace
- clean enterprise SaaS design
- minimal decoration
- strong information hierarchy
- responsive layout

Do not use excessive decorative elements.

============================================================
26. WFM ROSTER GENERATION SCREEN
============================================================

Build a serious WFM workflow.

Example:

ROSTER GENERATION

Planning Cycle:
05 Oct – 11 Oct

Project:
ABC Customer Support

Scope:
[Entire Project]

Options:

[Generate Roster]

Then show:

Employees: 150
Required Assignments: 900
Generated Assignments: 884
Coverage Gaps: 16
Hard Violations: 0

Optimization:

Morning Preference: 84%
Weekly Off Satisfaction: 79%
Overtime: 2 hours
Workload Balance: 91%
Shift Retention: 88%

Actions:

[View Roster]
[View Coverage]
[View Exceptions]
[Adjust Roster]
[Validate]
[Approve]
[Publish]

============================================================
27. ROSTER GENERATION SCOPES
============================================================

Support:

FULL_WEEK
SINGLE_DAY
SPECIFIC_SHIFT
SPECIFIC_TEAM
SPECIFIC_TL
STAFFING_GAP
REPLACEMENT

If generating a single day:

Do not modify other locked days.

If an assignment is locked:

Do not change it.

If a WFM adjustment is made:

preserve original version/history.

============================================================
28. AUDIT REQUIREMENTS
============================================================

Every significant change must be auditable.

Record:

- who
- what
- old value
- new value
- timestamp
- reason
- entity
- entity ID

Examples:

Employee shift changed.

Employee moved teams.

Leave approved.

Roster generated.

Roster regenerated.

Roster manually adjusted.

Roster assignment locked.

Roster published.

Roster unpublished if that operation is allowed.

============================================================
29. DATABASE INDEXING
============================================================

Create proper indexes.

Important indexes:

employees(employee_code)
employees(role_id)
employees(is_active)

employee_org_assignments(employee_id, effective_from, effective_to)
employee_org_assignments(team_id)
employee_org_assignments(reports_to_id)

employee_skills(employee_id, skill_id)

shift_eligibility(employee_id, shift_id)

availability(employee_id, date)

leaves(employee_id, start_date, end_date)

demand(planning_cycle_id, date, interval_start)
demand(project_id, date)

roster_versions(planning_cycle_id, version_number)

roster_assignments(roster_version_id, employee_id, date)
roster_assignments(roster_version_id, date, shift_id)

coverage(roster_version_id, date, interval_start)

exceptions(roster_version_id, status)

audit_logs(entity_type, entity_id, performed_at)

============================================================
30. TRANSACTIONS AND CONCURRENCY
============================================================

Roster generation must be transactional where appropriate.

Prevent:

- two WFM users generating conflicting versions simultaneously
- two users publishing different versions
- race conditions during manual adjustment
- modification of already published immutable assignments

Use optimistic locking/version columns where appropriate.

Published roster versions should be immutable.

Changes after publishing must create adjustments/new versions.

============================================================
31. ERROR HANDLING
============================================================

Use global Spring Boot exception handling.

Return structured errors:

{
    "timestamp": "...",
    "status": 400,
    "error": "VALIDATION_ERROR",
    "message": "...",
    "details": [...]
}

Do not expose stack traces to users.

Log internal exceptions with correlation IDs.

============================================================
32. TESTING
============================================================

Create comprehensive tests.

UNIT TESTS:

- eligibility filtering
- leave filtering
- availability filtering
- skill filtering
- overlap detection
- 9-hour validation
- 11-hour rest validation
- weekly-off generation
- 6-consecutive-day detection
- coverage calculation
- majority shift calculation
- management shift generation
- preference scoring
- workload balancing
- replacement candidate selection

OPTIMIZATION TESTS:

Create deterministic datasets and verify:

- no hard constraint violations
- correct OFF count
- no overlap
- rest >= 11 hours
- no assignment on leave
- skill requirements
- max 9 hours

INTEGRATION TESTS:

- database
- REST APIs
- authentication
- roster generation
- approval
- publishing
- manual adjustment

END-TO-END TEST:

Create a complete project with:

- 20+ associates
- 3 TLs
- 2 AMs
- 1 Manager
- 1 Senior Manager
- 1 WFM

Generate a full 7-day roster.

Verify the complete hierarchy.

============================================================
33. SEED DATA
============================================================

Create realistic seed data.

At minimum:

1 project
3 teams
20+ associates
3 TLs
2 AMs
1 Manager
1 Senior Manager
1 WFM

Skills:

Customer Support
Technical Support
Billing

Shifts:

Morning
General
Evening
Night

Include:

- different shift eligibility
- different skills
- different skill levels
- availability restrictions
- approved leaves
- shift preferences
- weekly-off preferences
- demand
- management coverage requirements
- at least one staffing shortage
- at least one WFM adjustment scenario

The seed data must demonstrate the complete algorithm.

============================================================
34. DEMONSTRATION SCENARIO
============================================================

The seeded application must allow the following demonstration:

1. WFM creates planning cycle.

2. Demand exists.

3. Employees submit preferences.

4. Preferences lock.

5. TLs review preferences.

6. WFM generates roster.

7. Associate roster is generated.

8. Coverage is calculated.

9. Soft constraints are optimized.

10. TL rosters are generated from associate rosters.

11. AM rosters are generated from TL rosters.

12. Manager roster is generated from AM rosters.

13. Senior Manager roster is generated from Manager rosters.

14. WFM roster is generated.

15. Complete roster is validated.

16. Exceptions are generated.

17. WFM changes one employee assignment.

18. System validates the change.

19. Audit entry is created.

20. WFM locks an assignment.

21. System prevents optimizer from modifying it.

22. WFM approves roster.

23. WFM publishes roster.

24. An associate becomes unavailable.

25. System identifies affected assignment.

26. System calculates coverage gap.

27. System searches replacement candidates.

28. Replacement is selected if possible.

29. Adjustment and audit records are created.

30. Relevant users receive notifications.

============================================================
35. SECURITY
============================================================

Implement Spring Security.

Use JWT or enterprise-compatible authentication abstraction.

Implement:

- authentication
- authorization
- role-based access
- endpoint authorization
- method-level security
- password hashing if local authentication is used
- refresh token strategy if applicable
- audit of sensitive actions

Never trust role information sent by frontend.

============================================================
36. LOGGING / OBSERVABILITY
============================================================

Implement:

- structured logging
- correlation ID
- generation run ID
- roster version ID
- request ID

Every roster-generation operation should be traceable.

Example:

GENERATION RUN
GR-2026-001

ROSTER VERSION
RV-2026-001-V1

This allows debugging production issues.

============================================================
37. DOCKER
============================================================

Provide:

docker-compose.yml

Services:

frontend
backend
postgres

Optional:

redis

Use environment variables.

Provide:

.env.example

Never hard-code secrets.

============================================================
38. DATABASE MIGRATIONS
============================================================

Use Flyway or Liquibase.

Do not rely on Hibernate auto-create for production.

Create migration scripts in proper order:

V1__roles.sql
V2__employees.sql
V3__projects.sql
...

Include foreign keys and indexes.

============================================================
39. API DOCUMENTATION
============================================================

Use Swagger/OpenAPI.

Every endpoint must have:

- description
- request schema
- response schema
- authentication requirement
- possible errors

============================================================
40. REPORTING
============================================================

Provide WFM reports:

- staffing coverage
- staffing gaps
- employee utilization
- overtime
- shift distribution
- weekend distribution
- preference satisfaction
- roster changes
- exceptions
- management coverage

Do not make reports the source of truth.

Reports must query operational data.

============================================================
41. IMPORTANT ENGINEERING RULES
============================================================

DO NOT:

- create one giant service class
- put business logic in controllers
- put solver logic inside controllers
- store eligibility as "M/G/E"
- duplicate roster tables by role
- hard-code shift timings
- hard-code demand formulas
- treat preferences as hard constraints
- treat staffing shortage as a hard constraint
- overwrite published rosters
- bypass validation for manual WFM changes
- let frontend enforce authorization
- use fake/mock roster logic in production code

DO:

- use domain-oriented services
- use DTOs
- use validation
- use transactions
- use repository abstraction
- use database migrations
- use versioned rosters
- use audit logs
- use configurable optimization weights
- use deterministic test datasets
- maintain separation between optimization and persistence
- preserve historical roster versions

============================================================
42. PROJECT STRUCTURE
============================================================

Use a clean monorepo:

/frontend
    /app
    /components
    /features
    /lib
    /hooks
    /types
    /services

/backend
    /src/main/java
        /config
        /security
        /employee
        /organization
        /project
        /team
        /skill
        /shift
        /availability
        /leave
        /preference
        /planning
        /demand
        /roster
        /optimization
        /coverage
        /validation
        /exception
        /adjustment
        /approval
        /notification
        /audit

    /src/main/resources
        /db/migration

/infrastructure
    docker-compose.yml

/docs
    architecture.md
    database.md
    roster-engine.md
    api.md
    deployment.md
    testing.md

============================================================
43. DEVELOPMENT APPROACH
============================================================

Do not attempt to generate thousands of lines of code blindly in one step.

Develop in phases.

PHASE 1:
Project setup
Database
Migrations
Entities
Repositories
Seed data

PHASE 2:
Authentication
Authorization
Roles
Organization hierarchy

PHASE 3:
Employee/skill/shift/availability/leave management

PHASE 4:
Planning cycle
Demand management
Preferences
Weekly-off preferences

PHASE 5:
Roster optimization engine

PHASE 6:
Coverage and validation

PHASE 7:
Management roster generation

PHASE 8:
WFM adjustments
Locks
Versioning
Audit

PHASE 9:
Approval and publishing

PHASE 10:
Post-publish replacement engine

PHASE 11:
Frontend portals

PHASE 12:
Reports
Notifications
Testing
Docker
Documentation

At the end of every phase:

- compile
- run tests
- fix errors
- verify database migrations
- verify API contracts
- verify frontend build

Do not proceed while the previous phase is fundamentally broken.

============================================================
44. OPTIMIZATION ENGINE DESIGN
============================================================

Use CP-SAT through OR-Tools Java.

Keep the solver implementation isolated.

Create an internal model:

PlanningModel

containing:

- employees
- dates
- shifts
- skills
- demand
- availability
- leave
- preferences
- weekly offs
- existing assignments
- locked assignments
- management requirements

Create:

RosterModelBuilder

which converts database data into solver variables.

Create:

ConstraintBuilder

which adds all hard constraints.

Create:

ObjectiveBuilder

which creates weighted soft objectives.

Create:

SolverRunner

which runs CP-SAT.

Create:

SolutionMapper

which converts solver output into roster assignments.

Never let the solver directly write to PostgreSQL.

Flow:

Database
    ↓
Planning Snapshot
    ↓
Optimization Model
    ↓
CP-SAT
    ↓
Solution
    ↓
Validation
    ↓
Roster Version
    ↓
Database

============================================================
45. OPTIMIZATION OBJECTIVE
============================================================

Create configurable weights.

Conceptually:

Minimize:

coverage shortage penalty
+
morning preference penalty
+
weekly-off preference penalty
+
night concentration penalty
+
weekend imbalance penalty
+
overtime penalty
+
shift-change penalty
+
workload imbalance penalty
+
preferred-shift movement penalty

Coverage shortage is penalized heavily but is not an absolute hard constraint.

Hard constraints must NEVER be violated to improve the objective.

Make objective weights configurable per project/planning cycle.

============================================================
46. FINAL ARCHITECTURAL PRINCIPLE
============================================================

The architecture must enforce this distinction:

HARD CONSTRAINTS
=
What the roster is allowed to do.

SOFT CONSTRAINTS
=
What the roster should preferably do.

COVERAGE
=
How well the roster satisfies business demand.

MANAGEMENT COVERAGE
=
Whether the organization has sufficient leadership coverage.

VALIDATION
=
Independent verification that the generated roster is valid.

EXCEPTIONS
=
Things that require human attention.

WFM
=
Human operational control and final approval.

============================================================
47. FINAL ACCEPTANCE CRITERIA
============================================================

The project is complete only when all of the following work:

[ ] User authentication works.

[ ] Role-based authorization works.

[ ] Associate portal works.

[ ] TL portal works.

[ ] AM portal works.

[ ] Manager portal works.

[ ] Senior Manager portal works.

[ ] WFM portal works.

[ ] Employee CRUD works.

[ ] Organization hierarchy works.

[ ] Project/team management works.

[ ] Skill management works.

[ ] Shift management works.

[ ] Shift eligibility works.

[ ] Availability works.

[ ] Leave workflow works.

[ ] Preference workflow works.

[ ] Weekly-off preferences work.

[ ] Planning cycle works.

[ ] Demand management works.

[ ] Holiday management works.

[ ] Associate roster generation works.

[ ] Weekly OFF rules work.

[ ] Maximum 6 consecutive work days works.

[ ] 9-hour maximum works.

[ ] 11-hour rest works.

[ ] Leave constraints work.

[ ] Availability constraints work.

[ ] Skill constraints work.

[ ] No-overlap constraint works.

[ ] Soft optimization works.

[ ] Coverage engine works.

[ ] Staffing shortage exceptions work.

[ ] TL roster generation works.

[ ] AM roster generation works.

[ ] Manager roster generation works.

[ ] Senior Manager roster generation works.

[ ] WFM roster generation works.

[ ] Management coverage works.

[ ] Roster versioning works.

[ ] WFM manual adjustments work.

[ ] WFM assignment locks work.

[ ] Manual changes are revalidated.

[ ] Audit trail works.

[ ] Approval workflow works.

[ ] WFM final approval works.

[ ] Publishing works.

[ ] Published rosters are immutable.

[ ] Post-publish unavailability handling works.

[ ] Replacement engine works.

[ ] Notifications work.

[ ] Reports work.

[ ] Swagger documentation works.

[ ] Database migrations work.

[ ] Docker Compose works.

[ ] Seed data works.

[ ] Unit tests work.

[ ] Integration tests work.

[ ] End-to-end roster generation test works.

[ ] Frontend production build works.

[ ] Backend production build works.

============================================================
48. HOW YOU SHOULD WORK WITH ME
============================================================

You are not merely generating code snippets.

You are developing the complete project.

Before implementing each major phase:

1. Explain the architecture briefly.
2. Show the relevant folder/file structure.
3. Implement the phase.
4. Run/build/test it.
5. Fix errors.
6. Explain what was completed.
7. Move to the next phase.

When a business rule is ambiguous:

- do not silently invent a critical business rule
- identify the ambiguity
- make the value configurable where possible
- use the already-defined rules as the source of truth

Do not replace the architecture with a simpler architecture just because it is easier to implement.

The project must remain extensible for:

- multiple projects
- multiple teams
- multiple skills
- different shift patterns
- different demand formulas
- different approval workflows
- different management coverage requirements
- different optimization weights

The final system should be production-grade, modular, testable, maintainable, and explainable.

Most importantly:

THE ROSTER ENGINE MUST BE EXPLAINABLE.

For every generated assignment, the system should be able to provide enough information to understand:

- why the employee was eligible
- which hard constraints were checked
- which soft preferences influenced selection
- whether the assignment contributes to coverage
- whether the assignment was generated automatically or manually
- who changed it, if it was changed

Build the system around this principle:

                    BUSINESS DEMAND
                           ↓
                 ASSOCIATE ROSTER
                           ↓
                    TL ROSTER
                           ↓
                    AM ROSTER
                           ↓
                MANAGER ROSTER
                           ↓
             SENIOR MANAGER ROSTER
                           ↓
                     WFM ROSTER
                           ↓
                  COMPLETE ROSTER
                           ↓
                    VALIDATION
                           ↓
                    EXCEPTIONS
                           ↓
                  WFM ADJUSTMENT
                           ↓
                  RE-VALIDATION
                           ↓
                    WFM APPROVAL
                           ↓
                      PUBLISH

Start by creating the complete repository structure, database migration plan, architecture documentation, and Phase 1 implementation. Do not skip the database design or jump directly into UI development.
  config/              # App, Security, CORS, Redis configs
  security/            # JWT filter, UserDetails, Auth
  common/              # Base entities, DTOs, responses
  employee/            # Employee CRUD, org assignments
  organization/        # Roles, org structure
  project/             # Project management
  team/                # Team management
  skill/               # Skills, employee skills
  shift/               # Shift definitions, eligibility
  availability/        # Employee availability
  leave/               # Leave requests and approvals
  preference/          # Shift and weekly-off preferences
  planning/            # Planning cycles
  demand/              # Demand configuration, demand data
  holiday/             # Holidays, project holiday policies
  roster/
    controller/
    service/
    repository/
    entity/
    dto/
  optimization/
    RosterOptimizationService  # Orchestrator
    RosterModelBuilder         # Data to Model
    ConstraintBuilder          # Hard constraints
    ObjectiveBuilder           # Soft constraints
    SolverRunner               # CP-SAT execution
    SolutionMapper             # Solution to DB
  coverage/            # Coverage calculation
  validation/          # Independent validation engine
  adjustment/          # WFM manual overrides
  approval/            # Approval workflow
  notification/        # Notification system
  audit/               # Audit trail
  exception/           # Global exception handling
```

---

## Database Schema (28 Tables)

### Organization Group
1. roles
2. employees
3. projects
4. teams
5. employee_org_assignments

### Workforce/Skills Group
6. skills
7. employee_skills
8. shifts
9. shift_eligibility
10. availability
11. leaves

### Preferences Group
12. employee_preferences
13. weekly_off_preferences

### Planning/Demand Group
14. planning_cycles
15. demand_configurations
16. demand
17. holidays
18. project_holiday_policies

### Roster Group
19. roster_versions
20. roster_assignments  <- Central unified table for ALL roles
21. roster_locks
22. coverage

### Validation/Operations Group
23. exceptions
24. roster_adjustments
25. approvals
26. generation_runs
27. audit_logs
28. notifications

---

## Hard Constraints (H1-H6)

| ID | Rule |
|----|------|
| H1 | No assignment on approved leave |
| H2 | No overlapping shift assignments |
| H3 | Employee must have required skill and level |
| H4 | Max 9 working hours per day |
| H5 | No assignment outside permitted availability |
| H6 | Minimum 11 hours rest between consecutive shifts |

Staffing shortages are NOT hard failures. They produce exceptions.

---

## Soft Constraints (S1-S8)

| ID | Rule | Weight |
|----|------|--------|
| S1 | Prefer morning shifts | Configurable |
| S2 | Avoid consecutive night shifts | Configurable |
| S3 | Fair weekend distribution | Configurable |
| S4 | Minimize overtime | Configurable |
| S5 | Honor weekly-off preferences | Configurable |
| S6 | Minimize shift changes | Configurable |
| S7 | Balance workload | Configurable |
| S8 | Minimize preferred-shift movement | Configurable |

All weights are configurable per planning cycle.

---

## CP-SAT Optimization Model

Decision Variable:
  x[e][d][s] in {0, 1}
  where e=employee, d=date, s=shift (including OFF)

Objective: Minimize weighted penalty sum
  = coverage_shortage_weight * shortage
  + morning_pref_weight * (1 - morning_pref_satisfied)
  + weekly_off_pref_weight * (1 - weekly_off_satisfied)
  + night_concentration_weight * night_concentration
  + weekend_imbalance_weight * weekend_imbalance
  + overtime_weight * overtime_hours
  + shift_change_weight * shift_changes
  + workload_imbalance_weight * imbalance
  + preferred_shift_movement_weight * movements

---

## Versioning Strategy

DRAFT (Algorithm-generated)    -> Version 1
WFM-Adjusted Draft             -> Version 2
Approved/Published             -> Version 3

parent_version_id tracks lineage.
Published versions are IMMUTABLE.
Post-publish changes -> roster_adjustments table.

---

## Security Model

- JWT-based authentication
- Role-based authorization (RBAC) at method level
- All API endpoints require valid JWT
- Frontend role checks are cosmetic only; backend enforces all access
- Audit logging for all sensitive operations

---

## Key Design Decisions

1. Single roster_assignments table for all roles; employee role determines assignment type
2. Effective-dated org assignments via employee_org_assignments with effective_from/to
3. Shift eligibility as individual rows, not comma-separated strings
4. Configurable demand formulas via pluggable formula framework
5. Locked assignments respected by optimizer
6. Management roster hierarchically derived via majority-shift rule with tie-breaking
7. Validation is independent from generation
8. Replacement engine handles post-publish unavailability
9. Coverage shortage creates exception, not hard failure
