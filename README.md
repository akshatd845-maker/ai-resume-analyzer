<div align="center">

<img src="https://raw.githubusercontent.com/akshatd845-maker/ai-resume-analyzer/master/frontend/public/favicon.svg" alt="AI Resume Analyzer" width="80" height="80" />

# AI Resume Analyzer

**Turn your resume into an interview-winning document — powered by AI.**

Analyze, score, and optimize your resume against real job listings with ATS intelligence, keyword matching, and OpenAI-powered suggestions. Built for job seekers who want a competitive edge.

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-8B5CF6.svg?style=for-the-badge)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com)

<br />

[![GitHub Stars](https://img.shields.io/github/stars/akshatd845-maker/ai-resume-analyzer?style=flat-square&color=8B5CF6)](https://github.com/akshatd845-maker/ai-resume-analyzer/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/akshatd845-maker/ai-resume-analyzer?style=flat-square&color=6D28D9)](https://github.com/akshatd845-maker/ai-resume-analyzer/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/akshatd845-maker/ai-resume-analyzer?style=flat-square&color=EF4444)](https://github.com/akshatd845-maker/ai-resume-analyzer/issues)
[![Last Commit](https://img.shields.io/github/last-commit/akshatd845-maker/ai-resume-analyzer?style=flat-square&color=22C55E)](https://github.com/akshatd845-maker/ai-resume-analyzer/commits/master)
[![Repo Size](https://img.shields.io/github/repo-size/akshatd845-maker/ai-resume-analyzer?style=flat-square&color=F59E0B)](https://github.com/akshatd845-maker/ai-resume-analyzer)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?style=flat-square&logo=cloudinary)](https://cloudinary.com)
[![Google OAuth](https://img.shields.io/badge/OAuth-Google-4285F4?style=flat-square&logo=google)](https://developers.google.com/identity)

</div>

---

## 🛠️ Tech Stack

<div align="center">

[![My Skills](https://skillicons.dev/icons?i=react,vite,tailwind,js,nodejs,express,mongodb,git,github,vscode,postman,cloudinary,openai,html,css&perline=8)](https://skillicons.dev)

</div>

---

## 📖 About

Most job seekers submit resumes without knowing how applicant tracking systems (ATS) parse and score them. Recruiters never see a resume that gets filtered out by software before human eyes touch it.

**AI Resume Analyzer** solves this by giving every job seeker access to the same intelligence that enterprise HR platforms use — combined with large language model analysis — entirely in the browser.

Upload a PDF resume once. Within seconds you receive:

- A numeric **ATS score** across multiple categories (keywords, formatting, content, experience, education)
- **AI-generated strengths, weaknesses, and prioritized improvement suggestions** powered by GPT-4o-mini
- **Keyword gap analysis** against real job listings
- **Skill extraction** from your resume content
- **Personalized job matching** ranked by compatibility percentage

**Target users:** Recent graduates, career changers, and active job seekers who want a data-driven edge in competitive hiring markets.

---

## ✨ Features

| Feature | Description | Status |
|---|---|---|
| 🔐 JWT Authentication | Stateless Bearer token auth with 7-day expiry | ✅ |
| 🔑 Google OAuth 2.0 | One-click sign-in via Google, one-time code exchange | ✅ |
| 📄 Resume Upload | PDF upload with Cloudinary storage, size & type validation | ✅ |
| 🔍 Resume Parsing | Extracts text, skills, experience, and education from PDF | ✅ |
| 🤖 AI Analysis | GPT-4o-mini generates strengths, weaknesses, suggestions | ✅ |
| 📊 ATS Scoring | Multi-category ATS score: keywords, formatting, content, experience | ✅ |
| 🎯 Keyword Matching | Detects keyword gaps vs. job descriptions | ✅ |
| 🧠 Skill Extraction | Parses and categorizes skills from resume content | ✅ |
| 💼 Job Matching | AI-ranked job recommendations with compatibility % | ✅ |
| 📈 Dashboard | KPI cards, recent resumes, AI summary, job matches overview | ✅ |
| 👤 Profile Management | Update name, email, avatar upload | ✅ |
| 🔒 Password Reset | Token-based forgot/reset password flow | ✅ |
| 🛡️ Protected Routes | Frontend and backend route guards by role | ✅ |
| 👑 Admin Panel | Admin dashboard with elevated access controls | ✅ |
| 📱 Responsive Design | Full mobile layout with animated sidebar | ✅ |


---

## 🏗️ Architecture

```mermaid
flowchart TD
    A["🌐 React 19 Frontend\n(Vite · Tailwind CSS v4)"] --> B

    B["🔀 REST API\n/api — Express 5"]

    B --> C["🔐 Auth Layer\nJWT · Google OAuth 2.0\nPassport.js · bcryptjs"]
    B --> D["📄 Resume Service\nPDF Parse · Cloudinary\nMulter Upload"]
    B --> E["🤖 AI Service\nOpenAI GPT-4o-mini\nATS Engine"]
    B --> F["💼 Job Service\nMatching · Ranking\nKeyword Analysis"]
    B --> G["📊 Dashboard Service\nAggregation · KPIs"]

    C --> H[("🍃 MongoDB Atlas")]
    D --> H
    E --> H
    F --> H
    G --> H

    D --> I["☁️ Cloudinary\nFile Storage"]
    E --> J["🧠 OpenAI API\nGPT-4o-mini"]

    style A fill:#1e1b4b,stroke:#8B5CF6,color:#fff
    style B fill:#111827,stroke:#6D28D9,color:#fff
    style H fill:#14532d,stroke:#22C55E,color:#fff
    style I fill:#1e3a5f,stroke:#3B82F6,color:#fff
    style J fill:#1a1033,stroke:#A78BFA,color:#fff
```

---

## 📁 Folder Structure

<details>
<summary><strong>Click to expand full project tree</strong></summary>

```
ai-resume-analyzer/
│
├── backend/                        # Node.js / Express 5 API
│   ├── server.js                   # Entry point — connects DB and starts server
│   ├── src/
│   │   ├── app.js                  # Express app, middleware stack
│   │   ├── config/
│   │   │   ├── database.js         # Mongoose connection
│   │   │   ├── passport.js         # Google OAuth strategy
│   │   │   ├── security.config.js  # Rate limits, CORS, upload rules
│   │   │   └── corsConfig.js       # Origin whitelist
│   │   ├── controllers/            # Route handlers (thin layer)
│   │   ├── services/               # Business logic
│   │   │   ├── ai.service.js       # OpenAI integration
│   │   │   ├── ats.service.js      # ATS scoring engine
│   │   │   ├── analysis.service.js # Orchestrates AI + ATS
│   │   │   ├── jobMatching.service.js # Resume ↔ job ranking
│   │   │   ├── parser.service.js   # PDF text extraction
│   │   │   └── resume.service.js   # Upload, CRUD, Cloudinary
│   │   ├── models/                 # Mongoose schemas
│   │   ├── routes/                 # Express routers
│   │   ├── middleware/             # Auth, upload, validation, error
│   │   ├── validators/             # express-validator chains
│   │   └── utils/                  # JWT, ApiError, ApiResponse, helpers
│   ├── scripts/
│   │   ├── seed-jobs.js            # Seed job listings
│   │   └── seed-admin.js           # Create admin user
│   └── tests/                      # Jest integration + unit tests
│
└── frontend/                       # React 19 + Vite SPA
    └── src/
        ├── app/
        │   ├── layouts/            # AppLayout, AuthLayout, RootLayout
        │   ├── providers/          # AuthProvider, QueryProvider, SidebarProvider
        │   └── router/             # Protected, Guest, Admin route guards
        ├── components/
        │   ├── ui/                 # shadcn-style primitives (Button, Card, Badge…)
        │   ├── common/             # EmptyState, StatCard, PageHeader…
        │   ├── auth/               # AuthCard, BrandPanel, PasswordStrength…
        │   └── layout/             # AppSidebar, TopNav, UserMenu
        ├── features/               # Feature-sliced modules
        │   ├── auth/               # Login, Register, ForgotPassword, ResetPassword
        │   ├── dashboard/          # KPI cards, hero, job matches, AI summary
        │   ├── resume/             # Upload zone, list, preview panel, analysis panel
        │   ├── analysis/           # ATS score card, improvement timeline, insights
        │   ├── jobs/               # Job grid, filters, details panel, matching
        │   ├── profile/            # Profile settings, password change
        │   ├── admin/              # Admin dashboard
        │   └── common/             # Home page, 404
        ├── services/               # API client (axios), auth storage
        ├── styles/                 # globals.css — Tailwind v4 design tokens
        └── lib/                    # utils, auth-schemas (Zod)
```

</details>


---

## 🧩 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend Framework** | React | 19 |
| **Build Tool** | Vite | 8 |
| **Styling** | Tailwind CSS | 4 |
| **UI Primitives** | Radix UI | 1.6 |
| **Animations** | Framer Motion | 12 |
| **Data Fetching** | TanStack Query | 5 |
| **Forms** | React Hook Form + Zod | 7 / 4 |
| **Charts** | Recharts | 3 |
| **Routing** | React Router DOM | 7 |
| **Toast** | Sonner | 2 |
| **Backend Framework** | Express | 5 |
| **Runtime** | Node.js | 18+ |
| **Database** | MongoDB + Mongoose | 9 |
| **Authentication** | JWT + Passport.js | — |
| **OAuth** | Google OAuth 2.0 | — |
| **Password Hashing** | bcryptjs | 3 |
| **AI Engine** | OpenAI (GPT-4o-mini) | 6 |
| **PDF Parsing** | pdf-parse | 2 |
| **File Storage** | Cloudinary | 1.41 |
| **Validation** | express-validator | 7 |
| **Security** | Helmet, HPP, Rate Limit | — |
| **Testing** | Jest + Supertest | 30 / 7 |
| **Linting** | OXLint | 1 |

---

## 🚀 Installation

### Prerequisites

- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- OpenAI API key
- Google Cloud Console project with OAuth 2.0 credentials

---

### 1. Clone the Repository

```bash
git clone https://github.com/akshatd845-maker/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

**Backend** — copy and fill in `.env`:

```bash
cp backend/.env.example backend/.env
```

**Frontend** — create `.env.local`:

```bash
cp frontend/.env.example frontend/.env.local
```

### 5. Seed the Database (optional)

```bash
# From backend/
npm run seed:jobs    # Seed job listings
npm run seed:admin   # Create admin user (set ADMIN_EMAIL + ADMIN_PASSWORD in .env first)
```

### 6. Run the Backend

```bash
cd backend
npm run dev          # Development with nodemon
# or
npm start            # Production
```

### 7. Run the Frontend

```bash
cd frontend
npm run dev
```

The app is now running at:
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000/api`


---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required | Example |
|---|---|---|---|
| `PORT` | Server port | ✅ | `5000` |
| `NODE_ENV` | Runtime environment | ✅ | `development` |
| `MONGODB_URI` | MongoDB connection string | ✅ | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | ✅ | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | JWT expiry duration | ✅ | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ | `my-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ | `abc123xyz` |
| `AI_API_KEY` | OpenAI API key | ✅ | `sk-proj-...` |
| `AI_MODEL` | OpenAI model identifier | ✅ | `gpt-4o-mini` |
| `AI_BASE_URL` | OpenAI base URL | ✅ | `https://api.openai.com/v1` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ | `xxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ✅ | `GOCSPX-...` |
| `GOOGLE_CALLBACK_URL` | OAuth redirect URI | ✅ | `http://localhost:5000/api/auth/google/callback` |
| `SESSION_SECRET` | Session signing secret | ✅ | `session-secret-key` |
| `FRONTEND_URL` | Allowed frontend origin | ✅ (prod) | `https://your-app.vercel.app` |
| `CORS_ORIGIN` | Additional CORS origins | ❌ | `https://other-origin.com` |
| `API_BASE_URL` | Public API base URL | ❌ | `http://localhost:5000/api` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | ❌ | `60000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max auth requests per window | ❌ | `5` |
| `API_RATE_LIMIT_MAX` | Max API requests per window | ❌ | `30` |
| `MAX_UPLOAD_SIZE` | Max file upload size in bytes | ❌ | `5242880` |
| `ADMIN_EMAIL` | Seed admin email | ❌ | `admin@example.com` |
| `ADMIN_PASSWORD` | Seed admin password | ❌ | `StrongPass123!` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Required | Example |
|---|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | ✅ | `http://localhost:5000/api` |


---

## 📡 API Overview

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register with email + password |
| `POST` | `/api/auth/login` | Public | Login, returns JWT |
| `GET` | `/api/auth/me` | 🔒 Bearer | Get authenticated user |
| `GET` | `/api/auth/google` | Public | Initiate Google OAuth flow |
| `GET` | `/api/auth/google/callback` | Public | Google OAuth callback |
| `POST` | `/api/auth/oauth/exchange` | Public | Exchange one-time code for JWT |
| `PATCH` | `/api/auth/profile` | 🔒 Bearer | Update name / email |
| `POST` | `/api/auth/avatar` | 🔒 Bearer | Upload profile avatar |
| `POST` | `/api/auth/change-password` | 🔒 Bearer | Change password |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset |
| `POST` | `/api/auth/reset-password` | Public | Reset password with token |

### Resumes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/resumes/upload` | 🔒 Bearer | Upload PDF resume |
| `GET` | `/api/resumes` | 🔒 Bearer | List all user's resumes |
| `GET` | `/api/resumes/:id` | 🔒 Bearer | Get resume by ID |
| `GET` | `/api/resumes/:id/file` | 🔒 Bearer | Stream resume PDF |
| `DELETE` | `/api/resumes/:id` | 🔒 Bearer | Delete resume |

### Analysis

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/analysis/:resumeId` | 🔒 Bearer | Run full AI analysis |
| `GET` | `/api/analysis/:resumeId` | 🔒 Bearer | Get saved analysis |
| `POST` | `/api/analysis/:resumeId/ats` | 🔒 Bearer | Run ATS scoring only |
| `GET` | `/api/analysis/:resumeId/ats` | 🔒 Bearer | Get ATS results |

### Jobs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/jobs` | 🔒 Bearer | List all job listings |
| `GET` | `/api/jobs/:id` | 🔒 Bearer | Get job by ID |
| `POST` | `/api/jobs/match/:resumeId` | 🔒 Bearer | Match resume to jobs |
| `POST` | `/api/jobs` | 🔒 Admin | Create job listing |
| `PUT` | `/api/jobs/:id` | 🔒 Admin | Update job listing |
| `DELETE` | `/api/jobs/:id` | 🔒 Admin | Delete job listing |

### Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/dashboard` | 🔒 Bearer | User dashboard aggregate |
| `GET` | `/api/dashboard/admin` | 🔒 Admin | Admin dashboard |
| `GET` | `/api/health` | Public | Server health check |


---

## 🔒 Security

Every layer of the stack has explicit security controls. Nothing is assumed.

| Control | Implementation | Where |
|---|---|---|
| **Secure HTTP Headers** | `helmet` — sets CSP, HSTS, X-Frame-Options, and 10+ other headers | `app.js` |
| **Password Hashing** | `bcryptjs` with salt rounds = 10, hashed on `pre('save')` | `user.model.js` |
| **JWT Verification** | Bearer token validated on every protected route; user re-fetched from DB | `auth.middleware.js` |
| **Google OAuth Security** | One-time code exchange — JWT never exposed in redirect URL | `oauthCodeStore.js` |
| **Rate Limiting** | Strict limits on `/auth/login`, `/auth/register`; separate limit for upload, AI, matching | `app.js` |
| **CORS** | Production: explicit origin whitelist; Development: localhost only | `security.config.js` |
| **HTTP Parameter Pollution** | `hpp` middleware strips duplicate query params | `app.js` |
| **XSS Sanitization** | Custom middleware strips `<script>` tags and HTML from all `req.body`, `req.query`, `req.params` | `app.js` |
| **Input Validation** | `express-validator` chains on all auth, job, and profile routes | `validators/` |
| **Upload Validation** | PDF-only enforcement; blocked extensions list (`.exe`, `.sh`, `.bat`, etc.); max file size | `security.config.js` |
| **Ownership Checks** | Every resume/analysis operation verifies the resource belongs to the requesting user | `services/` |
| **Session Security** | `httpOnly`, `sameSite`, `secure` cookie flags; 10-minute OAuth-only session | `app.js` |
| **Stack Trace Hiding** | Error stack traces only included in `NODE_ENV=development` responses | `errorHandler.js` |
| **No Secrets in Responses** | Password reset link only returned in development; never in production | `auth.service.js` |


---

## 🌐 Deployment

### Frontend — Vercel

```bash
# Push to GitHub. Import repo at vercel.com/new
# Set root directory: frontend
# Framework preset: Vite

# Required environment variable:
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

### Backend — Render

```bash
# Create a new Web Service at render.com
# Build Command:  npm install
# Start Command:  npm start
# Root Directory: backend

# Set all variables from backend/.env.example in the Render dashboard
# IMPORTANT: Set NODE_ENV=production and FRONTEND_URL=https://your-app.vercel.app
```

### Database — MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Add your server's IP to the IP Access List (or `0.0.0.0/0` for all)
3. Create a database user and copy the connection string into `MONGODB_URI`

### File Storage — Cloudinary

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Copy **Cloud Name**, **API Key**, and **API Secret** from the dashboard
3. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

> **Note:** Set `GOOGLE_CALLBACK_URL` to your deployed backend URL in both your `.env` and Google Cloud Console → OAuth 2.0 → Authorized redirect URIs.


---

## ⚡ Performance

| Optimization | Implementation |
|---|---|
| **Code Splitting** | All pages are `React.lazy()` wrapped with `Suspense` fallbacks — only the current route's bundle loads |
| **Server State Caching** | TanStack Query v5 caches API responses, deduplicates concurrent requests, and refetches on window focus |
| **Optimistic UI** | Skeleton loading states match exact layout of loaded content — no layout shift |
| **Gzip Compression** | `compression` middleware on all Express responses |
| **Staggered Animations** | Framer Motion `staggerChildren` prevents render-blocking animation queues |
| **Upload Pipeline** | Multipart upload streams directly to Cloudinary via `multer-storage-cloudinary` — no temp disk write |
| **Reduced Motion** | `useReducedMotion()` hook disables animations for users who prefer reduced motion |
| **Font Optimization** | Geist Variable font loaded via `font-display: swap` — no FOIT |

---

## 🗺️ Roadmap

| Status | Feature |
|---|---|
| 🔜 | Email delivery for password reset (Nodemailer / SendGrid) |
| 🔜 | Resume version history and diff comparison |
| 🔜 | AI-generated cover letter builder |
| 🔜 | Interview preparation module (question generation per job role) |
| 🔜 | Resume template library with export to PDF |
| 🔜 | Saved jobs and application tracking |
| 🔜 | Redis-backed token store for password reset (multi-instance safe) |
| 🔜 | Premium tier with unlimited analyses |
| 🔜 | LinkedIn profile import |
| 🔜 | Dark/light theme toggle |


---

## 🤝 Contributing

Contributions are welcome. Please follow these steps:

**1. Fork and clone**

```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
cd ai-resume-analyzer
```

**2. Create a feature branch**

```bash
git checkout -b feat/your-feature-name
```

**3. Make your changes**

- Follow the existing code style (ESM on frontend, CJS on backend)
- Keep components small and single-purpose
- Add validation for any new API endpoints
- Never commit `.env` files or real user data

**4. Run the tests**

```bash
cd backend && npm test
cd frontend && npm run lint
```

**5. Commit with a conventional message**

```bash
git commit -m "feat: add cover letter generator"
# Types: feat | fix | refactor | docs | style | test | chore
```

**6. Open a Pull Request**

- Target the `master` branch
- Describe what the PR changes and why
- Reference any related issues

**Bug reports:** Open an issue with steps to reproduce, expected behavior, and actual behavior.


---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

You are free to use, modify, and distribute this project in personal and commercial work with attribution.

---

## 👤 Author

<div align="center">

Built and maintained by **Akshat Dixit**

[![GitHub](https://img.shields.io/badge/GitHub-akshatd845--maker-181717?style=for-the-badge&logo=github)](https://github.com/akshatd845-maker)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/your-profile)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-8B5CF6?style=for-the-badge&logo=vercel)](https://your-portfolio.dev)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail)](mailto:your@email.com)

</div>

---

## 🙏 Acknowledgements

- [OpenAI](https://openai.com) — GPT-4o-mini for AI analysis and suggestions
- [Cloudinary](https://cloudinary.com) — Secure file storage and delivery
- [Radix UI](https://radix-ui.com) — Accessible, unstyled component primitives
- [shadcn/ui](https://ui.shadcn.com) — Component design patterns and inspiration
- [Framer Motion](https://www.framer.com/motion/) — Production-quality animations
- [TanStack Query](https://tanstack.com/query) — Async state management
- [Lucide Icons](https://lucide.dev) — Clean, consistent icon system
- [SkillIcons](https://skillicons.dev) — Tech stack icon badges

---

<div align="center">

**⭐ If this project helped you, please consider giving it a star — it helps others find it.**

<br />

Built with React, Node.js, MongoDB, and OpenAI.

<br />

<sub>© 2025 AI Resume Analyzer · MIT License</sub>

</div>
