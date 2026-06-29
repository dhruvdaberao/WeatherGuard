# 🎬 WeatherGuard - 2-Minute Demo Video Script & Walkthrough Guide

This document contains the word-for-word spoken script and exact visual cues for recording your 2-minute take-home assessment submission video for **AI47Labs**.

---

## ⏱️ Video Structure & Timing Overview

| Section | Duration | Key Focus |
| :--- | :---: | :--- |
| **1. Introduction & Architecture** | 0:00 - 0:20 (20s) | Tech stack, live URL, modular engineering design. |
| **2. User Sign-Up & Locked State** | 0:20 - 0:45 (25s) | Social login, pending approval state, security lock overlay. |
| **3. Admin Console Vetting** | 0:45 - 1:15 (30s) | Role-based access control, vetting pending users, approving request. |
| **4. Telegram Integration & Alerts** | 1:15 - 2:00 (45s) | Token linking, bot connection, receiving simulated weather push alert. |

---

## 📝 Word-for-Word Script & Visual Cues

### Section 1: Introduction & Architecture (0:00 - 0:20)

🖥️ **WHAT TO SHOW ON SCREEN:**
- Open your browser to the live production deployment: `https://weather-guard-two.vercel.app`.
- Show the clean landing page with the centered WeatherGuard logo and branding.
- *Optional:* Have your GitHub repository open in an adjacent tab briefly.

🎙️ **WHAT TO SAY:**
> "Hi Awanish and the AI47Labs engineering team! Today I'm presenting **WeatherGuard**, an enterprise-grade, invite-only automated weather intelligence platform built to satisfy your take-home assessment requirements. 
> 
> The system is architected with a modular **NestJS** backend utilizing strict TypeScript interfaces and DTOs, a **MongoDB Atlas** database, and an ultra-responsive **React 18 & Tailwind CSS** frontend. The entire architecture is live and deployed seamlessly on Vercel."

---

### Section 2: User Sign-Up & Locked State (0:20 - 0:45)

🖥️ **WHAT TO SHOW ON SCREEN:**
- Click the **Sign In / Get Started** button on the landing page.
- Log in using a standard user account (or click one of the instant Demo User login options).
- Once landed on the **User Dashboard**, point your cursor to the **"Account Pending Approval"** status badge.
- Hover over the **Your Preferences** and **Telegram Integration** cards to visually demonstrate the sleek frosted-glass **"Feature Locked"** overlays.

🎙️ **WHAT TO SAY:**
> "Let's begin with the onboarding flow. When a new user authenticates via social login, their account is initialized in a strictly guarded **Pending** state. 
> 
> To enforce data security and ensure only approved users consume background API scheduling resources, our NestJS backend locks all preference configurations and integration endpoints. As you can see here, the UI reflects this security layer with frosted feature locks."

---

### Section 3: Admin Console Vetting (0:45 - 1:15)

🖥️ **WHAT TO SHOW ON SCREEN:**
- Open a **New Incognito Window** (or switch browser tabs) where you are logged into the **Admin Console** (`/admin`).
- Show the top header displaying **Admin Console** and the role badge.
- Click on the **Pending Requests** tab on the left sidebar.
- Locate the pending user account you just showed in Section 2.
- Click the bright green **Approve** button next to the user's name. Watch the notification toast confirm success.

🎙️ **WHAT TO SAY:**
> "Now, switching over to the administrative view. I am logged into the protected **Admin Console**, which implements role-based access control ensuring only authenticated administrators can vet users.
> 
> Navigating to the **Pending Requests** queue, we can review the applicant's details. I'll go ahead and click **Approve**. Immediately, the database updates their clearance level, unlocking backend alert dispatchers."

---

### Section 4: Telegram Integration & Automated Alerts (1:15 - 2:00)

🖥️ **WHAT TO SHOW ON SCREEN:**
- Switch back to the normal user browser window from Section 2.
- Refresh the page (or let it auto-update) to show the badge change to green **"Account Approved"** and the lock overlays disappear!
- Click the blue **Connect Telegram** button on the Telegram Integration card.
- In the popup modal, click the copy icon next to `/start WG_...` token.
- Open **Telegram** (web app or desktop app visible on screen) and paste the command `/start WG_...` to **@WeatherGuard_Bot**.
- Show the instant confirmation reply from the bot!
- Switch back to the web app dashboard and click **Send Test Alert**. Switch right back to Telegram to see the live weather alert card arrive instantly!

🎙️ **WHAT TO SAY:**
> "Returning to our user view, the account is instantly verified and unlocked. Let's connect our Telegram bot. 
> 
> Clicking **Connect Telegram** generates a short-lived, 24-hour cryptographic token. I'll copy this command and send it directly to our official Telegram bot. The NestJS webhook controller intercepts this, verifies the JWT token against MongoDB, and permanently links the chat ID.
> 
> Finally, let's trigger an automated alert dispatch. Whether fired periodically via scheduled background cron jobs or manually via our test dispatcher, the system instantly compiles real-time weather metrics and pushes formatted alerts directly to the user's phone. 
> 
> Thank you for reviewing my architectural submission—I look forward to discussing the system implementation in the next interview round!"

---

## 💡 Top Recording Tips for a Perfect Take
1. **Pre-open your tabs:** Have Tab 1 ready at the login page, Tab 2 ready logged into the Admin Console, and Telegram Desktop/Web ready in Tab 3 so you don't waste time loading pages.
2. **Audio Clear & Enthusiastic:** Speak clearly, confidently, and at a moderate pace. Show enthusiasm for clean code and modular design!
3. **Keep it under 2 minutes:** Hiring managers watch dozens of videos; crisp, energetic 1:50 - 2:00 minute videos always stand out best.
