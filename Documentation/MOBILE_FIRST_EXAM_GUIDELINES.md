# 📱 Mobile-First Exam Guidelines (Technical Framework)

**Standard established during the Level 2 MVP Sprint (March 2020).**
These rules ensure that interactive exam interfaces do not crash or lag on students' medium-tier mobile devices.

## 🚀 Core Technical Rules

### 1. The Audio Segmentation Strategy
*   **The Problem**: Playing a 25-minute high-quality MP3 (10MB+) requires significant RAM to buffer and makes navigation via a single seek-bar frustrating on small touchscreens.
*   **The Solution**: Slice the main audio into discrete question-specific MP3s (e.g., `Q1.mp3`, `Q2.mp3`). 
*   **Implementation**: Embed individual `<audio>` play buttons directly next to each question. This reduces bandwidth and allows students to replay only what they need.

### 2. Asset-Light UI (Emoji Priority)
*   **The Problem**: Loading 20+ cropped JPEG/PNG images for multiple choice answers causes cumulative layout shifts (CLS) and drains mobile data.
*   **The Solution**: Use standard Emojis (🍎, 👨‍⚕️, 🏥) as visual prompts whenever possible.
*   **Why**: Emojis are system fonts; they load instantly at zero-bandwidth and render perfectly at any zoom level.

### 3. Response-Time Optimization
*   **Animation**: Avoid heavy CSS animations or transitions. Use immediate visual state changes for selected buttons.
*   **Payloads**: Ensure the submission payload is minimal JSON (Student Name + Array of Answers). 

## 🛡️ Stability Checklist
- [ ] No background video elements.
- [ ] No concurrent screen-sharing during the exam (See Proctoring Strategy).
- [ ] Individual audio controls for every listening section.
- [ ] Native HTML form elements (tap-to-select) instead of complex drag-and-drop.
