import os

base_dir = "C:/Users/Akshat/Roster Generation/backend/src/main/java/com/wfm"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Created {path}")

# --- PLANNING CYCLE ---
write_file(f"{base_dir}/planning/dto/PlanningCycleDTO.java", """
package com.wfm.planning.dto;
import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;
@Data
public class PlanningCycleDTO {
    private Long id;
    private Long projectId;
    private String cycleName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Instant preferenceOpenAt;
    private Instant preferenceLockAt;
    private Instant tlReviewOpenAt;
    private Instant tlReviewCloseAt;
    private Instant generationStartedAt;
    private Instant generationCompletedAt;
    private Long createdById;
}
""")

write_file(f"{base_dir}/planning/mapper/PlanningCycleMapper.java", """
package com.wfm.planning.mapper;
import com.wfm.planning.dto.PlanningCycleDTO;
import com.wfm.planning.entity.PlanningCycle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PlanningCycleMapper {
    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "createdById", source = "createdBy.id")
    PlanningCycleDTO toDto(PlanningCycle entity);
    
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    PlanningCycle toEntity(PlanningCycleDTO dto);
}
""")

write_file(f"{base_dir}/planning/service/PlanningCycleService.java", """
package com.wfm.planning.service;
import com.wfm.planning.dto.PlanningCycleDTO;
import java.util.List;
public interface PlanningCycleService {
    PlanningCycleDTO getPlanningCycleById(Long id);
    List<PlanningCycleDTO> getAllPlanningCycles();
    PlanningCycleDTO createPlanningCycle(PlanningCycleDTO dto);
    PlanningCycleDTO updateStatus(Long id, String status);
}
""")

write_file(f"{base_dir}/planning/service/PlanningCycleServiceImpl.java", """
package com.wfm.planning.service;
import com.wfm.planning.dto.PlanningCycleDTO;
import com.wfm.planning.entity.PlanningCycle;
import com.wfm.planning.mapper.PlanningCycleMapper;
import com.wfm.planning.repository.PlanningCycleRepository;
import com.wfm.project.repository.ProjectRepository;
import com.wfm.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class PlanningCycleServiceImpl implements PlanningCycleService {
    private final PlanningCycleRepository planningCycleRepository;
    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;
    private final PlanningCycleMapper mapper;
    
    @Override
    public PlanningCycleDTO getPlanningCycleById(Long id) {
        return planningCycleRepository.findById(id).map(mapper::toDto).orElseThrow();
    }
    @Override
    public List<PlanningCycleDTO> getAllPlanningCycles() {
        return planningCycleRepository.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }
    @Override
    @Transactional
    public PlanningCycleDTO createPlanningCycle(PlanningCycleDTO dto) {
        PlanningCycle entity = mapper.toEntity(dto);
        entity.setProject(projectRepository.findById(dto.getProjectId()).orElseThrow());
        if(dto.getCreatedById() != null) {
            entity.setCreatedBy(employeeRepository.findById(dto.getCreatedById()).orElseThrow());
        }
        return mapper.toDto(planningCycleRepository.save(entity));
    }
    @Override
    @Transactional
    public PlanningCycleDTO updateStatus(Long id, String status) {
        PlanningCycle cycle = planningCycleRepository.findById(id).orElseThrow();
        cycle.setStatus(status);
        return mapper.toDto(planningCycleRepository.save(cycle));
    }
}
""")

