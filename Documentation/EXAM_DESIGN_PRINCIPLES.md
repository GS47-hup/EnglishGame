# 🎨 Exam Design Principles (Pedagogical Framework)

**Standard established during the Level 2 MVP Sprint (March 2026).**
These principles prioritize lowering "cognitive load" for junior students so their score reflects their English ability, not their technical proficiency.

## ✍️ The "Zero-Typing" Mandate
*   **The Concept**: Junior students (Level 1-2) often struggle with mobile keyboards, varying layouts, and autocorrect. Every keystroke is a potential failure point.
*   **The Solution**: Replace all text-input fields with **Tap-to-Select** or **Tap-to-Match** logic.
*   **Case Study (Reading Part 2)**: Instead of writing "hospital", students tap the "🏥 Hospital" block. This turns the exam into a game-like experience that keeps students engaged.

## 📊 Descriptive Answer Mapping
*   **The Concept**: Raw data in a database (`Q1: B`) is meaningless to a teacher without a paper key. This slows down the feedback loop.
*   **The Solution**: Map the raw answer ID to a human-readable string + Emoji in the `teacher-dashboard.html`.
*   **Example**: 
    - *Raw*: `{"q1": "B"}`
    - *Mapped*: `Q1: B (happy 😊)`
*   **Benefit**: Teachers can instantly review and grade performance at a glance.

## 📲 Hybrid Digital Workflow (WhatsApp Deep Linking)
*   **The Concept**: Some exam portions (like Writing) require physical handwriting. Building a photo-upload system inside a browser is often buggy on mobile.
*   **The Solution**: Use a **WhatsApp Deep Link** button.
*   **How it works**: A button labeled "Send Photo via WhatsApp" auto-generates a text payload: *"Hello Teacher, here is the Writing exam for [Student Name]"* and opens the student's native WhatsApp app to send the photo.
*   **Benefit**: Leverage the existing high-bandwidth, high-reliability infrastructure of WhatsApp that students already use daily.

## 🔒 Fail-Safe Submission Hook
*   **The Concept**: Students often accidentally submit early or skip questions.
*   **The Solution**: A JavaScript block that intercepts the "Submit" click, scans for unanswered questions, and triggers a loud visual warning if the submission is incomplete.

## 🎧 The 2-Play Audio Limit (Universal Rule)
*   **The Concept**: In real-life listening comprehension and standardized exams (like KET/PET), audio is strictly limited. Allowing unlimited replays turns a listening exam into a puzzle.
*   **The Solution**: A strict, universal cap restricting audio to exactly **2 plays** across **all levels (Level 0 through 6)**. 
*   **Implementation**: A JavaScript listener disables the play button, changes its UI to indicate exhaustion ("🚫 No Plays Remaining"), and prevents further playback. This forces students to focus on intent and context during the playback phase.
