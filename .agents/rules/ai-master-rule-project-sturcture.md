---
trigger: always_on
---

1. Objective
Your primary directive under this rule is to create, maintain, and own a file named PROJECT_STRUCTURE.md  EVERY project you work on. this file should be wihin a folder called "Documenation" (create  this folder if it doesn't exist in the project root). This file serves as the definitive "Table of Contents" for the codebase. Its purpose is to provide immediate clarity on the project's architecture for human collaborators, new developers, and your own future sessions.
2. Trigger Conditions
This rule is triggered and its protocol must be executed under the following conditions:
Project Initialization: Upon creating or starting work on a new project.
File System Modification: Upon any add, delete, or rename operation on any file or folder within the project scope.
3. Execution Protocol
Upon a trigger event, you MUST follow these steps in sequence:
Verify Existence: Check for PROJECT_STRUCTURE.md in the project's root directory.
Initialize if Absent: If the file does not exist, create it immediately using the Master Template defined in Section 4 of this rule.
Scan for Changes: Perform a deterministic scan of the entire project's file and folder structure. It is recommended to use a reliable system command (e.g., tree -L 3 --noreport -I 'node_modules|.git|dist|build') to generate an accurate, current representation of the file system.
Reconcile Structure: Compare the scan's output with the existing PROJECT_STRUCTURE.md.
For any newly detected file or folder, add it to the markdown structure under the appropriate heading with the placeholder: [TODO: Describe purpose here].
For any deleted file or folder, remove its corresponding line from the markdown file.
Analyze and Describe: For every entry marked with [TODO: Describe purpose here], you MUST:
Analyze the file's content and its location within the project.
Replace the placeholder with a concise, single-sentence description of that file's specific purpose.
Update Timestamp: Modify the Last Updated: field at the top of the file with the current UTC timestamp.
Atomic Commit: The updated PROJECT_STRUCTURE.md MUST be included in the very same commit as the file system changes that triggered this protocol. This ensures the documentation never becomes out-of-sync with the code.
4. Master Template for PROJECT_STRUCTURE.md
When creating a new PROJECT_STRUCTURE.md file, you MUST use this exact template. When updating, you MUST adhere to this format.
code
Markdown
# Project Structure: [AI will insert Project Name here]

**Last Updated:** [AI will insert UTC timestamp here]

This document is the single source of truth for this project's file and folder structure. It is maintained automatically by the Antigravity AI agent and serves as a "Table of Contents" for the codebase.

---

## 1. Application Source Code

*This section contains the core logic, features, and primary code of the application.*

-   `src/`: [Purpose: The main container for all primary source code.]
    -   `index.js`: [Purpose: The main entry point of the application.]
    <!-- AI will populate the rest of this section -->

## 2. Testing

*This section contains all code dedicated to verifying the functionality and correctness of the application.*

-   `tests/`: [Purpose: The main container for all automated tests.]
    <!-- AI will populate the rest of this section -->

## 3. Project Configuration

*These files define project-level settings, dependencies, and build configurations. They are crucial for the development environment.*

-   `package.json`: [Purpose: Lists project dependencies and defines key scripts like 'start' and 'test'.]
-   `.env`: [Purpose: Stores environment-specific variables, like API keys, which should not be committed to version control.]
    <!-- AI will populate the rest of this section -->

## 4. Environment & Tooling (Boilerplate Explained)

*These are standard, often auto-generated, files and folders common in modern development. They support the development process but do not contain application logic. They should generally not be edited manually.*

-   `.git/`: **(Do Not Touch)** [Purpose: This is where Git, our version control system, stores the entire history of the project.]
-   `node_modules/`: **(Do Not Touch)** [Purpose: Contains all the third-party libraries (dependencies) our project uses. It is managed automatically by a package manager (npm/yarn).]
-   `build/` or `dist/`: **(Do Not Touch)** [Purpose: Contains the final, optimized version of our application that gets deployed to the web server.]
-   `.gitignore`: [Purpose: A list of files and folders that Git should intentionally ignore and not track (e.g., `node_modules/`, `.env`).]

---
5. Scope and Constraints
Hierarchy is Key: You MUST represent the folder/file hierarchy accurately using nested markdown lists.
Conciseness: Descriptions SHALL be a single, clear sentence. The goal is to explain purpose, not implementation details.
Intelligent Exclusion: While the boilerplate directories (.git, node_modules, etc.) are listed and explained in their own section, you MUST NOT list their internal contents. The purpose is to explain the folder, not the thousands of files within it. Your file system scan SHOULD exclude these directories to maintain clarity and performance.