<div align="center">

# WeatherGuard

**Enterprise-grade Weather Intelligence & Automated Telegram Alerts**

*Assignment Project for AI47Labs*

Developed by:<br />
**Dhruv Daberao**<br />
B.Tech Information Technology<br />
PICT Pune

<br />

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Telegram Bot API](https://img.shields.io/badge/Telegram_Bot_API-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)
![OpenWeather API](https://img.shields.io/badge/OpenWeather_API-EB6E4B?style=for-the-badge&logo=openweathermap&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![GitHub OAuth](https://img.shields.io/badge/GitHub_OAuth-181717?style=for-the-badge&logo=github&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

</div>

---

## Project Overview

**WeatherGuard** is an invite-only, enterprise-grade weather intelligence platform designed to deliver personalized, proactive meteorological alerts directly to users via Telegram. Built with a strict security-first authorization model, the application ensures that only vetted and approved users gain access to automated weather monitoring and notification flows.

### User Journey
- **Login via OAuth**: Users securely authenticate using existing Google or GitHub credentials.
- **Request Access**: New registrations are automatically placed in a `PENDING` queue.
- **Configure Weather Preferences**: Users select target geographic cities and specify trigger conditions (e.g., Rain, Thunderstorm, Extreme Temperature).
- **Connect Telegram**: Users link their personal Telegram account via a custom verification token.
- **Receive Automated Alerts**: The scheduled background engine continuously monitors OpenWeather data and dispatches instant notifications when weather criteria match.

### Admin Capabilities
- **Review Requests**: Administrators monitor a dedicated queue of pending user access applications.
- **Approve or Reject Users**: Admins exercise granular control over platform membership, granting or revoking system privileges.
- **Monitor System Activity**: Real-time analytical cards track total users, pending approvals, active Telegram connections, and daily alert volumes.
- **Manage User Access**: Admins can search, filter, and inspect detailed profile status records across the entire user base.

---

## Features

### Authentication
- **Google OAuth**: Seamless identity verification via Google Cloud OAuth 2.0.
- **GitHub OAuth**: Developer-friendly login integration via GitHub OAuth apps.
- **JWT Authentication**: Cryptographically signed JSON Web Tokens for stateless, secure API communication.
- **Secure HttpOnly Cookies**: Protection against Cross-Site Scripting (XSS) by transmitting session tokens strictly through HTTP-only cookies.

### Admin Features
- **Dedicated Admin Login**: Separate secure login gateway specifically isolated from standard user authentication flows.
- **Password-based Admin Authentication**: Direct authentication verified against secure server environment configurations.
- **Pending User Queue**: Dedicated interface highlighting newly registered accounts awaiting authorization.
- **Approve Users**: One-click approval state execution that immediately elevates user status to active.
- **Reject Users**: Access denial mechanism preventing unverified entities from consuming backend API quotas.
- **User Search**: Real-time filtering by user name and email address across large datasets.
- **User Management Dashboard**: Comprehensive tabular overview displaying user roles, connection states, registration timestamps, and administrative actions.

### User Features
- **Save Alert Preferences**: Intuitive interface for selecting specific atmospheric trigger conditions.
- **Profile Management**: Personalized user dashboard displaying account metadata, identity provider details, and system status.
- **City Selection**: Geographic targeting enabling users to specify exact municipal locations for weather tracking.
- **Telegram Integration**: Guided one-click verification flow connecting user web profiles with the WeatherGuard Telegram Bot.
- **Settings Page**: Full control over alert subscriptions, city updates, and integration decoupling.
- **Approval Status Tracking**: Transparent UI banners informing users of their real-time application state (`PENDING`, `APPROVED`, or `REJECTED`).

### Weather Features
- **OpenWeather Integration**: High-precision meteorological data retrieval powered by the OpenWeatherMap API.
- **Continuous 6-Times-Daily Weather Monitoring**: Automated cloud cron engine checking weather states across all configured user cities and delivering regular updates on a 4-hour cycle (6 times daily).
- **Telegram Notifications**: Rich markdown-formatted alert messages delivered instantly to users' Telegram devices.
- **Realtime Manual Test Alerts**: Interactive UI triggers allowing users to fetch live, real-time meteorological conditions for their city and send instant verification alerts on demand.
- **Interactive On-Demand Bot Chat**: Connected users can chat directly with the Telegram bot at any time (e.g., typing `hi`, `/weather`, or `status`) to receive an immediate, real-time live telemetry report without opening the web dashboard.
- **Smart Anti-Spam Protection**: Advanced state-tracking algorithm that limits routine alerts to every ~4 hours while immediately overriding cooldowns if sudden, brand-new severe weather conditions develop.
- **Automated Lifecycle Cleanups**: Automatic decoupling of Telegram bot connections if a user removes their primary city or clears their alert condition preferences.

---

## System Architecture

The following diagram illustrates the complete architectural blueprint and end-to-end lifecycle of an identity session and alert workflow:

```text
User
 ↓
OAuth Authentication
 ↓
MongoDB Atlas
 ↓
PENDING Status
 ↓
Admin Dashboard
 ↓
Approval Workflow
 ↓
APPROVED Status
 ↓
Telegram Connection
 ↓
Weather Scheduler
 ↓
OpenWeather API
 ↓
Telegram Alerts
```

---

## Current Deployment Architecture

WeatherGuard is deployed using a modern, serverless monorepo architecture engineered for optimal performance, automatic scaling, and minimal operational overhead.

- **Frontend**: **React + Vite**  
  Single Page Application (SPA) built with Vite for rapid bundling, optimized tree-shaking, and responsive TailwindCSS styling. Deployed via Vercel Static Build.
- **Backend**: **NestJS (Serverless on Vercel)**  
  Enterprise modular backend compiled into Vercel Serverless Functions (`@vercel/node`), ensuring stateless execution, automatic horizontal scaling, and zero idle resource costs.
- **Scheduling**: **Vercel Cron Jobs**  
  Infrastructure-level scheduled cron triggers configured via `vercel.json` that securely invoke backend scheduler endpoints hourly (`0 * * * *`) to run meteorological checks.
- **Messaging**: **Telegram Webhooks**  
  Bi-directional asynchronous communication leveraging Telegram Bot API webhooks and RESTful dispatchers for real-time notification delivery.
- **Database**: **MongoDB Atlas**  
  Fully managed cloud NoSQL database cluster utilizing Mongoose object modeling for robust schema enforcement, indexing, and high availability.

---

## Scheduling Architecture

The original implementation plan considered `node-cron` as suggested in the assignment requirements. However, to enable a fully serverless architecture and deploy the entire application on a single Vercel project, the scheduling mechanism was migrated to **Vercel Cron Jobs**.

Vercel Cron provides equivalent periodic execution without requiring long-running backend processes or dedicated servers.

The implementation still satisfies all functional requirements by providing:
- ✓ **Automated weather checks**
- ✓ **Periodic task execution**
- ✓ **Preference-based filtering**
- ✓ **Telegram notification delivery**
- ✓ **Anti-spam protections**
- ✓ **Fully automated alert generation**

### Architectural Benefits
- **Single-platform deployment**: Consolidates frontend static assets, serverless APIs, and background tasks under one unified provider.
- **Serverless scalability**: Eliminates idle server costs while scaling execution capacity dynamically on demand.
- **Lower operational complexity**: Removes the need for managing virtual machines, PM2 process managers, or persistent containers.
- **Native Vercel integration**: Configured cleanly via `vercel.json` with built-in execution monitoring and authorization headers.
- **No persistent worker processes required**: Functions execute statelessly and spin down immediately after completing the weather monitoring loop.

*The functional behavior remains identical to a traditional node-cron implementation while being optimized for a serverless deployment environment.*

---

## Database Schema

The application stores all core identity, preference, and analytical state within the `Users` collection hosted on MongoDB Atlas.

### Users Collection Example

```json
{
  "_id": "667ff123456789abcdef0123",
  "name": "Dhruv Daberao",
  "email": "dhruvdaberao@gmail.com",
  "avatar": "https://lh3.googleusercontent.com/a/example_avatar",
  "provider": "google",
  "providerId": "109876543210987654321",
  "role": "USER",
  "status": "APPROVED",
  "city": "Pune",
  "weatherPreferences": ["RAIN", "HIGH_TEMPERATURE", "THUNDERSTORM"],
  "telegramChatId": "987654321",
  "telegramConnected": true,
  "lastAlertSentAt": "2026-06-29T16:00:00.000Z",
  "lastAlertTypes": ["RAIN"],
  "createdAt": "2026-06-28T10:00:00.000Z",
  "updatedAt": "2026-06-29T16:00:00.000Z"
}
```

### Field Explanations
- `_id`: Unique primary key object identifier generated automatically by MongoDB.
- `name`: Full display name retrieved from the OAuth provider (Google/GitHub).
- `email`: Primary contact email associated with the OAuth identity.
- `avatar`: HTTPS URL pointing to the user's profile picture hosted by the identity provider.
- `provider`: Authentication strategy utilized during account inception (`google` or `github`).
- `providerId`: Unique immutable subject identifier issued by the OAuth authorization server.
- `role`: Access tier defining platform privileges (`USER` or `ADMIN`).
- `status`: Authorization gate state determining platform functionality (`PENDING`, `APPROVED`, or `REJECTED`).
- `city`: Target municipal location configured by the user for automated weather monitoring.
- `weatherPreferences`: Array of subscribed meteorological alert strings (e.g., `RAIN`, `SNOW`, `HIGH_TEMPERATURE`).
- `telegramChatId`: Unique numerical chat ID bound to the user's Telegram messaging account upon verification.
- `telegramConnected`: Boolean flag confirming whether the Telegram verification handshake successfully completed.
- `lastAlertSentAt`: ISO 8601 timestamp recording the exact moment the previous automated notification was dispatched.
- `lastAlertTypes`: Array of weather condition strings triggered during the most recent alert cycle, utilized by the anti-spam algorithm.
- `createdAt`: Timestamp recording initial account creation.
- `updatedAt`: Timestamp reflecting the most recent modification to the user's document.

---

## Approval Workflow

To safeguard external API quotas and ensure strict access governance, WeatherGuard enforces an immutable approval gate.

```text
User: Google/GitHub Login
 ↓
Status: PENDING
 ↓
Admin Dashboard
 ↓
Approve User
 ↓
Status: APPROVED
 ↓
Telegram Connected
 ↓
Weather Alerts Enabled
```

### Authorization Logic
The background weather evaluation engine strictly checks database conditions before processing any user account. Automated meteorological queries and Telegram notifications are **ONLY sent if**:

$$\text{status} \equiv \text{APPROVED} \quad \land \quad \text{telegramConnected} \equiv \text{true}$$

If a user's account is marked as `PENDING` or `REJECTED`, the scheduler automatically bypasses their record during the evaluation loop, guaranteeing zero external API consumption or alert transmission for unverified users.

---

## Data Flow

The following data pipeline illustrates how user preferences, background schedulers, external weather data, and messaging APIs interact:

```text
User
 ↓
Save Preferences
 ↓
MongoDB Atlas
 ↓
Vercel Cron
 ↓
OpenWeather API
 ↓
Weather Matching Engine
 ↓
Telegram Service
 ↓
Notification Sent
```

### Pipeline Mechanisms
- **Approved-user Restrictions**: When Vercel Cron triggers the hourly schedule, the backend queries MongoDB specifically for users matching `status: 'APPROVED'` and `telegramConnected: true`.
- **Preference Filtering**: For each qualified user, the engine fetches real-time meteorological conditions for their configured `city` from OpenWeather API and parses the temperature, wind speed, rain accumulation, and atmospheric codes against the user's `weatherPreferences`.
- **Anti-Spam Protection**: To avoid alert fatigue, the matching engine cross-references matching conditions against `lastAlertTypes` and `lastAlertSentAt`. A notification is only dispatched if a **new** weather condition arises or if more than 24 hours have elapsed since the previous notification.

---

## Project Structure

WeatherGuard is structured as a unified enterprise monorepo housing frontend, backend, and cloud orchestration configuration.

```text
weatherguard/
├── admin/                     # Frontend SPA (React + Vite + TypeScript)
│   ├── public/                # Static visual assets and icons
│   ├── src/
│   │   ├── components/        # Reusable UI widgets (Cards, Tables, Modals)
│   │   ├── pages/             # Core route views (LoginPage, DashboardPage, AdminDashboardPage)
│   │   ├── services/          # Axios HTTP client and API endpoints
│   │   └── types/             # Shared TypeScript domain interfaces
│   ├── package.json           # Frontend dependency manifest
│   └── vite.config.ts         # Vite bundler and proxy configuration
│
├── api/                       # Backend Application (NestJS + TypeScript)
│   ├── src/
│   │   ├── admin/             # Administrative analytics and management controllers
│   │   ├── auth/              # OAuth strategies, Passport guards, and JWT services
│   │   ├── scheduler/         # Cron execution engine and scheduled task handlers
│   │   ├── telegram/          # Telegram Bot messaging service and verification webhooks
│   │   ├── users/             # User domain CRUD operations and schema definitions
│   │   ├── weather/           # OpenWeather HTTP client and preference matching algorithms
│   │   ├── app.module.ts      # Root NestJS dependency injection container
│   │   └── main.ts            # Application bootstrap and serverless entry point
│   ├── package.json           # Backend dependency manifest
│   └── tsconfig.json          # TypeScript compiler configuration
│
├── vercel.json                # Vercel cloud routing, serverless compilation, and cron schedules
└── README.md                  # Comprehensive production project documentation
```

### Major Modules
- **`auth`**: Handles Google/GitHub OAuth handshakes, validates admin login credentials, issues secure JWTs, and attaches HttpOnly cookies.
- **`users`**: Manages profile persistence, city preference updates, approval status transitions, and Telegram account decoupling.
- **`admin`**: Provides analytical aggregations and privileged administrative actions (approving/rejecting user queues).
- **`weather`**: Encapsulates external OpenWeather API communication, temperature Kelvin-to-Celsius conversion, and condition threshold evaluation.
- **`telegram`**: Operates the Telegram Bot API client, formats markdown dispatch messages, and handles verification token linking.
- **`scheduler`**: Exposes secure endpoints executed by serverless cron timers to iterate over approved users and trigger notifications.

---

## Local Development Setup

Follow these exact instructions to spin up the complete full-stack environment locally on your workstation.

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB instance or active MongoDB Atlas cluster URI

### Frontend Setup
Open your terminal and execute the following commands to launch the React development server:

```bash
cd admin
npm install
npm run dev
```
*The frontend interface will be accessible locally at `http://localhost:5173`.*

### Backend Setup
Open a second terminal window and execute the following commands to initialize the NestJS API server:

```bash
cd api
npm install
npm run start:dev
```
*The backend API will run in watch mode at `http://localhost:3000`.*

---

## Environment Variables

Create a `.env` file inside the `weatherguard/api/` directory containing the configuration keys below. Every variable is essential for full platform operation.

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weatherguard
JWT_SECRET=super_secret_jwt_signing_key_change_in_production
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
ADMIN_PASSWORD=secure_admin_password_123
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
CRON_SECRET=super_secure_cron_authentication_token
FRONTEND_URL=http://localhost:5173
```

### Variable Explanations
- `MONGODB_URI`: Connection string for MongoDB Atlas database storage.
- `JWT_SECRET`: Cryptographic secret key used to sign and verify user authentication tokens.
- `GOOGLE_CLIENT_ID`: Client identifier generated in Google Cloud Console for OAuth 2.0 web authentication.
- `GOOGLE_CLIENT_SECRET`: Client secret token corresponding to the Google OAuth application.
- `GITHUB_CLIENT_ID`: Client ID obtained from GitHub Developer Settings for OAuth login.
- `GITHUB_CLIENT_SECRET`: Client secret token corresponding to the GitHub OAuth application.
- `ADMIN_PASSWORD`: Master password required for administrators to log into the dedicated Admin Console.
- `TELEGRAM_BOT_TOKEN`: API token issued by `@BotFather` used to authenticate requests to the Telegram Bot API.
- `OPENWEATHER_API_KEY`: API authorization key issued by OpenWeatherMap for accessing global meteorological data.
- `CRON_SECRET`: Security token passed as a Bearer header to authenticate automated requests from Vercel Cron Jobs.
- `FRONTEND_URL`: Base URL of the client application used to configure Cross-Origin Resource Sharing (CORS) and post-OAuth redirect targets.

---

## Deployment

WeatherGuard is configured for streamlined, single-project cloud deployment on Vercel.

### Current Deployment Architecture
- **Single-project Vercel deployment**: Both frontend static assets and backend serverless functions reside within a unified Vercel project container governed by `vercel.json`.
- **Frontend**: **React + Vite** compiled into optimized static HTML/CSS/JS bundles served via global CDN edge networks.
- **Backend**: **NestJS Serverless Functions** compiled dynamically into `@vercel/node` AWS Lambda execution units handling route paths matching `/api/(.*)`.
- **Scheduler**: **Vercel Cron Jobs** automatically configured to hit `/api/cron/weather` every hour (`0 * * * *`).
- **Telegram**: **Webhooks** transmitting outbound messages securely over HTTPS directly to user chat IDs.
- **Database**: **MongoDB Atlas** cloud database cluster providing persistent data storage across serverless function invocations.

### Deployment Steps
1. **Repository Push**: Commit and push the entire monorepo structure to a GitHub repository.
2. **Import in Vercel**: Connect your GitHub account to Vercel and import the repository as a new project.
3. **Configure Root Directory**: Leave the root directory set to the project root (`./`). The build configuration automatically handles subdirectory installation and compilation.
4. **Environment Variables**: Add all required environment variables (`MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `TELEGRAM_BOT_TOKEN`, `OPENWEATHER_API_KEY`, etc.) inside the Vercel Project Settings dashboard. Update `FRONTEND_URL` to match your production Vercel domain.
5. **Update OAuth Redirect URIs**: Register your live production callback URIs inside Google Cloud Console and GitHub Developer Settings:
   - `https://your-app.vercel.app/api/auth/google/callback`
   - `https://your-app.vercel.app/api/auth/github/callback`
6. **Deploy**: Trigger production deployment. Vercel automatically deploys the frontend SPA, initializes backend API serverless endpoints, and activates the background cron scheduler.

---

## Screenshots Section

| Login Page | Admin Dashboard |
| :---: | :---: |
| ![Login Page](./admin/public/quirky-child-weather.png) | ![Admin Dashboard](./admin/public/quirky-child-weather.png) |

| Pending Approval | Profile Page |
| :---: | :---: |
| ![Pending Approval](./admin/public/quirky-child-weather.png) | ![Profile Page](./admin/public/quirky-child-weather.png) |

| Telegram Connection | Weather Alerts |
| :---: | :---: |
| ![Telegram Connection](./admin/public/quirky-child-weather.png) | ![Weather Alerts](./admin/public/quirky-child-weather.png) |

*(Note: Screenshots represent placeholders for visual documentation of active platform user interfaces.)*

---

## Demo Video

Watch the comprehensive 2-minute video walkthrough demonstrating end-to-end system capabilities:

### Video Demonstration Highlights
1. **User Login**: Demonstrating instant authentication via Google and GitHub OAuth providers.
2. **Request Access**: Inspecting the registration flow and the immediate transition into the `PENDING` queue.
3. **Save Preferences**: Navigating the user dashboard to select target municipal cities and meteorological alert triggers.
4. **Admin Approval**: Logging into the dedicated Admin Console, reviewing user records, and executing one-click approval authorization.
5. **Telegram Connection**: Connecting an approved user profile to the Telegram Bot via automated token verification.
6. **Weather Alert Delivery**: Triggering instant meteorological evaluations and showcasing live, markdown-formatted weather notifications arriving on Telegram.

📺 **[Watch the 2-Minute Demo Video on YouTube](#)** *(Placeholder link for assignment submission video)*

---

## Contact

**Developer:** Dhruv Daberao  
**GitHub:** [https://github.com/dhruvdaberao](https://github.com/dhruvdaberao)  
**LinkedIn:** [https://linkedin.com/in/dhruvdaberao](https://linkedin.com/in/dhruvdaberao)  
**Email:** [dhruvdaberao@gmail.com](mailto:dhruvdaberao@gmail.com)

---

## License

**MIT License**

Developed as part of an engineering assignment submission for **AI47Labs**.  
*Copyright (c) 2026 Dhruv Daberao. All rights reserved.*
