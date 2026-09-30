package com.wfm.demand.service;
import com.wfm.demand.entity.Demand;
import com.wfm.demand.repository.DemandRepository;
import com.wfm.organization.entity.Role;
import com.wfm.organization.repository.RoleRepository;
import com.wfm.planning.entity.PlanningCycle;
import com.wfm.planning.repository.PlanningCycleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@Slf4j
public class ManagementDemandServiceImpl implements ManagementDemandService {
    private final DemandRepository demandRepository;
    private final PlanningCycleRepository cycleRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public void calculateManagementDemand(Long cycleId) {
        log.info("Calculating management demand for cycle {}", cycleId);
        PlanningCycle cycle = cycleRepository.findById(cycleId).orElseThrow();
        
        List<Demand> existingDemands = demandRepository.findAll().stream()
            .filter(d -> d.getPlanningCycle().getId().equals(cycleId))
            .collect(Collectors.toList());

        // Remove old calculated management demands
        List<Demand> oldMgmtDemands = existingDemands.stream()
            .filter(d -> "CALCULATED".equals(d.getSource()))
            .collect(Collectors.toList());
        demandRepository.deleteAll(oldMgmtDemands);
        
        List<Demand> associateDemands = existingDemands.stream()
            .filter(d -> d.getRole() != null && "ASSOCIATE".equals(d.getRole().getCode()))
            .collect(Collectors.toList());

        Role tlRole = roleRepository.findByCode("TL").orElse(null);
        Role amRole = roleRepository.findByCode("AM").orElse(null);
        
        if (tlRole == null || amRole == null) {
            log.warn("TL or AM roles not found in DB. Skipping management demand calculation.");
            return;
        }

        List<Demand> newMgmtDemands = new ArrayList<>();
        
        // Group by Date, Shift, and Interval
        Map<String, List<Demand>> grouped = associateDemands.stream()
            .collect(Collectors.groupingBy(d -> 
                d.getDate().toString() + "_" + 
                (d.getShift() != null ? d.getShift().getId() : "NULL") + "_" +
                d.getIntervalStart().toString()
            ));

        for (List<Demand> intervalDemands : grouped.values()) {
            if (intervalDemands.isEmpty()) continue;
            
            int totalAssociateHeadcount = intervalDemands.stream()
                .mapToInt(Demand::getRequiredHeadcount)
                .sum();
                
            if (totalAssociateHeadcount == 0) continue;

            // TL Ratio: 1 TL per 15 associates
            int tlRequired = (int) Math.ceil(totalAssociateHeadcount / 15.0);
            
            // AM Ratio: 1 AM per 5 TLs
            int amRequired = (int) Math.ceil(tlRequired / 5.0);
            
            Demand template = intervalDemands.get(0);
            
            // Create TL Demand
            newMgmtDemands.add(Demand.builder()
                .planningCycle(cycle)
                .project(template.getProject())
                .date(template.getDate())
                .intervalStart(template.getIntervalStart())
                .intervalEnd(template.getIntervalEnd())
                .shift(template.getShift())
                .role(tlRole)
                .requiredHeadcount(tlRequired)
                .source("CALCULATED")
                .build());
                
            // Create AM Demand
            newMgmtDemands.add(Demand.builder()
                .planningCycle(cycle)
                .project(template.getProject())
                .date(template.getDate())
                .intervalStart(template.getIntervalStart())
                .intervalEnd(template.getIntervalEnd())
                .shift(template.getShift())
                .role(amRole)
                .requiredHeadcount(amRequired)
                .source("CALCULATED")
                .build());
        }
        
        demandRepository.saveAll(newMgmtDemands);
        log.info("Saved {} management demand records.", newMgmtDemands.size());
    }
}
