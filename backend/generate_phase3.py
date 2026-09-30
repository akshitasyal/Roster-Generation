import os

base_dir = "C:/Users/Akshat/Roster Generation/backend/src/main/java/com/wfm"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Created {path}")

# --- SKILL ---
write_file(f"{base_dir}/skill/dto/SkillDTO.java", """
package com.wfm.skill.dto;
import lombok.Data;
@Data
public class SkillDTO {
    private Long id;
    private String skillCode;
    private String skillName;
    private String description;
    private String category;
    private String status;
}
""")

write_file(f"{base_dir}/skill/mapper/SkillMapper.java", """
package com.wfm.skill.mapper;
import com.wfm.skill.dto.SkillDTO;
import com.wfm.skill.entity.Skill;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SkillMapper {
    SkillDTO toDto(Skill entity);
    Skill toEntity(SkillDTO dto);
}
""")

write_file(f"{base_dir}/skill/service/SkillService.java", """
package com.wfm.skill.service;
import com.wfm.skill.dto.SkillDTO;
import java.util.List;
public interface SkillService {
    SkillDTO getSkillById(Long id);
    List<SkillDTO> getAllSkills();
    SkillDTO createSkill(SkillDTO dto);
    SkillDTO updateSkill(Long id, SkillDTO dto);
}
""")

write_file(f"{base_dir}/skill/service/SkillServiceImpl.java", """
package com.wfm.skill.service;
import com.wfm.skill.dto.SkillDTO;
import com.wfm.skill.entity.Skill;
import com.wfm.skill.mapper.SkillMapper;
import com.wfm.skill.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {
    private final SkillRepository skillRepository;
    private final SkillMapper skillMapper;
    @Override
    public SkillDTO getSkillById(Long id) {
        return skillRepository.findById(id).map(skillMapper::toDto).orElseThrow();
    }
    @Override
    public List<SkillDTO> getAllSkills() {
        return skillRepository.findAll().stream().map(skillMapper::toDto).collect(Collectors.toList());
    }
    @Override
    @Transactional
    public SkillDTO createSkill(SkillDTO dto) {
        return skillMapper.toDto(skillRepository.save(skillMapper.toEntity(dto)));
    }
    @Override
    @Transactional
    public SkillDTO updateSkill(Long id, SkillDTO dto) {
        Skill existing = skillRepository.findById(id).orElseThrow();
        existing.setSkillName(dto.getSkillName());
        existing.setDescription(dto.getDescription());
        existing.setCategory(dto.getCategory());
        existing.setStatus(dto.getStatus());
        return skillMapper.toDto(skillRepository.save(existing));
    }
}
""")

write_file(f"{base_dir}/skill/controller/SkillController.java", """
package com.wfm.skill.controller;
import com.wfm.skill.dto.SkillDTO;
import com.wfm.skill.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {
    private final SkillService skillService;
    @GetMapping
    @PreAuthorize("hasAnyAuthority('WFM', 'MANAGER', 'AM', 'TL')")
    public ResponseEntity<List<SkillDTO>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }
    @PostMapping
    @PreAuthorize("hasAuthority('WFM')")
    public ResponseEntity<SkillDTO> createSkill(@RequestBody SkillDTO dto) {
        return ResponseEntity.ok(skillService.createSkill(dto));
    }
}
""")

# --- SHIFT ---
write_file(f"{base_dir}/shift/dto/ShiftDTO.java", """
package com.wfm.shift.dto;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalTime;
@Data
public class ShiftDTO {
    private Long id;
    private String shiftCode;
    private String shiftName;
    private String shiftType;
    private LocalTime startTime;
    private LocalTime endTime;
    private BigDecimal durationHours;
    private Boolean isOvernight;
    private String status;
}
""")

write_file(f"{base_dir}/shift/mapper/ShiftMapper.java", """
package com.wfm.shift.mapper;
import com.wfm.shift.dto.ShiftDTO;
import com.wfm.shift.entity.Shift;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ShiftMapper {
    ShiftDTO toDto(Shift entity);
    Shift toEntity(ShiftDTO dto);
}
""")

write_file(f"{base_dir}/shift/service/ShiftService.java", """
package com.wfm.shift.service;
import com.wfm.shift.dto.ShiftDTO;
import java.util.List;
public interface ShiftService {
    ShiftDTO getShiftById(Long id);
    List<ShiftDTO> getAllShifts();
    ShiftDTO createShift(ShiftDTO dto);
}
""")

write_file(f"{base_dir}/shift/service/ShiftServiceImpl.java", """
package com.wfm.shift.service;
import com.wfm.shift.dto.ShiftDTO;
import com.wfm.shift.entity.Shift;
import com.wfm.shift.mapper.ShiftMapper;
import com.wfm.shift.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class ShiftServiceImpl implements ShiftService {
    private final ShiftRepository shiftRepository;
    private final ShiftMapper shiftMapper;
    @Override
    public ShiftDTO getShiftById(Long id) {
        return shiftRepository.findById(id).map(shiftMapper::toDto).orElseThrow();
    }
    @Override
    public List<ShiftDTO> getAllShifts() {
        return shiftRepository.findAll().stream().map(shiftMapper::toDto).collect(Collectors.toList());
    }
    @Override
    @Transactional
    public ShiftDTO createShift(ShiftDTO dto) {
        return shiftMapper.toDto(shiftRepository.save(shiftMapper.toEntity(dto)));
    }
}
""")

