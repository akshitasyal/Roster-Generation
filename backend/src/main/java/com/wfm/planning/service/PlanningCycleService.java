package com.wfm.planning.service;
import com.wfm.planning.dto.PlanningCycleDTO;
import java.util.List;
public interface PlanningCycleService {
    PlanningCycleDTO getPlanningCycleById(Long id);
    List<PlanningCycleDTO> getAllPlanningCycles();
    PlanningCycleDTO createPlanningCycle(PlanningCycleDTO dto);
    PlanningCycleDTO updateStatus(Long id, String status);
}
