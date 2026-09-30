package com.wfm.leave.controller;
import com.wfm.leave.dto.LeaveDTO;
import com.wfm.leave.service.LeaveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {
    private final LeaveService leaveService;
    
    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyAuthority('WFM', 'MANAGER', 'AM', 'TL') or authentication.principal.id == #employeeId")
    public ResponseEntity<List<LeaveDTO>> getEmployeeLeaves(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getLeavesByEmployee(employeeId));
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('WFM') or authentication.principal.id == #dto.employeeId")
    public ResponseEntity<LeaveDTO> submitLeave(@RequestBody LeaveDTO dto) {
        return ResponseEntity.ok(leaveService.submitLeave(dto));
    }
    
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyAuthority('WFM', 'MANAGER', 'AM', 'TL')")
    public ResponseEntity<LeaveDTO> approveLeave(@PathVariable Long id, @RequestParam Long approverId) {
        return ResponseEntity.ok(leaveService.approveLeave(id, approverId));
    }
}
