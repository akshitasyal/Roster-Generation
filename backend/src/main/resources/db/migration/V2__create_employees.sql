-- V2: Create employees table
CREATE TABLE employees (
    id                 BIGSERIAL PRIMARY KEY,
    employee_code      VARCHAR(50)  NOT NULL UNIQUE,
    first_name         VARCHAR(100) NOT NULL,
    last_name          VARCHAR(100) NOT NULL,
    email              VARCHAR(255) NOT NULL UNIQUE,
    phone              VARCHAR(20),
    password_hash      VARCHAR(255) NOT NULL,
    role_id            BIGINT       NOT NULL REFERENCES roles(id),
    employment_status  VARCHAR(30)  NOT NULL DEFAULT 'ACTIVE',
    -- ACTIVE | ON_NOTICE | TERMINATED | ON_LEAVE
    employment_type    VARCHAR(30)  NOT NULL DEFAULT 'FULL_TIME',
    -- FULL_TIME | PART_TIME | CONTRACT
    date_of_joining    DATE         NOT NULL,
    last_working_date  DATE,
    location           VARCHAR(100),
    gender             VARCHAR(10),
    is_active          BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login_at      TIMESTAMPTZ,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_employees_code           ON employees(employee_code);
CREATE INDEX idx_employees_role_id        ON employees(role_id);
CREATE INDEX idx_employees_is_active      ON employees(is_active);
CREATE INDEX idx_employees_email          ON employees(email);
CREATE INDEX idx_employees_employment_status ON employees(employment_status);

COMMENT ON TABLE employees IS 'Core employee master. Skills, eligibility, preferences, leave stored in separate tables.';
COMMENT ON COLUMN employees.employment_status IS 'ACTIVE | ON_NOTICE | TERMINATED | ON_LEAVE';
COMMENT ON COLUMN employees.employment_type   IS 'FULL_TIME | PART_TIME | CONTRACT';
