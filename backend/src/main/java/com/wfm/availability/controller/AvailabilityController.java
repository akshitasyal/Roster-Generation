package com.wfm.availability.controller;
import com.wfm.availability.dto.AvailabilityDTO;
import com.wfm.availability.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
public class AvailabilityController {
    private final AvailabilityService availabilityService;
    
    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasAnyAuthority('WFM', 'MANAGER', 'AM', 'TL') or authentication.principal.id == #employeeId")
    public ResponseEntity<List<AvailabilityDTO>> getEmployeeAvailability(@PathVariable Long employeeId) {
        return ResponseEntity.ok(availabilityService.getEmployeeAvailability(employeeId));
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('WFM') or authentication.principal.id == #dto.employeeId")
    public ResponseEntity<AvailabilityDTO> createAvailability(@RequestBody AvailabilityDTO dto) {
        return ResponseEntity.ok(availabilityService.createAvailability(dto));
    }
}
