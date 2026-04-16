# Project Structure: SpokenEnglish Academy — English Review Game

**Last Updated:** 2026-04-16T21:05:00Z

This document is the single source of truth for this project's file and folder structure. It is maintained automatically by the Antigravity AI agent and serves as a "Table of Contents" for the codebase.

> **Note on ADR:** This project uses `Documentation/02_decisions_log.md` as its Architectural Decision Record, which predates the `documentation/DECISIONS.md` naming convention in the agent rules. They serve the same purpose. No duplicate file will be created.

---

## 1. Application Source Code

*Core logic, exam portals, teacher tools, and interactive lesson games.*

- `index.html`: Entry point — redirects students to the exam selection wizard.
- `student-exam-selection.html`: 4-step wizard for students to choose their level and exam type.
- `app.js`: Main JavaScript engine for the Core Review Game (3100+ lines — all 8 question types, flashcards, audio, content bank).
- `questions.json`: Vocabulary and question database (58 authorized words per `VOCAB.md`).
- `teacher-dashboard.html`: Teacher portal for viewing all Level 2, 4, and 5 exam submissions from the Neon PostgreSQL database.
- `main-app.html`: Full standalone version of the main review game with all sections embedded.
- `listening-exam.html`: Month 1 listening comprehension exam page (partial — full digitization pending).

### Exam Portals
- `Level 2 online exam/`: Complete online exam system for Level 2 students (Reading, Writing, Listening).
- `Level 4 online exam/`: Complete online exam system for Level 4 students (Reading, Writing, Listening — 25-min timer).
- `Level 5_Online exam/`: Complete online exam system for Level 5 students (Reading, Writing, Listening — 30-min timer).
- `Complete_Level_3_4_Digital_Placement_Test.html`: Standalone digital placement test for Levels 3 and 4.

### Lesson Games (Standalone Interactive HTML)
- `day4_numbers_animals_lesson.html`: Interactive lesson game covering numbers and animals vocabulary.
- `days_1_3_review_games.html`: Review game covering vocabulary from Days 1–3.
- `expanded_review_game.html`: An earlier, expanded version of the core review game.
- `comprehensive_vocab_review_game.html`: Comprehensive vocabulary review game with all categories.
- `fruit_lesson_interactive_game.html`: Standalone interactive game for fruit vocabulary.
- `jobs_lesson_interactive_game.html`: Standalone interactive game for jobs/occupations vocabulary.
- `week1_day4_lesson.html`: Lesson game specifically for Week 1, Day 4 content.
- `month2_week1_day5_lesson.html`: Lesson game for Month 2, Week 1, Day 5 content.

### Presentation & Portal Tools
- `english-olympiad-sponsor-presentation.html`: English Olympiad sponsor deck (English version).
- `english-olympiad-sponsor-presentation-arabic.html`: English Olympiad sponsor deck (Arabic version).
- `homepage.html`: Academy homepage / navigation hub.
- `flipbook-portal.html`: Entry point for the Flipbook digital coursebook portal.
- `debug_section1.html`: Debugging harness for isolating Section 1 game logic issues.
- `test-system.html`: Prototype test system used during development.

### Serverless Backend
- `netlify/functions/`: All Netlify serverless functions connecting the exam portals to the Neon PostgreSQL database.
  - `submit-level2-exam.js`: Saves Level 2 exam submissions to the database.
  - `submit-level4-exam.js`: Saves Level 4 exam submissions to the database.
  - `submit-level5-exam.js`: Saves Level 5 exam submissions to the database.
  - `get-level2-submissions.js`: Retrieves Level 2 exam results for the teacher dashboard.
  - `get-level4-submissions.js`: Retrieves Level 4 exam results for the teacher dashboard.
  - `get-level5-submissions.js`: Retrieves Level 5 exam results for the teacher dashboard.
  - `clear-submissions.js`: Admin utility to clear test/dummy submissions from the database.
  - `submit-placement-test.js`: Saves Level 3–4 placement test results.
  - `get-placement-submissions.js`: Retrieves placement test results for teacher review.

---

## 2. Content & Assets

*Vocabulary, audio, images, and reference materials.*

- `questions.json`: The authoritative question and vocabulary database used by the Core Game.
- `VOCAB.md`: **AUTHORITATIVE** list of 58 approved vocabulary words. NO word outside this file may be used.
- `All first month vocab and sentecnes.md`: Extended vocabulary reference with example sentences.
- `comprehensive_question_bank.md`: Templates and examples for all 8 question types.
- `words_needing_images.md`: List of vocabulary words still lacking real PNG images (using emoji fallbacks).
- `Level Starter Words_images/`: Directory of PNG vocabulary images for the starter level.
- `EU3e_2_Student_Book_051.mp3`: Audio file — Everybody Up Book 2, Unit 3e track 51.
- `EU3e_3_Student_Book_043.mp3`: Audio file — Everybody Up Book 3, Unit 3e track 43.
- `EU3e_3_Student_Book_044.mp3`: Audio file — Everybody Up Book 3, Unit 3e track 44.
- `EU3e_3_Student_Book_045.mp3`: Audio file — Everybody Up Book 3, Unit 3e track 45.
- `1st month exam format/`: Folder containing all 60 questions for the Month 1 exam, organized by section.
- `Level 2_PDF/`: PDF source files for Level 2 exam content.
- `Level 4_Screenshots/`: Reference screenshots of the Level 4 exam PDFs.
- `everybody-up-syllabi/`: Syllabi for the Everybody Up coursebook series.
- `Flipbook_Portal/`: The complete Flipbook Hub sub-app (password-protected digital coursebook viewer).
- `Everybody up_Flipbooks_3rd Edition/`: Static Flip PDF Plus assets for the digital flipbooks.
- `Interactive-Games-Package/`: Packaged collection of standalone interactive review games.
- `SpokenEnglish_YouLearnt/`: Files related to the YouLearnt platform integration.
- `YouLearnt_Source/`: Source research and assets for the YouLearnt mobile app project.
- `Redesign/`: Work-in-progress UI redesign prototypes.
- `Month 1 Exam Practice_ Interactive Review Game_files/`: Supporting assets for the standalone exam practice HTML page.

