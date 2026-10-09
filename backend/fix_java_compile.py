import os

def replace_in_file(filepath, old_text, new_text):
    if not os.path.exists(filepath):
        print(f"Not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace(old_text, new_text)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

# 1. WfmUserDetailsService
replace_in_file(r'c:\Users\Akshat\Roster Generation\backend\src\main\java\com\wfm\security\WfmUserDetailsService.java',
                "if (!Boolean.TRUE.equals(employee.getIsActive())) {",
                "if (!\"Active\".equalsIgnoreCase(employee.getStatus())) {")

# 2. WfmUserPrincipal
replace_in_file(r'c:\Users\Akshat\Roster Generation\backend\src\main\java\com\wfm\security\WfmUserPrincipal.java',
                "return Boolean.TRUE.equals(employee.getIsActive());",
                "return \"Active\".equalsIgnoreCase(employee.getStatus());")

# 3. EmployeeServiceImpl
replace_in_file(r'c:\Users\Akshat\Roster Generation\backend\src\main\java\com\wfm\employee\service\EmployeeServiceImpl.java',
"""        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setPhone(dto.getPhone());
        existing.setEmploymentStatus(dto.getEmploymentStatus());
        existing.setIsActive(dto.getIsActive());""",
"""        existing.setName(dto.getFirstName());
        existing.setStatus(dto.getIsActive() != null && dto.getIsActive() ? "Active" : "Inactive");""")

# 4. ReplacementServiceImpl
replace_in_file(r'c:\Users\Akshat\Roster Generation\backend\src\main\java\com\wfm\roster\service\ReplacementServiceImpl.java',
"""        dto.setFirstName(emp.getFirstName());
        dto.setLastName(emp.getLastName());""",
"""        dto.setFirstName(emp.getName());
        dto.setLastName("");""")
        
print("Java compile fixes applied.")
