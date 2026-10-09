-- V39: Seed user_accounts for the 2 WFM Senior Managers.
-- Only TM10001 (Vikas Gupta) and TM10002 (Gaurav Agarwal) get pre-seeded accounts.
-- All other 198 employees must self-register via the /signup page.
-- Password: Wfm@12345  (BCrypt hash below)

INSERT INTO user_accounts (emp_id, email, password_hash, account_status, email_verified, created_at, updated_at)
VALUES
    ('TM10001',
     'vikas.gupta@techmahindra.com',
     '$2a$10$7qB/cIhBv5E.5f2xL/f1qONt.a8uYgU/5zY0O9GvI.H.zLqE/mU8i',
     'ACTIVE',
     TRUE,
     NOW(),
     NOW()),
    ('TM10002',
     'gaurav.agarwal@techmahindra.com',
     '$2a$10$7qB/cIhBv5E.5f2xL/f1qONt.a8uYgU/5zY0O9GvI.H.zLqE/mU8i',
     'ACTIVE',
     TRUE,
     NOW(),
     NOW());
