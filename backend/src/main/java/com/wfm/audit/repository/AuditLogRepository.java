package com.wfm.audit.repository;

import com.wfm.audit.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByEntityTypeAndEntityIdOrderByPerformedAtDesc(
            String entityType, String entityId, Pageable pageable);

    @Query("""
        SELECT a FROM AuditLog a
        WHERE a.entityType = :entityType
          AND a.entityId = :entityId
        ORDER BY a.performedAt DESC
        """)
    List<AuditLog> findEntityHistory(
            @Param("entityType") String entityType,
            @Param("entityId") String entityId);

    @Query("""
        SELECT a FROM AuditLog a
        WHERE a.performedBy = :employeeId
          AND a.performedAt >= :from
          AND a.performedAt <= :to
        ORDER BY a.performedAt DESC
        """)
    List<AuditLog> findByPerformedByInRange(
            @Param("employeeId") Long employeeId,
            @Param("from") Instant from,
            @Param("to") Instant to);

    List<AuditLog> findByCorrelationIdOrderByPerformedAtAsc(String correlationId);
}
