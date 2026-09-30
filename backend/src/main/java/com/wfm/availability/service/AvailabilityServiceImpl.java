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
