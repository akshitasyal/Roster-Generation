package com.wfm.roster.service;
import com.wfm.roster.dto.CoverageDTO;
import java.util.List;
public interface CoverageService {
    List<CoverageDTO> calculateAndSaveCoverage(Long rosterVersionId);
    List<CoverageDTO> getCoverageForVersion(Long rosterVersionId);
}
