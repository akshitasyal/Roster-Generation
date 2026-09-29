-- V27: Seed planning cycle and demand data for demonstration week (Oct 5-11, 2026)

-- Planning Cycle for demo
INSERT INTO planning_cycles (project_id, cycle_name, start_date, end_date, status, preference_open_at, preference_lock_at, tl_review_open_at, tl_review_close_at, created_by)
SELECT
    p.id,
    'Week 41 - Oct 05-11 2026',
    '2026-10-05',
    '2026-10-11',
    'PREFERENCE_LOCKED',
    '2026-09-28 09:00:00+05:30',
    '2026-09-29 11:00:00+05:30',
    '2026-09-29 12:00:00+05:30',
    '2026-10-01 10:00:00+05:30',
    wfm.id
FROM projects p, employees wfm
WHERE p.project_code = 'ACME-CS-01' AND wfm.employee_code = 'WFM001';

-- ============================================================
-- EMPLOYEE SHIFT PREFERENCES for this cycle
-- ============================================================
-- Team A prefers Morning
INSERT INTO employee_preferences (employee_id, planning_cycle_id, preferred_shift_id, preference_rank)
SELECT e.id, pc.id, s.id, 1
FROM employees e, planning_cycles pc, shifts s
WHERE e.employee_code IN ('E001','E002','E003','E004','E005','E006')
  AND pc.cycle_name = 'Week 41 - Oct 05-11 2026' AND s.shift_code = 'M';

INSERT INTO employee_preferences (employee_id, planning_cycle_id, preferred_shift_id, preference_rank)
SELECT e.id, pc.id, s.id, 1
FROM employees e, planning_cycles pc, shifts s
WHERE e.employee_code IN ('E007','E008')
  AND pc.cycle_name = 'Week 41 - Oct 05-11 2026' AND s.shift_code = 'M';

-- Team B prefers General
INSERT INTO employee_preferences (employee_id, planning_cycle_id, preferred_shift_id, preference_rank)
SELECT e.id, pc.id, s.id, 1
FROM employees e, planning_cycles pc, shifts s
WHERE e.employee_code IN ('E009','E010','E011','E012')
  AND pc.cycle_name = 'Week 41 - Oct 05-11 2026' AND s.shift_code = 'G';

INSERT INTO employee_preferences (employee_id, planning_cycle_id, preferred_shift_id, preference_rank)
SELECT e.id, pc.id, s.id, 1
FROM employees e, planning_cycles pc, shifts s
WHERE e.employee_code IN ('E013','E014','E015','E016')
  AND pc.cycle_name = 'Week 41 - Oct 05-11 2026' AND s.shift_code = 'E';

-- Team C prefers Evening
INSERT INTO employee_preferences (employee_id, planning_cycle_id, preferred_shift_id, preference_rank)
SELECT e.id, pc.id, s.id, 1
FROM employees e, planning_cycles pc, shifts s
WHERE e.employee_code IN ('E017','E018','E019','E020','E021')
  AND pc.cycle_name = 'Week 41 - Oct 05-11 2026' AND s.shift_code = 'E';

INSERT INTO employee_preferences (employee_id, planning_cycle_id, preferred_shift_id, preference_rank)
SELECT e.id, pc.id, s.id, 1
FROM employees e, planning_cycles pc, shifts s
WHERE e.employee_code IN ('E022','E023','E024','E025')
  AND pc.cycle_name = 'Week 41 - Oct 05-11 2026' AND s.shift_code = 'G';

-- Weekly-off preferences (prefer Sat + Sun off)
INSERT INTO weekly_off_preferences (employee_id, planning_cycle_id, day_of_week, preference_rank)
SELECT e.id, pc.id, dow, rank
FROM employees e, planning_cycles pc,
     (VALUES ('SATURDAY', 1), ('SUNDAY', 2)) AS v(dow, rank)
WHERE e.employee_code IN (
    'E001','E002','E003','E004','E005','E006','E007','E008',
    'E009','E010','E011','E012','E013','E014','E015','E016'
) AND pc.cycle_name = 'Week 41 - Oct 05-11 2026';

INSERT INTO weekly_off_preferences (employee_id, planning_cycle_id, day_of_week, preference_rank)
SELECT e.id, pc.id, dow, rank
FROM employees e, planning_cycles pc,
     (VALUES ('FRIDAY', 1), ('SATURDAY', 2)) AS v(dow, rank)
WHERE e.employee_code IN (
    'E017','E018','E019','E020','E021','E022','E023','E024','E025'
) AND pc.cycle_name = 'Week 41 - Oct 05-11 2026';

-- ============================================================
-- DEMAND DATA (Mon-Sun Oct 5-11, 2026)
-- Per shift per day per skill - Associate demand
-- ============================================================
-- We use shift-level demand intervals: Morning 06-15, General 09-18, Evening 14-23, Night 22-07
DO $$
DECLARE
    cycle_id BIGINT;
    project_id BIGINT;
    associate_role_id BIGINT;
    cs_skill_id BIGINT;
    ts_skill_id BIGINT;
    billing_skill_id BIGINT;
    tl_role_id BIGINT;
    am_role_id BIGINT;
    morning_shift_id BIGINT;
    general_shift_id BIGINT;
    evening_shift_id BIGINT;
    night_shift_id BIGINT;
    d DATE;
