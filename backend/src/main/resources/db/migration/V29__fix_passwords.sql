-- Update all seeded employees to have the correct bcrypt hash for "Wfm@12345"
UPDATE employees SET password_hash = '$2a$10$ZAqgzFpykeab4aZ8kgOLyeUiLKX7vS.dd8TZbNEdNoY3e14ihVfS2';
