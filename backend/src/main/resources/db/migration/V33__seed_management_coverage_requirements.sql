-- V33: Seed management coverage requirements (default minimums)
-- Seeds for the first project (CustSupport-Alpha) and all projects globally
-- TL: must have at least 1 on Morning AND 1 on Evening every day
-- AM: at least 1 on Morning on weekdays
-- Manager, Senior Manager, WFM: at least 1 on Morning every day

INSERT INTO management_coverage_requirements
    (project_id, role_id, shift_id, min_required, day_type, effective_from)
SELECT
    p.id       AS project_id,
    r.id       AS role_id,
    s.id       AS shift_id,
    req.min_required,
    req.day_type,
    '2026-01-01' AS effective_from
FROM
    (VALUES
        ('TEAM_LEAD',       'MORNING',  1, 'ALL'),
        ('TEAM_LEAD',       'EVENING',  1, 'ALL'),
        ('ASSISTANT_MANAGER','MORNING', 1, 'WEEKDAY'),
        ('MANAGER',         'MORNING',  1, 'WEEKDAY'),
        ('SENIOR_MANAGER',  'MORNING',  1, 'WEEKDAY'),
        ('WFM',             'MORNING',  1, 'ALL')
    ) AS req(role_code, shift_code, min_required, day_type)
JOIN roles   r ON r.code = req.role_code
JOIN shifts  s ON s.shift_code = req.shift_code
CROSS JOIN projects p
WHERE p.project_code IS NOT NULL
ON CONFLICT (project_id, role_id, shift_id, effective_from) DO NOTHING;
