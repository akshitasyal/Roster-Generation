package com.wfm.shift.controller;
import com.wfm.shift.dto.ShiftDTO;
import com.wfm.shift.service.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/shifts")
@RequiredArgsConstructor
public class ShiftController {
    private final ShiftService shiftService;
    @GetMapping
    @PreAuthorize("hasAnyAuthority('WFM', 'MANAGER', 'AM', 'TL')")
    public ResponseEntity<List<ShiftDTO>> getAllShifts() {
        return ResponseEntity.ok(shiftService.getAllShifts());
    }
    @PostMapping
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<ShiftDTO> createShift(@RequestBody ShiftDTO dto) {
        return ResponseEntity.ok(shiftService.createShift(dto));
    }
}
