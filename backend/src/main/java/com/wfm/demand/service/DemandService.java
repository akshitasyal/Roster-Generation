package com.wfm.demand.service;
import com.wfm.demand.dto.DemandDTO;
import java.util.List;
public interface DemandService {
    List<DemandDTO> getDemandForCycle(Long cycleId);
    DemandDTO createDemand(DemandDTO dto);
}
