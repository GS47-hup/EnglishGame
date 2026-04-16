import os

master_rules_path = r"E:\Antigravity Projects\1_Master Antigravity Documentation\00_Exocortex_Protocols\Antigravity_Global_AI_Rules.md"
master_templates_path = r"E:\Antigravity Projects\1_Master Antigravity Documentation\Universal_Project_Templates.md"

youlearnt_doc_dir = r"E:\Cursor AI Projects\Youlearnt app project\Documentation"
spoken_doc_dir = r"E:\Cursor AI Projects\SpokenEnglish Academy_Websitet\Documentation"

# 1. Update Master Rules (Appending the Knowledge Atlas rule to the Prime Directive)
with open(master_rules_path, "r", encoding="utf-8") as f:
    master_rules = f.read()

if "99_Knowledge_Atlas.md" not in master_rules:
    master_rules = master_rules.replace(
        "If we change an architecture, write it down.",
        "If we change an architecture, write it down.\n*   **The Knowledge Atlas requirement:** Every single project must contain a `Documentation/99_Knowledge_Atlas.md` file to bank any new technological concepts, pipelines, or theoretical discoveries made during the project."
    )
    with open(master_rules_path, "w", encoding="utf-8") as f:
        f.write(master_rules)

# 2. Update Universal Templates
with open(master_templates_path, "r", encoding="utf-8") as f:
    master_templates = f.read()

if "99_Knowledge_Atlas.md" not in master_templates:
    master_templates = master_templates.replace(
        "└── 📄 04_changelog.md",
        "├── 📄 04_changelog.md\n      └── 📄 99_Knowledge_Atlas.md"
    )
    with open(master_templates_path, "w", encoding="utf-8") as f:
        f.write(master_templates)

# 3. Create Knowledge Atlas for YouLearnt
youlearnt_atlas_content = """# 99. Knowledge Atlas (YouLearnt App)

This document serves as the local knowledge bank for the YouLearnt mobile application architecture.

## 1. The White-Label CI/CD Pipeline (Multi-Center Architecture)
**Concept:** A system that allows maintaining **One Codebase** while publishing **Multiple Unique Apps** (different icons, names, colors) to the App Store.
**How it Works:** 
- The framework is React Native powered by Expo.
- We maintain configuration files (e.g., `app.knowledge_center.json`, `app.youlearnt.json`).
- Expo Application Services (EAS) reads these configs in the cloud. Instead of compiling one app, it dynamically generates multiple separate IPA (iOS) and APK (Android) binaries. 
- *Result:* Students get center-specific branded apps on their phone's home screen, but we only have to write and debug code once.

## 2. Database Syncing Limitations
**Concept:** The theoretical bridge between the Global International DB and the Libyan Regional DB.
**How it Works:** A cron-job script wakes up (e.g., at 3:00 AM) to request new users from the Global API and writes them into the Libyan Database.
**Why it is Dangerous:**
- "Data Collisions": Conflicts arise if a user changes their password on app but changes phone number on website.
- "Technical Dependency": If the Global team changes their database logic, the Libyan script silently breaks.
- *Conclusion:* Better to use a "Clean Slate" fork where new users just sign up on the app, avoiding dangerous technical dependencies entirely.
"""

with open(os.path.join(youlearnt_doc_dir, "99_Knowledge_Atlas.md"), "w", encoding="utf-8") as f:
    f.write(youlearnt_atlas_content)

# Update YouLearnt Decision Log regarding the new Clean Slate decision
decisions_log_path = os.path.join(youlearnt_doc_dir, "02_decisions_log.md")
if os.path.exists(decisions_log_path):
    with open(decisions_log_path, "a", encoding="utf-8") as f:
        f.write("| 2026-04-07 | Clean Slate DB Migration | Decided against complex script synchronization AND against doing a massive data export. Students will simply create new accounts on the app. | Hard Database Transfer CSV Dump (Too much effort for low-value data) |\n")

# 4. Create Knowledge Atlas for SpokenEnglish
spoken_atlas_content = """# 99. Knowledge Atlas (SpokenEnglish Game)

This document serves as the local knowledge bank for the SpokenEnglish Academy Review Game ecosystem.

## 1. Mono-Repo Micro-App Structure
The system is built as several entirely separate web applications residing in the same folder, sharing the `questions.json` and PostgreSQL Database without directly sharing logic.

## 2. Audio Fetching CORS Bypass
Local JavaScript `fetch()` calls for audio trigger CORS blocks on desktop environments. This necessitates the use of `start_server.py` to host standard local environment protocols.
"""

with open(os.path.join(spoken_doc_dir, "99_Knowledge_Atlas.md"), "w", encoding="utf-8") as f:
    f.write(spoken_atlas_content)

print("✅ Documentation rules globally enforced. Knowledge Atlases generated.")
