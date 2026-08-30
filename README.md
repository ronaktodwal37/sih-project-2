# Jharkhand Societal Innovation Portal (JSIP)

**Problem Statement ID:** 26043  
**Organization:** Government of Jharkhand — Department of Higher & Technical Education  
**Theme:** Smart Education | **Category:** Software

An AI-powered societal innovation collaboration portal that transforms community problems into validated innovation projects by connecting citizens, universities, students, faculty, industry, CSR organizations and government.

> **Note:** All seeded data is labeled as **Demonstration Data** and is not actual government data.

---

## Problem Statement

Citizens across Jharkhand identify local challenges in education, healthcare, agriculture, water, sanitation, environment, energy, and more — but there is no structured mechanism to convert these into validated innovation projects. Universities have research capabilities; industries have funding and deployment capacity. This platform bridges that gap.

## Key Differentiators

| Feature | Description |
|---------|-------------|
| AI-assisted analysis | Classification, summarization, skill extraction — with rule-based fallback |
| Explainable matching | Weighted, transparent university & industry matching scores |
| Deterministic priority | Population, severity, urgency — not arbitrary AI decisions |
| Project lifecycle | Research → Proposal → Prototype → Pilot → Deployment → Impact |
| Government analytics | District maps, KPIs, category trends via Recharts |
| Human-in-the-loop | Government validates; admin controls final assignments |

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, React Router, Tailwind CSS, Axios, React Hook Form, Zod, Recharts, Leaflet |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Helmet, CORS, rate-limit |
| AI | Gemini API (isolated service layer) with rule-based fallback |
| Storage | Cloudinary (with local upload fallback) |
| Deployment | Vercel (frontend), Render/Railway (backend), MongoDB Atlas |

---

## Architecture

```
Citizen → Challenge → AI Analysis → Validation → Prioritization
    → University Matching → Industry Matching → Project → Impact
```

```
SiHPROJECT/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/   # Reusable UI, maps, challenge forms
│       ├── pages/        # Public + role-based dashboards
│       ├── services/     # API clients
│       ├── context/      # Auth context
│       ├── routes/       # React Router + guards
│       └── i18n/         # Translation structure (EN ready, HI prepared)
└── server/          # Express API
    ├── config/      # DB, Cloudinary
    ├── controllers/ # Route handlers
    ├── middleware/  # Auth, validation, errors
    ├── models/      # Mongoose schemas
    ├── routes/      # REST endpoints
    ├── services/    # AI, matching, analytics, notifications
    ├── validators/  # Zod schemas
    └── scripts/     # Seed data
```

---

## Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Setup

```bash
# Clone and install
cd SiHPROJECT
npm run install:all

# Configure environment
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit server/.env — set MONGO_URI, JWT_SECRET, optionally GEMINI_API_KEY

# Seed demonstration data
npm run seed

# Start backend (port 5001 — avoids macOS AirPlay conflict on 5000)
npm run dev:server

# Start frontend (separate terminal)
npm run dev:client
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api
- Health check: http://localhost:5001/api/health

---

## Environment Variables

### Server (`server/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | API port (default: 5001) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | Token expiry (default: 7d) |
| `GEMINI_API_KEY` | Google Gemini API key (optional) |
| `CLOUDINARY_*` | Cloudinary credentials (optional) |
| `CLIENT_URL` | Frontend URL for CORS |

### Client (`client/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

---

## Demo Accounts

Password for all accounts: **`Demo@1234`**

| Role | Email |
|------|-------|
| Admin | admin@jsip.gov.in |
| Government | gov@jsip.gov.in |
| Citizen | citizen1@example.com |
| University | university@bitmesra.ac.in |
| Faculty | faculty@bitmesra.ac.in |
| Student | student@bitmesra.ac.in |
| Industry | csr@tatasteel.com |

---

## Demo Flow (End-to-End)

1. Login as **citizen1@example.com**
2. Go to **Report a Challenge** → submit water contamination problem
3. View AI analysis, priority score, duplicate detection, university/industry matches
4. Login as **gov@jsip.gov.in** → validate challenge
5. Login as **university@bitmesra.ac.in** → accept challenge, create project
6. Assign faculty/students, add industry partner
7. Track milestones: Research → Prototype → Pilot → Deployment
8. Login as **gov@jsip.gov.in** → view analytics dashboard and district map
9. Record impact metrics

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Current user

### Challenges
- `GET /api/challenges` — List (public, filterable)
- `POST /api/challenges` — Create (auth)
- `GET /api/challenges/:id` — Detail
- `POST /api/challenges/:id/validate` — Validate (government)
- `POST /api/challenges/:id/assign` — Assign institutions
- `GET /api/challenges/:id/university-matches` — University matching
- `GET /api/challenges/:id/industry-matches` — Industry matching

### Projects, Universities, Industries, Government, Admin, Notifications, Uploads
See `server/routes/` for full route definitions.

---

## AI Integration

The AI layer is isolated in `server/services/ai/`:

- **aiProvider.js** — Abstract provider (Gemini + fallback)
- **challengeAnalyzer.js** — Structured JSON analysis with Zod validation
- **duplicateDetector.js** — Keyword + cosine similarity
- **rootCauseAnalyzer.js** — Root cause hypothesis (not verified fact)

If Gemini is unavailable, rule-based fallback uses keyword matching and category dictionaries. The platform never fails due to AI unavailability.

### Priority Engine (Deterministic)
| Factor | Weight |
|--------|--------|
| Population Impact | 30% |
| Severity | 25% |
| Urgency | 20% |
| Vulnerability | 10% |
| Feasibility | 10% |
| Cost Efficiency | 5% |

### University Matching (Explainable)
| Factor | Weight |
|--------|--------|
| Expertise match | 35% |
| Lab capability | 25% |
| Past projects | 15% |
| Available capacity | 10% |
| Geographic proximity | 10% |
| Student skills | 5% |

---

## Security

- JWT authentication with HTTP-only cookies
- bcrypt password hashing (12 rounds)
- Helmet, CORS, rate limiting
- Zod input validation
- Role-based authorization middleware
- Audit logging for sensitive actions
- No secrets in source code

---

## Deployment

### Frontend (Vercel)
```bash
cd client && npm run build
# Deploy dist/ to Vercel, set VITE_API_URL
```

### Backend (Render/Railway)
```bash
# Set env vars, start command: node server.js
```

### Database
Use MongoDB Atlas with connection string in `MONGO_URI`.

---

## Future Scope

- Hindi language support (i18n structure ready)
- Socket.IO real-time notifications
- MongoDB Atlas Vector Search for semantic duplicate detection
- Mobile app for citizen challenge submission
- Integration with state government grievance systems

---

## License

MIT — Built for Smart India Hackathon 2026, Problem Statement 26043.
