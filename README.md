# AI Resume Analyzer & Job Matcher

A comprehensive, production-ready MERN stack application designed for AI-powered resume parsing, applicant tracking system (ATS) analysis, keyword optimization suggestions, and job matching.

---

## Features

- **Authentication**: JWT-based email/password registration and login alongside Google OAuth 2.0 integration.
- **Secure File Upload**: Intercepts uploaded files at the storage stream layer to validate PDF MIME types, `.pdf` extensions, and check first-bytes signature (`%PDF-`).
- **ATS Score Analysis**: Calculates overall and category-weighted scores (contact, education, experience, formatting, keywords, achievements) dynamically.
- **AI-Powered Suggestions**: Synthesizes custom resume summaries, identifies career levels, structures actionable feedback lists, and lists missing skills.
- **Job Matching**: Performs semantic skill matching, computes matching score percentages, and reveals skill-gaps between candidate profiles and job roles.
- **User Dashboard**: Highlights KPI cards, uploads resumes, tracks recent upload history, and links matching jobs.
- **Admin Dashboard**: Visualizes global platform KPIs (total users, analysis metrics, average ATS score, and category analysis).
- **Security Hardening**: Built-in protection utilizing Helmet headers, request rate limiters, HTTP parameter pollution prevention, and custom XSS input sanitizers.

---

## Tech Stack

### Frontend
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State & Networking**: TanStack React Query & Axios
- **Animations**: Framer Motion
- **UI Components**: Radix UI primitives & Lucide React icons

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Passport.js (Google OAuth) & JWT
- **File Handling**: Multer & Cloudinary SDK
- **AI Engine**: OpenAI API Node SDK
- **Security**: Helmet, Express Rate Limit, HPP

---

## Folder Structure

```
AI-Resume-Analyzer/
├── backend/
│   ├── scripts/             # DB Seed scripts (Admin & Jobs)
│   ├── src/
│   │   ├── config/          # Configurations (db, cloudinary, passport, security)
│   │   ├── controllers/     # API request handlers
│   │   ├── middleware/      # Authentication, rate limit, and error catch wrappers
│   │   ├── models/          # Mongoose database schemas
│   │   ├── routes/          # Express route declarations
│   │   ├── services/        # Business logic (AI processing, parser, ATS math)
│   │   ├── utils/           # Helper scripts (JWT, validation, response format)
│   │   └── validators/      # Payload structure validation schemas
│   └── tests/               # Unit and Integration test suites
└── frontend/
    ├── src/
    │   ├── app/             # Application routers and global providers
    │   ├── components/      # Reusable UI layout elements
    │   ├── features/        # Module-specific code (Auth, Dashboard, Jobs, Resume)
    │   ├── hooks/           # Custom utility React hooks
    │   └── services/        # HTTP API client wrappers
    └── vite.config.js       # Vite build configurations
```

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory using `backend/.env.example` as a template.

### 3. Setup the Backend
```bash
cd backend
npm install
# Seed jobs (development mode only)
npm run seed:jobs
# Seed administrator (development mode only)
npm run seed:admin
# Run development server
npm run dev
```

### 4. Setup the Frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

```ini
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname

# JWT configuration
JWT_SECRET=your-cryptographic-jwt-secret-key-here
JWT_EXPIRES_IN=7d

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# OpenAI API Integration
AI_API_KEY=your-openai-api-key
AI_MODEL=gpt-4o-mini
AI_BASE_URL=https://api.openai.com/v1

# Google OAuth Integration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your-session-cookie-signing-secret

# Rate Limiting & Upload configurations
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5
API_RATE_LIMIT_MAX=30
MAX_UPLOAD_SIZE=5242880

# Administrator Seed credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminPassword123!
```

### Frontend (`frontend/.env`)
```ini
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Screenshots

- **Landing Page**: `![Landing Page](docs/screenshots/landing.png)`
- **Authentication**: `![Authentication](docs/screenshots/auth.png)`
- **Dashboard**: `![Dashboard](docs/screenshots/dashboard.png)`
- **Resume Upload**: `![Resume Upload](docs/screenshots/upload.png)`
- **ATS Analysis**: `![ATS Analysis](docs/screenshots/analysis.png)`
- **Job Matching**: `![Job Matching](docs/screenshots/matching.png)`
- **Profile Settings**: `![Profile Settings](docs/screenshots/profile.png)`

---

## API Overview

### Authentication Routes (`/api/auth`)
- `POST /register` - Register a new user.
- `POST /login` - Login email/password.
- `GET /google` - Redirect to Google authentication flow.
- `GET /google/callback` - Callback for Google authentication.

### Resume Routes (`/api/resumes`)
- `POST /upload` - Upload a resume file.
- `GET /` - Fetch all resumes for the authenticated user.
- `GET /:id` - Get resume details by ID.
- `DELETE /:id` - Remove a resume.

### Job Matching Routes (`/api/jobs`)
- `GET /` - Retrieve all available jobs.
- `POST /` - Create a job (Admin only).
- `POST /match/:resumeId` - Semantic match candidate profile to jobs.

---

## Deployment

### Frontend (Vercel)
Import the `frontend` subdirectory, override the build command to `npm run build`, and supply the `VITE_API_BASE_URL` env variable pointing to your deployed backend.

### Backend (Render / Railway)
Import the `backend` subdirectory, configure the startup script to `npm start`, and supply all environment keys in the service configurations.

### Database (MongoDB Atlas)
Provision a free Atlas cluster, whitelist your server IP address, and paste the connection string to `MONGODB_URI`.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
