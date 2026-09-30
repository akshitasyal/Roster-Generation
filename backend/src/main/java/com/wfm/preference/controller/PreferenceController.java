package com.wfm.preference.controller;
import com.wfm.preference.dto.EmployeePreferenceDTO;
import com.wfm.preference.dto.WeeklyOffPreferenceDTO;
import com.wfm.preference.service.PreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/preferences")
@RequiredArgsConstructor
public class PreferenceController {
    private final PreferenceService service;
    
    @GetMapping("/employee/{cycleId}/{employeeId}")
    @PreAuthorize("hasAnyAuthority('WFM', 'MANAGER', 'AM', 'TL') or authentication.principal.id == #employeeId")
    public ResponseEntity<List<EmployeePreferenceDTO>> getEmpPrefs(@PathVariable Long cycleId, @PathVariable Long employeeId) {
        return ResponseEntity.ok(service.getEmployeePreferences(cycleId, employeeId));
    }
    @PostMapping("/employee")
    @PreAuthorize("hasAuthority('WFM') or authentication.principal.id == #dto.employeeId")
    public ResponseEntity<EmployeePreferenceDTO> submitEmpPref(@RequestBody EmployeePreferenceDTO dto) {
        return ResponseEntity.ok(service.submitEmployeePreference(dto));
    }
    @PostMapping("/employee/{id}/decline")
    @PreAuthorize("hasAnyAuthority('WFM', 'TL')")
    public ResponseEntity<EmployeePreferenceDTO> declinePref(@PathVariable Long id, @RequestParam Long tlId, @RequestParam String reason) {
        return ResponseEntity.ok(service.declineEmployeePreference(id, tlId, reason));
    }
    
    @GetMapping("/weekly-off/{cycleId}/{employeeId}")
    @PreAuthorize("hasAnyAuthority('WFM', 'MANAGER', 'AM', 'TL') or authentication.principal.id == #employeeId")
    public ResponseEntity<List<WeeklyOffPreferenceDTO>> getWeeklyOffPrefs(@PathVariable Long cycleId, @PathVariable Long employeeId) {
        return ResponseEntity.ok(service.getWeeklyOffPreferences(cycleId, employeeId));
    }
    @PostMapping("/weekly-off")
    @PreAuthorize("hasAuthority('WFM') or authentication.principal.id == #dto.employeeId")
    public ResponseEntity<WeeklyOffPreferenceDTO> submitWeeklyOffPref(@RequestBody WeeklyOffPreferenceDTO dto) {
        return ResponseEntity.ok(service.submitWeeklyOffPreference(dto));
    }
}
