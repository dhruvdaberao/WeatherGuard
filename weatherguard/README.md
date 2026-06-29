<div align="center">

# WeatherGuard

**Enterprise-grade weather intelligence and automated Telegram alerts.**

Assignment Project for AI47Labs. <br />
Designed and developed by **Dhruv Daberao**.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)
![OpenWeather](https://img.shields.io/badge/OpenWeather-EB6E4B?style=for-the-badge&logo=openweathermap&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

<br />

## 🔗 Live Links
- **Live Frontend**: [https://weatherguard-admin.vercel.app](#) *(Placeholder)*
- **API Base URL**: [https://weatherguard-api.vercel.app](#) *(Placeholder)*
- **Demo Video**: [Watch on YouTube](#) *(Placeholder)*

---

## ✨ Features

### Authentication
- Seamless **Google OAuth** and **GitHub OAuth** integration.
- Secure HTTP-only cookies and JWT-based session management.

### Admin Capabilities
- **Separate Admin Portal**: Secure login for platform administrators.
- **Pending User Management**: Review and authorize new access requests.
- **Approve/Reject Workflow**: Granular control over platform access.
- **Analytics Dashboard**: Real-time metrics on connected users and alert volume.
- **Search & Filters**: Easily navigate the user database.

### User Features
- **City Preferences**: Define your exact geographic location.
- **Weather Alerts**: Granular selection of alerts (Rain, Thunderstorm, Severe Weather, etc.).
- **Telegram Connection**: Link your personal Telegram account securely.
- **Profile Management**: Update your details and sync preferences instantly.

### Weather Engine
- **OpenWeather Integration**: Highly accurate global weather data.
- **Automated Weather Checks**: Scheduled background engine runs hourly.
- **Telegram Notifications**: Real-time push alerts delivered to your phone.
- **Manual Test Alerts**: Instantly verify your connection.
- **Anti-Spam Protection**: Intelligent throttling prevents duplicate notifications for the same weather condition.

---

## 🛠 Tech Stack

### Frontend
- **React**: Component-based UI architecture.
- **TypeScript**: Strict type safety.
- **TailwindCSS**: Utility-first, responsive styling.
- **TanStack Query**: Optimized data fetching and state synchronization.
- **React Router**: Client-side routing.
- **Lucide Icons**: Clean, scalable vector iconography.

### Backend
- **NestJS**: Highly scalable Node.js framework.
- **TypeScript**: End-to-end type safety.
- **Passport & JWT**: Secure authentication strategies.
- **MongoDB & Mongoose**: Flexible, schema-driven NoSQL database.

### Integrations
- Google OAuth 2.0
- GitHub OAuth
- Telegram Bot API
- OpenWeather API

---

## 🏗 System Architecture

```ascii
     User Request
          ↓
     OAuth Login
          ↓
 MongoDB User Record
          ↓
   Pending Approval
          ↓
   Admin Dashboard
          ↓
    Approved User
          ↓
 Telegram Connection
          ↓
  Weather Scheduler
          ↓
 OpenWeather API
          ↓
  Telegram Alert
```

---

## 🗄 Database Design

WeatherGuard uses MongoDB Atlas. The core of the application revolves around the `Users` collection.

### Users Collection

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "provider": "google",
  "providerId": "123456789",
  "avatar": "https://example.com/avatar.jpg",
  "role": "USER",
  "status": "APPROVED",
  "city": "Pune",
  "weatherPreferences": ["RAIN", "HIGH_TEMPERATURE"],
  "telegramChatId": "987654321",
  "telegramConnected": true,
  "lastAlertSentAt": "2026-06-29T10:00:00Z",
  "lastAlertTypes": ["RAIN"],
  "createdAt": "2026-06-28T10:00:00Z",
  "updatedAt": "2026-06-29T10:00:00Z"
}
```

#### Field Explanations:
- `provider` / `providerId`: Securely links the OAuth identity provider.
- `role`: Distinguishes between standard users and platform administrators.
- `status`: Enforces the authorization gate (`PENDING`, `APPROVED`, `REJECTED`).
- `city`: The geographic target for weather checks.
- `weatherPreferences`: Array of weather conditions the user subscribes to.
- `telegramChatId` / `telegramConnected`: Validates the active Telegram webhook link.
- `lastAlertSentAt` / `lastAlertTypes`: Core fields powering the Anti-Spam engine, tracking previous alert states.

---

## 🛡 User Approval Workflow

WeatherGuard employs a strict authorization gate. Creating an account does **not** grant immediate access to the weather engine.

1. **User Login**: User authenticates via Google/GitHub.
2. **Request Access**: User status is set to `PENDING`.
3. **Admin Dashboard**: Administrator reviews the pending request.
4. **Approve User**: Admin grants access; status updates to `APPROVED`.
5. **Telegram Connection**: The approved user can now link their Telegram account.
6. **Alerts Enabled**: The Weather Engine activates for this user.

**Security Rule**: The scheduler strictly verifies that `status == APPROVED` **AND** `telegramConnected == true` before executing weather checks.

---

## 🔄 Data Flow

```ascii
 User Saves Preferences
          ↓
  Updates MongoDB Record
          ↓
 Vercel Hourly Scheduler
          ↓
 Fetches OpenWeather API
          ↓
 Preference Matching Engine
          ↓
 Anti-Spam Validation
          ↓
 Telegram Webhook Notification
```

### Flow Highlights
- **Preference Filtering**: The matching engine cross-references live weather data against the user's specific `weatherPreferences` array.
- **Approved-user Restrictions**: Queries ignore any unapproved accounts to conserve API limits.
- **Anti-Spam Validation**: The system checks `lastAlertSentAt` and `lastAlertTypes` to suppress duplicate notifications unless weather conditions change or 24 hours have passed.

---

## 📂 Project Structure

WeatherGuard operates as a monorepo containing distinct frontend and backend environments.

```text
weatherguard/
├── admin/                     # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route views (Dashboard, Admin, etc.)
│   │   ├── services/          # API & Axios configuration
│   │   └── types/             # Shared TypeScript definitions
│   ├── package.json
│   └── vite.config.ts
│
├── api/                       # NestJS Backend
│   ├── src/
│   │   ├── admin/             # Admin logic & analytics
│   │   ├── auth/              # OAuth & JWT strategies
│   │   ├── scheduler/         # Vercel Cron endpoints
│   │   ├── telegram/          # Webhook handling
│   │   ├── users/             # User management
│   │   ├── weather/           # OpenWeather engine
│   │   ├── app.module.ts      # Root dependency injection
│   │   └── main.ts            # Serverless bootstrap entry
│   ├── package.json
│   └── tsconfig.json
│
└── vercel.json                # Single-repo deployment config
```

---

## ⚙️ Local Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/dhruvdaberao/weatherguard.git
cd weatherguard
```

### Step 2: Frontend Setup
```bash
cd admin
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

### Step 3: Backend Setup
```bash
cd ../api
npm install
npm run start:dev
```
*Backend runs on `http://localhost:3000`*

### Step 4: Environment Variables
Create a `.env` file in the `/api` directory using the reference below.

---

## 🔐 Environment Variables

```env
# Database
MONGODB_URI=mongodb+srv://...           # MongoDB Atlas Connection String

# Authentication
JWT_SECRET=your_jwt_secret_here         # Secret key for signing JWTs
ADMIN_PASSWORD=your_admin_password      # Password for the admin portal

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_id         # Google Cloud Console Credentials
GOOGLE_CLIENT_SECRET=your_google_secret
GITHUB_CLIENT_ID=your_github_id         # GitHub Developer Settings
GITHUB_CLIENT_SECRET=your_github_secret

# External APIs
TELEGRAM_BOT_TOKEN=your_bot_token       # From Telegram BotFather
OPENWEATHER_API_KEY=your_weather_key    # From OpenWeatherMap

# Infrastructure
CRON_SECRET=your_cron_secret            # Secures the Vercel cron endpoint
FRONTEND_URL=http://localhost:5173      # CORS & Redirect target
```

---

## 🚀 Deployment

WeatherGuard is architected for zero-configuration deployment on Vercel as a single repository.

- **Frontend**: Deployed via `@vercel/static-build` (React/Vite).
- **Backend**: Deployed via `@vercel/node` Serverless Functions (NestJS).
- **Database**: Hosted globally on MongoDB Atlas.

A `vercel.json` file in the root directory manages routing and cron jobs automatically.

---

## 📸 Screenshots

- **Login Page**  
  ![Login Page](#) *(Placeholder)*
- **Admin Dashboard**  
  ![Admin Dashboard](#) *(Placeholder)*
- **Pending Approval**  
  ![Pending Approval](#) *(Placeholder)*
- **Profile Page**  
  ![Profile Page](#) *(Placeholder)*
- **Telegram Connection**  
  ![Telegram Connection](#) *(Placeholder)*
- **Weather Alerts**  
  ![Weather Alerts](#) *(Placeholder)*

---

## 🎬 Demo Video

Watch the complete demonstration showcasing:
1. Google/GitHub Login
2. Requesting Platform Access
3. Admin Approval Workflow
4. Saving Weather Preferences
5. Linking a Telegram Account
6. Live Weather Alert Delivery

📺 **[Click here to watch the Demo Video](#)** *(Placeholder)*

---

## 📬 Contact

**Developer:** Dhruv Daberao  
**GitHub:** [https://github.com/dhruvdaberao](https://github.com/dhruvdaberao)  
**LinkedIn:** [https://linkedin.com/in/dhruvdaberao](https://linkedin.com/in/dhruvdaberao)  
**Email:** [dhruvdaberao@gmail.com](mailto:dhruvdaberao@gmail.com)

---

## 📄 License

This project was developed as part of an engineering assignment submission for **AI47Labs**.  
*For demonstration and educational purposes only.*
