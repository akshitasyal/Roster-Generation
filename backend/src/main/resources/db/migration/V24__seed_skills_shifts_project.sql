-- V24: Seed shifts data

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
