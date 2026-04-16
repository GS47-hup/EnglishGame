# 04. Technical Stack

> **Context for Future AI Agents:** This document outlines the explicit technical stack approved for the YouLearnt Mobile Application. Do not deviate from these technologies without logging the decision process via the Founder.

## Core Stack

### 1. Mobile Framework: React Native (Expo)
*   **Why not Flutter?** While Flutter is performant, React Native (specifically via Expo) was chosen primarily for its superior **Over-The-Air (OTA) update capabilities**. Pushing silent bug fixes without forcing users on 10 Mbps Libyan internet to redownload 50MB apps from the App Store is critical for retention.
*   **Ecosystem:** RN allows faster UI prototyping and easier translation of the web platform's existing CSS styling.

### 2. Database & Backend: Supabase (PostgreSQL)
*   **Why not Firebase?** While Firebase is great, Supabase provides a rigid SQL structure which is infinitely superior for complex B2B multi-tenant environments (e.g., enforcing Row Level Security so Center A cannot view Center B's students).
*   **Independence:** Fully sovereign backend entirely disconnected from the global YouLearnt database, ensuring absolute control over schema changes.

### 3. Real-Time Communication: Agora.io SDK
*   **Usage:** Natively handling all Audio, Video, and Chat within the virtual classrooms.
*   **Rationale:** Guaranteed scalability, native React Native SDK blocks (eliminating webview hacks), and highly optimized audio-priority routing for low-bandwidth environments.

### 4. Authentication: Firebase Auth (or Supabase Auth)
*   **Requirement:** Strict implementation of Phone-Number-based OTP (One-Time Password).
*   **Note:** While Supabase has SMS capabilities, Firebase Auth is often used alongside Supabase in RN due to its historically robust SMS telecom delivery networks in the MENA region. (Must be validated during Phase 1 testing).

---

## High-Level Architecture Guidelines
*   **Whitelabel Environment Variables:** The entire app must be governed by dynamic environment configurations. A single `.env` file target should be able to flip the app's Logo, Primary Colors, and App Name to deploy a new version for one of the 5 Educational Centers instantly.
*   **Offline-First Tolerance:** Where possible (e.g., viewing past text chats or schedules), data should be cached locally to tolerate momentary connection drops without crashing the UI.
