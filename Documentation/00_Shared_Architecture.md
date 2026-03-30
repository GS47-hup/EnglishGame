# 00. Shared Architecture Map

**Last Updated:** 2026-03-12
**Monorepo:** English Review Game 

This document maps out how the different sub-components (Micro-Apps) in this Monorepo relate to each other, and documents any resources they share.

---

## 🏛️ The Sub-Components

This repository is structured as a **Monorepo** containing several independent web applications. 

### 1. The Core Game (`index.html` + `app.js` at root)
*   **Purpose:** The main interactive English language learning game designed for ESL students.
*   **Features:** Vocabulary practice, question generation, Canvas drawing, Audio Text-to-Speech.
*   **Data Source:** Uses a local `questions.json` and LocalStorage.

### 2. Level 4 & 5 Online Exams (`Level 4 online exam/` & `Level 5_Online exam/`)
*   **Purpose:** The testing environments for advanced students.
*   **Features:** Timed reading, writing, and listening exams.
*   **Data Source:** **Neon PostgreSQL Database** via Netlify Serverless Functions.

### 3. Teacher Dashboard (`teacher-dashboard.html` at root)
*   **Purpose:** A portal for teachers to review exam submissions from Level 4 & 5.
*   **Data Source:** Also connects to the same **Neon PostgreSQL Database** to fetch submissions.

### 4. Flipbook Portal (`Flipbook_Portal/`)
*   **Purpose:** A secure hub for teachers and students to access digital coursebooks, workbooks, and teacher guides.
*   **Features:** Password wall (`Academy2026`), Flip PDF Plus integration.
*   **Data Source:** Entirely local/static HTML linking to the `Everybody up_Flipbooks_3rd Edition/` assets. *No database connection.*

---

## 🔗 Shared Resources Matrix

Before modifying a core resource, check this matrix to see which apps you might break.

| Resource | Used By | Risk Level |
| :--- | :--- | :--- |
| **Neon PostgreSQL DB** | Exam Portals, Teacher Dashboard | 🔴 **HIGH**. Schema changes must be coordinated. |
| `questions.json` | Core Game only | 🟢 **LOW**. Safe to edit within game context. |
| **Netlify Functions** | Exam Portals, Teacher Dashboard | 🔴 **HIGH**. Modifying API routes breaks exams. |
| `start_server.py` | Core Game | 🟡 **MEDIUM**. Needed to bypass CORS for local audio/fetch. |
| **LocalStorage** | Core Game (Progress), Flipbook Portal (Auth) | 🟢 **LOW**. Distinct keys used (`flipbook_access` vs game progress). |

### ⚠️ Critical Rule for AI / Developers
If you are working inside an isolated folder (e.g., `Flipbook_Portal/`), **do not modify the files of another application or a shared resource** without explicitly communicating the cross-app impact.
