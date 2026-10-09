-- V37: Separate authentication from employee master
-- Creates user_accounts table (1:1 with employees).
-- Removes password_hash, role_id, last_login_at from employees.
-- Removes the fake WFM9999 test account added in V36.

-- ================================================================
-- 1. Remove fake WFM9999 employee (violates spec: no fake employees)
-- ================================================================
DELETE FROM employee_org_assignments WHERE employee_id = (SELECT id FROM employees WHERE emp_id = 'WFM9999');
DELETE FROM employees WHERE emp_id = 'WFM9999';

-- ================================================================
-- 2. Create user_accounts table (authentication layer only)
-- ================================================================
CREATE TABLE user_accounts (
    id                    BIGSERIAL    PRIMARY KEY,
    emp_id                VARCHAR(50)  NOT NULL UNIQUE REFERENCES employees(emp_id) ON DELETE CASCADE,
    email                 VARCHAR(255) NOT NULL UNIQUE,
    password_hash         VARCHAR(255) NOT NULL,
    account_status        VARCHAR(30)  NOT NULL DEFAULT 'ACTIVE',
    -- ACTIVE | LOCKED | PENDING_VERIFICATION | DISABLED
    email_verified        BOOLEAN      NOT NULL DEFAULT TRUE,
    failed_login_attempts INT          NOT NULL DEFAULT 0,
    locked_until          TIMESTAMPTZ,
    last_login_at         TIMESTAMPTZ,
    created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_accounts_emp_id ON user_accounts(emp_id);
CREATE INDEX idx_user_accounts_email  ON user_accounts(email);
CREATE INDEX idx_user_accounts_status ON user_accounts(account_status);

COMMENT ON TABLE user_accounts IS
  '1:1 with employees. Stores credentials ONLY. Designation, LOB, skill, managers remain in employees.';
COMMENT ON COLUMN user_accounts.account_status IS 'ACTIVE | LOCKED | PENDING_VERIFICATION | DISABLED';

-- ================================================================
-- 3. Remove auth fields from employees (they belong in user_accounts)
--    Drop FK constraint first, then the columns.
-- ================================================================
DO $$
DECLARE
    fk_name TEXT;
BEGIN
    -- Find and drop the FK constraint on role_id
    SELECT conname INTO fk_name
    FROM pg_constraint
    WHERE conrelid = 'employees'::regclass
      AND confrelid = 'roles'::regclass
      AND contype = 'f';
    
    IF fk_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE employees DROP CONSTRAINT ' || quote_ident(fk_name);
    END IF;
END $$;

ALTER TABLE employees DROP COLUMN IF EXISTS password_hash;
ALTER TABLE employees DROP COLUMN IF EXISTS role_id;
ALTER TABLE employees DROP COLUMN IF EXISTS last_login_at;