BEGIN
    SELECT id INTO cycle_id FROM planning_cycles WHERE cycle_name = 'Week 41 - Oct 05-11 2026';
    SELECT id INTO project_id FROM projects WHERE project_code = 'ACME-CS-01';
    SELECT id INTO associate_role_id FROM roles WHERE code = 'ASSOCIATE';
    SELECT id INTO tl_role_id FROM roles WHERE code = 'TL';
    SELECT id INTO am_role_id FROM roles WHERE code = 'AM';
    SELECT id INTO cs_skill_id FROM skills WHERE skill_code = 'CUSTOMER_SUPPORT';
    SELECT id INTO ts_skill_id FROM skills WHERE skill_code = 'TECHNICAL_SUPPORT';
    SELECT id INTO billing_skill_id FROM skills WHERE skill_code = 'BILLING';
    SELECT id INTO morning_shift_id FROM shifts WHERE shift_code = 'M';
    SELECT id INTO general_shift_id FROM shifts WHERE shift_code = 'G';
    SELECT id INTO evening_shift_id FROM shifts WHERE shift_code = 'E';
    SELECT id INTO night_shift_id FROM shifts WHERE shift_code = 'N';

    FOR d IN SELECT generate_series('2026-10-05'::DATE, '2026-10-11'::DATE, INTERVAL '1 day')::DATE LOOP

        -- Morning shift demand - Customer Support (4 heads required)
        INSERT INTO demand (planning_cycle_id, project_id, date, interval_start, interval_end, shift_id, skill_id, role_id, required_headcount, source)
        VALUES (cycle_id, project_id, d, '06:00', '15:00', morning_shift_id, cs_skill_id, associate_role_id, 4, 'MANUAL');

        -- General shift demand - Customer Support (3 heads)
        INSERT INTO demand (planning_cycle_id, project_id, date, interval_start, interval_end, shift_id, skill_id, role_id, required_headcount, source)
        VALUES (cycle_id, project_id, d, '09:00', '18:00', general_shift_id, cs_skill_id, associate_role_id, 3, 'MANUAL');

        -- Evening shift demand - Customer Support (4 heads)
        INSERT INTO demand (planning_cycle_id, project_id, date, interval_start, interval_end, shift_id, skill_id, role_id, required_headcount, source)
        VALUES (cycle_id, project_id, d, '14:00', '23:00', evening_shift_id, cs_skill_id, associate_role_id, 4, 'MANUAL');

        -- Night shift demand - Technical Support (2 heads) - fewer people eligible
        INSERT INTO demand (planning_cycle_id, project_id, date, interval_start, interval_end, shift_id, skill_id, role_id, required_headcount, source)
        VALUES (cycle_id, project_id, d, '22:00', '07:00', night_shift_id, ts_skill_id, associate_role_id, 3, 'MANUAL');

        -- Technical Support - Morning (2 heads)
        INSERT INTO demand (planning_cycle_id, project_id, date, interval_start, interval_end, shift_id, skill_id, role_id, required_headcount, source)
        VALUES (cycle_id, project_id, d, '06:00', '15:00', morning_shift_id, ts_skill_id, associate_role_id, 2, 'MANUAL');

        -- Billing - General (2 heads)
        INSERT INTO demand (planning_cycle_id, project_id, date, interval_start, interval_end, shift_id, skill_id, role_id, required_headcount, source)
        VALUES (cycle_id, project_id, d, '09:00', '18:00', general_shift_id, billing_skill_id, associate_role_id, 2, 'MANUAL');

        -- Management coverage demand: 1 TL per active shift per day
        INSERT INTO demand (planning_cycle_id, project_id, date, interval_start, interval_end, shift_id, skill_id, role_id, required_headcount, source)
        VALUES (cycle_id, project_id, d, '06:00', '15:00', morning_shift_id, NULL, tl_role_id, 1, 'MANUAL');

        INSERT INTO demand (planning_cycle_id, project_id, date, interval_start, interval_end, shift_id, skill_id, role_id, required_headcount, source)
        VALUES (cycle_id, project_id, d, '14:00', '23:00', evening_shift_id, NULL, tl_role_id, 1, 'MANUAL');

        -- 1 AM coverage per day
        INSERT INTO demand (planning_cycle_id, project_id, date, interval_start, interval_end, shift_id, skill_id, role_id, required_headcount, source)
        VALUES (cycle_id, project_id, d, '09:00', '18:00', general_shift_id, NULL, am_role_id, 1, 'MANUAL');

    END LOOP;
END $$;

-- Demand config
INSERT INTO demand_configurations (project_id, name, formula_type, aht, shrinkage, occupancy, utilization, service_level, interval_minutes, effective_from, is_active)
SELECT p.id, 'ACME Standard Config', 'SIMPLE_HEADCOUNT', 360.0, 0.25, 0.85, 0.90, 0.80, 30, '2025-01-01', TRUE
FROM projects p WHERE p.project_code = 'ACME-CS-01';
