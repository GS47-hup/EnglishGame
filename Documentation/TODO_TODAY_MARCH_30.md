# 🚀 EMERGENCY SPRINT: TODAY'S TO-DO LIST (1-HOUR TIMEBOX)
**Date:** March 30, 2026
**Objective:** Deliver Level 2 Online Exam MVP

## 🛑 URGENT (DO THIS NOW)
- [x] **Scaffold Level 2 Reading Exam** (`Level 2 online exam/Level_2_Reading_Exam_Online.html`)
- [x] **Scaffold Level 2 Writing Exam** (`Level 2 online exam/Level_2_Writing_Exam_Online.html`)
- [x] **Scaffold Level 2 Listening Exam** (`Level 2 online exam/Level_2_Listening_Exam_Online.html`)
- [x] **Create Level 2 Backend Submission** (`_netlify_backup/functions/submit-level2-exam.js`)
- [x] **Create Level 2 Backend Retrieval** (`_netlify_backup/functions/get-level2-submissions.js`)
- [x] **Update Target Hubs** (`student-exam-selection.html` & `teacher-dashboard.html`)

---

## 🧊 ICEBOX / BACKLOG (IMPORTANT, BUT NOT URGENT)
These are critical JARVIS architectural findings that we will tackle *after* the Level 2 exams are live.
- [ ] **Security Fix (Tech Debt):** Remove frontend hardcoded passwords (e.g., `teacher123`, `Academy2026`) and validate them securely via Netlify Edge Functions.
- [ ] **Admin Panel (Exam Toggles):** Build a teacher toggle in the Admin Dashboard to turn exams "ON" and "OFF". This mathematically eliminates the risk of students taking exams early, completely removing the need for a separate student exam password.
