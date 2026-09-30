package com.wfm.roster.service;
import com.wfm.roster.dto.CoverageDTO;
import com.wfm.roster.entity.Coverage;
import com.wfm.roster.entity.RosterAssignment;
import com.wfm.roster.entity.RosterException;
import com.wfm.roster.entity.RosterVersion;
import com.wfm.demand.entity.Demand;
import com.wfm.demand.repository.DemandRepository;
import com.wfm.roster.mapper.RosterMapper;
import com.wfm.roster.repository.CoverageRepository;
import com.wfm.roster.repository.RosterAssignmentRepository;
import com.wfm.roster.repository.RosterExceptionRepository;
import com.wfm.roster.repository.RosterVersionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@Slf4j
public class CoverageServiceImpl implements CoverageService {
    private final CoverageRepository coverageRepository;
    private final RosterAssignmentRepository assignmentRepository;
    private final DemandRepository demandRepository;
    private final RosterVersionRepository versionRepository;
    private final RosterExceptionRepository exceptionRepository;
    private final RosterMapper rosterMapper;

    @Override
    @Transactional
    public List<CoverageDTO> calculateAndSaveCoverage(Long rosterVersionId) {
        log.info("Calculating coverage for version: {}", rosterVersionId);
        RosterVersion version = versionRepository.findById(rosterVersionId).orElseThrow();
        List<Demand> demands = demandRepository.findAll().stream()
            .filter(d -> d.getPlanningCycle().getId().equals(version.getPlanningCycle().getId()))
            .collect(Collectors.toList());
        
        List<RosterAssignment> assignments = assignmentRepository.findByRosterVersionId(rosterVersionId);
        List<Coverage> coveragesToSave = new ArrayList<>();
        List<RosterException> exceptions = new ArrayList<>();

        for (Demand demand : demands) {
            long assignedCount = assignments.stream()
                .filter(a -> a.getDate().equals(demand.getDate()))
                .filter(a -> a.getAssignmentType().equals("SHIFT"))
                .filter(a -> demand.getShift() == null || (a.getShift() != null && a.getShift().getId().equals(demand.getShift().getId())))
                .count();

            Coverage cov = Coverage.builder()
                .rosterVersion(version)
                .project(demand.getProject())
                .date(demand.getDate())
                .intervalStart(demand.getIntervalStart())
                .intervalEnd(demand.getIntervalEnd())
                .shift(demand.getShift())
                .skill(demand.getSkill())
                .role(demand.getRole())
                .requiredHeadcount(demand.getRequiredHeadcount())
                .assignedHeadcount((int) assignedCount)
                .build();
            cov.setCoverageStatus(cov.computeStatus());
            coveragesToSave.add(cov);

            if ("SHORTAGE".equals(cov.getCoverageStatus())) {
                exceptions.add(RosterException.builder()
                    .rosterVersion(version)
                    .planningCycle(version.getPlanningCycle())
                    .exceptionType("STAFFING_SHORTAGE")
                    .severity("ERROR")
                    .date(demand.getDate())
                    .shift(demand.getShift())
                    .skill(demand.getSkill())
                    .role(demand.getRole())
                    .requiredCount(demand.getRequiredHeadcount())
                    .assignedCount((int) assignedCount)
                    .gap(demand.getRequiredHeadcount() - (int) assignedCount)
                    .description("Staffing shortage detected")
                    .status("OPEN")
                    .build());
            }
        }
        
        coverageRepository.saveAll(coveragesToSave);
        exceptionRepository.saveAll(exceptions);
        
        return coveragesToSave.stream().map(rosterMapper::toCoverageDto).collect(Collectors.toList());
    }

    @Override
    public List<CoverageDTO> getCoverageForVersion(Long rosterVersionId) {
        return coverageRepository.findByRosterVersionId(rosterVersionId).stream()
            .map(rosterMapper::toCoverageDto)
            .collect(Collectors.toList());
    }
}
