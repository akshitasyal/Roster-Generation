-- Insert a new employee with the WFM role
INSERT INTO employees (
    emp_id, 
    email, 
    password_hash, 
    name, 
    role_id, 
    status, 
    created_at, 
    updated_at
) VALUES (
    'WFM9999', 
    'new.admin@acme.wfm', 
    '$2a$10$ZAqgzFpykeab4aZ8kgOLyeUiLKX7vS.dd8TZbNEdNoY3e14ihVfS2', 
    'New Admin', 
    (SELECT id FROM roles WHERE code = 'WFM'),
    'ACTIVE', 
    CURRENT_TIMESTAMP, 
    CURRENT_TIMESTAMP
);

-- Assign them to a project if needed
INSERT INTO employee_org_assignments (
    employee_id, 
    project_id, 
    effective_from,
    created_at
) VALUES (
    (SELECT id FROM employees WHERE email = 'new.admin@acme.wfm'),
    (SELECT id FROM projects LIMIT 1), 
    CURRENT_DATE,
    CURRENT_TIMESTAMP
);
