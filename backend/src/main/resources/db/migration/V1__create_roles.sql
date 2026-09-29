-- V1: Create roles table
CREATE TABLE roles (
    id          BIGSERIAL PRIMARY KEY,
    code        VARCHAR(50) NOT NULL UNIQUE,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_roles_code ON roles(code);

COMMENT ON TABLE roles IS 'System roles for organizational hierarchy: ASSOCIATE, TL, AM, MANAGER, SENIOR_MANAGER, WFM';
