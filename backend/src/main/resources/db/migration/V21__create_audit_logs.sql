-- V21: Create audit_logs table
CREATE TABLE audit_logs (
    id            BIGSERIAL PRIMARY KEY,
    entity_type   VARCHAR(100) NOT NULL,
    -- EMPLOYEE | ROSTER_ASSIGNMENT | PLANNING_CYCLE | LEAVE | PREFERENCE | etc.
    entity_id     VARCHAR(100) NOT NULL,
    action        VARCHAR(50)  NOT NULL,
    -- CREATE | UPDATE | DELETE | GENERATE | APPROVE | PUBLISH | LOCK | UNLOCK | ADJUST | LOGIN | LOGOUT
    old_value     JSONB,
    new_value     JSONB,
    performed_by  BIGINT       REFERENCES employees(id),
    performed_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    ip_address    VARCHAR(50),
    correlation_id VARCHAR(100),
    metadata      JSONB
    -- Additional context (e.g., reason, generation run ID, roster version ID)
);

CREATE INDEX idx_audit_logs_entity_type    ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id      ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_performed_by   ON audit_logs(performed_by);
CREATE INDEX idx_audit_logs_performed_at   ON audit_logs(performed_at);
CREATE INDEX idx_audit_logs_entity_performed ON audit_logs(entity_type, entity_id, performed_at);
CREATE INDEX idx_audit_logs_action         ON audit_logs(action);
CREATE INDEX idx_audit_logs_correlation_id ON audit_logs(correlation_id);

COMMENT ON TABLE audit_logs IS
    'Immutable audit trail for all significant actions. '
    'Who changed what, when, from what to what. '
    'Entity examples: ROSTER_ASSIGNMENT, LEAVE, PREFERENCE, PLANNING_CYCLE. '
    'Action examples: GENERATE, ADJUST, LOCK, UNLOCK, APPROVE, PUBLISH.';
