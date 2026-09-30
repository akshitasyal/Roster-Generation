# WFM UI/UX Rebuild Plan

## 1. Current UI Problems
- The UI wrongly treats the system as a "Solver Launcher" (i.e., click a button to run the engine and view technical logs).
- "Roster Optimization Engine" is too technical a framing; the business manages a *Planning Cycle*.
- Missing critical WFM workflows: Demand Management, Planning Cycle context, Post-Publish adjustments, manual adjustments, validation center.
- The UI treats the solver as the primary product, rather than a background service that supports a broader business workflow.
- Inadequate route architecture for the WFM layer. It needs a massive structural overhaul.

## 2. New WFM Information Architecture
The WFM role is a "Planning Control Center." The workflow is sequential but highly contextual to a **Planning Cycle**.

**Business Flow:**
Demand -> Planning Cycle -> Workforce Data -> Preferences -> Availability -> Rules -> Snapshot -> Generate -> Management Rosters -> Coverage -> Validation -> Exceptions -> Review -> Adjust -> Approve -> Publish -> Post-Publish.

## 3. Route Structure
The new WFM sidebar and route structure will be:

- `/wfm/dashboard`: Central Planning Dashboard
- **PLANNING**
  - `/wfm/cycles`: Planning Cycles
  - `/wfm/demand`: Demand Management
  - `/wfm/workforce`: Workforce
  - `/wfm/preferences`: Preferences
- **ROSTER**
  - `/wfm/generate`: Generate Roster
  - `/wfm/versions`: Roster Versions
  - `/wfm/validation`: Validation
  - `/wfm/exceptions`: Exceptions
  - `/wfm/adjustments`: Adjustments
  - `/wfm/published`: Published Rosters
- **MANAGEMENT**
  - `/wfm/reviews/tl`: TL Review
  - `/wfm/reviews/am`: AM Review
  - `/wfm/reviews/manager`: Manager Review
  - `/wfm/reviews/senior-manager`: Senior Manager Review
- **ANALYTICS**
  - `/wfm/analytics/coverage`: Coverage
  - `/wfm/analytics/capacity`: Capacity
  - `/wfm/analytics/reports`: Reports
- **CONFIGURATION**
  - `/wfm/settings/rules`: Rules & Settings
  - `/wfm/settings/shifts`: Shift Configuration
  - `/wfm/settings/holidays`: Holiday Calendar
- **SYSTEM**
  - `/wfm/system/notifications`: Notifications
  - `/wfm/system/audit`: Audit Logs

## 4. Navigation Structure
Redesign `navigation.ts` to reflect the new categorized sidebar. Ensure the WFM role expands into these nested or explicitly grouped sections rather than a flat, generic list.

## 5. Dashboard Structure
The main dashboard must not be a solver interface. It will feature:
- Contextual headers (Cycle, Project, Status).
- Top KPI cards (Demand, Available, Coverage, Staffing Gap, Exceptions, Roster Status).
- Planning Cycle Progress timeline (Demand loaded, Preferences complete, TL review complete, Generation complete, etc.).

## 6. Planning Cycle Structure
A dedicated `/wfm/cycles` page showing a table of cycles (ID, Date Range, Project, Status).
Clicking a cycle enters the contextual **Planning Cycle Workspace** containing tabs for Overview, Demand, Workforce, Preferences, Rules, Roster, Coverage, Validation, Exceptions, Reviews, Adjustments, and Audit.

## 7. Generate Workflow
Redesign `/wfm/generate` to be business-centric:
- **Step 1:** Cycle context (Dates, Project).
- **Step 2:** Input Readiness (Checklist of Demand, Workforce, Preferences, Rules).
- **Step 3:** Planning Snapshot (Employee count, demand intervals, etc.).
- **Step 4:** Generation Config (High-level business settings, not CP-SAT parameters).
- **Step 5:** Generate (Button to "Generate Draft Roster").
- Progress screen visually steps through business logic (Loading snapshot, filtering, applying rules).

## 8. Roster Grid
A highly dense, professional enterprise roster component.
Rows: Employees. Columns: Days.
Cells visually communicate: Shift, time, status, lock state, source (Manual vs Optimizer).
Clicking opens an Assignment Detail side-panel to Adjust, Lock, or Explain assignment.

## 9. Coverage
Hourly charts showing Required vs Assigned vs Gap across the week, with deep filtering by Project, Team, Skill, and Shift.

## 10. Validation
Separates Hard Constraints (Leave, overlapping shifts) from Soft Metrics (Fairness, Preferences, Shift Stability).

## 11. Exceptions
Aggregated view of gaps, conflicts, and issues.
Clicking an exception explains *why* it occurred (e.g. 16 required, 14 eligible, 2 on leave).

## 12. Adjustments
Visual UI for WFM to manually override assignments. Will validate the change instantly against Hard Constraints and Soft Impacts before confirming.

## 13. Management Rosters
Using the same `RosterGrid` component, dynamically scoped to display TL, AM, Manager, Sr. Manager, and WFM levels.

## 14. Approval
Explicit state progression: Draft -> Validated -> Under Review -> Adjusted -> Approved -> Published.

## 15. Publish
Publish screen summarizing coverage, gaps, and manual adjustments. Hard requirement for explicit confirmation before pushing live.

## 16. Post-Publish Replacement
A tactical, targeted UI for replacing an employee who calls out sick, without regenerating the entire week. It surfaces valid replacement candidates based on rules.

## 17. Component Architecture
- `WorkspaceShell`: Wraps contextual cycle pages.
- `RosterGrid`: Rebuilt for dense enterprise view and manual adjustments.
- `CoverageChart`: Updated for drill-down.
- `ExceptionTable`: Dynamic issue resolution component.

---

## Implementation Order

- **PHASE 1:** Application shell + sidebar + WFM dashboard
- **PHASE 2:** Planning cycle workspace
- **PHASE 3:** Demand + Workforce + Preferences
- **PHASE 4:** Generate Roster workflow
- **PHASE 5:** Roster Grid
- **PHASE 6:** Coverage + Validation
- **PHASE 7:** Exceptions
- **PHASE 8:** Management Roster views
- **PHASE 9:** Manual Adjustments + Locks
- **PHASE 10:** Approval + Publish
- **PHASE 11:** Post-Publish Replacement
- **PHASE 12:** Technical details / audit / polish