write_file(f"{base_dir}/planning/controller/PlanningCycleController.java", """
package com.wfm.planning.controller;
import com.wfm.planning.dto.PlanningCycleDTO;
import com.wfm.planning.service.PlanningCycleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/planning-cycles")
@RequiredArgsConstructor
public class PlanningCycleController {
    private final PlanningCycleService service;
    
    @GetMapping
    @PreAuthorize("hasAnyAuthority('WFM', 'SENIOR_MANAGER', 'MANAGER', 'AM', 'TL')")
    public ResponseEntity<List<PlanningCycleDTO>> getAll() {
        return ResponseEntity.ok(service.getAllPlanningCycles());
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('WFM', 'SENIOR_MANAGER', 'MANAGER', 'AM', 'TL')")
    public ResponseEntity<PlanningCycleDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPlanningCycleById(id));
    }
    @PostMapping
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<PlanningCycleDTO> create(@RequestBody PlanningCycleDTO dto) {
        return ResponseEntity.ok(service.createPlanningCycle(dto));
    }
}
""")

# --- DEMAND ---
write_file(f"{base_dir}/demand/dto/DemandDTO.java", """
package com.wfm.demand.dto;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class DemandDTO {
    private Long id;
    private Long planningCycleId;
    private Long projectId;
    private LocalDate date;
    private LocalTime intervalStart;
    private LocalTime intervalEnd;
    private Long shiftId;
    private Long skillId;
    private Long roleId;
    private Integer requiredHeadcount;
    private String source;
}
""")

write_file(f"{base_dir}/demand/mapper/DemandMapper.java", """
package com.wfm.demand.mapper;
import com.wfm.demand.dto.DemandDTO;
import com.wfm.demand.entity.Demand;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DemandMapper {
    @Mapping(target = "planningCycleId", source = "planningCycle.id")
    @Mapping(target = "projectId", source = "project.id")
    @Mapping(target = "shiftId", source = "shift.id")
    @Mapping(target = "skillId", source = "skill.id")
    @Mapping(target = "roleId", source = "role.id")
    DemandDTO toDto(Demand entity);
    
    @Mapping(target = "planningCycle", ignore = true)
    @Mapping(target = "project", ignore = true)
    @Mapping(target = "shift", ignore = true)
    @Mapping(target = "skill", ignore = true)
    @Mapping(target = "role", ignore = true)
    Demand toEntity(DemandDTO dto);
}
""")

write_file(f"{base_dir}/demand/service/DemandService.java", """
package com.wfm.demand.service;
import com.wfm.demand.dto.DemandDTO;
import java.util.List;
public interface DemandService {
    List<DemandDTO> getDemandForCycle(Long cycleId);
    DemandDTO createDemand(DemandDTO dto);
}
""")

write_file(f"{base_dir}/demand/service/DemandServiceImpl.java", """
package com.wfm.demand.service;
import com.wfm.demand.dto.DemandDTO;
import com.wfm.demand.entity.Demand;
import com.wfm.demand.mapper.DemandMapper;
import com.wfm.demand.repository.DemandRepository;
import com.wfm.planning.repository.PlanningCycleRepository;
import com.wfm.project.repository.ProjectRepository;
import com.wfm.shift.repository.ShiftRepository;
import com.wfm.skill.repository.SkillRepository;
import com.wfm.organization.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class DemandServiceImpl implements DemandService {
    private final DemandRepository demandRepository;
    private final PlanningCycleRepository planningCycleRepository;
    private final ProjectRepository projectRepository;
    private final ShiftRepository shiftRepository;
    private final SkillRepository skillRepository;
    private final RoleRepository roleRepository;
    private final DemandMapper mapper;
    
    @Override
    public List<DemandDTO> getDemandForCycle(Long cycleId) {
        return demandRepository.findAll().stream()
                .filter(d -> d.getPlanningCycle().getId().equals(cycleId))
                .map(mapper::toDto).collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public DemandDTO createDemand(DemandDTO dto) {
        Demand entity = mapper.toEntity(dto);
        entity.setPlanningCycle(planningCycleRepository.findById(dto.getPlanningCycleId()).orElseThrow());
        entity.setProject(projectRepository.findById(dto.getProjectId()).orElseThrow());
        if(dto.getShiftId() != null) entity.setShift(shiftRepository.findById(dto.getShiftId()).orElse(null));
        if(dto.getSkillId() != null) entity.setSkill(skillRepository.findById(dto.getSkillId()).orElse(null));
        if(dto.getRoleId() != null) entity.setRole(roleRepository.findById(dto.getRoleId()).orElse(null));
        return mapper.toDto(demandRepository.save(entity));
    }
}
""")

