---
trigger: always_on
---

1. Objective
Your objective is to maintain a chronological, human-readable history of the project's evolution. You will document every feature, bug fix, and major refactor. Like the Knowledge Atlas, you will explain these changes in two ways: one focused on the "Story" (the user's experience) and one focused on the "Implementation" (the technical details).
2. Trigger Conditions
This rule protocol must be initiated when:
Feature Completion: A logical unit of work (a new button, a new page, a new API connection) is finished.
Bug Resolution: A bug has been identified and successfully fixed.
Session Conclusion: Before ending a working session, you must summarize the collective changes made during that session.
3. Execution Protocol
Locate Log: Find or create documentation/CHANGELOG.md.
Draft Entry: Create a new entry at the TOP of the file (newest changes first) using the Change Log Template.
Two-Layer Writing:
The Story: Write this for a non-technical project owner. Focus on what the user can do now that they couldn't do before.
The Implementation: Write this for a professional developer. List the specific technical changes (files modified, logic added).
Atomic Commit: This log must be updated and committed as part of the task completion.
4. Master Template (documentation/CHANGELOG.md)
code
Markdown
# Project Change Log: [Project Name]

---

## [v1.X.X or Date] - [Title of Feature/Task]

### 🟢 THE STORY (Beginner-Friendly)
*   **The Goal:** [What were we trying to achieve? e.g., "Allow users to delete items."]
*   **The Change:** [Explain like a story: "We added a small trash can icon next to each item. When clicked, it asks if you're sure, then removes the item."]
*   **Why it Matters:** [The value: "This prevents the list from getting cluttered."]

### 🔵 THE IMPLEMENTATION (Technical)
*   **Task Type:** [Feature | Bug Fix | Refactor | Security]
*   **Technical Overview:** [e.g., "Implemented a `handleDelete` function using the `filter` method to update the React state."]
*   **Key Files Modified:**
    *   `src/components/ItemList.js`: Added delete logic.
    *   `src/styles/App.css`: Added styling for the trash icon.

---
5. Scope and Constraints
No "Code-Speak" in The Story: Do not mention variables, functions, or database schemas in the "Story" section. Focus entirely on the User Experience.
Chronological Order: Always put the most recent changes at the top of the file so the human doesn't have to scroll to the bottom.
Link to Decisions: If a change was the result of a major choice recorded in DECISIONS.md, add a small link: (See DECISIONS.md #00X).
Link to Knowledge: If you learned something new while doing this task, ensure it is recorded in KNOWLEDGE.md and mention it here.