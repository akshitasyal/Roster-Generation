-- V24: Seed skills, shifts, and project data

-- Skills
INSERT INTO skills (skill_code, skill_name, description, category) VALUES
('CUSTOMER_SUPPORT',  'Customer Support',   'General customer-facing support',    'SUPPORT'),
('TECHNICAL_SUPPORT', 'Technical Support',  'L1/L2 technical troubleshooting',    'SUPPORT'),
('BILLING',           'Billing & Payments', 'Billing, invoicing, payment issues',  'FINANCE'),
('ESCALATION',        'Escalation Handling','Handles escalated complex cases',     'SUPPORT'),
('QUALITY',           'Quality Assurance',  'Call/chat quality monitoring',        'QUALITY');

-- Shifts
-- NOTE: Timings are configurable. These are realistic BPO shift windows.
INSERT INTO shifts (shift_code, shift_name, shift_type, start_time, end_time, duration_hours, is_overnight) VALUES
('M',   'Morning',  'MORNING',  '06:00', '15:00', 9.0,  FALSE),
('G',   'General',  'GENERAL',  '09:00', '18:00', 9.0,  FALSE),
('E',   'Evening',  'EVENING',  '14:00', '23:00', 9.0,  FALSE),
('N',   'Night',    'NIGHT',    '22:00', '07:00', 9.0,  TRUE),
('OFF', 'Off Day',  'OFF',      '00:00', '00:00', 0.0,  FALSE);

-- NOTE: The OFF "shift" is a sentinel used in the optimizer model.
-- In roster_assignments, assignment_type='OFF' with shift_id=NULL is the actual representation.
-- The shifts table row for 'OFF' is used as a model sentinel if needed.

-- Project
INSERT INTO projects (project_code, project_name, description, status, start_date, timezone, location) VALUES
('ACME-CS-01', 'ACME Customer Support', 'Customer support operations for ACME Corp. BPO engagement.', 'ACTIVE', '2025-01-01', 'Asia/Kolkata', 'Hyderabad');
