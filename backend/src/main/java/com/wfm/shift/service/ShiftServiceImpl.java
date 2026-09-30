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
