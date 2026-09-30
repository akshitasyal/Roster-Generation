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
