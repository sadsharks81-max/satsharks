# Project Context — my-daily-compass

This document captures the codebase analysis, architecture, database schema summary, API surface, authentication flow, tech stack, implemented and pending features, deployment notes, and development workflow.

## Project Summary

- Monorepo with two workspaces: `backend` (TypeScript + Express) and `frontend` (React + Vite).
- Backend is an Express + TypeScript API using Mongoose (MongoDB). Frontend is a Vite React app using TanStack Router and Tailwind.

## Folder Structure (high level)

- `backend/`
  - `src/`
    - `server.ts` — app entry, route registration and middleware
    - `config/` — `db.ts`, `env.ts`
    - `controllers/` — route handlers (auth, user, question, test, subscription, analytics, practice, upload, contact, success-stories, etc.)
    - `models/` — Mongoose models (User, Question, TestAttempt, DiagnosticTest, SubscriptionPlan, SuccessStory, PracticeSession, Inquiry, PracticeTestUpload, etc.)
    - `routes/` — express routers plugged into `/api/*`
    - `middleware/` — auth, role checks, validators
    - `validators/` — request validators using `express-validator`
    - `scripts/` — seed and migration helpers
    - `uploads/` — static serve directory for uploaded files
  - `package.json` (build, dev, seed, migrate scripts)

- `frontend/`
  - `src/` — React routes, components, contexts, hooks, services
  - `vite.config.ts`, `tsconfig.json`, `package.json`

## Database (high-level schema)

Primary DB: MongoDB (Mongoose models). Key schemas observed:

- `User`
  - name, email (unique), password (hashed), role (`ADMIN`|`STUDENT`), country, region (`LOCAL`|`INTERNATIONAL`), subscription (`FREE`|`PAID`), status (`ACTIVE`|`SUSPENDED`)
  - timestamps

- `Question`
  - text, options (label + text), correctAnswer (A/B/C/D), explanation, category (ref `QuestionCategory`), difficulty (`EASY`|`MEDIUM`|`HARD`), section (`READING_WRITING`|`MATH`), tags, source, status, createdBy
  - indexes: category, difficulty, section, status, tags

- `TestAttempt`
  - student (ref `User`), test (ref `DiagnosticTest`), answers (question ref, selectedAnswer, isCorrect, timeSpent), score, totalQuestions, correctCount, percentage, timeTaken, status (`IN_PROGRESS`|`COMPLETED`|`ABANDONED`), timestamps
  - indexes: student, test

- Other models present (brief): `DiagnosticTest`, `QuestionCategory`, `SubscriptionPlan`, `SuccessStory`, `PracticeSession`, `Inquiry`, `PracticeTestUpload` — inspect `backend/src/models` for full field definitions.

## API Routes (registered in `server.ts`)

- Health check: `GET /api/health`
- `POST /api/auth/*` — authentication: register, login, reset-password
  - `POST /api/auth/register` — create user (or mock response when DB not configured)
  - `POST /api/auth/login` — login (mock mode available when no DB)
  - `POST /api/auth/reset-password` — stubbed response
- `GET/POST/PUT/DELETE` style routes exist under these base paths (controllers in `backend/src/controllers`):
  - `/api/users` — user management
  - `/api/subscriptions` — plan management & user subscriptions
  - `/api/contact` — contact/inquiries
  - `/api/success-stories` — CRUD for success stories
  - `/api/categories` — question category CRUD
  - `/api/questions` — question CRUD and listing/filtering
  - `/api/tests` — diagnostic tests and attempts
  - `/api/analytics` and `/api/admin/analytics` — analytics endpoints
  - `/api/practice` — practice sessions and endpoints
  - `/api/uploads` — file upload handling (multer)

Note: Exact endpoints and HTTP verbs are implemented per router files in `backend/src/routes` — use those files for complete method lists.

## Authentication Flow

- JWT-based tokens using `jsonwebtoken`.
- Tokens generated in `backend/src/utils/jwt.ts`:
  - `generateTokens(userId, role, region, subscription, status)` → returns `{ accessToken, refreshToken }` with lifetimes `15m` and `7d` respectively.
  - `verifyAccessToken` and `verifyRefreshToken` helper functions exist.
- Auth controllers (`auth.controller.ts`) implement:
  - `register` — creates user, hashes password (bcrypt), returns access+refresh tokens; when no `DATABASE_URL` present, returns mock user + tokens (mock mode).
  - `login` — checks credentials, compares bcrypt password, respects `SUSPENDED` status, returns tokens; when no `DATABASE_URL` present, returns mock tokens.
  - `resetPassword` — currently returns a generic success message (email sending not implemented in controller).

