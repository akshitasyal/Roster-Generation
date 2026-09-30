package com.wfm.roster.controller;
import com.wfm.roster.dto.CoverageDTO;
import com.wfm.roster.dto.RosterExceptionDTO;
import com.wfm.roster.service.CoverageService;
import com.wfm.roster.service.ValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/roster/validation")
@RequiredArgsConstructor
public class ValidationController {
    private final CoverageService coverageService;
    private final ValidationService validationService;

    @PostMapping("/{versionId}/coverage")
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<List<CoverageDTO>> computeCoverage(@PathVariable Long versionId) {
        return ResponseEntity.ok(coverageService.calculateAndSaveCoverage(versionId));
    }

    @PostMapping("/{versionId}/constraints")
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<List<RosterExceptionDTO>> validateConstraints(@PathVariable Long versionId) {
        return ResponseEntity.ok(validationService.validateRosterVersion(versionId));
    }
}