write_file(f"{base_dir}/shift/controller/ShiftController.java", """
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
""")

# --- AVAILABILITY ---
write_file(f"{base_dir}/availability/dto/AvailabilityDTO.java", """
package com.wfm.availability.dto;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class AvailabilityDTO {
    private Long id;
    private Long employeeId;
    private LocalDate date;
    private LocalTime availableFrom;
    private LocalTime availableTo;
    private String availabilityStatus;
    private String reason;
}
""")

write_file(f"{base_dir}/availability/mapper/AvailabilityMapper.java", """
package com.wfm.availability.mapper;
import com.wfm.availability.dto.AvailabilityDTO;
import com.wfm.availability.entity.Availability;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AvailabilityMapper {
    @Mapping(target = "employeeId", source = "employee.id")
    AvailabilityDTO toDto(Availability entity);
    
    @Mapping(target = "employee", ignore = true)
    Availability toEntity(AvailabilityDTO dto);
}
""")

write_file(f"{base_dir}/availability/service/AvailabilityService.java", """
package com.wfm.availability.service;
import com.wfm.availability.dto.AvailabilityDTO;
import java.util.List;
public interface AvailabilityService {
    List<AvailabilityDTO> getEmployeeAvailability(Long employeeId);
    AvailabilityDTO createAvailability(AvailabilityDTO dto);
}
""")

write_file(f"{base_dir}/availability/service/AvailabilityServiceImpl.java", """
package com.wfm.availability.service;
import com.wfm.availability.dto.AvailabilityDTO;
import com.wfm.availability.entity.Availability;
import com.wfm.availability.mapper.AvailabilityMapper;
import com.wfm.availability.repository.AvailabilityRepository;
import com.wfm.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class AvailabilityServiceImpl implements AvailabilityService {
    private final AvailabilityRepository availabilityRepository;
    private final EmployeeRepository employeeRepository;
    private final AvailabilityMapper availabilityMapper;
    
    @Override
    public List<AvailabilityDTO> getEmployeeAvailability(Long employeeId) {
        return availabilityRepository.findAll().stream()
                .filter(a -> a.getEmployee().getId().equals(employeeId))
                .map(availabilityMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public AvailabilityDTO createAvailability(AvailabilityDTO dto) {
        Availability entity = availabilityMapper.toEntity(dto);
        entity.setEmployee(employeeRepository.findById(dto.getEmployeeId()).orElseThrow());
        return availabilityMapper.toDto(availabilityRepository.save(entity));
    }
}
""")

write_file(f"{base_dir}/availability/controller/AvailabilityController.java", """
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
""")

# --- LEAVE ---
write_file(f"{base_dir}/leave/dto/LeaveDTO.java", """
package com.wfm.leave.dto;
import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;
@Data
public class LeaveDTO {
    private Long id;
    private Long employeeId;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Long approvedById;
    private Instant approvedAt;
    private String reason;
}
""")

write_file(f"{base_dir}/leave/mapper/LeaveMapper.java", """
package com.wfm.leave.mapper;
import com.wfm.leave.dto.LeaveDTO;
import com.wfm.leave.entity.Leave;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LeaveMapper {
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "approvedById", source = "approvedBy.id")
    LeaveDTO toDto(Leave entity);
    
    @Mapping(target = "employee", ignore = true)
    @Mapping(target = "approvedBy", ignore = true)
    Leave toEntity(LeaveDTO dto);
}
""")

write_file(f"{base_dir}/leave/service/LeaveService.java", """
package com.wfm.leave.service;
import com.wfm.leave.dto.LeaveDTO;
import java.util.List;
public interface LeaveService {
    List<LeaveDTO> getLeavesByEmployee(Long employeeId);
    LeaveDTO submitLeave(LeaveDTO dto);
    LeaveDTO approveLeave(Long leaveId, Long approverId);
}
""")

write_file(f"{base_dir}/leave/service/LeaveServiceImpl.java", """
package com.wfm.leave.service;
import com.wfm.leave.dto.LeaveDTO;
import com.wfm.leave.entity.Leave;
import com.wfm.leave.mapper.LeaveMapper;
import com.wfm.leave.repository.LeaveRepository;
import com.wfm.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class LeaveServiceImpl implements LeaveService {
    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;
    private final LeaveMapper leaveMapper;
    
    @Override
    public List<LeaveDTO> getLeavesByEmployee(Long employeeId) {
        return leaveRepository.findAll().stream()
                .filter(l -> l.getEmployee().getId().equals(employeeId))
                .map(leaveMapper::toDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public LeaveDTO submitLeave(LeaveDTO dto) {
        Leave leave = leaveMapper.toEntity(dto);
        leave.setEmployee(employeeRepository.findById(dto.getEmployeeId()).orElseThrow());
        leave.setStatus("PENDING");
        return leaveMapper.toDto(leaveRepository.save(leave));
    }
    
    @Override
    @Transactional
    public LeaveDTO approveLeave(Long leaveId, Long approverId) {
        Leave leave = leaveRepository.findById(leaveId).orElseThrow();
        leave.setStatus("APPROVED");
        leave.setApprovedBy(employeeRepository.findById(approverId).orElseThrow());
        leave.setApprovedAt(Instant.now());
        return leaveMapper.toDto(leaveRepository.save(leave));
    }
}
""")

write_file(f"{base_dir}/leave/controller/LeaveController.java", """
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
""")

print("Phase 3 files for Skill, Shift, Availability, and Leave created.")
