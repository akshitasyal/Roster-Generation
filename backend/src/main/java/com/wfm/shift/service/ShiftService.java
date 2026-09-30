package com.wfm.shift.service;
import com.wfm.shift.dto.ShiftDTO;
import java.util.List;
public interface ShiftService {
    ShiftDTO getShiftById(Long id);
    List<ShiftDTO> getAllShifts();
    ShiftDTO createShift(ShiftDTO dto);
}
