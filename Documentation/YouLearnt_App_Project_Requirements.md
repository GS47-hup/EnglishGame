# YouLearnt App: Master Project Requirements

*This document serves as the foundational source of truth for the YouLearnt mobile application, capturing all original context, feature requirements, and architectural decisions.*

---

## 1. Project Overview
**What is YouLearnt?**
YouLearnt is a platform offering virtual classrooms where students and teachers can register and attend live video sessions. 

**Target Audience & Localization (The "Libya Focus")**
- Unlike the global web version of YouLearnt, this mobile application is built **specifically for Libyan students by Libyan developers**.
- **The Low Bandwidth Constraint:** Internet speeds in Libya average around 10 Mbps (7x slower than regions like the UK). The app architecture must aggressively optimize data fetching, state caching, and video streaming protocols to handle poor connections without crashing or infinite loading screens.
- **Extreme Simplicity:** The culture of online learning is new. The app must remove conventional friction (e.g., complex Gmail registrations, cluttered dashboards).

### Multi-Tenant / Whitelabel Architecture
- The app will not just be one instance. It will serve approximately **5 different educational centers** in Libya.
- **The Requirement:** We will maintain one single Master Codebase. Using environment configurations (via Expo), we will compile 5 separate, differently-branded apps (different names, logos, color palettes).
- **Benefit:** If we fix a bug in the primary codebase, all 5 apps are patched simultaneously.

## 2. The Two Core Systems
The YouLearnt App is divided into two primary environments:

### A. The User Dashboard
The administrative hub for all users.
- **Profile Management:** Users can change their names and update details.
- **Discovery:** Users can search for tutors, browse available courses, and view teacher profiles attached to those courses.
- **Progress Tracking:** Students can see how many hours they have attended. Teachers can see attendance logs.

### B. The "YouLearnt Conference" (The Live Classroom)
This is the core, real-time virtual classroom environment. It is conceptually similar to Google Meet or Zoom, but heavily customized for an educational setting.
**Required Features within the Conference:**
- Live video and audio streaming.
- **Recording capability:** Classes must be recorded (either Voice-only or Voice + Video).
- **Interactive Whiteboard:** The teacher has a whiteboard and can grant temporary access to specific students to write on it.
- **Screen Sharing:** Teachers can share their screens with the class.
- **Interactions:** Students can digitally "raise their hands".
- **Chat System:** Both public (entire class) and private (student-to-teacher or student-to-student) text messaging.

## 3. Critical User Flows

### Deep-Linked Push Notifications
This is a high-priority feature for ease of use.
- **The Flow:** When a class is about to start, the app pushes a notification to the student's phone.
- **The Mechanism:** When the student taps the notification, they completely bypass opening the app's dashboard or navigating menus. They are injected **immediately** into the live YouLearnt Conference room.

## 4. Accounts, Authentication & Payments

### Phone Number Authentication
- **Requirement:** Users must be able to create accounts and log in using their **phone numbers** (via SMS/OTP verification). 
- **Rationale:** Traditional email/Gmail setups are a point of high friction for the target demographic. Phone numbers ensure maximum accessibility.

### Payments
- **No In-App Payments required.**
- All subscriptions and payments are handled manually off-app (e.g., in-person at the office or via manual bank transfers). E-commerce integration is the lowest possible priority.

## 5. Technical Architecture & Independence

### Complete Separation from Web Platform
- The Libyan mobile app will be **architecturally separated** from the global YouLearnt Web Platform.
- It will have its own independent database and backend management system.

### Data Migration Strategy
- **One-Time Export/Import:** The only crossing point between the web platform and the app is data migration. Existing Libyan students registered on the web version will be exported and manually injected into the new app's database.
- **Future Onboarding:** Moving forward, all new Libyan students will register directly through the mobile app.

## 6. Development Context
- **Platforms:** The app must be developed for both **iOS and Android** simultaneously (targeting React Native/Expo to achieve this).
- **Team Structure:** The app is being built by a solo Libyan developer (beginner/pre-intermediate) heavily utilizing AI Coding Assistants for architecture and advanced implementation. 