---

## 3. Project Configuration

*Settings, dependencies, and deployment configuration.*

- `package.json`: Node.js project manifest listing dependencies and scripts.
- `package-lock.json`: Locked dependency tree for reproducible installs.
- `netlify.toml`: Netlify deployment configuration (routing, build settings, function directory).
- `.gitignore`: Files and folders excluded from Git version control.
- `.netlifyignore`: Files excluded from Netlify deployment (e.g., raw PDFs, large assets).
- `start_server.py`: Local HTTP server script — required to bypass CORS errors when testing audio locally.
- `start_game.bat`: Windows batch shortcut to launch `start_server.py` with one click.

---

## 4. Documentation (`Documentation/`)

*All project management, architecture, and tracking files.*

- `Documentation/README.md`: Navigation index for this Documentation folder.
- `Documentation/00_architecture_overview.md`: Combined architecture map, AI context briefing, shared resources matrix, and deployment checklist. **Read this first every session.**
- `Documentation/01_setup_guide.md`: Step-by-step guide for running the project locally and deploying to Netlify.
- `Documentation/02_decisions_log.md`: Architectural Decision Record (ADR) — logs all major technical choices and their rationale.
- `Documentation/04_changelog.md`: Full chronological history of all versions and changes.
- `Documentation/99_Knowledge_Atlas.md`: Banked technical lessons, gotchas, architectural discoveries, and known bugs.
- `Documentation/PROJECT_STRUCTURE.md`: This file — the definitive Table of Contents for the codebase.
- `Documentation/TODO.md`: Legacy detailed task tracker (granular, historical).
- `Documentation/ISSUE_LOG.md`: Known bugs and their resolution status.
- `Documentation/VOCAB.md`: Copy of the authorized vocabulary list (canonical copy is at root).
- `Documentation/EXAM_DESIGN_PRINCIPLES.md`: Pedagogical rules governing all exam design decisions.
- `Documentation/EXAM_PROCTORING_STRATEGY.md`: Strategy document for exam administration and anti-cheat measures.
- `Documentation/MOBILE_FIRST_EXAM_GUIDELINES.md`: Rules for ensuring all exams are fully usable on mobile devices.
- `Documentation/MOBILE_PERFORMANCE_GUIDELINES.md`: Performance constraints for mobile-first exam delivery.
- `Documentation/DEPLOYMENT_STRATEGY.md`: Strategy for deploying to Netlify and managing environment variables.
- `Documentation/FUTURE_ROADMAP.md`: Long-term feature planning (Month 2, LMS integration, etc.).
- `Documentation/Level_4_Reading_Master_Pool.md`: Full question pool for the Level 4 Reading exam.
- `Documentation/Level_4_Writing_Master_Pool.md`: Full question pool for the Level 4 Writing exam.
- `Documentation/Level_4_Listening_Master_Pool.md`: Full question pool for the Level 4 Listening exam.
- `Documentation/Session_Logs/`: Dated session logs for individual work sprints.
- `Documentation/YouLearnt_Strategic_Foundation/`: Complete strategic planning docs for the YouLearnt mobile app (tech stack, board presentation, market analysis).
- `Documentation/YouLearnt_App_Project_Requirements.md`: Formal requirements document for the YouLearnt mobile app.
- `Documentation/YouLearnt_App_Analysis_And_Estimation.md`: Time and cost estimation analysis for the YouLearnt app build.
- `Level 4 online exam/images/listening/`: Directory for listening exam visual assets.
    - `part_1_parade.png`: [Purpose: Visual prompt for Part 1 Question about a parade.]

---

## 5. Utility Scripts

*One-off Python scripts for automation and generation tasks.*

- `generate_adr.py`: CLI tool to scaffold a new entry in `Documentation/02_decisions_log.md`.
- `generate_complete_questions.py`: Generates a full question set from the vocabulary database.
- `generate_knowledge.py`: Auto-generates entries for the Knowledge Atlas.
- `apply_templates.py`: Applies Universal Templates to documentation files.
- `close_session.py`: End-of-session script that prompts for a summary and updates `session_summary.md`.
- `setup_youlearnt.py`: Scaffolding script for the YouLearnt project environment.
- `strings_extractor.py`: Extracts string literals from source files for review.
- `strings_extractor_v2.py`: Updated version of the strings extractor with improved parsing.
- `generate_questions.js`: Node.js version of the question generation utility.

---

## 6. Environment & Tooling (Do Not Touch)

*Auto-generated or managed directories that support the build environment.*

- `.git/`: **(Do Not Touch)** Git version control history for the entire project.
- `node_modules/`: **(Do Not Touch)** All third-party npm dependencies. Managed by `npm install`.
- `.netlify/`: **(Do Not Touch)** Netlify CLI cache, local function build artifacts, and state files.
- `.agents/`: Agent rule files that govern AI behavior in this workspace (Antigravity OS rules).
- `.agents copy/`: Copy of agent rules directory (likely a backup — candidate for `_Graveyard`).
- `.claude/`: Local Claude AI settings file (`settings.local.json`).
- `.obsidian/`: Obsidian vault settings (if this project is opened in Obsidian for note-taking).
- `_netlify_backup/`: Backup of Netlify function files prior to a major refactor.
