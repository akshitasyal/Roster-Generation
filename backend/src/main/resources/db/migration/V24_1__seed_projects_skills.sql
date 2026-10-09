-- V24b: Seed ACME Projects and Skills

INSERT INTO projects (project_code, project_name, description, status, start_date, timezone, location)
VALUES ('ACME-CS-01', 'ACME Customer Support 01', 'Primary CS Project for ACME Corp', 'ACTIVE', '2020-01-01', 'Asia/Kolkata', 'Hyderabad');

INSERT INTO skills (skill_code, skill_name, description, category, status)
VALUES
('CUSTOMER_SUPPORT', 'Customer Support', 'General customer support', 'SUPPORT', 'ACTIVE'),
('TECHNICAL_SUPPORT', 'Technical Support', 'Technical troubleshooting', 'TECHNICAL', 'ACTIVE'),
('BILLING', 'Billing & Invoicing', 'Billing queries and payments', 'FINANCE', 'ACTIVE'),
('ESCALATION', 'Escalation Handling', 'L2/L3 escalations', 'MANAGEMENT', 'ACTIVE'),
('QUALITY', 'Quality Assurance', 'QA and monitoring', 'QUALITY', 'ACTIVE');
