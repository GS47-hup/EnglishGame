# 🎓 English Review Game Monorepo

Welcome to the **English Review Game** repository. 

This repository is structured as a **Monorepo**, meaning it contains multiple distinct, independent web applications (Micro-Apps) that share a common root but operate autonomously.

---

## 🏗️ Monorepo Directory Index

To maintain clean context and strict separation of concerns, each Micro-App contains its own localized code, `task.md`, and `changelog.md`. 

Please navigate to the specific folder of the application you wish to work on:

### 🎮 The Core Game
`./index.html`
An interactive English learning game for elementary ESL students (First-month vocabulary). Features vocabulary practice, drawing tools, and the Content Bank system.

### 📚 The Flipbook Portal
`./Flipbook_Portal/`
A secure, password-protected hub (`Academy2026`) for teachers and students to access digital coursebooks, workbooks, and teacher guides.

### 🎓 Level 4 & 5 Online Exam System
`./Level 4 online exam/` & `./Level 5_Online exam/`
A professional online examination platform with Neon PostgreSQL database integration. Features timed Reading, Writing, and Listening exams.

### 👨‍🏫 Teacher Dashboard
`./teacher-dashboard.html`
A card-based admin dashboard that fetches and displays live student exam submissions from the Neon DB.

---

## 📖 Central Documentation

While code and tasks are isolated in the folders above, all **shared resources** and **administrative logs** are centralized in the `Documentation/` folder.

- **`Documentation/00_Shared_Architecture.md`**: Read this before modifying any database schemas or global server routes.
- **`Documentation/01_Global_Setup.md`**: Instructions on how to run the local Python server and deploy to Netlify.
- **`Documentation/Session_Logs/`**: Human-level progress tracked via weekly session summaries (e.g., `Week_01_March_01-07.md`).

---

**🎯 Maintained by SpokenEnglish Academy** 🚀