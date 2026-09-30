# WFM Roster Generation UI/UX Specification

## 1. Design Principles
The core design philosophy is: **SAME UNDERLYING ROSTER DATA + ROLE-SPECIFIC VISIBILITY + ROLE-SPECIFIC ACTIONS.**
- **Enterprise-Grade UI:** The product should feel like an enterprise workforce-planning platform. It should be professional, clean, data-dense, trustworthy, and modern.
- **Hierarchy Representation:** The UI must naturally reflect the hierarchy (Associate → TL → AM → Manager → Senior Manager → WFM).
- **Progressive Disclosure:** Use drill-downs to display data. Do not show every detail immediately.
- **Explainability:** Roster assignments, especially exceptions and adjustments, must provide a "Why?" explanation derived from backend validation and optimizer data.

## 2. Design System
- **Visuals:** Avoid excessive gradients, glassmorphism, or flashy animations. Use solid, accessible colors and clear typography.
- **Color Semantics:** Use colors strictly for semantic states (Success/Approved, Warning/Review, Error/Shortage, Info/Draft). Never use color as the sole indicator (always pair with icons/labels).
- **Reusable Application Shell:** 
  - **Sidebar:** Navigation, role indicator, user profile.
  - **Top Header:** Breadcrumbs, page title, cycle context, global notifications.

## 3. Navigation & Route Architecture
- **/associate/*:** Dashboard, My Roster, Preferences, Leaves, Notifications, Profile
- **/tl/*:** Dashboard, Team, Preferences/Leaves Review, Team Roster, Issues
- **/am/*:** Dashboard, Teams, Coverage, Exceptions, Approvals
- **/manager/*:** Dashboard, Organization Overview, Coverage, Roster Review, Approvals
- **/senior-manager/*:** Dashboard, Capacity, Cross-Team Coverage, Roster Review
- **/wfm/*:** Dashboard, Planning Cycles, Demand, Generate Roster, Validation, Exceptions, Adjustments, Published, Settings, Audit

## 4. Role-Specific UX Focus
### Associate UI ("What is my schedule?")
- **Dashboard:** Quick view of today's shift, weekly hours, and upcoming shifts.
- **Roster:** Weekly view of shifts (Morning, Evening, OFF, LEAVE).
- **Preferences:** Step-by-step guided workflow for preferred shifts, weekly offs, and availability. Disabled after deadline.

### TL UI ("What is happening with my team?")
- **Dashboard:** Team coverage, shortages, leave overview.
- **Roster:** Dense grid view of team shifts.
- **Review:** Ability to review and **decline** (with reason) subordinate preferences before the deadline.

### AM UI ("Are my teams adequately staffed?")
- **Coverage:** Hourly demand-vs-staffing visualizations across multiple teams.
- **Hierarchy:** Ability to drill down from Team → TL → Employee.

### Manager & Senior Manager UI ("Is my organization covered?")
- **Overview:** Project-level capacity, cross-team coverage, and staffing gaps.
- **Approval:** Review and approve rosters. No direct adjustment bypass.

### WFM UI ("Control Center")
- **Planning Cycle:** Timeline visualization of the current cycle.
- **Generation Wizard:** 5-step CP-SAT optimization wizard with live progress tracking (not fake loaders).
- **Validation:** Clear separation of hard constraints (overlap, leave) vs soft constraints (preferences).
- **Exceptions:** Detailed breakdown of shortages and conflicts.
- **Manual Adjustments:** Before/After impact preview, validation checks before confirming.

## 5. Global Roster & Component Architecture
To ensure DRY code and consistent UI, the following reusable components are required:
- `<AppShell />`, `<Sidebar />`, `<TopHeader />`
- `<RosterGrid />`: The foundational roster grid taking props `scope`, `role`, `allowAdjustment`, `readOnly`.
- `<CoverageChart />`: Hourly demand vs staffing bar/line chart.
- `<ExceptionTable />`, `<ExceptionDrawer />`
- `<StatusBadge />`, `<RoleBadge />`, `<KpiCard />`

## 6. Permissions and Security
- Frontend visibility is **NOT** authorization. The UI will simply reflect what the backend API permits.
- No "hidden buttons"; elements outside a user's scope will simply not render or receive data.

## 7. Performance & Accessibility
- **Performance:** Use pagination, virtualization (e.g., `react-window` for large rosters), and server-side filtering for WFM tables.
- **Accessibility:** Keyboard navigation, ARIA labels, sufficient contrast, and semantic markup.

## 8. Development Phases
1. Design System & App Shell
2. Authentication & Role Routing
3. Associate Portal
4. TL Portal
5. AM Portal
6. Manager Portal
7. Senior Manager Portal
8. WFM Core Dashboard
9. WFM Planning Cycle & Demand
10. WFM Roster Generation UI
11. RosterGrid & Validation Views
12. Exceptions & Explainability
13. Manual Adjustments & Locks
14. Publish & Post-Publish UI
15. Reports & Audit
16. Polish, Accessibility, Performance