Observations / Gaps:
- No dedicated refresh-token endpoint or refresh-token rotation logic found in controllers (refresh logic may be missing).
- No persistent refresh-token store (tokens are JWTs only); if refresh revocation is required, add server-side store.
- Password reset flow is a stub; no email service / token flow implemented.

## Tech Stack

- Backend: Node.js + TypeScript, Express, Mongoose (MongoDB), bcrypt, jsonwebtoken, multer, express-validator
- Frontend: React (TSX), Vite, TanStack Router, TanStack React Query, Tailwind CSS, Framer Motion
- Dev tooling: `tsx` for backend dev runner, `typescript`, `eslint`, `prettier` on frontend
- Monorepo: npm workspaces (`package.json` at root), and `bunfig.toml` present (may indicate Bun usage or experimentation)

## Features Implemented (observed)

- User registration and login (with mock fallback when no DB configured)
- Role-based user model (`ADMIN` vs `STUDENT`) and status checks (suspended)
- Question bank model with categories, difficulty, section, tagging, and indexing
- Test attempt tracking (answers, score, timing, status)
- Routes and controllers for subscriptions, analytics, practice, uploads, contact, success stories, categories (complete implementations likely in respective controller files)
- File upload support via multer and static serving of `/uploads`
- Seed scripts for initial data (`scripts/seedPhaseOne.ts`, `seedPhaseTwo.ts`)

## Pending / Missing Features (recommendations)

- Refresh token endpoint and secure refresh token rotation + revocation mechanism.
- Full password reset flow (email service, one-time token, reset endpoint).
- Rate limiting, brute-force protection on auth endpoints.
- More robust role-based access enforcement on admin routes (confirm `role.middleware` usage everywhere).
- Tests (unit/integration) — I didn't find a test suite in the repo.
- CI/CD pipeline configuration (GitHub Actions, etc.) — none observed.

## Deployment Notes

- Environment variables required (see `backend/src/config/env.ts`): `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `FRONTEND_URL`, `PORT`.
- Backend `package.json` scripts:
  - `dev`: `tsx watch src/server.ts`
  - `build`: `tsc` → outputs to `dist/` (server run with `node dist/server.js`)
  - `seed`, `migrate` scripts exist for DB bootstrap
- Frontend `package.json` scripts:
  - `dev` (vite), `build` (vite build), `preview`
- Root workspace scripts: `dev:frontend`, `dev:backend`, `dev` to run both.

Suggested production deployment patterns:
- Build frontend with `npm run build -w frontend` and serve via static hosting (Netlify, Vercel, S3+CloudFront) or from a CDN.
- Build backend with `npm run build -w backend` and run `node dist/server.js` behind a process manager (PM2) or containerized via Docker. Use environment variables and ensure secure storage for `JWT_*` secrets and DB credentials.
- Use MongoDB Atlas (or managed instance) and configure `DATABASE_URL` accordingly.
- Add a health check for readiness/liveness endpoints (there is already `/api/health`).

## Development Workflow

1. Install dependencies (root uses workspaces):

```bash
npm install
```

2. Run both apps in dev mode (root workspace):

```bash
npm run dev
```

3. Backend dev (inside repo root or via workspace):

```bash
npm run dev:backend
# or
cd backend && npm install && npm run dev
```

4. Frontend dev:

```bash
npm run dev:frontend
# or
cd frontend && npm install && npm run dev
```

5. Build for production:

```bash
npm run build
```

6. Seed data and migrations (backend):

```bash
cd backend
npm run seed:phase1
npm run seed:phase2
```

## How to extend / next steps (practical checklist)

- Implement refresh-token endpoint and refresh rotation + revocation store.
- Implement password-reset with emailed token and token expiry.
- Add integration tests for auth, questions, and test attempts.
- Add CI pipeline to run linting, build, and tests on PRs.
- Add Dockerfiles for backend and frontend and a `docker-compose` for local stack with MongoDB.
- Add monitoring (Sentry or similar) and structured logging for production.

## Reference files to inspect next

- `backend/src/config/env.ts` — environment variables and defaults
- `backend/src/config/db.ts` — mongoose connection logic (uses `DATABASE_URL` or mock mode)
- `backend/src/controllers/auth.controller.ts` — auth flow and mock mode behavior
- `backend/src/utils/jwt.ts` — token generation and verification
- `backend/src/models/` — full model definitions for DB schema
- `frontend/src/` — client routes and usage of auth context (`contexts/AuthContext.tsx`)

---

Generated on: 2026-06-23
