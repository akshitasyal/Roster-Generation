-- V2: Create employees table
CREATE TABLE employees (
    id                 BIGSERIAL PRIMARY KEY,
    
    -- Fields from requested schema
    emp_id             VARCHAR(50)  NOT NULL UNIQUE,
    name               VARCHAR(200) NOT NULL,
    gender             VARCHAR(10),  -- M/F/U
    emp_type           VARCHAR(50),  -- Full Timer / Contractual
    designation        VARCHAR(100), -- Support, Advisor
    joining_date       DATE,
    modification_date  DATE,
    
    manager1_emp_id    VARCHAR(50),
    manager1_name      VARCHAR(200),
    manager2_emp_id    VARCHAR(50),
    manager2_name      VARCHAR(200),
    manager3_emp_id    VARCHAR(50),
    manager3_name      VARCHAR(200),
    manager4_emp_id    VARCHAR(50),
    manager4_name      VARCHAR(200),
    
    country            VARCHAR(100),
    location           VARCHAR(100),
    center             VARCHAR(100),
    status             VARCHAR(50) DEFAULT 'Active', -- Active/Inactive
    lob                VARCHAR(100), -- Line of Business
    channel            VARCHAR(100), -- BO/Voice/Chat/Email/Blended
    skill              VARCHAR(255),
    agent_status       VARCHAR(100), -- Support, Production, OJT, Training
    mode_of_work       VARCHAR(50),  -- WFO, WFH
    
    -- Essential App/Auth Fields (Retained for system to work)
    email              VARCHAR(255) NOT NULL UNIQUE,
    password_hash      VARCHAR(255) NOT NULL,
    role_id            BIGINT       NOT NULL REFERENCES roles(id),
    last_login_at      TIMESTAMPTZ,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_employees_emp_id     ON employees(emp_id);
CREATE INDEX idx_employees_role_id    ON employees(role_id);
CREATE INDEX idx_employees_status     ON employees(status);
CREATE INDEX idx_employees_email      ON employees(email);
CREATE INDEX idx_employees_lob        ON employees(lob);
CREATE INDEX idx_employees_location   ON employees(location);

