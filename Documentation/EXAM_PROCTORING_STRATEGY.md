# Online Exam Proctoring Strategy for Mobile Students

## The "6-Tab Screen Sharing" Pitfall (What NOT To Do)
Initially considered hosting 6 individual Google Meet sessions for 6 students, asking each student to share their screen from their mobile phone so the teacher could watch them navigate the exam.

**Why this fails:**
1. **Device Overload (Student):** Students use medium-tier phones. Running a live screen-capture video stream while rendering an interactive web application causes rapid battery drain, severe overheating, and browser/phone crashes.
2. **Resource Exhaustion (Teacher):** Running 6 concurrent live video streams across 6 Chrome tabs consumes massive amounts of RAM and CPU, risking a total teacher-side browser crash during the exam.
3. **Audio Chaos:** 6 Google Meets active on one computer routes all audio to one headset. The teacher cannot tell which tab a student is speaking from without manually hunting through tabs.
4. **Visibility & UX:** When a mobile user shares their screen and switches to Safari/Chrome, they cannot see the Google Meet UI. They don't know if the teacher is talking to them. Furthermore, the teacher seeing 6 vertical phone screens squeezed onto a desktop monitor makes text unreadable. Any incoming WhatsApp/Instagram notifications on the student's phone will be broadcast to the teacher.

---

## The "One Room, Grid View" Strategy (Recommended Approach)
Instead of individual rooms and screen sharing, utilize **One Google Meet Link** for the entire class.

### How to Execute:
1. **Single Entry Point:** The teacher creates one Google Meet link and sends it to all 6 students.
2. **Camera Only (No Screen Share):** All students join the room, turn on their standard front-facing cameras, and mute their microphones.
3. **Teacher Control Center:** The teacher sets their Google Meet layout to "Tiled" or "Grid". This turns the teacher's monitor into a direct surveillance dashboard of all 6 students' faces simultaneously in a single tab.
4. **Monitoring Workflow:**
    *   **Anti-Cheat:** The teacher watches the live cameras to ensure students aren't talking to others in the room or looking off-screen for answers.
    *   **Submissions:** The teacher keeps the `teacher-dashboard.html` open in a second tab and refreshes it. Since the Netlify/Neon backend submits instantly, the dashboard acts as the true record of progress. There is no need to micromanage individual finger-taps on the students' screens.
5. **Streamlined Communication:** If a student has an issue, they physically raise their hand on camera or use the "Raise Hand" button in Meet. The teacher simply unmutes and addresses the room ("Ahmed, I see your hand, what is your question?").

### Why this is Superior:
*   **Performance:** Uses a fraction of the bandwidth, RAM, and battery for both the teacher's computer and the students' medium-tier phones.
*   **Simplicity:** Centralizes audio, removing the chaos of hunting for the speaking student across multiple tabs.
*   **Privacy:** Protects the student from accidentally broadcasting private push notifications.
