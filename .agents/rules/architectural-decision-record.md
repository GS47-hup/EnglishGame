---
trigger: always_on
---

1. Objective
Your directive under this rule is to maintain a log of all significant architectural and technical decisions in a file named DECISIONS.md. This file must be located within a documentation folder at the project's root (i.e., the path must be documentation/DECISIONS.md). This file serves as the project's memory, explaining why key technical choices were made. This prevents re-litigation of past decisions and provides crucial context for all collaborators (human and AI). This process is also known as maintaining an Architectural Decision Record (ADR).
2. Trigger Conditions
This rule is triggered and its protocol must be initiated when:
A new technology is introduced: A core library, framework, database, or major third-party service is being added to the project.
A choice between alternatives is made: You are evaluating two or more distinct approaches to solve a problem.
A fundamental pattern is established: A project-wide standard for handling a recurring concern is being defined.
An explicit human command is given: A human collaborator instructs you to "record a decision" or asks, "Why did we decide to do X this way?"
3. Execution Protocol
Upon a trigger event, you MUST follow these steps in sequence:
Acknowledge and Propose: Announce that a significant decision point has been reached and that it should be recorded. State your intention to create an ADR entry.
Ensure File and Directory Path:
First, check if the documentation/ directory exists in the project root. If it does not, you must create it.
Next, check for the existence of the file at the path documentation/DECISIONS.md.
If the file does not exist, create it inside the documentation/ directory using the base template from Section 4.
Draft the Decision Record: Create a new decision record entry in a Proposed state. You MUST pre-fill the following fields based on the current context:
Title: A concise summary of the decision (e.g., "001: Choice of State Management Library"). Increment the number from the last record.
Context: Describe the problem or need that prompted the decision.
Decision: Clearly state the chosen solution.
Consequences: Analyze and list the expected positive outcomes, as well as the known trade-offs, risks, or limitations of the chosen path.
Seek Human Confirmation: Present the drafted record to the human collaborator for review. You MUST NOT finalize or commit a decision record without explicit human approval. This is a collaborative process.
Finalize and Append: Once approved, change the status of the record from Proposed to Accepted and update the date. Append the finalized record to the bottom of the documentation/DECISIONS.md file.
Commit: Commit the updated documentation/DECISIONS.md file with a descriptive message (e.g., "docs: Record decision for using [Technology Name]").
4. Master Template for DECISIONS.md
When creating a new DECISIONS.md file, you MUST use this base structure. Every new record appended MUST follow the "Decision Record Template."
code
Markdown
# Architectural Decision Record (ADR)

This document logs all significant architectural decisions for this project. Its purpose is to provide clear, historical context for the "why" behind our technical choices. All entries are maintained by the Antigravity AI agent in collaboration with the development team.

---

<!-- AI will append new decision records below this line -->
Decision Record Template
code
Markdown
## 001: [Title of Decision]

*   **Status:** Proposed | Accepted | Deprecated
*   **Date:** [YYYY-MM-DD]

### Context

[Describe the problem, the driving forces, the constraints, and the user stories that this decision addresses. What is the situation that requires a decision?]

### Decision

[State the full decision clearly and concisely. What is the chosen path? Be specific about the technology, pattern, or approach selected.]

### Consequences

[Describe the results of making this decision. List the positive outcomes (e.g., "Improves developer experience by...") and the negative trade-offs or accepted limitations (e.g., "Increases bundle size," "Introduces a new dependency to manage," "This approach will be less performant for X use case").]

---
5. Scope and Constraints
Significance is Key: This log is for decisions that have a notable impact on the project's structure, dependencies, or development patterns. Do not create records for trivial choices like variable names or component logic.
Immutability: Once a decision is Accepted, it should not be edited. If a past decision becomes obsolete, a new decision record should be created that explicitly Deprecateds the old one, explaining the reasoning for the change.
Human is the Authority: Your role is to facilitate the decision-making process by proposing, drafting, and recording. The final authority on any decision rests with the human collaborator.