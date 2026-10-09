package com.wfm.employee.controller;

import com.wfm.employee.dto.EmployeeDTO;
import com.wfm.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.wfm.employee.service.EmployeeImportService;
import java.util.Collections;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;
    private final EmployeeImportService employeeImportService;

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<Map<String, String>> uploadEmployees(@RequestParam("file") MultipartFile file) {
        try {
            int count = employeeImportService.importEmployeesFromExcel(file);
            return ResponseEntity.ok(Collections.singletonMap("message", "Successfully imported " + count + " employees"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Failed to import: " + e.getMessage()));
        }
    }

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
