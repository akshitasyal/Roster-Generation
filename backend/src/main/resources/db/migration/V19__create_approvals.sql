-- V19: Create approvals table
CREATE TABLE approvals (
    id                   BIGSERIAL PRIMARY KEY,
    roster_version_id    BIGINT      NOT NULL REFERENCES roster_versions(id),
    approval_level       VARCHAR(50) NOT NULL,
    -- TL_REVIEW | AM_REVIEW | MANAGER_REVIEW | SENIOR_MANAGER_REVIEW | WFM_APPROVAL
    approver_employee_id BIGINT      NOT NULL REFERENCES employees(id),
    status               VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    -- PENDING | APPROVED | REJECTED | SKIPPED
    comments             TEXT,
    approved_at          TIMESTAMPTZ,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_approval_version_level UNIQUE (roster_version_id, approval_level)
);

CREATE INDEX idx_approvals_version_id   ON approvals(roster_version_id);
CREATE INDEX idx_approvals_approver_id  ON approvals(approver_employee_id);
CREATE INDEX idx_approvals_status       ON approvals(status);
CREATE INDEX idx_approvals_level        ON approvals(approval_level);

COMMENT ON TABLE approvals IS
    'Multi-level approval workflow for roster versions. '
    'Approval levels: TL_REVIEW | AM_REVIEW | MANAGER_REVIEW | SENIOR_MANAGER_REVIEW | WFM_APPROVAL. '
    'WFM is the final approval authority.';