write_file(f"{base_dir}/demand/controller/DemandController.java", """
package com.wfm.demand.controller;
import com.wfm.demand.dto.DemandDTO;
import com.wfm.demand.service.DemandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/demand")
@RequiredArgsConstructor
public class DemandController {
    private final DemandService service;
    @GetMapping("/cycle/{cycleId}")
    @PreAuthorize("hasAnyAuthority('WFM', 'SENIOR_MANAGER', 'MANAGER')")
    public ResponseEntity<List<DemandDTO>> getForCycle(@PathVariable Long cycleId) {
        return ResponseEntity.ok(service.getDemandForCycle(cycleId));
    }
    @PostMapping
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<DemandDTO> create(@RequestBody DemandDTO dto) {
        return ResponseEntity.ok(service.createDemand(dto));
    }
}
""")

# --- PREFERENCE (Employee & Weekly Off) ---
write_file(f"{base_dir}/preference/dto/EmployeePreferenceDTO.java", """
package com.wfm.preference.dto;
import lombok.Data;
import java.time.Instant;
@Data
public class EmployeePreferenceDTO {
    private Long id;
    private Long employeeId;
    private Long planningCycleId;
    private Long preferredShiftId;
    private Integer preferenceRank;
    private Boolean tlDeclined;
    private Long tlDeclinedById;
    private Instant tlDeclinedAt;
    private String tlDeclineReason;
}
""")

write_file(f"{base_dir}/preference/dto/WeeklyOffPreferenceDTO.java", """
package com.wfm.preference.dto;
import lombok.Data;
@Data
public class WeeklyOffPreferenceDTO {
    private Long id;
    private Long employeeId;
    private Long planningCycleId;
    private String dayOfWeek;
    private Integer preferenceRank;
}
""")

write_file(f"{base_dir}/preference/mapper/PreferenceMapper.java", """
package com.wfm.preference.mapper;
import com.wfm.preference.dto.EmployeePreferenceDTO;
import com.wfm.preference.dto.WeeklyOffPreferenceDTO;
import com.wfm.preference.entity.EmployeePreference;
import com.wfm.preference.entity.WeeklyOffPreference;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PreferenceMapper {
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "planningCycleId", source = "planningCycle.id")
    @Mapping(target = "preferredShiftId", source = "preferredShift.id")
    @Mapping(target = "tlDeclinedById", source = "tlDeclinedBy.id")
    EmployeePreferenceDTO toEmployeePrefDto(EmployeePreference entity);
    
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "planningCycle", ignore = true)
    @Mapping(target = "preferredShift", ignore = true)
    @Mapping(target = "tlDeclinedBy", ignore = true)
    EmployeePreference toEmployeePrefEntity(EmployeePreferenceDTO dto);

    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "planningCycleId", source = "planningCycle.id")
    WeeklyOffPreferenceDTO toWeeklyOffPrefDto(WeeklyOffPreference entity);

    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "planningCycle", ignore = true)
    WeeklyOffPreference toWeeklyOffPrefEntity(WeeklyOffPreferenceDTO dto);
}
""")

write_file(f"{base_dir}/preference/service/PreferenceService.java", """
package com.wfm.preference.service;
import com.wfm.preference.dto.EmployeePreferenceDTO;
import com.wfm.preference.dto.WeeklyOffPreferenceDTO;
import java.util.List;
public interface PreferenceService {
    List<EmployeePreferenceDTO> getEmployeePreferences(Long cycleId, Long employeeId);
    EmployeePreferenceDTO submitEmployeePreference(EmployeePreferenceDTO dto);
    EmployeePreferenceDTO declineEmployeePreference(Long prefId, Long tlId, String reason);
    
    List<WeeklyOffPreferenceDTO> getWeeklyOffPreferences(Long cycleId, Long employeeId);
    WeeklyOffPreferenceDTO submitWeeklyOffPreference(WeeklyOffPreferenceDTO dto);
}
""")

