import pandas as pd
import math
import re

df = pd.read_excel(r'c:\Users\Akshat\Downloads\TechMahindra_Workforce_Employee_Dataset_200.xlsx')

def clean_val(v):
    if pd.isna(v):
        return 'NULL'
    if isinstance(v, str):
        v = v.replace("'", "''")
        return f"'{v}'"
    return f"'{v}'"

def map_role(designation):
    d = str(designation).lower()
    if 'senior manager' in d: return 5
    if 'associate manager' in d: return 3
    if 'manager' in d: return 4
    if 'team leader' in d: return 2
    if 'associate' in d: return 1
    return 1

sql_statements = ["-- V25: Seed Employees (Generated from Excel)", ""]
sql_statements.append("TRUNCATE TABLE employees CASCADE;")
sql_statements.append("")
sql_statements.append("INSERT INTO employees (")
sql_statements.append("  emp_id, name, gender, emp_type, designation, joining_date, modification_date,")
sql_statements.append("  manager1_emp_id, manager1_name, manager2_emp_id, manager2_name,")
sql_statements.append("  manager3_emp_id, manager3_name, manager4_emp_id, manager4_name,")
sql_statements.append("  country, location, center, status, lob, channel, skill, agent_status, mode_of_work,")
sql_statements.append("  email, password_hash, role_id")
sql_statements.append(") VALUES")

values_list = []
for index, row in df.iterrows():
    # Construct email
    name = str(row['Name']).lower().strip()
    name_parts = re.sub(r'[^a-z\s]', '', name).split()
    if len(name_parts) >= 2:
        email = f"{name_parts[0]}.{name_parts[1]}@techmahindra.com"
    else:
        email = f"{name_parts[0]}@techmahindra.com" if name_parts else f"emp{index}@techmahindra.com"
    
    role_id = map_role(row['Designation'])
    password_hash = "'$2a$10$7qB/cIhBv5E.5f2xL/f1qONt.a8uYgU/5zY0O9GvI.H.zLqE/mU8i'" # Wfm@12345
    
    def parse_date(date_val):
        if pd.isna(date_val): return 'NULL'
        date_str = str(date_val).strip()
        if not date_str: return 'NULL'
        # Convert DD-MM-YYYY to YYYY-MM-DD
        parts = date_str.split('-')
        if len(parts) == 3:
            return f"'{parts[2]}-{parts[1]}-{parts[0]}'"
        return f"'{date_str}'"

    row_vals = [
        clean_val(row['Emp_ID']), clean_val(row['Name']), clean_val(row['Gender']), 
        clean_val(row['Emp_Type']), clean_val(row['Designation']), 
        parse_date(row['Joining_Date']), parse_date(row['Modification_Date']),
        clean_val(row['Manager1_Emp_Id']), clean_val(row['Manager1_Name']),
        clean_val(row['Manager2_Emp_Id']), clean_val(row['Manager2_Name']),
        clean_val(row['Manager3_Emp_Id']), clean_val(row['Manager3_Name']),
        clean_val(row['Manager4_Emp_Id']), clean_val(row['Manager4_Name']),
        clean_val(row['Country']), clean_val(row['Location']), clean_val(row['Center']),
        clean_val(row['Status']), clean_val(row['LOB']), clean_val(row['Channel']),
        clean_val(row['Skill']), clean_val(row['Agent_Status']), clean_val(row['Mode_Of_Work']),
        f"'{email}'", password_hash, str(role_id)
    ]
    
    values_list.append("(" + ", ".join(row_vals) + ")")

sql_statements.append(",\n".join(values_list) + ";")

with open(r'c:\Users\Akshat\Roster Generation\backend\src\main\resources\db\migration\V25__seed_employees.sql', 'w', encoding='utf-8') as f:
    f.write("\n".join(sql_statements))

print("V25 written successfully.")
