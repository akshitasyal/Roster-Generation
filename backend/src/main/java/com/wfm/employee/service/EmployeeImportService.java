package com.wfm.employee.service;

import com.wfm.employee.entity.Employee;
import com.wfm.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Processes uploaded Excel sheets and updates the employee master.
 * <p>
 * Header names are dynamically matched (case-insensitive), supporting the full
 * Tech Mahindra employee dataset schema:
 * Emp_ID, Name, Gender, Emp_Type, Designation, Joining_Date, Modification_Date,
 * Country, Location, Center, Status, LOB, Channel, Skill, Agent_Status, Mode_Of_Work.
 * </p>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeImportService {

    private final EmployeeRepository employeeRepository;

    @Transactional
    public int importEmployeesFromExcel(MultipartFile file) throws Exception {
        int count = 0;

        // Mark non-WFM employees inactive prior to restoring from sheet
        employeeRepository.markNonSeniorManagerAsInactive();

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.rowIterator();

            if (!rowIterator.hasNext()) return 0;

            // Map column header names to column index
            Row headerRow = rowIterator.next();
            Map<String, Integer> headerMap = new HashMap<>();
            for (Cell cell : headerRow) {
                String header = getStringValue(cell);
                if (header != null) {
                    headerMap.put(header.trim().toLowerCase(), cell.getColumnIndex());
                }
            }

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();

                String empId = getVal(row, headerMap, "emp_id", "empid", "emp id", "employee id");
                if (empId == null || empId.trim().isEmpty()) continue;

                String name = getVal(row, headerMap, "name", "employee name", "emp_name");

                Employee employee = employeeRepository.findByEmpId(empId.trim())
                        .orElseGet(() -> Employee.builder()
                                .empId(empId.trim())
                                .email(generateEmail(name, empId.trim()))
                                .build());

                employee.setEmpId(empId.trim());
                if (name != null) employee.setName(name);
                
                String gender = getVal(row, headerMap, "gender");
                if (gender != null) employee.setGender(gender);

                String empType = getVal(row, headerMap, "emp_type", "emptype", "emp type");
                if (empType != null) employee.setEmpType(empType);

                String designation = getVal(row, headerMap, "designation", "role");
                if (designation != null) employee.setDesignation(designation);

                String country = getVal(row, headerMap, "country");
                if (country != null) employee.setCountry(country);

                String location = getVal(row, headerMap, "location", "city");
                if (location != null) employee.setLocation(location);

                String center = getVal(row, headerMap, "center", "site");
                if (center != null) employee.setCenter(center);

                String lob = getVal(row, headerMap, "lob", "line of business");
                if (lob != null) employee.setLob(lob);

                String channel = getVal(row, headerMap, "channel");
                if (channel != null) employee.setChannel(channel);

                String skill = getVal(row, headerMap, "skill", "profile");
                if (skill != null) employee.setSkill(skill);

                String agentStatus = getVal(row, headerMap, "agent_status", "agent status");
                if (agentStatus != null) employee.setAgentStatus(agentStatus);

                String modeOfWork = getVal(row, headerMap, "mode_of_work", "mode of work");
                if (modeOfWork != null) employee.setModeOfWork(modeOfWork);

                employee.setStatus("Active");

                employeeRepository.save(employee);
                count++;
            }
        }

        log.info("Excel import complete: {} employees updated", count);
        return count;
    }

    private String getVal(Row row, Map<String, Integer> headerMap, String... keys) {
        for (String key : keys) {
            Integer index = headerMap.get(key.toLowerCase());
            if (index != null) {
                Cell cell = row.getCell(index);
                String val = getStringValue(cell);
                if (val != null && !val.trim().isEmpty()) {
                    return val.trim();
                }
            }
        }
        return null;
    }

    private String generateEmail(String name, String empId) {
        if (name == null || name.trim().isEmpty()) {
            return empId.toLowerCase() + "@techmahindra.com";
        }
        String[] parts = name.trim().toLowerCase().split("\\s+");
        if (parts.length >= 2) {
            return parts[0] + "." + parts[parts.length - 1] + "@techmahindra.com";
        }
        return parts[0] + "." + empId.toLowerCase() + "@techmahindra.com";
    }

    private String getStringValue(Cell cell) {
        if (cell == null) return null;
        return switch (cell.getCellType()) {
            case STRING  -> cell.getStringCellValue().trim();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                yield String.valueOf((long) cell.getNumericCellValue());
            }
            default      -> null;
        };
    }
}
