# 📚 Knowledge Atlas — SpokenEnglish Academy (Local)
**Purpose:** Every significant technical learning moment from this project, written at two levels: total beginner and professional developer.
**Last Updated:** 2026-04-16

---

### TITLE: Netlify Serverless Functions (API Without a Server)
*   **TAGS:** `netlify, serverless, api, backend, postgresql, node-js`
*   **DATE:** 2026-04-15 (retroactively documented)

#### 🟢 VERSION 1: The Foundation (Simple Analogy)
*   **The Big Idea:** You can run small backend programs without owning or renting a server — the cloud runs them only when someone calls them.
*   **The Analogy:** Imagine a vending machine. You don't need a full store (a server running 24/7). You just put a vending machine on the wall. When someone pushes a button (makes a request), it dispenses the item (runs the code) and goes back to sleep. You only pay for the button presses, not for the machine being on all night.
*   **In Plain English:** Traditional websites need a computer (a server) running non-stop waiting for visitors. Serverless functions are like on-demand workers — they wake up, do the task (save to a database, send data), and go back to sleep. Netlify manages all of this for you. You just write the logic.

#### 🔵 VERSION 2: The Tech Spec (Professional Terminology)
*   **Technical Definition:** A serverless function is a stateless, event-driven piece of Node.js code deployed to a cloud provider (Netlify) that executes on HTTP request and terminates after returning a response.
*   **How it Works in Code:** Each function exports a `handler` async function. Netlify invokes it with an `event` object (containing `httpMethod`, `body`, `headers`) and a `context`. You parse the body, do your work (DB query), and return a response object with `statusCode`, `headers`, and `body`.
*   **Why We Used It Here:** The exam portals need to save student answers to a PostgreSQL database. Since there's no backend server, Netlify Functions act as the secure API layer between the browser and the Neon database. The DB credentials are stored as environment variables, never exposed to the client.

#### 💻 Code Snapshot
```javascript
// netlify/functions/submit-level4-exam.js
const { Client } = require('pg');

exports.handler = async (event, context) => {
  // 1. Handle CORS preflight (browser safety check)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' };
  }

  // 2. Connect to database using secret env variable
  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL, ssl: true });
  await client.connect();

  // 3. Parse incoming data and save it
  const submission = JSON.parse(event.body);
  await client.query('INSERT INTO level4_exam_submissions (...) VALUES ($1, $2, $3)', [...]);

  await client.end();
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
```

---

### TITLE: CORS & The Preflight Request
*   **TAGS:** `cors, http, browser-security, api, netlify`
*   **DATE:** 2026-04-15 (retroactively documented)

#### 🟢 VERSION 1: The Foundation (Simple Analogy)
*   **The Big Idea:** Browsers have a built-in bodyguard that refuses to let your webpage talk to a different website unless that website explicitly says "yes, this guest is allowed in."
*   **The Analogy:** Imagine a nightclub (the API/database). Your friend's apartment (your webpage) calls the nightclub and asks "Can I send my guests there?" The nightclub must answer "Yes, guests from that address are welcome" BEFORE any guests show up. If the nightclub doesn't answer (or says no), the guests are blocked at the door — even if the nightclub would have been fine with them coming.
*   **In Plain English:** CORS (Cross-Origin Resource Sharing) is this "permission check." Before your JavaScript sends real data to an API, the browser first sends a tiny "hello, is it okay if I send data?" message called a "preflight." The API must respond with permission headers, or the browser blocks the request entirely. This is a browser-only safety feature — it does NOT affect Postman or server-to-server calls.

#### 🔵 VERSION 2: The Tech Spec (Professional Terminology)
*   **Technical Definition:** CORS is a browser security mechanism where requests to a different origin (domain/port/protocol) are blocked unless the server responds with `Access-Control-Allow-Origin` headers. For non-simple requests (POST with JSON body), the browser first sends an `OPTIONS` preflight request.
*   **How it Works in Code:** Every Netlify function in this project handles the `OPTIONS` method first, returning a 200 with the required headers. If omitted, the browser throws a CORS error and the real POST never reaches the function.
*   **Why We Used It Here:** The exam HTML pages are on Netlify's CDN, and the serverless functions are on a different Netlify subdomain. Even though they're the same project, the browser treats them as cross-origin. Every function needs the preflight handler.

