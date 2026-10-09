-- V40: Configure Akshita Syal as the sole WFM Portal Admin.
-- Employee ID: TM10001
-- Email: akshitasyal09@techmahindra.com
-- Password: wfm@1234
-- Designation: Workforce Manager

-- 1. Update Employee Master for TM10001
UPDATE employees
SET name = 'Akshita Syal',
    email = 'akshitasyal09@techmahindra.com',
    designation = 'Workforce Manager',
    skill = 'Workforce Management',
    status = 'Active',
    updated_at = NOW()
WHERE emp_id = 'TM10001';

-- 2. Clean user_accounts and set TM10001 as sole pre-seeded user account
DELETE FROM user_accounts;

INSERT INTO user_accounts (emp_id, email, password_hash, account_status, email_verified, created_at, updated_at)
VALUES (
    'TM10001',
    'akshitasyal09@techmahindra.com',
    '$2a$10$gwHNIPtrQ.tceJwJhXKppesoOytIqC6G/zHPI1qltFzRDu75COXnS',
    'ACTIVE',
    TRUE,
    NOW(),
    NOW()
);

-- 3. Deactivate previous generic rules and set exclusive rule for Workforce Manager
UPDATE wfm_auth_rules SET active = FALSE;

INSERT INTO wfm_auth_rules (rule_name, designation_equals, skill_equals, active, priority, description)
VALUES (
    'WORKFORCE_MANAGER_SOLE_RULE',
    'Workforce Manager',
    'Workforce Management',
    TRUE,
    0,
    'Designation Workforce Manager with Workforce Management skill grants exclusive WFM portal access.'
);
