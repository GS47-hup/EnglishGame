# SpokenEnglish Academy: Future Roadmap & Technical Debt

This document serves as a backlog for high-value features, infrastructure improvements, and technical debt that were deferred during rapid MVP development phases.

## 1. Native Image Uploads (Level 2 Writing Exams)
**Current State:** Level 2 students complete written exams on physical paper and manually send photos via WhatsApp to the teacher. This fragments the data (Reading scores in Dashboard, Writing scores on WhatsApp) and introduces a high friction context-switch for young learners.
**The "Holy Grail" Solution:** 
*   **Web App Integration:** Implement a `[📷 Take Picture of Your Paper]` button directly on the `Level_2_Writing_Exam_Online.html` page using the HTML5 `<input type="file" capture="environment">` tag.
*   **Backend Infrastructure:** Integrate a free image-hosting API (like Cloudinary, ImgBB, or AWS S3) via Netlify Functions.
*   **Database Sync:** The Netlify Function uploads the photo to the bucket, retrieves the URL, and securely saves the URL string into the Neon PostgreSQL `level2_submissions` table alongside the student's ID.
*   **Teacher Dashboard:** The dashboard queries the database and renders the actual image of the student's handwriting directly next to their reading/listening scores, unifying the entire grading workflow onto a single screen.

## 2. Hardcoded Password Replacement (Urgent Security Debt)
**Current State:** The Student Exam Portal and Flipbook Portals currently rely on hardcoded JavaScript passwords on the frontend (`student-exam-selection.html` lines ~80-100). This is fundamentally insecure and vulnerable to simple inspection tools.
**The Solution:** 
*   Implement an Admin Toggle Panel connected to the Neon Database or Netlify Environment Variables.
*   Instead of checking a password, the frontend simply queries a `GET /api/check-exam-status` endpoint.
*   The teacher can flip a switch in their Admin Panel to change the exam status from "Locked" to "Live," eliminating the need for passwords entirely and preventing premature access.
