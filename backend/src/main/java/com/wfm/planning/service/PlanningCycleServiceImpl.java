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
