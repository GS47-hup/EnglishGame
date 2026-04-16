# 🛠️ Admin Dashboard Roadmap — SpokenEnglish Academy

**Created:** 2026-04-16  
**Author:** Antigravity AI (Strategic Partner)  
**Purpose:** Define the full vision of the Teacher/Admin Dashboard in staged versions — from a quick MVP that solves the most urgent pain point today, to a full academic management system in the future.

---

## 🔴 The Core Problem This Solves

Currently, the teacher controls exams by **manually editing HTML files**. To lock or unlock an exam, a developer has to open the code and change a hardcoded value. This is:
- **Insecure** — passwords are visible in browser source code
- **Fragile** — one wrong edit breaks the exam
- **Unusable** — a teacher cannot do this themselves

The Admin Dashboard gives the teacher full control without ever touching code.

---

## ✅ Version 1 — The MVP: "Exam Control Panel"
**Goal:** Replace the hardcoded lock system. Give the teacher a simple, password-protected page to flip exam switches ON/OFF.  
**Timeline Estimate:** 1 session (~2-4 hours)  
**Priority:** 🔴 CRITICAL — This fixes an active security vulnerability.

### Features:
- **Admin Login Wall**
  - Simple password input (stored as a Netlify Environment Variable, NOT in HTML code)
  - Session-based: Stays logged in for the browser session

- **Exam Toggle Panel**
  - A visual ON/OFF switch for every exam:
    - `Level 2 → Reading | Writing | Listening`
    - `Level 4 → Reading | Writing | Listening`
    - `Level 5 → Reading | Writing | Listening`
  - Toggle state saved to the **Neon PostgreSQL database** (an `exam_status` table)
  - The student portal (`student-exam-selection.html`) queries this table on load — no more hardcoded `disabled` classes

- **Basic Stats** (read-only)
  - Total submissions received today per exam
  - Last submission timestamp

### Technical Architecture:
- `admin-dashboard.html` — New file at project root
- `netlify/functions/get-exam-status.js` — GET: Returns which exams are open/closed
- `netlify/functions/set-exam-status.js` — POST: Admin sets a toggle (protected by env variable token)
- New DB table: `exam_status(exam_key TEXT, is_open BOOLEAN, updated_at TIMESTAMP)`

---

## 🟡 Version 2 — "Submissions Hub"
**Goal:** Unify all exam results (Level 2, 4, 5) into one clean view. Replace the need to juggle multiple dashboard tabs.  
**Timeline Estimate:** 2-3 sessions  
**Depends on:** V1 complete

### Features:
- **Unified Submissions Table**
  - Filter by: Level, Exam Type (R/W/L), Date
  - Search by student name
  - Color-coded status (submitted, partial, not started)

- **Individual Student Result View**
  - Click any row → see full answer breakdown for that student
  - Show: Question → Student Answer → Correct Answer → ✅/❌
  - Answer mapping (raw `B` → human-readable `White coat`)

- **Export to CSV**
  - Download all Level 2 results as a spreadsheet for grading offline

- **Level 2 Writing Photo View**
  - Display the WhatsApp-submitted photo alongside the student's digital answers
  - *(Requires the "Native Image Upload" feature from FUTURE_ROADMAP.md to be built first)*

---

## 🟢 Version 3 — "Academic Control Center"
**Goal:** Give the teacher complete visibility into student progress over time. Move from single-exam tracking to ongoing learning analytics.  
**Timeline Estimate:** 4-6 sessions  
**Depends on:** V2 complete

### Features:
- **Student Roster Management**
  - Register/remove students by name + level
  - Assign students to classes/groups

- **Grade Book**
  - Per-student view: all exams taken, scores, timestamps
  - Automatic pass/fail calculation based on configurable threshold (e.g., 70%)
  - Progress chart: score over time per student

- **Exam Scheduler**
  - Set a date/time for exams to auto-open and auto-close
  - Example: "Level 4 Reading Exam opens Saturday 10:00AM and closes at 10:30AM automatically"
  - No teacher needs to manually toggle — it's time-based

- **Announcement Banner**
  - Teacher types a message in the admin panel
  - It displays as a banner on the student exam selection portal
  - Example: "Exam is tomorrow! Make sure your phone is charged."

---

## 🔵 Version 4 — "Multi-Center Platform" (Enterprise)
**Goal:** Scale the platform to support multiple SpokenEnglish Academy branches or the YouLearnt partner network.  
**Timeline Estimate:** Long-term (multiple sprints)  
**Depends on:** V3 complete + YouLearnt App integration

### Features:
- **Multi-Tenant Architecture**
  - Each branch/center gets their own login
  - Data is siloed per center (a teacher at Branch A cannot see Branch B's students)

- **Super Admin View**
  - A master account (you) can see all centers, all submissions, all analytics in one panel
  - Compare performance across centers

- **Role Management**
  - `Super Admin` — full control
  - `Teacher` — can toggle exams, view their center's submissions
  - `Student` *(future)* — personal dashboard showing own grades/history

- **WhatsApp Notification Integration**
  - Admin sends a "Exam is live!" WhatsApp blast to all students from within the panel
  - Uses WhatsApp Business API or Twilio

---

## 📊 Feature Matrix Summary

| Feature | V1 MVP | V2 | V3 | V4 |
| :--- | :---: | :---: | :---: | :---: |
| Exam Lock/Unlock Toggles | ✅ | ✅ | ✅ | ✅ |
| Secure Admin Login | ✅ | ✅ | ✅ | ✅ |
| Submission Counter (Today) | ✅ | ✅ | ✅ | ✅ |
| Unified Submissions Table | ❌ | ✅ | ✅ | ✅ |
| Individual Student Result View | ❌ | ✅ | ✅ | ✅ |
| CSV Export | ❌ | ✅ | ✅ | ✅ |
| Student Roster | ❌ | ❌ | ✅ | ✅ |
| Grade Book | ❌ | ❌ | ✅ | ✅ |
| Exam Scheduler (Auto Open/Close) | ❌ | ❌ | ✅ | ✅ |
| Announcement Banner | ❌ | ❌ | ✅ | ✅ |
| Multi-Center / Multi-Tenant | ❌ | ❌ | ❌ | ✅ |
| Super Admin View | ❌ | ❌ | ❌ | ✅ |
| WhatsApp Blast Notifications | ❌ | ❌ | ❌ | ✅ |

---

## 🧭 Recommended Execution Order

1. **Build V1 first.** It solves the hardcoded password security debt immediately and takes only one session.
2. **Merge V2 into the existing `teacher-dashboard.html`** rather than building a separate file — it's already halfway there.
3. **V3 is a milestone** — only pursue it when the student base is large enough that tracking individual progress creates real value.
4. **V4 is the YouLearnt integration play** — build it in parallel with the YouLearnt Mobile App when that project is in its second phase.
