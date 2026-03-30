# 📱 Mobile Performance Guidelines

## 🎯 The Objective
This platform is designed **Phone-First**. The primary users will be taking exams on medium-to-low tier mobile devices. The architecture must prioritize speed, smoothness, and low resource consumption to ensure no student is hindered by technical difficulties.

## 🛠️ Architectural Constraints (The "How")

### 1. Minimal JavaScript & CSS Payloads
*   **No Heavy Frameworks:** Avoid large libraries (React, Angular) unless strictly necessary. We will continue the pattern established in Level 4/5 by using Vanilla HTML/CSS/JS.
*   **Utility CSS:** Use a lean, utility-first approach (like Tailwind via CDN or a custom minimal stylesheet) to prevent CSS bloat.

### 2. DOM (Document Object Model) Management
*   **Shallow DOM:** Low-end phones struggle with deeply nested HTML elements. Keep the structure flat and semantic.
*   **Paging/Wizard Structure:** Instead of loading a 50-question exam onto a single massive scrolling page (which consumes RAM), consider rendering a few questions at a time or using the proven Wizard format (`student-exam-selection.html`).

### 3. Asset Optimization
*   **Images:** All images must be compressed (e.g., WebP format) and exact-sized to prevent the phone's CPU from scaling them on the fly.
*   **Audio (Listening Exams):** Audio files should be highly compressed MP3s. They should not auto-buffer all at once on page load to preserve bandwidth.

### 4. Connection Resilience & State Management
*   **Local Storage Backup:** Medium-tier phones often deal with spotty cellular networks. Every time a student answers a question, it MUST be saved to `sessionStorage` or `localStorage`. 
*   **Safe Submissions:** If the network drops, the exam progress is not lost. The student can reconnect and hit submit.

### 5. Interaction Design (UX)
*   **Touch Targets:** All buttons must be at least `44px` by `44px` (Apple/Google accessibility standard) so they are easy to tap without frustration.
*   **No Complex Animations:** Avoid CSS transitions that trigger reflows or repaints (e.g., changing `width` or `margin` on hover/active). Stick to `opacity` and `transform` which are GPU-accelerated.
