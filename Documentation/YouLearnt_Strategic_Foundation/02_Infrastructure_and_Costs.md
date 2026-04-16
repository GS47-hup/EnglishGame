# 02. Infrastructure & Costs Analysis

> **Context for Future AI Agents:** This document details the specific mathematics, architecture choices, and hidden costs regarding real-time video streaming, specifically comparing the global platform's use of BigBlueButton against the mobile app's use of Agora.io.

## BigBlueButton vs. Agora SDK

### 1. BigBlueButton (The Global Web Choice)
*   **What it is:** A free, open-source web conferencing framework built natively for HTML5/Browsers.
*   **Built for Web:** It is essentially an "Online School in a Box" (comes with built-in whiteboards, teacher controls, and breakout rooms natively). No downloads are required on computers.
*   **Cost Mechanics ($$):** Because it is open-source, the software is free. However, computing live video is expensive. The global team must rent raw servers (e.g., AWS/DigitalOcean). At massive scale, renting a 20-server cluster ($4,000/mo) is drastically cheaper than paying API companies per minute.
*   **The Hidden "DevOps" Cost:** BigBlueButton requires a dedicated Systems Administrator (DevOps Engineer) costing $3,000–$5,000/mo to monitor the cluster, balance server loads (via Scalelite), and restart servers when CPUs max out.
*   **Why we reject it for Mobile:** It does not have clean Native iOS/Android SDKs. Wrapping BigBlueButton into a mobile app requires unstable "webviews." It is incredibly hostile to mobile-first development.

### 2. Agora SDK (The Mobile App Choice)
*   **What it is:** A global Platform-as-a-Service (PaaS) providing native API components for React Native real-time communication.
*   **Cost Mechanics ($$$):** Agora charges per minute of usage. (Audio: ~$0.99/1000 min, Video: ~$3.99/1000 min).
*   **The Math (3,000 Concurrent Students Example):**
    *   3,000 students × 20 hours/month = 60,000 hours (3.6 million minutes).
    *   3.6M / 1000 × $3.99 = **~$14,300 / month.**
*   **Why we chose it despite the cost:**
    *   **Zero DevOps:** For $14k/mo, Agora handles global latency, server crashes, and scaling perfectly. We do not need to hire a $5,000/mo DevOps engineer or manage a 20-server cluster.
    *   **Native Mobile Blocks:** It integrates perfectly into React Native, avoiding App Store rejections related to webviews.
    *   **Startup Friendly:** For the initial launch (100–500 users), Agora is insanely cheap (first 10,000 minutes per month are mostly free).

## Cost of Building the Global Platform
For context, building a platform like the global YouLearnt site with self-hosted BigBlueButton is an enterprise task.
*   **Initial Build:** Offshore teams would charge $25k–$45k. Western Agencies would charge $100k–$150k+.
*   **Maintenance:** The hidden cost of server rent, DevOps administration, and constant web library updates bleeds the company for **$3,500 to $10,000+ every single month** just to keep the lights on.
*   Our app avoids this heavy upfront infrastructure burn by utilizing serverless architecture (Supabase) and PaaS (Agora).
