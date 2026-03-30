# 🧠 AI Context Briefing: Flipbook Portal

**Last Updated**: 2026-02-11
**Project**: Flipbook Portal (Sub-component of English Review Game)

---

## 🏗️ Technical Architecture
- **Frontend**: Single-file HTML/JS (`index.html`) using **Tailwind CSS** for styling and **Lucide/Font Awesome** for icons.
- **Design Language**: "Glassmorphism" (semi-transparent backgrounds, blurs, rounded corners).
- **Authentication**: Custom client-side password wall using `localStorage` for session persistence (key: `authenticated`).
- **Data Model**: `booksData` object within `index.html` maps Level -> Type -> Path.
- **Navigation**: Uses `URLSearchParams` to track current level/book without full page reloads.
- **Cleanup Logic**: Includes `MutationObserver` to remove "Flip PDF Plus" watermarks from embedded flipbooks.

## 🔑 Key Credentials
- **Portal Password**: `Academy2026`

## 📁 Repository Structure
- `index.html`: Main portal access.
- `Everybody up_Flipbooks_3rd Edition/`: Assets for student books and guides.
- `Project_Management/Flipbook_Portal/`: This folder containing all governance and planning docs.

## 🚀 Deployment Info
- **Platform**: Netlify (site: `sage-flipbooks`)
- **Workflow**: `npx netlify-cli deploy --prod`

## ⚠️ Important Constraints
1.  **Styling**: DO NOT attempt "premium" rebrands unless explicitly requested again. The user strongly prefers the clean, original Glassmorphism UI.
2.  **Naming**: Always use **"SpokenEnglish Academy"** (one word, no space) for brand consistency.
3.  **Security**: Ensure the password wall is never bypassed when adding new levels.
