# Enterprise Workforce Management (WFM) & Roster Generation System
**Project Documentation**

This document serves as a comprehensive "from scratch" overview of everything that has been built in the WFM project so far. This is a production-grade full-stack application architected for a Tech Mahindra-style enterprise environment.

---

## 1. High-Level Architecture
- **Backend:** Java 21, Spring Boot 3.2.4, Spring Security, Spring Data JPA, PostgreSQL.
- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS v4.
- **Database Migrations:** Flyway (29 successive schema migrations).
- **Authentication:** Stateless JWT (JSON Web Tokens) with Role-Based Access Control (RBAC).

---

## 2. Database Schema (PostgreSQL via Flyway)
I have modeled a highly relational, enterprise-grade database scheme across 29 migration files (`V1` to `V29`).

**Core Entities Created:**
1. **Organizations & Roles:**
   - `roles`: WFM, TEAM_LEAD, MANAGER, ASSOCIATE.
   - `organizations`, `departments`, `teams`: Hierarchical structure tracking.
2. **Employees:**
   - `employees`: Core identity and credentials.
   - `employee_org_assignments`: Tracks which team/department an employee belongs to.
3. **Skills & Capabilities:**
   - `skills`, `skill_categories`, `employee_skills`, `skill_requirements`: Maps agent proficiencies to business requirements.
4. **Shifts & Coverage:**
   - `shifts`: Master definitions of shift timings (e.g., Morning, Night).
   - `shift_eligibility`: Who is allowed to work which shift.
   - `shift_coverage_requirements`: How many people (and with what skills) are needed per 15-minute interval.
5. **Rostering & Planning:**
   - `shift_preferences`: Agents bidding for preferred shifts.
   - `leave_requests`: Tracking PTO and sick leaves.
   - `rosters`, `roster_versions`, `roster_locks`: The actual generated schedules and management overrides.

---

## 3. The Spring Boot Backend
The backend has been modularized using Domain-Driven Design (DDD).

### 3.1. Core Modules Built
- **`com.wfm.common`**: Base Entity classes with audit fields (`createdAt`, `updatedAt`), standard `ApiResponse` wrapping, and global exception handlers.
- **`com.wfm.organization`**: REST APIs and repositories for Teams and Departments.
- **`com.wfm.employee`**: Complete CRUD for employee profiles.
- **`com.wfm.shift`** & **`com.wfm.skill`**: Repositories managing shift definitions and skill matrices.
- **`com.wfm.roster`**: The engine room holding services for publishing rosters and managing lock/freeze windows.
- **`com.wfm.optimization`**: Contains `PlanningSnapshot`, which aggregates leaves, skills, and requirements to feed the constraint solver.

### 3.2. Security & Authentication Engine
- **`SecurityConfig.java`**: Configured strict CORS, disabled CSRF (stateless API), and implemented a permit-list (e.g., `/api/auth/**`, `/error`, Swagger docs).
- **`JwtTokenProvider.java`**: Securely generates and validates Bearer tokens using standard UTF-8 parsing and HMAC-SHA algorithms.
- **`JwtAuthenticationFilter.java`**: Intercepts every API call, validates the JWT, and loads the user's role into the Spring Security Context.
- **`AuthController.java`**: Exposes `/login`, `/me`, and `/logout` endpoints, with explicit `@ExceptionHandler` to gracefully catch and return `401 Unauthorized` responses.

---

## 4. The Next.js Frontend
The frontend was designed to have a premium, modern, glassmorphic UI.

### 4.1. Infrastructure & API Integration
- **`src/lib/api.ts`**: A custom, intelligent `fetch` wrapper. It automatically intercepts API calls, injects the `Authorization: Bearer <token>` header, and parses Spring Boot's JSON error payloads natively.
- **`src/context/AuthContext.tsx`**: The global state provider. It manages the user session, syncs the JWT with `localStorage`, and handles automatic redirects if a user is not authenticated.

### 4.2. UI Components & Layouts
- **`src/app/layout.tsx`**: The root layout, wrapping the entire app in the `AuthProvider`.
- **`src/components/layout/ClientLayout.tsx`**: A dynamic shell that renders the sidebar and top navigation. Crucially, it conditionally renders links based on the user's role (e.g., only WFM Admins see the "Generate Roster" button).
- **`src/app/login/page.tsx`**: A visually stunning, highly animated login page featuring custom gradients, blur effects, dynamic loading states, and embedded error message handling.
- **Dashboard scaffolding**: Created placeholders for the `wfm/dashboard`, `tl/dashboard`, and `associate/dashboard` routes.

---

## 5. What Was Fixed During Our Debugging Session
To ensure the two halves (Frontend and Backend) communicated perfectly:
1. **Unmasked Errors:** Fixed Spring Security so it returns real `401` errors instead of masking them behind `403 Forbidden`.
2. **JWT Secret Bug:** Patched a crash in the JWT generation where the library attempted to Base64-decode a plaintext secret.
3. **Database Passwords:** Rewrote the seeded passwords for test accounts in the database using a custom Flyway script (`V29__fix_passwords.sql`) to guarantee the BCrypt hashes worked.

---

## What is Ready Right Now?
You can successfully launch the backend, launch the frontend, and log in securely with `ankit.joshi@acme.wfm` / `Wfm@12345`. The frontend will receive a valid JWT, cache it, and log the user into the authenticated portion of the web application.
