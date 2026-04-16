# 99. Knowledge Atlas — SpokenEnglish Academy
**Purpose:** Banked lessons, technical gotchas, and architectural discoveries so future AI agents never repeat mistakes.
**Last Updated:** 2026-04-15

---

## 🏗️ Technical Breakthroughs

### [2026-03-30] Zero-Typing Tap-to-Match Architecture (Level 2 Exams)
- **Problem:** Students on mobile cannot comfortably type full answers.
- **Solution:** Implemented a "tap-to-select" answer system where students tap an answer chip which populates the answer field — zero keyboard input required.
- **Location:** `Level 2 online exam/` HTML files.

### [2026-03-31] Cross-App Shared Resource Risk (Monorepo Safety)
- **Problem:** Multiple sub-apps (Game, Exams, Teacher Dashboard, Flipbook) share the same repo. Editing a shared resource (e.g., Netlify functions, `questions.json`) can silently break OTHER apps.
- **Rule:** Before modifying any shared resource, consult the **Shared Resources Matrix** in `00_architecture_overview.md`.
- **High-risk resources:** Neon PostgreSQL schema, Netlify function routes.

### [2026-03-12] File Structure & Relative Links (Static Sites)
- **The Issue:** Moving HTML files breaks relative asset paths (`scripts/`, `css/`).
- **The Fix:** Use `../` to navigate up, OR migrate to a build tool (Vite) that resolves paths automatically.
- **Deferred:** Vite migration planned post-monorepo cleanup.

### [Ongoing] Audio Fetching CORS Bypass
- **Problem:** `fetch()` for local audio files triggers CORS errors when opening HTML directly in browser.
- **Solution:** Run `start_server.py` to serve files over HTTP locally. This bypasses the browser's CORS policy.
- **Command:** `python start_server.py`

### [Ongoing] Auto-Save via sessionStorage
- **Pattern Used:** For all online exams, student answers are auto-saved to `sessionStorage` every 30 seconds. On page reload, answers are restored. This protects against accidental tab closure.

---

## 🧠 Strategic Decisions (Architecture)

### [2026-04-08] YouLearnt App Stack
| Decision | Choice | Rejected Alternative | Reason |
|---|---|---|---|
| Framework | React Native (Expo) | Flutter | Expo provides OTA updates — bypasses App Store review for bug fixes |
| Video SDK | Agora.io | BigBlueButton | Agora handles 10 Mbps Libyan bandwidth; BBB needs a DevOps team |
| Database | Supabase (Independent) | Shared Global DB | Isolation required for B2B 5-center whitelabeling logic |

### [2026-04-07] Documentation Standardization
- **Decision:** Merged architecture context and AI briefing into a single `00_architecture_overview.md`.
- **Rationale:** Reduce cognitive load. One file to read per session instead of three.

### [Ongoing] Neon PostgreSQL for Exam Submissions
- **Decision:** Use Neon PostgreSQL (serverless) via Netlify functions — NOT localStorage — for Level 2+ exam submissions.
- **Rationale:** localStorage is wiped if the browser is cleared. Neon provides persistent, retrievable records for the teacher dashboard.

---

## 🛠️ Tooling & Workflows

### Local Development Boot
1. Run `start_server.py` to launch a local HTTP server (bypasses CORS).
2. Open `http://localhost:8000` in browser.
3. Use `start_game.bat` as a shortcut on Windows.

### Deployment (Netlify)
- All serverless functions live in `netlify/functions/`.
- Requires `NETLIFY_DATABASE_URL` environment variable set in Netlify dashboard.
- `netlify.toml` configures routing and build settings.

### ADR Generation
- Use `generate_adr.py` to scaffold new ADR entries into `Documentation/02_decisions_log.md`.

---

## 🚨 Known Bugs / Gotchas

### Answer Key Errors (Month 1 Listening Exam — NOT YET FIXED)
| Section | Question | Current (Wrong) | Correct |
|---|---|---|---|
| Section 3 | Q1: "lions are sea animals" | True | **False** |
| Section 3 | Q7: "Nine is between seven and eight" | True | **False** |
| Section 2 | Q19: "clothes we wear in summer" | "cake" | **"t-shirt"** |

### Vocabulary Compliance Rule
- **ONLY** use the 58 words in `VOCAB.md`. Any word outside this list is unauthorized.
- Past violation: "frog" was removed because it was not in `VOCAB.md`.

---

## 🚀 Future Roadmap Banked Here

- **Vite Migration:** Deferred. Trigger: when managing 40+ HTML relative paths becomes the bottleneck.
- **Month 2 Expansion:** Blocked until Month 1 exam system is fully deployed and tested.
- **LMS Integration:** Research phase. No tool selected yet.
