-- V22: Create notifications table
CREATE TABLE notifications (
    id                   BIGSERIAL PRIMARY KEY,
    recipient_employee_id BIGINT      NOT NULL REFERENCES employees(id),
    notification_type    VARCHAR(50) NOT NULL,
    -- ROSTER_PUBLISHED | LEAVE_STATUS | PREFERENCE_LOCKED | REPLACEMENT_NEEDED
    -- STAFFING_SHORTAGE | ROSTER_ADJUSTED | APPROVAL_REQUIRED | GENERAL
    title                VARCHAR(300) NOT NULL,
    message              TEXT         NOT NULL,
    reference_type       VARCHAR(50),
    -- PLANNING_CYCLE | ROSTER_VERSION | LEAVE | ROSTER_ASSIGNMENT | EXCEPTION
    reference_id         VARCHAR(100),
    priority             VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    -- LOW | NORMAL | HIGH | URGENT
    is_read              BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at              TIMESTAMPTZ,
    expires_at           TIMESTAMPTZ
);

CREATE INDEX idx_notifications_recipient    ON notifications(recipient_employee_id);
CREATE INDEX idx_notifications_is_read      ON notifications(is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at   ON notifications(created_at);
CREATE INDEX idx_notifications_type         ON notifications(notification_type);
CREATE INDEX idx_notifications_recipient_read ON notifications(recipient_employee_id, is_read);

COMMENT ON TABLE notifications IS
    'In-app notifications for all users. '
    'Sent on: roster published, leave status update, replacement, staffing shortage, approval required. '
    'is_read index partial on FALSE for fast unread count queries.';
