package com.wfm.availability.service;
import com.wfm.availability.dto.AvailabilityDTO;
import java.util.List;
public interface AvailabilityService {
    List<AvailabilityDTO> getEmployeeAvailability(Long employeeId);
    AvailabilityDTO createAvailability(AvailabilityDTO dto);
}
