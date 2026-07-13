# AI Resume Analyzer - Frontend client

This is the React-based frontend client for the AI Resume Analyzer application, built using Vite, Tailwind CSS, TanStack React Query, and Radix UI.

## Features

- **Dashboard UI**: Displays resume status overview, quick actions, ATS scores, and missing skills.
- **Resume Upload Zone**: Drag-and-drop file upload zone enforcing early MIME and format checks.
- **Job Match Center**: View semantic match percentages and skill gaps.
- **Profile & Settings**: Manage accounts, passwords, and themes.

## Get Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment variables
Create a `.env` file in this directory:
```ini
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```
