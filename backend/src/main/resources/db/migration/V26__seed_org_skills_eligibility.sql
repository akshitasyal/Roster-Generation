-- V26: Seed teams, org assignments, skills, shift eligibility, leaves, preferences
-- ============================================================
-- TEAMS
-- ============================================================
INSERT INTO teams (team_code, team_name, project_id, tl_employee_id, status)
SELECT 'TEAM-A', 'Alpha Team - Morning', p.id, e.id, 'ACTIVE'
FROM projects p, employees e
WHERE p.project_code = 'ACME-CS-01' AND e.employee_code = 'TL001';

INSERT INTO teams (team_code, team_name, project_id, tl_employee_id, status)
SELECT 'TEAM-B', 'Beta Team - Mixed', p.id, e.id, 'ACTIVE'
FROM projects p, employees e
WHERE p.project_code = 'ACME-CS-01' AND e.employee_code = 'TL002';

INSERT INTO teams (team_code, team_name, project_id, tl_employee_id, status)
SELECT 'TEAM-C', 'Gamma Team - Evening', p.id, e.id, 'ACTIVE'
FROM projects p, employees e
WHERE p.project_code = 'ACME-CS-01' AND e.employee_code = 'TL003';

-- ============================================================
-- ORG ASSIGNMENTS
-- ============================================================
-- Senior Manager -> Project (no team)
INSERT INTO employee_org_assignments (employee_id, project_id, team_id, reports_to_id, effective_from, is_primary)
SELECT e.id, p.id, NULL, NULL, '2025-01-01', TRUE
FROM employees e, projects p WHERE e.employee_code = 'SM001' AND p.project_code = 'ACME-CS-01';

-- Manager -> SM
INSERT INTO employee_org_assignments (employee_id, project_id, team_id, reports_to_id, effective_from, is_primary)
SELECT e.id, p.id, NULL, sm.id, '2025-01-01', TRUE
FROM employees e, projects p, employees sm
WHERE e.employee_code = 'MGR001' AND p.project_code = 'ACME-CS-01' AND sm.employee_code = 'SM001';

-- WFM -> SM
INSERT INTO employee_org_assignments (employee_id, project_id, team_id, reports_to_id, effective_from, is_primary)
SELECT e.id, p.id, NULL, sm.id, '2025-01-01', TRUE
FROM employees e, projects p, employees sm
WHERE e.employee_code = 'WFM001' AND p.project_code = 'ACME-CS-01' AND sm.employee_code = 'SM001';

-- AM001 -> Manager
INSERT INTO employee_org_assignments (employee_id, project_id, team_id, reports_to_id, effective_from, is_primary)
SELECT e.id, p.id, NULL, mgr.id, '2025-01-01', TRUE
FROM employees e, projects p, employees mgr
WHERE e.employee_code = 'AM001' AND p.project_code = 'ACME-CS-01' AND mgr.employee_code = 'MGR001';

-- AM002 -> Manager
INSERT INTO employee_org_assignments (employee_id, project_id, team_id, reports_to_id, effective_from, is_primary)
SELECT e.id, p.id, NULL, mgr.id, '2025-01-01', TRUE
FROM employees e, projects p, employees mgr
WHERE e.employee_code = 'AM002' AND p.project_code = 'ACME-CS-01' AND mgr.employee_code = 'MGR001';

-- TL001 -> AM001
INSERT INTO employee_org_assignments (employee_id, project_id, team_id, reports_to_id, effective_from, is_primary)
SELECT e.id, p.id, t.id, am.id, '2025-01-01', TRUE
FROM employees e, projects p, teams t, employees am
WHERE e.employee_code = 'TL001' AND p.project_code = 'ACME-CS-01' AND t.team_code = 'TEAM-A' AND am.employee_code = 'AM001';

-- TL002 -> AM001
INSERT INTO employee_org_assignments (employee_id, project_id, team_id, reports_to_id, effective_from, is_primary)
SELECT e.id, p.id, t.id, am.id, '2025-01-01', TRUE
FROM employees e, projects p, teams t, employees am
WHERE e.employee_code = 'TL002' AND p.project_code = 'ACME-CS-01' AND t.team_code = 'TEAM-B' AND am.employee_code = 'AM001';

-- TL003 -> AM002
INSERT INTO employee_org_assignments (employee_id, project_id, team_id, reports_to_id, effective_from, is_primary)
SELECT e.id, p.id, t.id, am.id, '2025-01-01', TRUE
FROM employees e, projects p, teams t, employees am
WHERE e.employee_code = 'TL003' AND p.project_code = 'ACME-CS-01' AND t.team_code = 'TEAM-C' AND am.employee_code = 'AM002';

