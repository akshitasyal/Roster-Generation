import os

base_dir = "C:/Users/Akshat/Roster Generation/backend/src/main/java/com/wfm/demand"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Created {path}")

write_file(f"{base_dir}/service/ManagementDemandService.java", """
package com.wfm.demand.service;
import java.util.List;
public interface ManagementDemandService {
    void calculateManagementDemand(Long cycleId);
}
""")

write_file(f"{base_dir}/service/ManagementDemandServiceImpl.java", """
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
""")

write_file(f"{base_dir}/controller/ManagementDemandController.java", """
package com.wfm.demand.controller;
import com.wfm.demand.service.ManagementDemandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/management-demand")
@RequiredArgsConstructor
public class ManagementDemandController {
    private final ManagementDemandService managementDemandService;

    @PostMapping("/calculate/{cycleId}")
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<String> calculateManagementDemand(@PathVariable Long cycleId) {
        managementDemandService.calculateManagementDemand(cycleId);
        return ResponseEntity.ok("Management demand calculated successfully.");
    }
}
""")

print("Phase 7 Management Demand files created.")
