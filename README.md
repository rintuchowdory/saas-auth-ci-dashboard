# SaaS Auth CI Dashboard

> **Portfolio project** demonstrating the full modern stack that 80% of job postings require.

[![CI](https://github.com/rintuchowdory/saas-auth-ci-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/rintuchowdory/saas-auth-ci-dashboard/actions/workflows/ci.yml)
[![Deploy](https://github.com/rintuchowdory/saas-auth-ci-dashboard/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/rintuchowdory/saas-auth-ci-dashboard/actions/workflows/deploy-pages.yml)

**Live Demo:** https://rintuchowdory.github.io/saas-auth-ci-dashboard/

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 · TypeScript · TanStack Query v5 · Tailwind CSS 4 · Wouter |
| **Backend** | FastAPI (Python 3.12) · SQLAlchemy 2 (async) · Alembic |
| **Database** | PostgreSQL 16 |
| **Auth** | JWT (access + refresh tokens) · OAuth2 password flow |
| **DevOps** | Docker Compose · GitHub Actions CI/CD |
| **Deploy** | Railway (backend) · GitHub Pages / Cloudflare Pages (frontend) |

---

## Features

- **JWT Authentication** — login, register, refresh token rotation, protected routes
- **OAuth2 Password Flow** — FastAPI-native `/api/v1/auth/login` endpoint
- **CI/CD Pipeline Dashboard** — real-time pipeline status, stage visualization, retry
- **TanStack Query** — data fetching, caching, auto-refresh, optimistic mutations
- **Docker Compose** — one-command local dev environment (backend + db + redis + frontend)
- **GitHub Actions** — automated tests, TypeScript check, Docker build, Pages deploy

---

## Quick Start

### Prerequisites
- Node.js 22+ and pnpm
- Python 3.12+
- Docker & Docker Compose

### Option A — Docker Compose (recommended)

```bash
git clone https://github.com/rintuchowdory/saas-auth-ci-dashboard.git
cd saas-auth-ci-dashboard

# Copy env file
cp backend/env.example backend/.env
# Edit backend/.env — set SECRET_KEY

docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/docs

### Option B — Manual

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp env.example .env  # edit values
uvicorn app.main:app --reload
```

**Frontend:**
```bash
pnpm install
pnpm dev
```

---

## Project Structure

```
saas-auth-ci-dashboard/
├── client/                  # React + TypeScript frontend
│   └── src/
│       ├── contexts/        # AuthContext (JWT), ThemeContext
│       ├── hooks/           # TanStack Query hooks
│       ├── pages/           # Login, Dashboard, Pipelines, Projects
│       └── components/      # DashboardLayout, shadcn/ui
├── backend/                 # FastAPI backend
│   └── app/
│       ├── api/v1/          # auth, pipelines, projects, users
│       ├── core/            # config, security (JWT)
│       ├── models/          # SQLAlchemy models
│       ├── schemas/         # Pydantic schemas
│       └── db/              # async session, Base
├── .github/workflows/       # CI + GitHub Pages deploy
├── docker-compose.yml       # Local dev environment
├── Dockerfile.frontend      # Nginx-served React build
├── backend/Dockerfile       # FastAPI multi-stage build
└── railway.json             # Railway deployment config
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/login` | OAuth2 password flow login |
| `POST` | `/api/v1/auth/login/json` | JSON body login |
| `POST` | `/api/v1/auth/register` | Create new account |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |
| `GET` | `/api/v1/auth/me` | Current user profile |
| `GET` | `/api/v1/pipelines` | List CI/CD pipelines |
| `GET` | `/api/v1/pipelines/{id}` | Pipeline detail |
| `POST` | `/api/v1/pipelines/{id}/retry` | Retry failed pipeline |
| `GET` | `/api/v1/projects` | List projects |
| `GET` | `/api/health` | Health check |

Interactive docs: http://localhost:8000/api/docs

---

## Deployment

### Backend → Railway

1. Connect GitHub repo to Railway
2. Set environment variables (DATABASE_URL, SECRET_KEY, etc.)
3. Railway auto-deploys on push to `main`

### Frontend → GitHub Pages

Automatic via GitHub Actions on push to `main`.
See `.github/workflows/deploy-pages.yml`.

### Frontend → Cloudflare Pages

1. Connect GitHub repo to Cloudflare Pages
2. Build command: `pnpm build`
3. Output directory: `dist/public`

---

## License

MIT — feel free to use as a portfolio template.
