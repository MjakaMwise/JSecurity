# JSecurity Ltd

**Your Safety. Our Mission.**

JSecurity Ltd provides integrated physical and digital security services for businesses and individuals across Kenya.

---

## About

JSecurity is Nairobi's leading integrated security provider — combining physical guards, cybersecurity, AI-powered surveillance, executive protection, forensics, and consulting under a single roof.

- **PSRA Licensed** — fully compliant with Kenya's Private Security Regulatory Authority
- **24/7 Monitoring** — real-time threat detection and response
- **15-Minute Response SLA** — rapid deployment across Nairobi
- **500+ Clients** — trusted by banks, hospitals, schools, and embassies

## Services

| Service | Description |
|---------|-------------|
| Physical Security | Elite-trained on-site guards and access control |
| Cybersecurity | Penetration testing, network defense, zero trust |
| CCTV & Surveillance | AI-powered cameras with real-time analytics |
| Executive Protection | Discrete close protection for VIPs |
| Emergency Response | 15-minute rapid deployment teams |
| Forensics | Digital and physical investigation services |
| Agentic Security | Autonomous AI threat detection and response |
| Security Consulting | Risk assessments and compliance advisory |
| Network Services | Enterprise network design and hardening |

## Tech Stack

### Frontend

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | anime.js + Aceternity UI |
| Typography | Playfair Display (headings) · DM Mono (body) · Calibri (brand) |
| Validation | Zod |

### Backend

| Layer | Technology |
|-------|-----------|
| Framework | FastAPI (Python) |
| Database | PostgreSQL (Supabase) |
| Auth | JWT + TOTP MFA |
| ORM | SQLAlchemy |

---

## Local Development

### Frontend

```sh
# Install dependencies
npm install

# Start dev server (localhost:8080)
npm run dev
```

### Backend

```sh
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Update DATABASE_URL, SECRET_KEY, FRONTEND_URL in .env

# Run development server
python run.py
```

API available at `http://localhost:8000` — Swagger docs at `http://localhost:8000/docs`

## Production Build

```sh
npm run build
```

Output in `dist/` — deploy to any static host (Vercel, Netlify, Cloudflare Pages).

---

## Backend API

### Authentication Flow

```http
POST /api/v1/auth/login
POST /api/v1/auth/mfa/setup
POST /api/v1/auth/mfa/verify
POST /api/v1/auth/refresh
```

### Role-Based Access Control

| Role | Capabilities |
|------|-------------|
| SUPER_ADMIN | Everything including user management |
| ADMIN | All content CRUD + audit logs |
| EDITOR | Create/edit own content only |

### Database Schema

Key tables: `users`, `blog_posts`, `reviews`, `team_members`, `services`, `audit_logs`

### Environment Variables

```
DATABASE_URL          - PostgreSQL connection string
SECRET_KEY           - JWT secret key (min 32 chars)
ALGORITHM            - JWT algorithm (default: HS256)
ACCESS_TOKEN_EXPIRE_MINUTES - Token expiry (default: 30)
REFRESH_TOKEN_EXPIRE_DAYS   - Refresh token expiry (default: 7)
FRONTEND_URL         - Frontend URL for CORS
ENVIRONMENT          - development/production
DEBUG                - True/False
```

---

## Contact

- **Email**: info@jsecurity.co.ke
- **Phone**: +254 700 000 000
- **Location**: Nairobi, Kenya

---

© 2025 JSecurity Ltd. All rights reserved.
