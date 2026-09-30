import os

base_dir = "C:/Users/Akshat/Roster Generation/backend/src/main/java/com/wfm"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Created {path}")

# --- EMPLOYEE ---
write_file(f"{base_dir}/employee/dto/EmployeeDTO.java", """
package com.wfm.employee.dto;
import lombok.Data;
import java.time.LocalDate;

@Data
public class EmployeeDTO {
    private Long id;
    private String employeeCode;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Long roleId;
    private String roleCode;
    private String employmentStatus;
    private String employmentType;
    private LocalDate dateOfJoining;
    private LocalDate lastWorkingDate;
    private String location;
    private String gender;
    private Boolean isActive;
}
""")

write_file(f"{base_dir}/employee/mapper/EmployeeMapper.java", """
package com.wfm.employee.mapper;

import com.wfm.employee.dto.EmployeeDTO;
import com.wfm.employee.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EmployeeMapper {
    @Mapping(target = "roleId", source = "role.id")
    @Mapping(target = "roleCode", source = "role.code")
    EmployeeDTO toDto(Employee entity);

    @Mapping(target = "role", ignore = true)
    Employee toEntity(EmployeeDTO dto);
}
""")

write_file(f"{base_dir}/employee/service/EmployeeService.java", """
package com.wfm.employee.service;

import com.wfm.common.dto.PagedResponse;
import com.wfm.employee.dto.EmployeeDTO;

import java.util.List;

public interface EmployeeService {
    EmployeeDTO getEmployeeById(Long id);
    List<EmployeeDTO> getAllEmployees();
    EmployeeDTO createEmployee(EmployeeDTO dto);
    EmployeeDTO updateEmployee(Long id, EmployeeDTO dto);
    void deleteEmployee(Long id);
}
""")

write_file(f"{base_dir}/employee/service/EmployeeServiceImpl.java", """
package com.wfm.employee.service;

import com.wfm.employee.dto.EmployeeDTO;
import com.wfm.employee.entity.Employee;
import com.wfm.employee.mapper.EmployeeMapper;
import com.wfm.employee.repository.EmployeeRepository;
import com.wfm.organization.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final RoleRepository roleRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    @Transactional(readOnly = true)
    public EmployeeDTO getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .map(employeeMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(employeeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EmployeeDTO createEmployee(EmployeeDTO dto) {
        Employee employee = employeeMapper.toEntity(dto);
        employee.setPasswordHash("temp_hash"); // In real app, generate random password and hash it
        if (dto.getRoleId() != null) {
            employee.setRole(roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found")));
        }
        return employeeMapper.toDto(employeeRepository.save(employee));
    }

    @Override
    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        existing.setFirstName(dto.getFirstName());
        existing.setLastName(dto.getLastName());
        existing.setPhone(dto.getPhone());
        existing.setEmploymentStatus(dto.getEmploymentStatus());
        existing.setIsActive(dto.getIsActive());
        
        if (dto.getRoleId() != null && (existing.getRole() == null || !existing.getRole().getId().equals(dto.getRoleId()))) {
            existing.setRole(roleRepository.findById(dto.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found")));
        }
        
        return employeeMapper.toDto(employeeRepository.save(existing));
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}
""")

write_file(f"{base_dir}/employee/controller/EmployeeController.java", """
package com.wfm.employee.controller;

import com.wfm.employee.dto.EmployeeDTO;
import com.wfm.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('WFM', 'MANAGER', 'AM', 'SENIOR_MANAGER')")
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('WFM', 'MANAGER', 'AM', 'TL') or authentication.principal.id == #id")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(employeeService.createEmployee(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, dto));
    }
}
""")

print("Phase 3 Employee files created.")
