# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JSecurity Ltd is a full-stack web application for a Nairobi-based security services company. It has a React/TypeScript frontend and a FastAPI Python backend with PostgreSQL (Supabase) database.

## Development Commands

### Frontend (run from project root)
```bash
npm run dev        # Dev server at localhost:8080
npm run build      # Production build
npm run lint       # ESLint
npm run test       # Vitest tests
npm run test:watch # Watch mode
npm run preview    # Preview production build
```

### Backend (run from `backend/`)
```bash
python run.py                                   # Dev server (uses .env)
uvicorn app.main:app --reload --host 0.0.0.0   # Direct uvicorn
pytest                                          # Run tests
alembic upgrade head                            # Apply DB migrations
alembic revision --autogenerate -m "message"   # Create migration
```

### Access Points
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs

## Architecture

### Backend (`backend/app/`)

- **`main.py`** — FastAPI app setup, CORS, router registration
- **`core/config.py`** — Pydantic BaseSettings (reads from `.env`)
- **`core/dependencies.py`** — `get_current_user` dependency; `CurrentUser` class with permission-checking methods
- **`core/rbac.py`** — 3 roles (SUPER_ADMIN, ADMIN, EDITOR), 24 permission enums, role→permission mapping
- **`db/database.py`** — SQLAlchemy engine + session; tables auto-created on startup via `Base.metadata.create_all()`
- **`models/models.py`** — ORM models: `User`, `BlogPost`, `Review`, `TeamMember`, `Service`, `AuditLog`
- **`schemas/schemas.py`** — Pydantic request/response schemas
- **`api/v1/endpoints/`** — Route handlers (auth, blog, reviews, team, services, users, audit)
- **`utils/jwt.py`** — Access token (30 min) + refresh token (7 days) creation/verification
- **`utils/security.py`** — bcrypt hashing, TOTP/MFA helpers
- **`utils/audit.py`** — Audit log helper (records CREATE/UPDATE/DELETE with old/new values)

All endpoints are prefixed `/api/v1`. The audit log captures all mutations automatically.

### Frontend (`src/`)

- **`App.tsx`** — React Router v6 routes; public routes, auth routes (`/login`, `/mfa-*`), and protected admin routes (`/admin/*`)
- **`hooks/useAuth.tsx`** — Auth Context provider; stores user/tokens in localStorage; exposes `login()`, `logout()`, `hasRole()`, `hasAnyRole()`
- **`api/client.ts`** — Fetch wrapper with automatic Bearer token injection, 401 handling, and refresh token retry
- **`api/*.ts`** — One module per resource (auth, blog, reviews, team, services, users, audit)
- **`components/admin/ProtectedRoute.tsx`** — Route guard enforcing role requirements
- **`components/admin/`** — AdminLayout, Sidebar, Header, and per-entity CRUD forms
- **`components/ui/`** — 40+ shadcn/ui components (built on Radix UI)
- **`components/aceternity/`** — Animation components (TypewriterEffect, MovingBorder, Spotlight, etc.)
- **`pages/admin/`** — One page per admin section (Blog, Reviews, Team, Services, Users, AuditLogs)

### RBAC Summary

| Role | Capabilities |
|------|-------------|
| SUPER_ADMIN | Everything including user management |
| ADMIN | All content CRUD + audit logs; no user management |
| EDITOR | Create/update own content; cannot publish blogs or view audit logs |

Route-level enforcement is done in `ProtectedRoute.tsx`; endpoint-level enforcement uses `require_admin_or_super` and `get_current_user` dependencies.

## Environment Variables

### Backend (`.env`)
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-ID].supabase.co:5432/postgres
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
FRONTEND_URL=http://localhost:5173
ENVIRONMENT=development
DEBUG=True
```

### Frontend (`.env.local`)
```
VITE_API_URL=http://localhost:8000/api/v1
```

## Database

Tables are auto-created by SQLAlchemy on app startup — no migrations needed for initial setup. Alembic is available in `backend/migrations/` for versioned changes. The project uses Supabase (managed PostgreSQL) in production; local PostgreSQL works for development.
