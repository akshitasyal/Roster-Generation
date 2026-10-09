with open('c:/Users/Akshat/Roster Generation/backend/src/main/resources/db/migration/V25__seed_employees.sql', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_user = "('WFM-001', 'Admin WFM', 'U', 'Full Timer', 'WFM Analyst', '2026-01-01', '2026-01-01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'India', 'Noida', 'P131', 'Active', 'WFM', 'Blended', 'Workforce Management', 'Support', 'WFO', 'admin.wfm@techmahindra.com', '$2a$10$7qB/cIhBv5E.5f2xL/f1qONt.a8uYgU/5zY0O9GvI.H.zLqE/mU8i', 6)"

if not any('WFM-001' in line for line in lines):
    lines[-1] = lines[-1].replace(';', ',\n' + new_user + ';')
    
    with open('c:/Users/Akshat/Roster Generation/backend/src/main/resources/db/migration/V25__seed_employees.sql', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print('WFM Admin added')
else:
    print('WFM Admin already exists')
