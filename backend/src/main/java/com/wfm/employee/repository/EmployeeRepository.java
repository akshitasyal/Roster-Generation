package com.wfm.employee.repository;

import com.wfm.employee.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByEmployeeCode(String employeeCode);
    boolean existsByEmail(String email);
    boolean existsByEmployeeCode(String employeeCode);

    List<Employee> findByIsActiveTrue();
    List<Employee> findByRole_CodeAndIsActiveTrue(String roleCode);

    Page<Employee> findByIsActiveTrue(Pageable pageable);

    @Query("""
        SELECT e FROM Employee e
        WHERE e.isActive = true
          AND e.role.code = :roleCode
        ORDER BY e.lastName, e.firstName
        """)
    List<Employee> findActiveByRole(@Param("roleCode") String roleCode);

    @Query("""
        SELECT e FROM Employee e
        JOIN e.role r
        WHERE e.isActive = true
          AND (:roleCode IS NULL OR r.code = :roleCode)
          AND (:search IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<Employee> searchEmployees(
            @Param("roleCode") String roleCode,
            @Param("search") String search,
            Pageable pageable);
}
