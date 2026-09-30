-- V34: Seed users for all seeded employees
-- Generates default users for all employees currently in the system
-- Uses a default password hash (e.g., 'password' hashed with BCrypt)
-- Default BCrypt hash for 'password': $2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGF.4KqY.b2wY6L6R74W

INSERT INTO users (employee_id, username, password_hash, status, failed_attempts, created_at, updated_at)
SELECT 
    id, 
    email, 
    '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGF.4KqY.b2wY6L6R74W', 
    'ACTIVE', 
    0, 
    NOW(), 
    NOW()
FROM employees
ON CONFLICT (username) DO NOTHING;
