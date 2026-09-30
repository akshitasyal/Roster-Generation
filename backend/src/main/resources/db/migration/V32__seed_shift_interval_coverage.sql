-- V32: Seed shift_interval_coverage
-- Populates 30-minute interval coverage for all 4 standard shifts
-- Morning(M): 08:00-17:00, General(G): 09:00-18:00, Evening(E): 14:00-23:00, Night(N): 22:00-07:00+1

-- Helper: insert intervals for each shift by shift_code
-- Morning shift: shift_code='MORNING' (08:00-17:00, 9 one-hour intervals)
INSERT INTO shift_interval_coverage (shift_id, interval_start, interval_end, coverage_factor, effective_from)
SELECT s.id, i.istart::TIME, i.iend::TIME, 1.0, '2026-01-01'
FROM shifts s
CROSS JOIN (VALUES
    ('08:00','09:00'), ('09:00','10:00'), ('10:00','11:00'),
    ('11:00','12:00'), ('12:00','13:00'), ('13:00','14:00'),
    ('14:00','15:00'), ('15:00','16:00'), ('16:00','17:00')
) AS i(istart, iend)
WHERE s.shift_code = 'MORNING';

-- General shift: 09:00-18:00
INSERT INTO shift_interval_coverage (shift_id, interval_start, interval_end, coverage_factor, effective_from)
SELECT s.id, i.istart::TIME, i.iend::TIME, 1.0, '2026-01-01'
FROM shifts s
CROSS JOIN (VALUES
    ('09:00','10:00'), ('10:00','11:00'), ('11:00','12:00'),
    ('12:00','13:00'), ('13:00','14:00'), ('14:00','15:00'),
    ('15:00','16:00'), ('16:00','17:00'), ('17:00','18:00')
) AS i(istart, iend)
WHERE s.shift_code = 'GENERAL';

-- Evening shift: 14:00-23:00
INSERT INTO shift_interval_coverage (shift_id, interval_start, interval_end, coverage_factor, effective_from)
SELECT s.id, i.istart::TIME, i.iend::TIME, 1.0, '2026-01-01'
FROM shifts s
CROSS JOIN (VALUES
    ('14:00','15:00'), ('15:00','16:00'), ('16:00','17:00'),
    ('17:00','18:00'), ('18:00','19:00'), ('19:00','20:00'),
    ('20:00','21:00'), ('21:00','22:00'), ('22:00','23:00')
) AS i(istart, iend)
WHERE s.shift_code = 'EVENING';

-- Night shift: 22:00-07:00 (next day) - use 22:00-23:00 and 00:00-07:00
INSERT INTO shift_interval_coverage (shift_id, interval_start, interval_end, coverage_factor, effective_from)
SELECT s.id, i.istart::TIME, i.iend::TIME, 1.0, '2026-01-01'
FROM shifts s
CROSS JOIN (VALUES
    ('22:00','23:00'), ('23:00','23:59'), ('00:00','01:00'),
    ('01:00','02:00'), ('02:00','03:00'), ('03:00','04:00'),
    ('04:00','05:00'), ('05:00','06:00'), ('06:00','07:00')
) AS i(istart, iend)
WHERE s.shift_code = 'NIGHT';
