package com.wfm.security;

import com.wfm.employee.entity.Employee;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Custom UserDetails principal wrapping the Employee entity.
 * Provides role-based authorities using ROLE_ prefix convention.
 */
@Getter
public class WfmUserPrincipal implements UserDetails {

    private final Employee employee;

    public WfmUserPrincipal(Employee employee) {
        this.employee = employee;
    }

    public Long getId() {
        return employee.getId();
    }

    public String getEmployeeCode() {
        return employee.getEmployeeCode();
    }

    public String getRoleCode() {
        return employee.getRoleCode();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + employee.getRoleCode()));
    }

    @Override
    public String getPassword() {
        return employee.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return employee.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return Boolean.TRUE.equals(employee.getIsActive());
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return Boolean.TRUE.equals(employee.getIsActive());
    }
}
