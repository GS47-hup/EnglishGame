import os

# The target directory
base_dir = r"E:\Cursor AI Projects\Youlearnt app project"

# Defining the structure
folders = [
    "Documentation",
    "Documentation/Session_Logs"
]

files = {
    "task.md": "# YouLearnt App - Tasks\n\n- [ ] Finalize Architectural Separation Plan\n- [ ] Approve V1 MVP Scope\n",
    "session_summary.md": "# Session Summary\n\n## Initial Boot\n- Decided on React Native (Expo) for cross-platform app.\n- Decided to isolate the Libyan app database from the Global database.\n",
    "Documentation/00_architecture_overview.md": "# Architecture Overview\n\nStandalone infrastructure isolated from the Global branch. One-time data migration pending.\n",
    "Documentation/01_setup_guide.md": "# Setup Guide\n\n(Pending Stack Selection)\n",
    "Documentation/02_decisions_log.md": "# Decisions Log\n\n| Date | Decision | Rationale |\n| --- | --- | --- |\n| 2026-04-07 | Hard Database Fork | Libyan branch needs political/operational autonomy from the Global branch. |\n",
    "Documentation/04_changelog.md": "# Changelog\n\n"
}

# Create folders
for folder in folders:
    os.makedirs(os.path.join(base_dir, folder), exist_ok=True)

# Create files
for file_path, content in files.items():
    full_path = os.path.join(base_dir, file_path)
    if not os.path.exists(full_path):
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)

print(f"✅ Antigravity Architecture successfully initialized at {base_dir}")
