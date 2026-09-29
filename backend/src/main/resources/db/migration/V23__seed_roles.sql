-- V23: Seed reference data - Roles
INSERT INTO roles (code, name, description) VALUES
('ASSOCIATE',      'Associate',        'Front-line workforce associate'),
('TL',             'Team Leader',      'Team lead responsible for a team of associates'),
('AM',             'Associate Manager','Associate manager overseeing multiple TLs'),
('MANAGER',        'Manager',          'Manager overseeing multiple AMs'),
('SENIOR_MANAGER', 'Senior Manager',   'Senior manager overseeing business units'),
('WFM',            'WFM Analyst',      'Workforce Management - full planning authority');
