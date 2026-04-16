# Project Change Log: SpokenEnglish Academy

---

## [2026-04-16] - Resilient Audio Engine (Global)

### 🟢 THE STORY (Beginner-Friendly)
*   **The Goal:** Ensure audio works even when students are on a Google Meet call using their phones.
*   **The Change:** We replaced the old "Music Player" style with a "Professional Audio Engine" (Web Audio API). This engine "buffers" the sound into the phone's memory first, which helps bypass the system's attempts to silence browser audio during calls.
*   **Why it Matters:** Students in Libya often use phones and need to hear exams while sharing their screen on Google Meet. This fix is designed to keep the sound audible in those tough conditions.

### 🔵 THE IMPLEMENTATION (Technical)
*   **Task Type:** Feature | Security (Bypass)
*   **Technical Overview:** Implemented `ResilientAudioEngine` class using `AudioContext`. Transitions from `HTMLAudioElement` to `AudioBufferSourceNode`. This bypasses mobile OS "communication ducking" patterns by treating audio as processed buffers rather than simple media streams.
*   **Key Files Modified:**
    *   `Level_2_Listening_Exam_Online.html`: Fully migrated to Web Audio API.
    *   `Level_4_Listening_Exam_Online.html`: Partial migration (Context & Engine added).

---

## [2026-04-16] - Level 4 Visual & Autoplay Finalization

### 🟢 THE STORY (Beginner-Friendly)
*   **The Goal:** Complete the Level 4 Listening Exam visuals and fix common audio playback issues.
*   **The Change:** Fixed all broken images in Parts 1, 2, and 3. We also removed all "text cheats" (like "eating lunch"), so students must actually listen to the audio to choose the right picture. Added a "Master Audio Unlock" so students don't have to keep tapping the screen to hear the next question.
*   **Why it Matters:** This brings the Level 4 exam up to professional KET/PET standards where listening skill is the only thing tested.

### 🔵 THE IMPLEMENTATION (Technical)
*   **Task Type:** Feature | Content
*   **Technical Overview:** 
    *   Mapped all missing assets for Section 3 (Part 1/2/3).
    *   Enforced "Pure Modality" by stripping descriptive text from image options.
    *   Implemented global `unlockAudio()` and `playSequence()` logic for seamless sequential playback.
*   **Key Files Modified:**
    *   `Level_4_Listening_Exam_Online.html`: Visual assets and sequence logic.
    *   `task.md`: Marked content finalization as complete.

---

## [2026-04-16] - Global Audio Autoplay Stability Fix

### 🟢 THE STORY (Beginner-Friendly)
*   **The Goal:** Stop the "Audio Blocked" errors on mobile phones.
*   **The Change:** We added a "Master Key" to the Start Exam button. When the student clicks "Start Exam," the website now automatically asks the phone's browser for permission to play all future sounds, meaning the student won't get blocked later in the test.
*   **Why it Matters:** Phones (especially iPhones) are very strict about audio. This fix ensures the exam doesn't "freeze" or stay silent when a student tries to play a question.

### 🔵 THE IMPLEMENTATION (Technical)
*   **Task Type:** Bug Fix | UX
*   **Technical Overview:** Implemented a "first-user-interaction" capture to resume the `AudioContext` (if using Web Audio) and pre-play/pause dummy HTML5 audio elements to "bless" the media stack. Added a global `unlockAudio()` trigger on `startExam()`.
*   **Key Files Modified:**
    *   `Level_2_Listening_Exam_Online.html`: Added unlock mechanism.
    *   `Level_4_Listening_Exam_Online.html`: Integrated unlock mechanism into start flow.
