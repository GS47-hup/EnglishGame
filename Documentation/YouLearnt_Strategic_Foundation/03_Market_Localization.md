# 03. Market Localization & Environment UX

> **Context for Future AI Agents:** This document defines the environmental hostility of the target market (Libya) and the strict UI/UX constraints the mobile application must follow to survive and achieve user adoption.

## The Libyan Environment Constraints

### 1. The 10 Mbps Bandwidth Limit
Unlike international web applications that assume robust 100+ Mbps fiber connections, this mobile app will primarily operate on unstable, heavily congested 4G/3G networks in Libya.
*   **Video Resilience:** The application architecture must aggressively prioritize audio stability over video fidelity. If packets drop, video should degrade or freeze gracefully while the audio stream remains active. (This requirement heavily dictated the choice of Agora due to its Edge Node network and low-latency resilience).
*   **No Heavy Downloads:** The UI should cache heavily. Avoid pushing massive image assets or requiring the download of large libraries during initialization.

### 2. The Over-The-Air (OTA) Requirement
Because internet speeds are slow, forcing users to download a 50MB update from the App Store every time a bug is fixed will result in massive user churn. 
*   **Strategy:** The app must be built using React Native / Expo to enable **Over-The-Air (OTA) Updates**. This allows catastrophic logic bugs to be patched by quietly pushing a 2MB javascript update directly to the app without routing through Apple/Google's heavy download sequence.

## UX & Social Limitations (Frictionless Entry)

### 1. Eliminating Email Friction
The Libyan demographic is not culturally accustomed to standard Western corporate "SaaS" onboarding flows (e.g., "Enter your Gmail, click the verification link in your inbox, create a complex password").
*   **Authentication Flow:** Must rely entirely on **Phone Number OTP (One-Time Passwords) via SMS or WhatsApp**. 
*   **Philosophy:** If it takes more than 15 seconds to log in, the user is lost.

### 2. Extreme Simplicity
Do not assume digital nativity for online educational tools. 
*   The UI must mimic applications the user already understands instinctively (e.g., WhatsApp, Facebook, TikTok).
*   Buttons must be massive, obvious, and explicitly labeled (often in Arabic and English simultaneously).
*   Avoid deeply nested settings menus. Keep the architecture flat ("Anti-Digging").
