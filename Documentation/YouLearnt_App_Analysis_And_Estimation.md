# YouLearnt App: Strategy, Architecture, & Time Estimation

**Document Objective:** Provide a comprehensive scoping, technical strategy, and realistic time estimation for a solo developer building the Libyan-focused YouLearnt mobile application with AI assistance.

---

## 1. The Core Challenge & Strategic Honesty
You mentioned that the app's most important feature is the **"YouLearnt Conference"**, which essentially mimics Google Meet or Zoom (live video, screen sharing, whiteboard, recording, chat, etc.). 

**Strategic Honesty:** Building a live video streaming server from scratch is one of the hardest things in software engineering. If you try to build a custom WebRTC video routing server by yourself, it will take over a year and will have terrible quality. 

**The Solution:** We must use a third-party PaaS (Platform as a Service) specifically built for video. I highly recommend **Agora.io** or the **Zoom Video SDK**. These platforms handle the massively complex background routing of video and audio around the world. We will just design the UI in the app and "plug in" their video feed. This is how almost all modern startups build video apps.

---

## 2. Answers to Your Crucial Questions

### What is React Native, and what are the alternatives?
*   **React Native** is a framework created by Meta (Facebook) that allows you to write code *once* in JavaScript/TypeScript, and it automatically creates both an iOS app and an Android app. 
*   **Why we should use it:** As a solo developer, you absolutely do not have the time to learn **Swift** (for iOS) and **Kotlin** (for Android) and build the app twice. React Native cuts your development time in half. We will specifically use **Expo** (a framework built on top of React Native) which makes testing on your physical phone incredibly easy.
*   **Alternatives:** 
    *   **Flutter:** Created by Google, uses the Dart language. Very powerful for animations, but has a slightly steeper learning curve than React Native if you are already familiar with JavaScript.
    *   **Native Development (Swift/Kotlin):** Building two entirely separate apps. Not recommended for a solo developer.

### How much of the YouLearnt Web System can we integrate into the App?
Since you explicitly want to **separate** the Libyan app from the global web platform so you can manage it independently, we cannot plug the app into the exact same running backend logic. 
*   **What we CAN take (Salvage):**
    *   **The Database Structure:** We can look at how they structured the users, courses, and classes, and copy that exact blueprint so we don't have to rethink the logic.
    *   **The Initial Data (Export/Import):** We can export the existing Libyan students from the web platform to an Excel/CSV file and import them into our new standalone database.
    *   **The Design Assets:** We can take all the colors (hex codes), logos, and font files to ensure the brand looks the same.
*   **What we CANNOT take:**
    *   The actual database infrastructure. We will build a new one (likely using **Supabase** or **Firebase**) specifically for Libyan servers/users.

---

## 3. The Recommended Libyan Architecture
To achieve your goals of simplifying the experience for Libyan users, here is the technical stack I recommend:

1.  **Frontend:** **React Native (Expo)** - One codebase for iOS and Android.
2.  **Authentication:** **Firebase Auth** - We will configure it to use **Phone Number OTP (One-Time Password)**. Users enter their Libyan phone number, receive a text, and they are in. No emails or Gmail required.
3.  **Database & Backend:** **Supabase** (PostgreSQL) - It is highly scalable, fast, and similar to what you already know from the English Review Game.
4.  **Live Video Room (YouLearnt Conference):** **Agora.io SDK** - This gives us the camera, microphone, and screen-sharing tools. We just build the UI around it.
5.  **Push Notifications:** **Expo Push Notifications integrations**. When a user taps the "Class is starting" notification, we use "Deep Linking" to skip the dashboard and throw them directly into the video room.

---

## 4. Time Estimation (Solo Developer + AI)

Since you are a self-proclaimed beginner/pre-intermediate working with AI, you will move faster than a traditional beginner, but debugging mobile apps (especially camera/microphone permissions) takes patience. 

Here is a realistic timeline based on full-time / dedicated part-time hours:

### Phase 1: Foundation & Phone Login (Weeks 1 - 3)
*   Setup React Native (Expo) environment.
*   Build the design system (colors, logos, fonts).
*   Implement Firebase Phone Number Authentication.
*   Create the basic navigation (TabBar, Splash Screen).

### Phase 2: The User Dashboard (Weeks 4 - 6)
*   Create the Supabase Database and tables (Users, Classes, Tutors).
*   Build the UI for the dashboard.
*   Implement searching for tutors and viewing registered courses.
*   Import existing Libyan students from the old database.

### Phase 3: The "YouLearnt Conference" Room (Weeks 7 - 12) *[The Hardest Phase]*
*   Integrate the Agora Video SDK.
*   Build the video grid UI (showing multiple students).
*   Handle complex permissions (Camera, Microphone overlays).
*   Add Real-time Chat (Public and Private).
*   Implement the Whiteboard (using a web-view or canvas-based socket library).
*   Add Screen Sharing functionality (requires specific mobile OS permissions).

### Phase 4: Push Notifications & Polish (Weeks 13 - 15)
*   Implement Push Notifications.
*   Implement Deep Linking (Notification click -> instantly join classroom).
*   Testing on real physical iPhones and Android devices.
*   App Store & Google Play Store submission processes.

### **Total Estimated Time: 15 to 18 Weeks (approx. 3.5 to 4.5 months)**

*Note: This assumes we follow the "Strategic Honesty" path and use a BaaS (Backend as a Service) like Supabase, and a Video PaaS like Agora. If we avoid building the server structures ourselves, this timeline is highly achievable.*