-- Associates Team A (E001-E008) -> TL001
INSERT INTO employee_org_assignments (employee_id, project_id, team_id, reports_to_id, effective_from, is_primary)
SELECT e.id, p.id, t.id, tl.id, '2025-01-01', TRUE
FROM employees e, projects p, teams t, employees tl
WHERE e.employee_code IN ('E001','E002','E003','E004','E005','E006','E007','E008')
  AND p.project_code = 'ACME-CS-01' AND t.team_code = 'TEAM-A' AND tl.employee_code = 'TL001';

-- Associates Team B (E009-E016) -> TL002
INSERT INTO employee_org_assignments (employee_id, project_id, team_id, reports_to_id, effective_from, is_primary)
SELECT e.id, p.id, t.id, tl.id, '2025-01-01', TRUE
FROM employees e, projects p, teams t, employees tl
WHERE e.employee_code IN ('E009','E010','E011','E012','E013','E014','E015','E016')
  AND p.project_code = 'ACME-CS-01' AND t.team_code = 'TEAM-B' AND tl.employee_code = 'TL002';

-- Associates Team C (E017-E025) -> TL003
INSERT INTO employee_org_assignments (employee_id, project_id, team_id, reports_to_id, effective_from, is_primary)
SELECT e.id, p.id, t.id, tl.id, '2025-01-01', TRUE
FROM employees e, projects p, teams t, employees tl
WHERE e.employee_code IN ('E017','E018','E019','E020','E021','E022','E023','E024','E025')
  AND p.project_code = 'ACME-CS-01' AND t.team_code = 'TEAM-C' AND tl.employee_code = 'TL003';

-- ============================================================
-- EMPLOYEE SKILLS
-- ============================================================
-- Team A: Customer Support + Technical Support (mixed levels)
INSERT INTO employee_skills (employee_id, skill_id, skill_level, certified, valid_from)
SELECT e.id, s.id, 'INTERMEDIATE', TRUE, '2023-01-01'
FROM employees e, skills s WHERE e.employee_code IN ('E001','E002','E003','E004') AND s.skill_code = 'CUSTOMER_SUPPORT';

INSERT INTO employee_skills (employee_id, skill_id, skill_level, certified, valid_from)
SELECT e.id, s.id, 'ADVANCED', TRUE, '2023-01-01'
FROM employees e, skills s WHERE e.employee_code IN ('E005','E006') AND s.skill_code = 'TECHNICAL_SUPPORT';

INSERT INTO employee_skills (employee_id, skill_id, skill_level, certified, valid_from)
SELECT e.id, s.id, 'BEGINNER', FALSE, '2023-02-01'
FROM employees e, skills s WHERE e.employee_code IN ('E007','E008') AND s.skill_code = 'CUSTOMER_SUPPORT';

-- Team B: Customer Support + Billing
INSERT INTO employee_skills (employee_id, skill_id, skill_level, certified, valid_from)
SELECT e.id, s.id, 'ADVANCED', TRUE, '2023-01-01'
FROM employees e, skills s WHERE e.employee_code IN ('E009','E010','E011','E012') AND s.skill_code = 'CUSTOMER_SUPPORT';

INSERT INTO employee_skills (employee_id, skill_id, skill_level, certified, valid_from)
SELECT e.id, s.id, 'INTERMEDIATE', TRUE, '2023-01-01'
FROM employees e, skills s WHERE e.employee_code IN ('E013','E014') AND s.skill_code = 'BILLING';

INSERT INTO employee_skills (employee_id, skill_id, skill_level, certified, valid_from)
SELECT e.id, s.id, 'BEGINNER', FALSE, '2023-06-01'
FROM employees e, skills s WHERE e.employee_code IN ('E015','E016') AND s.skill_code = 'CUSTOMER_SUPPORT';

-- Team C: Technical Support + Billing + Escalation
INSERT INTO employee_skills (employee_id, skill_id, skill_level, certified, valid_from)
SELECT e.id, s.id, 'ADVANCED', TRUE, '2023-09-01'
FROM employees e, skills s WHERE e.employee_code IN ('E017','E018','E019') AND s.skill_code = 'TECHNICAL_SUPPORT';

INSERT INTO employee_skills (employee_id, skill_id, skill_level, certified, valid_from)
SELECT e.id, s.id, 'INTERMEDIATE', TRUE, '2023-09-01'
FROM employees e, skills s WHERE e.employee_code IN ('E020','E021','E022') AND s.skill_code = 'BILLING';

INSERT INTO employee_skills (employee_id, skill_id, skill_level, certified, valid_from)
SELECT e.id, s.id, 'EXPERT', TRUE, '2023-09-01'
FROM employees e, skills s WHERE e.employee_code IN ('E023','E024') AND s.skill_code = 'ESCALATION';

INSERT INTO employee_skills (employee_id, skill_id, skill_level, certified, valid_from)
SELECT e.id, s.id, 'BEGINNER', FALSE, '2024-01-01'
FROM employees e, skills s WHERE e.employee_code = 'E025' AND s.skill_code = 'CUSTOMER_SUPPORT';

