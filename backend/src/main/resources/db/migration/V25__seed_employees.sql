-- V25: Seed employees
-- Password hash below is BCrypt for "Wfm@12345" - change in production
-- Senior Manager
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'SM001', 'Rajiv', 'Sharma', 'rajiv.sharma@acme.wfm', '+91-9800000001', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2020-01-15', 'Hyderabad', 'MALE', TRUE
FROM roles r WHERE r.code = 'SENIOR_MANAGER';

-- Manager
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'MGR001', 'Priya', 'Nair', 'priya.nair@acme.wfm', '+91-9800000002', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2020-06-01', 'Hyderabad', 'FEMALE', TRUE
FROM roles r WHERE r.code = 'MANAGER';

-- WFM Analyst
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'WFM001', 'Ankit', 'Joshi', 'ankit.joshi@acme.wfm', '+91-9800000003', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2021-03-01', 'Hyderabad', 'MALE', TRUE
FROM roles r WHERE r.code = 'WFM';

-- Associate Managers
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'AM001', 'Sunita', 'Rao', 'sunita.rao@acme.wfm', '+91-9800000010', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2021-07-01', 'Hyderabad', 'FEMALE', TRUE
FROM roles r WHERE r.code = 'AM';

INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'AM002', 'Deepak', 'Verma', 'deepak.verma@acme.wfm', '+91-9800000011', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2022-01-10', 'Hyderabad', 'MALE', TRUE
FROM roles r WHERE r.code = 'AM';

-- Team Leaders (3 TLs)
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'TL001', 'Arun', 'Kumar', 'arun.kumar@acme.wfm', '+91-9800000020', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2022-03-15', 'Hyderabad', 'MALE', TRUE
FROM roles r WHERE r.code = 'TL';

INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'TL002', 'Meera', 'Pillai', 'meera.pillai@acme.wfm', '+91-9800000021', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2022-05-01', 'Hyderabad', 'FEMALE', TRUE
FROM roles r WHERE r.code = 'TL';

INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'TL003', 'Ravi', 'Shankar', 'ravi.shankar@acme.wfm', '+91-9800000022', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2022-08-10', 'Hyderabad', 'MALE', TRUE
FROM roles r WHERE r.code = 'TL';

-- Associates (25 associates across 3 teams)
-- Team 1 Associates (reports to TL001, AM001)
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E001', 'Sanjay', 'Mehta', 'sanjay.mehta@acme.wfm', '+91-9800001001', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-01-10', 'Hyderabad', 'MALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E002', 'Kavya', 'Reddy', 'kavya.reddy@acme.wfm', '+91-9800001002', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-01-15', 'Hyderabad', 'FEMALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E003', 'Vivek', 'Gupta', 'vivek.gupta@acme.wfm', '+91-9800001003', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-02-01', 'Hyderabad', 'MALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E004', 'Pooja', 'Singh', 'pooja.singh@acme.wfm', '+91-9800001004', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-02-15', 'Hyderabad', 'FEMALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E005', 'Kiran', 'Patel', 'kiran.patel@acme.wfm', '+91-9800001005', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-03-01', 'Hyderabad', 'MALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E006', 'Nisha', 'Agarwal', 'nisha.agarwal@acme.wfm', '+91-9800001006', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-03-15', 'Hyderabad', 'FEMALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E007', 'Rohit', 'Das', 'rohit.das@acme.wfm', '+91-9800001007', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-04-01', 'Hyderabad', 'MALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E008', 'Preethi', 'Krishnan', 'preethi.krishnan@acme.wfm', '+91-9800001008', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-04-15', 'Hyderabad', 'FEMALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';

-- Team 2 Associates (reports to TL002, AM001)
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E009', 'Suresh', 'Iyer', 'suresh.iyer@acme.wfm', '+91-9800001009', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-05-01', 'Hyderabad', 'MALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E010', 'Ananya', 'Bose', 'ananya.bose@acme.wfm', '+91-9800001010', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-05-15', 'Hyderabad', 'FEMALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E011', 'Akash', 'Malhotra', 'akash.malhotra@acme.wfm', '+91-9800001011', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-06-01', 'Hyderabad', 'MALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E012', 'Divya', 'Menon', 'divya.menon@acme.wfm', '+91-9800001012', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-06-15', 'Hyderabad', 'FEMALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E013', 'Vishal', 'Chopra', 'vishal.chopra@acme.wfm', '+91-9800001013', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-07-01', 'Hyderabad', 'MALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E014', 'Sneha', 'Yadav', 'sneha.yadav@acme.wfm', '+91-9800001014', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-07-15', 'Hyderabad', 'FEMALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E015', 'Harish', 'Nambiar', 'harish.nambiar@acme.wfm', '+91-9800001015', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-08-01', 'Hyderabad', 'MALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E016', 'Asha', 'Pillai', 'asha.pillai@acme.wfm', '+91-9800001016', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-08-15', 'Hyderabad', 'FEMALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';

-- Team 3 Associates (reports to TL003, AM002)
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E017', 'Gaurav', 'Tiwari', 'gaurav.tiwari@acme.wfm', '+91-9800001017', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-09-01', 'Hyderabad', 'MALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E018', 'Ritu', 'Saxena', 'ritu.saxena@acme.wfm', '+91-9800001018', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-09-15', 'Hyderabad', 'FEMALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E019', 'Nikhil', 'Jain', 'nikhil.jain@acme.wfm', '+91-9800001019', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-10-01', 'Hyderabad', 'MALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E020', 'Bhavna', 'Shah', 'bhavna.shah@acme.wfm', '+91-9800001020', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-10-15', 'Hyderabad', 'FEMALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E021', 'Arjun', 'Nair', 'arjun.nair@acme.wfm', '+91-9800001021', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-11-01', 'Hyderabad', 'MALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E022', 'Tanya', 'Mishra', 'tanya.mishra@acme.wfm', '+91-9800001022', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-11-15', 'Hyderabad', 'FEMALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E023', 'Sachin', 'Kumar', 'sachin.kumar@acme.wfm', '+91-9800001023', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2023-12-01', 'Hyderabad', 'MALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E024', 'Manjula', 'Rao', 'manjula.rao@acme.wfm', '+91-9800001024', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2024-01-10', 'Hyderabad', 'FEMALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
INSERT INTO employees (employee_code, first_name, last_name, email, phone, password_hash, role_id, employment_status, employment_type, date_of_joining, location, gender, is_active)
SELECT 'E025', 'Rajesh', 'Pandey', 'rajesh.pandey@acme.wfm', '+91-9800001025', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TqpN6c7K0dg9VPdkIR6qX3cYiXPy', r.id, 'ACTIVE', 'FULL_TIME', '2024-01-15', 'Hyderabad', 'MALE', TRUE FROM roles r WHERE r.code = 'ASSOCIATE';
