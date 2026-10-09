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
    Optional<Employee> findByEmpId(String empId);
    boolean existsByEmail(String email);
    boolean existsByEmpId(String empId);

    List<Employee> findByStatus(String status);
    List<Employee> findByDesignationAndStatus(String designation, String status);

    Page<Employee> findByStatus(String status, Pageable pageable);

    @Query("""
        SELECT e FROM Employee e
        WHERE e.status = 'Active'
          AND e.designation = :designation
        ORDER BY e.name
        """)
    List<Employee> findActiveByDesignation(@Param("designation") String designation);

    @Query("""
        SELECT e FROM Employee e
        WHERE e.status = 'Active'
          AND (:designation IS NULL OR e.designation = :designation)
          AND (:search IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(e.empId) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<Employee> searchEmployees(
            @Param("designation") String designation,
            @Param("search") String search,
            Pageable pageable);

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Employee e SET e.status = 'Inactive' WHERE e.designation != 'Senior Manager'")
    void markNonSeniorManagerAsInactive();

    /** Find all employees who report to a given manager (by emp_id). */
    List<Employee> findByManager1EmpIdAndStatus(String managerEmpId, String status);
    List<Employee> findByManager2EmpIdAndStatus(String managerEmpId, String status);
}