-- Management skills (all managers have all skills at EXPERT)
INSERT INTO employee_skills (employee_id, skill_id, skill_level, certified, valid_from)
SELECT e.id, s.id, 'EXPERT', TRUE, '2020-01-01'
FROM employees e, skills s
WHERE e.employee_code IN ('SM001','MGR001','WFM001','AM001','AM002','TL001','TL002','TL003')
  AND s.skill_code IN ('CUSTOMER_SUPPORT','TECHNICAL_SUPPORT','BILLING','ESCALATION','QUALITY');

-- ============================================================
-- SHIFT ELIGIBILITY (individual rows per employee per shift)
-- ============================================================
-- Team A: Morning + General eligible (E001-E006), Morning only (E007,E008)
INSERT INTO shift_eligibility (employee_id, shift_id, effective_from, is_eligible)
SELECT e.id, s.id, '2023-01-01', TRUE
FROM employees e, shifts s
WHERE e.employee_code IN ('E001','E002','E003','E004','E005','E006') AND s.shift_code IN ('M','G');

INSERT INTO shift_eligibility (employee_id, shift_id, effective_from, is_eligible)
SELECT e.id, s.id, '2023-01-01', TRUE
FROM employees e, shifts s
WHERE e.employee_code IN ('E007','E008') AND s.shift_code = 'M';

-- Team B: General + Evening eligible (E009-E014), All shifts (E015,E016)
INSERT INTO shift_eligibility (employee_id, shift_id, effective_from, is_eligible)
SELECT e.id, s.id, '2023-01-01', TRUE
FROM employees e, shifts s
WHERE e.employee_code IN ('E009','E010','E011','E012','E013','E014') AND s.shift_code IN ('G','E');

INSERT INTO shift_eligibility (employee_id, shift_id, effective_from, is_eligible)
SELECT e.id, s.id, '2023-01-01', TRUE
FROM employees e, shifts s
WHERE e.employee_code IN ('E015','E016') AND s.shift_code IN ('M','G','E');

-- Team C: Evening + Night eligible (E017-E021), General + Evening (E022-E025)
INSERT INTO shift_eligibility (employee_id, shift_id, effective_from, is_eligible)
SELECT e.id, s.id, '2023-09-01', TRUE
FROM employees e, shifts s
WHERE e.employee_code IN ('E017','E018','E019','E020','E021') AND s.shift_code IN ('E','N');

INSERT INTO shift_eligibility (employee_id, shift_id, effective_from, is_eligible)
SELECT e.id, s.id, '2023-09-01', TRUE
FROM employees e, shifts s
WHERE e.employee_code IN ('E022','E023','E024','E025') AND s.shift_code IN ('G','E');

-- Management: All eligible for Morning + General
INSERT INTO shift_eligibility (employee_id, shift_id, effective_from, is_eligible)
SELECT e.id, s.id, '2020-01-01', TRUE
FROM employees e, shifts s
WHERE e.employee_code IN ('SM001','MGR001','WFM001','AM001','AM002','TL001','TL002','TL003')
  AND s.shift_code IN ('M','G','E');

-- ============================================================
-- APPROVED LEAVES (for demo scenarios)
-- ============================================================
-- E008 on leave during the demo week (to create shortage scenario)
INSERT INTO leaves (employee_id, leave_type, start_date, end_date, status, reason)
SELECT e.id, 'SICK', '2026-10-05', '2026-10-07', 'APPROVED', 'Medical leave - doctor certified'
FROM employees e WHERE e.employee_code = 'E008';

-- E015 on leave (mid-week)
INSERT INTO leaves (employee_id, leave_type, start_date, end_date, status, reason)
SELECT e.id, 'CASUAL', '2026-10-06', '2026-10-06', 'APPROVED', 'Personal work'
FROM employees e WHERE e.employee_code = 'E015';

-- ============================================================
-- HOLIDAYS
-- ============================================================
INSERT INTO holidays (holiday_name, holiday_date, holiday_type, country, state, location, is_optional)
VALUES
('Gandhi Jayanti', '2026-10-02', 'PUBLIC', 'IN', 'Telangana', 'Hyderabad', FALSE),
('Dussehra',       '2026-10-12', 'PUBLIC', 'IN', 'Telangana', 'Hyderabad', FALSE);

-- Project holiday policy: OPERATIONAL (project runs on holidays)
INSERT INTO project_holiday_policies (project_id, holiday_id, policy, required_staffing, allow_work, comp_off_enabled)
SELECT p.id, h.id, 'OPERATIONAL', 80, TRUE, TRUE
FROM projects p, holidays h
WHERE p.project_code = 'ACME-CS-01'
  AND h.holiday_name IN ('Gandhi Jayanti', 'Dussehra');
