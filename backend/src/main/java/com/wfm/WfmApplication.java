package com.wfm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Workforce Management & Roster Generation System
 *
 * <p>Enterprise-grade WFM system with CP-SAT optimization engine.
 * Manages workforce planning, roster generation, and operations
 * for large-scale BPO/IT service organizations.
 *
 * <p>Architecture:
 * <pre>
 * BUSINESS DEMAND -> ASSOCIATE ROSTER -> TL ROSTER -> AM ROSTER
 *   -> MANAGER ROSTER -> SENIOR MANAGER ROSTER -> WFM ROSTER
 *   -> COMPLETE ROSTER -> VALIDATION -> WFM ADJUSTMENT -> PUBLISH
 * </pre>
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@EnableScheduling
public class WfmApplication {

    public static void main(String[] args) {
        SpringApplication.run(WfmApplication.class, args);
    }
}
