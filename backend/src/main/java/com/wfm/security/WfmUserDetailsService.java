package com.wfm.security;

import com.wfm.employee.entity.Employee;
import com.wfm.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;

/**
 * Spring Security UserDetailsService implementation.
 * Loads users by email from the employees table.
 */
@Service
@RequiredArgsConstructor
public class WfmUserDetailsService implements UserDetailsService {

    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Employee not found with email: " + email));

        if (!Boolean.TRUE.equals(employee.getIsActive())) {
            throw new UsernameNotFoundException("Employee account is inactive: " + email);
        }

        return new WfmUserPrincipal(employee);
    }
}
