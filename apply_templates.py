import os

master_docs_path = r"E:\Antigravity Projects\1_Master Antigravity Documentation\Universal_Project_Templates.md"
youlearnt_path = r"E:\Cursor AI Projects\Youlearnt app project"

master_content = """# Antigravity Universal Project Templates

This folder contains the standardized architectural templates that must be applied to **every new Antigravity project**, regardless of the software or technology being used (Notion, Godot, Python, Expo, etc.).

By applying these *exact* formatting constraints, we ensure that every project is instantly readable, maintainable, and scalable. This prevents "cognitive entropy" by ensuring the Founder's spatial memory functions perfectly—the exact same information is always located in the exact same visual structure.

## The Cognitive Requirement vs. Technical Hierarchy
- **Technical Hierarchy**: The project folder structure (e.g., `src/`, `app/`) can and should follow industry standards for the framework.
- **Cognitive Requirement**: Regardless of the technical hierarchy, the **root directory** and the **`Documentation/` directory** must *always* contain the "Context-State Protocol" files.

## Required Documentation Structure
When initializing a new project, create the following `Documentation` folder at the root:

```text
📁 [Project Name]/
  ├── 📄 task.md               <-- Exocortex (Required)
  ├── 📄 session_summary.md    <-- Exocortex (Required)
  └── 📁 Documentation/
      ├── 📄 00_architecture_overview.md
      ├── 📄 01_setup_guide.md
      ├── 📄 02_decisions_log.md
      ├── 📁 Session_Logs/
      └── 📄 04_changelog.md
```

## Standardized File Templates
*You must unconditionally apply these templates to their respective files to ensure visual parsing symmetry.*

### A. `04_changelog.md`
*Rule: Chronological logging grouped by specific action tags.*
```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [YYYY-MM-DD]
### Added
- [Feature description]
### Changed
- [Modification description]
### Fixed
- [Bug fix description]
### Removed
- [Deletion description]
```

### B. `02_decisions_log.md` (ADRs)
*Rule: A strict table format requiring justification for every major pivot.*
```markdown
# Architectural Decision Log (ADRs)

| Date | Decision | Rationale | Alternatives Rejected |
| :--- | :--- | :--- | :--- |
| YYYY-MM-DD | [What we decided] | [Why we did it] | [What we chose not to do and why] |
```

### C. `session_summary.md`
*Rule: A high-level narrative written at the end of a work sprint so you can instantly resume later.*
```markdown
# Session Summary

## Latest Session: YYYY-MM-DD
**Goal:** [What were we trying to achieve today?]

### What Was Done:
- [High-level action 1]
- [High-level action 2]

### Where We Left Off:
- [The exact state of the code/project right now]
- [The immediate next step required for the next session]
```

### D. `task.md`
*Rule: Granular, prioritized checklist using specific status flags.*
```markdown
# Project Tasks
Status Flags: `[ ]` Pending, `[/]` In Progress, `[x]` Completed

## Priority 1: Immediate Execution
- [ ] Task description

## Priority 2: Backlog
- [ ] Task description
```

### E. `01_setup_guide.md`
*Rule: The 4-step onboarding logic.*
```markdown
# Project Setup Guide

1. **Prerequisites:** [Software needed, e.g., Node.js, Python]
2. **Environment Variables:** [Keys required and where to put them]
3. **Installation:** [Exact command to install dependencies]
4. **Run Command:** [Exact command to boot the app locally]
```

### F. Session Logs (Inside `Documentation/Session_Logs/`)
*Rule: Name files exactly like `2026-04-07_Session.md`*
```markdown
# Session Log: YYYY-MM-DD

**Time Spent:** [Hours]
**Focus Area:** [Component/Feature]

## Technical Notes:
- [Code snippets, errors encountered, or mini-decisions]
```
"""

youlearnt_files = {
    "task.md": """# Project Tasks\nStatus Flags: `[ ]` Pending, `[/]` In Progress, `[x]` Completed\n\n## Priority 1: Immediate Execution\n- [ ] Finalize Architectural Separation Plan\n\n## Priority 2: Backlog\n- [ ] Define precise MVP features\n""",
    "session_summary.md": """# Session Summary\n\n## Latest Session: 2026-04-07\n**Goal:** Initial Setup and DB Fork Architecture\n\n### What Was Done:\n- Built out project folder based on Master Templates.\n- Agreed to React Native (Expo) route for Cross Platform Native app.\n- Wrote ADR proposing the hard Database Fork to ensure operational autonomy for Libya vs International branch.\n\n### Where We Left Off:\n- Awaiting CEO/Foundership validation of the ADR documentation and confirmation on budget/responsibility of the DB split.\n""",
    "Documentation/01_setup_guide.md": """# Project Setup Guide\n\n1. **Prerequisites:** \n\n2. **Environment Variables:** \n\n3. **Installation:** \n\n4. **Run Command:** \n""",
    "Documentation/02_decisions_log.md": """# Architectural Decision Log (ADRs)\n\n| Date | Decision | Rationale | Alternatives Rejected |\n| :--- | :--- | :--- | :--- |\n| 2026-04-07 | Recommend React Native (Expo) | Write once, export natively to Android & iOS. Avoids expensive native devs and bypasses sluggish PWA Website hurdles. | Website App (Clunky), Pure Native (Expensive) |\n| 2026-04-07 | Hard Database Fork | Branch requires true isolation and localization from global branch. | Tenant Syncing (Requires international technical co-dependence) |\n""",
    "Documentation/04_changelog.md": """# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n## [2026-04-07]\n### Added\n- Initial Antigravity template structure and strict rule application.\n- Strategic project proposal for React Native build.\n"""
}

# Update Master Rules
with open(master_docs_path, "w", encoding="utf-8") as f:
    f.write(master_content)

# Update local Youlearnt project files
for rel_path, content in youlearnt_files.items():
    full_path = os.path.join(youlearnt_path, rel_path.replace("/", os.sep))
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("✅ Master Antigravity Templates Updated & Applied to YouLearnt")
