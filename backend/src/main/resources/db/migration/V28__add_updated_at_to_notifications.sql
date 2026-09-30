-- V28: Add updated_at to notifications table to match BaseEntity
ALTER TABLE notifications ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
