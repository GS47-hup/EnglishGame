# 02. Architectural Decision Log (ADRs)

**Purpose:** Documenting *why* we chose Method A over Method B. This ensures that context and rationale are preserved so future developers/agents do not inadvertently reverse good decisions.

| Date | Decision | Rationale |
| :--- | :--- | :--- |
| 2026-04-08 | Use Agora SDK instead of BigBlueButton | Agora provides native mobile building blocks and handles global video routing perfectly on slow 10 Mbps internet. BBB is HTML5-bound and requires an expensive dedicated DevOps engineer to manage server clusters. |
| 2026-04-08 | Independent Supabase Database Backend | The mobile app will deliberately *not* share the global YouLearnt database. This grants total agility to build custom B2B "Center ID" logic for the 5 Libyan physical locations without breaking the global site. |
| 2026-04-08 | React Native (Expo) over Flutter | Chosen specifically to utilize Over-The-Air (OTA) updates. This bypasses the Apple/Google App Store review process and avoids forcing users to download heavy 50MB updates just to fix a logic bug. |
| 2026-04-07 | Documentation Standarization | Merged shared architecture and context window briefing into `00_architecture_overview.md` and adhered to the Universal Templates protocol to maintain cognitive legibility. |
| 2026-04-02 | Teacher Dashboard Updates | Implemented a descriptive answer-mapping system separating raw A/B/C from readable text to enhance teacher usability when reviewing exams. |
| *Older* | Neon PostgreSQL for Exam DB | Needed a robust, serverless-friendly relational database to store secure test submissions. Replaced localStorage for Level 4+ tests to ensure testing integrity. |
| 2026-04-16 | Admin Dashboard V1 — DB-Driven Exam Lock | Replaced hardcoded HTML disabled states with a live `exam_status` DB table. Teacher toggles exams via `admin-dashboard.html`. `ADMIN_SECRET_KEY` stored as Netlify env variable only — never in code. Student portal defaults to open if API unreachable (fail-safe). |
