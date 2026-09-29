-- V14: Create roster_versions table
CREATE TABLE roster_versions (
    id                BIGSERIAL PRIMARY KEY,
    planning_cycle_id BIGINT      NOT NULL REFERENCES planning_cycles(id),
    version_number    INTEGER     NOT NULL,
    version_type      VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    -- DRAFT | WFM_ADJUSTED | APPROVED | PUBLISHED
    status            VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    -- ACTIVE | SUPERSEDED | ARCHIVED | PUBLISHED
    parent_version_id BIGINT      REFERENCES roster_versions(id),
    -- Track version lineage
    scope             VARCHAR(50) NOT NULL DEFAULT 'FULL_WEEK',
    -- FULL_WEEK | SINGLE_DAY | SPECIFIC_SHIFT | SPECIFIC_TEAM | SPECIFIC_TL | STAFFING_GAP | REPLACEMENT
    generated_by      BIGINT      REFERENCES employees(id),
    generated_at      TIMESTAMPTZ,
    approved_by       BIGINT      REFERENCES employees(id),
    approved_at       TIMESTAMPTZ,
    published_by      BIGINT      REFERENCES employees(id),
    published_at      TIMESTAMPTZ,
    version_notes     TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_roster_version_cycle_number UNIQUE (planning_cycle_id, version_number)
);

CREATE INDEX idx_roster_versions_cycle_id    ON roster_versions(planning_cycle_id);
CREATE INDEX idx_roster_versions_status      ON roster_versions(status);
CREATE INDEX idx_roster_versions_type        ON roster_versions(version_type);
CREATE INDEX idx_roster_versions_parent      ON roster_versions(parent_version_id);
CREATE INDEX idx_roster_versions_cycle_num   ON roster_versions(planning_cycle_id, version_number);

COMMENT ON TABLE roster_versions IS
    'Version control for generated rosters. Never overwrite. '
    'Version flow: DRAFT (V1) -> WFM_ADJUSTED (V2) -> PUBLISHED (V3+). '
    'parent_version_id tracks lineage. Published versions are IMMUTABLE. '
    'scope = FULL_WEEK for complete generation, narrower scopes for targeted re-generation.';
