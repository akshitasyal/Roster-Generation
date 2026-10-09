package com.wfm.security.repository;

import com.wfm.security.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {

    Optional<UserAccount> findByEmail(String email);

    Optional<UserAccount> findByEmpId(String empId);

    boolean existsByEmpId(String empId);

    boolean existsByEmail(String email);
}
