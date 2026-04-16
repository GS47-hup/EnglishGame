# Online Exam Proctoring Strategy for Mobile Students

## The "6-Tab Screen Sharing" Pitfall (What NOT To Do)
Initially considered hosting 6 individual Google Meet sessions for 6 students, asking each student to share their screen from their mobile phone so the teacher could watch them navigate the exam.

**Why this fails:**
1. **Device Overload (Student):** Students use medium-tier phones. Running a live screen-capture video stream while rendering an interactive web application causes rapid battery drain, severe overheating, and browser/phone crashes.
2. **Resource Exhaustion (Teacher):** Running 6 concurrent live video streams across 6 Chrome tabs consumes massive amounts of RAM and CPU, risking a total teacher-side browser crash during the exam.
3. **Audio Chaos:** 6 Google Meets active on one computer routes all audio to one headset. The teacher cannot tell which tab a student is speaking from without manually hunting through tabs.
4. **Visibility & UX:** When a mobile user shares their screen and switches to Safari/Chrome, they cannot see the Google Meet UI. They don't know if the teacher is talking to them. Furthermore, the teacher seeing 6 vertical phone screens squeezed onto a desktop monitor makes text unreadable. Any incoming WhatsApp/Instagram notifications on the student's phone will be broadcast to the teacher.

---

## The "One Room, Grid View" Strategy (Standardized Protocol)
Instead of individual rooms and screen sharing, utilize **One Google Meet Link** for the entire class.

### Performance Optimization Insights:
*   **Device Load**: Established that screen-capture for 6+ students from mobile phones will lead to CPU overheating and battery failure. 
*   **Bandwidth**: Standard Camera streams are significantly lighter than screen-sharing streams.
*   **Stability**: Keeps the teacher's browser stable by limiting active video tabs to ONE. 

### Execution Workflow:
1. **Single Entry Point:** The teacher creates one Google Meet link and sends it to all 6 students.
2. **Camera Only (No Screen Share):** All students join the room, turn on their standard front-facing cameras, and mute their microphones.
3. **Teacher Control Center:** The teacher sets their Google Meet layout to "Tiled" or "Grid". This turns the teacher's monitor into a direct surveillance dashboard of all 6 students' faces simultaneously in a single tab.
4. **Monitoring Progress:**
    *   **Anti-Cheat:** The teacher watches live faces to ensure students aren't talking to others or looking off-screen for answers.
    *   **Submissions**: Instead of watching the student's screen, the teacher keeps **`teacher-dashboard.html`** open in a separate tab and refreshes it. As students submit, results appear instantly from the database.
5. **Communication:** Use the "Raise Hand" or Physical hand-raise to manage questions without audio chaos.

### Why this is Superior (Framework Summary):
*   **Efficiency**: Saves 80% bandwidth and RAM for both teacher and student.
*   **Standardization**: Simplifies the process into a single, repeatable meeting link.
*   **Privacy**: Protects students from accidentally sharing personal notifications via screen-share.