#### 💻 Code Snapshot
```javascript
// This block MUST come first in every Netlify function
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

if (event.httpMethod === 'OPTIONS') {
  return { statusCode: 200, headers, body: '' }; // Grants permission
}
```

---

### TITLE: sessionStorage — Passing Data Between Pages Without a Database
*   **TAGS:** `javascript, sessionstorage, state-management, browser-api, multi-page`
*   **DATE:** 2026-04-15 (retroactively documented)

#### 🟢 VERSION 1: The Foundation (Simple Analogy)
*   **The Big Idea:** When you move from one page to another, the browser normally forgets everything. `sessionStorage` is a small sticky note the browser keeps as long as the tab is open.
*   **The Analogy:** Think of a hospital wristband. When you check in (enter your name on the wizard), the hospital puts a wristband on you with your information. Every department you visit (each exam page) can read your wristband instead of asking you "what's your name?" again. When you leave the hospital (close the tab), the wristband is thrown away.
*   **In Plain English:** `sessionStorage` is a tiny storage space inside the browser tab. You can write data into it on one page (like the student's name and level) and read it back on the next page (the actual exam). The data survives page navigation but disappears when the tab closes — unlike `localStorage` which permanently stays on the device.

#### 🔵 VERSION 2: The Tech Spec (Professional Terminology)
*   **Technical Definition:** `sessionStorage` is a Web Storage API that persists key-value string pairs for the lifetime of a browser session (tab). Data is scoped to the origin and tab — not shared across tabs.
*   **How it Works in Code:** On the selection wizard, student data is serialized to JSON and saved. On the exam page, the data is retrieved, parsed, and used to pre-fill the student name on submission.
*   **Why We Used It Here:** Passing student metadata (name, level, exam type) from `student-exam-selection.html` to the individual exam pages without URL query strings or a database round-trip. It's the simplest, most appropriate tool for single-session, single-tab data handoff.

#### 💻 Code Snapshot
```javascript
// PAGE 1: student-exam-selection.html — Save before redirecting
sessionStorage.setItem('examSession', JSON.stringify({
  studentName: 'Ahmed',
  level: '4',
  examType: 'writing',
  startTime: new Date().toISOString()
}));
window.location.href = 'Level 4 online exam/Level_4_Writing_Exam_Online.html';

// PAGE 2: The exam page — Read immediately on load
const session = JSON.parse(sessionStorage.getItem('examSession'));
console.log(session.studentName); // "Ahmed"
```

---

### TITLE: The CSS-Only Multi-Step Wizard Pattern
*   **TAGS:** `css, javascript, ui-ux, wizard, show-hide, multi-step-form`
*   **DATE:** 2026-04-15 (retroactively documented)

#### 🟢 VERSION 1: The Foundation (Simple Analogy)
*   **The Big Idea:** You can make a multi-page form feel like a native app wizard using only CSS show/hide — no complex routing needed.
*   **The Analogy:** Think of a flip book. All the pages exist at once, but you can only see one at a time because the others are hidden behind it. When you flip (click Next), you hide the current page and reveal the next one. The whole book was always there — you just changed which page was on top.
*   **In Plain English:** Instead of building 4 separate HTML pages for a 4-step form, all 4 steps exist in the same HTML file. They all start hidden (`display: none`). Only the "active" step is visible (`display: block`). JavaScript just adds and removes a CSS class to switch between them. No page reloads, no routing — it's instant.

#### 🔵 VERSION 2: The Tech Spec (Professional Terminology)
*   **Technical Definition:** A single-page, CSS-driven form wizard using the `.active` class toggle pattern. All steps are pre-rendered in the DOM. Visibility is controlled by `display: none / block` via JavaScript class manipulation. Transitions use CSS `@keyframes` for animation.
*   **How it Works in Code:** Each step is a `<div class="step">`. The active one gets `.active` added, which sets `display: block`. `goToStep(n)` iterates over all steps, removes `.active` from all, then adds it to the target step.
*   **Why We Used It Here:** The student exam selection portal needed a smooth, app-like experience without the overhead of a JavaScript framework. This pattern delivered full wizard UX with ~30 lines of JavaScript.

#### 💻 Code Snapshot
```css
/* CSS */
.step { display: none; animation: fadeIn 0.4s ease-out; }
.step.active { display: block; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}
```
```javascript
// JavaScript
function goToStep(stepNumber) {
  document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
  document.getElementById('step' + stepNumber).classList.add('active');
}
```

---

### TITLE: The Web Speech API (Text-to-Speech in the Browser)
*   **TAGS:** `javascript, web-speech-api, text-to-speech, audio, browser-api, esl`
*   **DATE:** 2026-04-15 (retroactively documented)

#### 🟢 VERSION 1: The Foundation (Simple Analogy)
*   **The Big Idea:** The browser has a built-in voice — you can make it read any text out loud with one line of JavaScript, completely free with no external services.
*   **The Analogy:** Think of a talking parrot that lives inside the browser. You type a word, pass it to the parrot, and the parrot says it. You can even tell the parrot which accent to use, how fast to speak, and how high its pitch should be. The parrot uses the voice engine already installed on the user's operating system — no internet connection needed.
*   **In Plain English:** Modern browsers have a built-in text-to-speech engine called the "Web Speech API." You write a small piece of JavaScript that says "speak this text," and the browser reads it aloud using the device's voices. This is perfect for an English learning game because students can tap a word and immediately hear it pronounced correctly — without recording any audio files.

#### 🔵 VERSION 2: The Tech Spec (Professional Terminology)
*   **Technical Definition:** The Web Speech API's `SpeechSynthesis` interface provides a programmatic way to synthesize text into speech using the platform's native TTS engine and installed voice packages.
*   **How it Works in Code:** `window.speechSynthesis.speak(utterance)` queues text for synthesis. `SpeechSynthesisUtterance` is the config object for rate, pitch, volume, and voice selection. Voices are loaded asynchronously, triggering a `voiceschanged` event. An English `localService` voice is preferred for offline use.
*   **Why We Used It Here:** Every question in the review game has an `audio` field. Instead of recording 58+ MP3 files for every vocabulary word, the Web Speech API reads them on-demand. This keeps the project lightweight and allows the vocabulary to be expanded without recording sessions.

#### 💻 Code Snapshot
```javascript
class AudioSystem {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.synthesis.addEventListener('voiceschanged', () => this.loadVoices());
  }

  loadVoices() {
    const voices = this.synthesis.getVoices();
    // Prefer a local English voice (works offline)
    this.currentVoice = voices.find(v => v.lang.startsWith('en') && v.localService) || voices[0];
  }

  speak(text, options = {}) {
    this.synthesis.cancel(); // Stop any currently playing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.currentVoice;
    utterance.rate = options.rate || 0.8; // Slightly slower for ESL learners
    this.synthesis.speak(utterance);
  }
}
```

---

### TITLE: The Fallback Pattern (Graceful Degradation)
*   **TAGS:** `javascript, error-handling, resilience, ux, fetch-api`
*   **DATE:** 2026-04-15 (retroactively documented)

#### 🟢 VERSION 1: The Foundation (Simple Analogy)
*   **The Big Idea:** Always have a backup plan so your app never completely breaks if something goes wrong.
*   **The Analogy:** Imagine a chef at a restaurant. The seafood delivery didn't arrive (the API failed). A bad restaurant closes the kitchen. A smart restaurant has a freezer with backup fish. The meal still gets served — maybe not as fresh, but the customer isn't sent home hungry.
*   **In Plain English:** When the game tries to load questions from `questions.json` and it fails (maybe the file is missing, or there's a CORS issue), instead of crashing and showing a broken page, it loads a small set of hardcoded "emergency questions" from inside the JavaScript itself. The student never sees an error.

#### 🔵 VERSION 2: The Tech Spec (Professional Terminology)
*   **Technical Definition:** A try/catch fallback pattern in the async `fetch()` call. On failure, `createFallbackQuestions()` populates `AppState.questionsData` with a minimal hardcoded dataset, then calls `initializeSections()` normally — ensuring the UI pipeline completes regardless of network state.
*   **How it Works in Code:** The `QuestionsLoader.loadQuestions()` method wraps the `fetch` call in a `try/catch`. The `catch` block calls `createFallbackQuestions()` which injects pre-written questions directly into memory, then continues the render pipeline identically.
*   **Why We Used It Here:** The game relies on `fetch('questions.json')` which requires the local server to be running. In classroom environments, students sometimes open the HTML file directly (triggering CORS). The fallback ensures they can still play even if the server isn't running.

#### 💻 Code Snapshot
```javascript
async loadQuestions() {
  try {
    const response = await fetch('questions.json');
    this.questionsData = await response.json();
    showToast('Questions loaded! 🎉', 'success');
  } catch (error) {
    // Network or CORS failure — use hardcoded backup
    this.createFallbackQuestions();
    showToast('Using fallback questions', 'info');
  }
  this.initializeSections(); // Always runs, regardless of which path was taken
}
```

---

### TITLE: PostgreSQL JSONB Column — Storing Flexible Exam Data
*   **TAGS:** `postgresql, database, jsonb, schema-design, neon`
*   **DATE:** 2026-04-15 (retroactively documented)

#### 🟢 VERSION 1: The Foundation (Simple Analogy)
*   **The Big Idea:** Instead of making a separate database column for every possible answer, you can stuff all the answers into one flexible "bag" column.
*   **The Analogy:** Think of a regular filing cabinet (normal database columns) vs a single envelope labeled "Everything else." A reading exam has 25 specific answers (Q1, Q2... Q25). A writing exam has 6 open-ended paragraphs. Making separate columns for all of these would be a nightmare. Instead, we put the entire answer package into one envelope (`submission_data JSONB`) and the database stores it perfectly, even though every exam looks different inside.
*   **In Plain English:** `JSONB` is a special column type in PostgreSQL that stores JSON data — essentially any structure you want. The exam answers (which look completely different for Reading vs Writing vs Listening) are serialized as a JSON object and stored in this single column. When the teacher dashboard fetches results, it gets the full JSON back and can read whatever's inside.

#### 🔵 VERSION 2: The Tech Spec (Professional Terminology)
*   **Technical Definition:** `JSONB` (JSON Binary) is a PostgreSQL column type that stores JSON data in a decomposed binary format. Unlike `TEXT`, it supports indexing, querying with operators (`->`, `->>`), and schema validation.
*   **How it Works in Code:** The entire `submission` object from the exam page is serialized with `JSON.stringify(submission)` and inserted into the `submission_data` column. The fixed metadata (student name, exam type, time taken) are stored as proper typed columns for efficient filtering.
*   **Why We Used It Here:** The 6 exam types (Reading/Writing/Listening × Level 4/5) all have radically different answer structures. JSONB lets us store them all in one table without redesigning the schema when exam formats change.

#### 💻 Code Snapshot
```sql
-- The table schema
CREATE TABLE IF NOT EXISTS level4_exam_submissions (
  id              SERIAL PRIMARY KEY,
  student_name    VARCHAR(255) NOT NULL,
  exam_type       VARCHAR(50) NOT NULL,        -- 'reading', 'writing', 'listening'
  submission_data JSONB NOT NULL,              -- The entire answer blob
  time_taken      VARCHAR(50),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```
```javascript
// Inserting — the whole submission object goes into one column
await client.query(
  'INSERT INTO level4_exam_submissions (student_name, exam_type, submission_data, time_taken) VALUES ($1, $2, $3, $4)',
  [submission.studentName, submission.examType, JSON.stringify(submission), submission.timeTaken]
);
```

---

### TITLE: The Monorepo Pattern — Multiple Apps, One Repository
*   **TAGS:** `architecture, monorepo, static-site, deployment, shared-resources`
*   **DATE:** 2026-04-15 (retroactively documented)

#### 🟢 VERSION 1: The Foundation (Simple Analogy)
*   **The Big Idea:** Instead of maintaining 4 separate projects in 4 separate folders scattered across your computer, you put all related apps inside one big folder and manage them together.
*   **The Analogy:** Think of a school building. The kindergarten classroom, the science lab, the library, and the teachers' lounge are all separate rooms with different purposes. But they're all in the same building, sharing the same plumbing, electricity, and front entrance. A monorepo is the building — the individual apps are the rooms.
*   **In Plain English:** This project has 4 separate web apps: the Game, the Exam Portals, the Teacher Dashboard, and the Flipbook Hub. They all live in the same folder (repository). This makes deployment easy (one Netlify deploy covers everything), and shared files like the database connection can be used by multiple apps without being copied.

#### 🔵 VERSION 2: The Tech Spec (Professional Terminology)
*   **Technical Definition:** A monorepo is a version control strategy where multiple logically independent applications share a single repository. Here it's implemented as a flat static-site monorepo with shared Netlify serverless functions and a common database.
*   **How it Works in Code:** Each sub-app lives in its own subdirectory (`Level 4 online exam/`, `Flipbook_Portal/`, etc.) with self-contained HTML. They share `netlify/functions/` for the API layer and the Neon PostgreSQL DB via the same `NETLIFY_DATABASE_URL` environment variable.
*   **Why We Used It Here:** Simplicity of deployment. One GitHub repo → one Netlify site → all apps live at the same domain. The alternative (4 separate repos and 4 separate Netlify sites) would introduce unnecessary operational overhead for a small-team project.

#### ⚠️ Critical Rule for This Monorepo
Modifying a shared resource (Netlify functions, DB schema) can silently break OTHER apps. Always check the **Shared Resources Matrix** in `Documentation/00_architecture_overview.md` before touching shared files.

---

### TITLE: Environment Variables — Storing Secrets Outside the Code
*   **TAGS:** `security, netlify, environment-variables, api, authentication`
*   **DATE:** 2026-04-16

#### 🟢 VERSION 1: The Foundation (Simple Analogy)
*   **The Big Idea:** Never write a password or secret key directly inside your code. Store it in a secure outside location and have the code fetch it at runtime.
*   **The Analogy:** Think of a safe-deposit box at a bank. Your business (the code) needs a key (the password) to open a vault (the database). You never carry the key around in your wallet (the HTML file) where anyone can see it. Instead, the bank (Netlify) keeps the key in a private box. Only your business, when it shows up at the bank, gets access to it.
*   **In Plain English:** If you put your admin password in your HTML file, anyone who clicks "View Source" in their browser sees it instantly. Instead, the password is stored only in Netlify's secure server settings. When the page needs to check the password, it asks the Netlify function, which checks the stored secret — without ever revealing it to the browser.

#### 🔵 VERSION 2: The Tech Spec (Professional Terminology)
*   **Technical Definition:** Environment Variables are key-value pairs stored at the infrastructure level (Netlify Dashboard → Environment Variables). They are injected into the Node.js process at function execution time via `process.env.VARIABLE_NAME`. They are never sent to the client/browser.
*   **How it Works in Code:** The admin password is stored as `ADMIN_SECRET_KEY` in Netlify's dashboard. The frontend sends the password as an `x-admin-token` HTTP header. The Netlify function compares `event.headers['x-admin-token']` to `process.env.ADMIN_SECRET_KEY`. If they match, access is granted.
*   **Why We Used It Here:** The Admin Dashboard needs to be password-protected but the password cannot live in client-side code. Using an env variable means: (1) the password never appears in GitHub, (2) it can be changed without touching code, (3) it cannot be found through browser DevTools.
*   **Netlify Tip:** Enable **"Secret Value"** when setting sensitive variables. This makes the value write-only — even Netlify's own UI can't display it after it's set. Only server-side functions can use it.

#### 💻 Code Snapshot
```javascript
// ✅ SERVER SIDE (Netlify Function) — Secret is safe here
const providedToken = event.headers['x-admin-token'];
const secretKey = process.env.ADMIN_SECRET_KEY;
if (providedToken !== secretKey) {
  return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
}

// ❌ NEVER DO THIS in any HTML or client-side file
// const PASSWORD = "MySecretPassword123"; // Visible to anyone via DevTools
```

---

### TITLE: DB-Driven UI — Dynamic Lock/Unlock Without Touching Code
*   **TAGS:** `architecture, database, admin-pattern, ui, real-time, postgresql`
*   **DATE:** 2026-04-16

#### 🟢 VERSION 1: The Foundation (Simple Analogy)
*   **The Big Idea:** Instead of editing code every time you want to open or close an exam, you flip a switch in a dashboard. The switch saves to a database. The student page reads from the database. No one touches code.
*   **The Analogy:** Think of a store with a physical "Open/Closed" sign on the door. The old way (hardcoded HTML) was like painting "OPEN" directly onto the door — to change it, you'd need a painter. The new way (DB-driven) is like a hanging sign — anyone with the key (admin password) can flip it instantly.
*   **In Plain English:** There is a tiny table in the database with one row per exam. The teacher flips a switch in the admin panel → that saves the new state to the table → when a student opens the portal, it checks the table and shows each exam as available or locked automatically.

#### 🔵 VERSION 2: The Tech Spec (Professional Terminology)
*   **Technical Definition:** A database-controlled feature flag system. An `exam_status` table acts as a real-time config store. Admin panel writes to it via a protected POST function. Student portal reads from it via a public GET function and renders the UI accordingly.
*   **How it Works in Code:** `exam_status(exam_key TEXT PRIMARY KEY, is_open BOOLEAN)`. `get-exam-status.js` returns a JSON map of all statuses. `set-exam-status.js` upserts a single row. `student-exam-selection.html` fetches the map on step 3 and renders open exams as clickable cards and closed exams as locked cards.
*   **Why We Used It Here:** The old system had `disabled` classes and `alert()` messages hardcoded in HTML. The teacher had to ask a developer to unlock exams. Now the teacher does it herself in seconds from any device.

#### 💻 Code Snapshot
```sql
CREATE TABLE IF NOT EXISTS exam_status (
  exam_key   TEXT PRIMARY KEY,  -- e.g. '2-listening'
  is_open    BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
```javascript
// Student portal reads DB on step 3
const { statuses } = await (await fetch('/.netlify/functions/get-exam-status')).json();
const isOpen = statuses['2-listening']; // true → clickable, false → locked card
```

---

### TITLE: PowerShell Does NOT Support `&&` Command Chaining
*   **TAGS:** `powershell, windows, cli, terminal, gotcha, deployment`
*   **DATE:** 2026-04-16

#### 🟢 VERSION 1: The Foundation (Simple Analogy)
*   **The Big Idea:** The `&&` shortcut for chaining commands in one line only works in Unix/Linux/Mac terminals. Windows PowerShell doesn't understand it and will throw an error.
*   **The Analogy:** It's like trying to order food in French at a restaurant that only speaks Arabic. The waiter (PowerShell) isn't being difficult — it just genuinely doesn't speak that language (`&&`). You have to place two separate orders.
*   **In Plain English:** On Mac or Linux, you can write `git add -A && git commit -m "message"` to run two commands back to back. On Windows PowerShell, this throws a syntax error. The fix is simple: run each command on its own separate line.

#### 🔵 VERSION 2: The Tech Spec (Professional Terminology)
*   **Technical Definition:** `&&` is a bash/zsh conditional sequential operator. PowerShell uses `;` for unconditional sequential execution, or requires explicit `if ($LASTEXITCODE -eq 0)` checks for conditional chaining. `&&` was only added experimentally in PowerShell 7+ and is not reliably available.
*   **How it Works in Code:** Split every chained command into separate `run_command` tool calls when operating on Windows.
*   **Why We Documented It:** This caused a failed deployment step during the Admin Dashboard V1 deploy session (2026-04-16) and will happen on every future session if not remembered.

#### 💻 Code Snapshot
```powershell
# ❌ FAILS in PowerShell
git add -A && git commit -m "message"

# ✅ CORRECT — run as separate commands
git add -A
git commit -m "message"
git push origin main
```
