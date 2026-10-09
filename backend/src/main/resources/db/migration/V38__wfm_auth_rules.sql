-- V38: Configurable WFM authorization rules table
-- Determines which employees get WFM portal access.
-- Initially rule: Designation='Senior Manager' AND Skill='Workforce Management'.
-- Can be extended later (e.g., an explicit WFM flag column on employees).

CREATE TABLE wfm_auth_rules (
    id                 BIGSERIAL    PRIMARY KEY,
    rule_name          VARCHAR(100) NOT NULL UNIQUE,
    designation_equals VARCHAR(100),  -- NULL = match any designation
    skill_equals       VARCHAR(255),  -- NULL = match any skill
    active             BOOLEAN      NOT NULL DEFAULT TRUE,
    priority           INT          NOT NULL DEFAULT 0, -- lower = higher priority
    description        TEXT,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wfm_auth_rules_active ON wfm_auth_rules(active);

COMMENT ON TABLE wfm_auth_rules IS
  'Configurable rules for identifying WFM portal users. All non-null conditions must match.';

-- Seed the initial rule: Senior Manager WITH Workforce Management skill = WFM
INSERT INTO wfm_auth_rules (rule_name, designation_equals, skill_equals, active, priority, description)
VALUES (
    'SENIOR_MANAGER_WFM_SKILL',
    'Senior Manager',
    'Workforce Management',
    TRUE,
    0,
    'Senior Managers with Workforce Management skill are identified as WFM users. This covers TM10001 (Vikas Gupta) and TM10002 (Gaurav Agarwal) in the current dataset.'
);