write_file(f"{base_dir}/preference/service/PreferenceServiceImpl.java", """
package com.wfm.preference.service;
import com.wfm.preference.dto.EmployeePreferenceDTO;
import com.wfm.preference.dto.WeeklyOffPreferenceDTO;
import com.wfm.preference.entity.EmployeePreference;
import com.wfm.preference.entity.WeeklyOffPreference;
import com.wfm.preference.mapper.PreferenceMapper;
import com.wfm.preference.repository.EmployeePreferenceRepository;
import com.wfm.preference.repository.WeeklyOffPreferenceRepository;
import com.wfm.employee.repository.EmployeeRepository;
import com.wfm.planning.repository.PlanningCycleRepository;
import com.wfm.shift.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class PreferenceServiceImpl implements PreferenceService {
    private final EmployeePreferenceRepository empPrefRepo;
    private final WeeklyOffPreferenceRepository weeklyPrefRepo;
    private final EmployeeRepository empRepo;
    private final PlanningCycleRepository cycleRepo;
    private final ShiftRepository shiftRepo;
    private final PreferenceMapper mapper;

    @Override
    public List<EmployeePreferenceDTO> getEmployeePreferences(Long cycleId, Long employeeId) {
        return empPrefRepo.findAll().stream()
            .filter(p -> p.getPlanningCycle().getId().equals(cycleId) && p.getEmployee().getId().equals(employeeId))
            .map(mapper::toEmployeePrefDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EmployeePreferenceDTO submitEmployeePreference(EmployeePreferenceDTO dto) {
        EmployeePreference entity = mapper.toEmployeePrefEntity(dto);
        entity.setEmployee(empRepo.findById(dto.getEmployeeId()).orElseThrow());
        entity.setPlanningCycle(cycleRepo.findById(dto.getPlanningCycleId()).orElseThrow());
        entity.setPreferredShift(shiftRepo.findById(dto.getPreferredShiftId()).orElseThrow());
        return mapper.toEmployeePrefDto(empPrefRepo.save(entity));
    }

    @Override
    @Transactional
    public EmployeePreferenceDTO declineEmployeePreference(Long prefId, Long tlId, String reason) {
        EmployeePreference entity = empPrefRepo.findById(prefId).orElseThrow();
        entity.setTlDeclined(true);
        entity.setTlDeclineReason(reason);
        entity.setTlDeclinedBy(empRepo.findById(tlId).orElseThrow());
        entity.setTlDeclinedAt(Instant.now());
        return mapper.toEmployeePrefDto(empPrefRepo.save(entity));
    }

    @Override
    public List<WeeklyOffPreferenceDTO> getWeeklyOffPreferences(Long cycleId, Long employeeId) {
        return weeklyPrefRepo.findAll().stream()
            .filter(p -> p.getPlanningCycle().getId().equals(cycleId) && p.getEmployee().getId().equals(employeeId))
            .map(mapper::toWeeklyOffPrefDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WeeklyOffPreferenceDTO submitWeeklyOffPreference(WeeklyOffPreferenceDTO dto) {
        WeeklyOffPreference entity = mapper.toWeeklyOffPrefEntity(dto);
        entity.setEmployee(empRepo.findById(dto.getEmployeeId()).orElseThrow());
        entity.setPlanningCycle(cycleRepo.findById(dto.getPlanningCycleId()).orElseThrow());
        return mapper.toWeeklyOffPrefDto(weeklyPrefRepo.save(entity));
    }
}
""")

write_file(f"{base_dir}/preference/controller/PreferenceController.java", """
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
""")

print("Phase 4 files created.")
