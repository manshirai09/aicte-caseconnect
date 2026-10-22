# AICTE CaseConnect

> **One Institution. Connected Cases. Coordinated Action.**
> Smart India Hackathon 2026 — Problem Statement ID: **SIH26264**
> Team: **Digital KrishiVaani** | Team ID: **196061**

---

## Overview

**AICTE CaseConnect** is a fully working, browser-based institution intelligence and cross-bureau complaint coordination platform built as a prototype for SIH 2026. It provides AICTE officers a consolidated, role-aware view of institution-level complaint records across all Bureaus/Cells, with an explainable AI-assisted matching engine to identify potentially related or duplicate cases.

> **Status: Functional Prototype** — All 11 modules listed below are implemented and running on synthetic demo data.

---

## Problem Statement

Institution-related complaints arrive across multiple AICTE Bureaus (PGRC, Regulation Bureau, Approval Bureau, etc.) through different channels (CPGRAMS, Web Portal, Physical Petitions, Court Directives). Without a consolidated institution-level view, it is challenging to:

- Track the full complaint history of an institution
- Spot potentially related or duplicate complaints filed across different channels
- Coordinate follow-up actions across Bureaus
- Monitor SLA deadlines and escalate overdue cases
- Maintain a traceable audit record of all decisions

---

## Implemented Modules

### 1. Overview Dashboard
- KPI tiles: total cases, pending, overdue, cross-bureau links
- Case status distribution chart (Recharts)
- Bureau workload comparison
- Recent critical cases table with priority badges
- Live role-based data scope switching

### 2. Case Management
- Full case list with search and filters (Bureau, Status, Region, Date Range, Institution)
- Case detail drawer: timeline, action history, internal remarks, related case links
- Create new case via modal (title, description, category, subcategory, priority, institution, source channel, due date)
- Update case status with remarks
- Reassign officer (name, email, bureau)
- Transfer case jurisdiction to another Bureau
- Add internal confidential or standard remarks
- Auto-regenerates cross-bureau overlap suggestions after every mutation

### 3. Institution Registry
- Searchable list of all institutions with AICTE Permanent IDs, aliases, state, type, approval status
- Risk index indicator per institution
- Open / Total / Overdue case counts
- One-click drilldown to the Institution 360 view

### 4. Institution 360 View
- Full institution profile: address, contact, establishment year, approval status
- Recurring issues breakdown by category
- Complete case timeline across all bureaus
- Related case links viewer
- One-click coordination request dispatch

### 5. Cross-Bureau Overlap Detection (AI-Assisted)
- Automatically scans all cases and surfaces potentially related pairs
- Multi-signal explainable matching engine (6 signals — see below)
- Confidence bands: **High-Priority Review**, **Potentially Related**, **Weak Match**, **Identity Needs Verification**
- Human-in-the-loop: officers **Accept**, **Reject**, or mark **Under Further Investigation**
- Accepted links stored bidirectionally on both case records
- All decisions recorded in the audit trail

### 6. Coordination Workflow
- Cross-bureau coordination request dispatch (From Bureau → To Bureau)
- Action types: Joint Inspection, Provide Inspection Reports, Corroborate Assessment Records, Regulatory Show-Cause Alignment, Information Clarification
- Response logging by receiving bureau officer
- Status lifecycle: Requested → Accepted → Responded → Completed / Cancelled

### 7. SLA and Escalation Monitoring
- Due-date tracking per case with overdue highlighting
- Escalation status indicators
- Filterable SLA board by bureau, priority, and status

### 8. Analytics and Reports
- Case volume trends over time
- Bureau-wise and category-wise breakdowns (Recharts)
- Export to CSV: cases, institutions, and audit trails
- Date range and bureau filters

### 9. Audit Trail
- Immutable log: case creation, status changes, officer assignments, bureau transfers, overlap reviews, coordination events, role switches, config changes
- Searchable and filterable by action type, role, bureau
- CSV export

### 10. System Administration
- Matching weight tuner (live sliders for all 6 signals, must sum to 100)
- View all registered officer accounts
- Role switcher for demo/evaluation purposes
- One-click factory reset to seed data

### 11. Benchmark / Evaluation Module
- Runs the matching engine against 6 curated ground-truth labelled case pairs
- Reports: Precision, Recall, F1 Score, Institution Resolution Accuracy
- True/False Positive/Negative breakdown
- Configurable score threshold

---

## Explainable Matching Engine

The cross-bureau overlap engine computes a **weighted composite score (0–100)** across six signals:

| Signal | Default Weight | Description |
|--------|----------------|-------------|
| AICTE Permanent ID Match | 35 | Exact ID match — strongest identity signal |
| Institution Name and Alias Similarity | 20 | Levenshtein distance + alias registry lookup |
| Geographic Alignment | 10 | State + District match |
| Category Similarity | 15 | Exact or domain-correlated category match |
| Text / TF-IDF Keyword Overlap | 15 | Jaccard similarity + domain keyword boost |
| Temporal Proximity | 5 | Days between case filing dates |

**Guardrails enforced in code:**
- Confirmed different Permanent IDs → score capped at 34 (cannot be "related")
- Same institution but near-zero text/category overlap → score capped at 44
- AI suggestions are always presented for **officer review** — the system never auto-merges or auto-closes cases

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend Framework | React 19 + TypeScript | SPA component rendering |
| Build Tool | Vite 8 | Dev server, HMR, bundling |
| Styling | TailwindCSS v4 (Vite plugin) | Utility-first CSS |
| Charts | Recharts | KPI and analytics visualizations |
| Animations | Motion (Framer Motion) | Micro-interactions and transitions |
| Icons | Lucide React | UI icon set |
| AI SDK | @google/genai v2 | Gemini API integration |
| State Management | React Context + useMemo | Global app state, reactive data |
| Persistence | Browser localStorage | Demo-mode data persistence |
| Backend/Proxy | Express.js (bundled) | Optional API proxy server |
| Fonts | Google Fonts (Inter + JetBrains Mono) | Typography |

> **No external database is required for the demo.** All data is stored in the browser's `localStorage` and seeded from `src/services/seedData.ts`.

---

## Project Structure

```
aicte-caseconnect/
├── index.html                        # App entry point (SEO meta tags, fonts)
├── vite.config.ts                    # Vite + TailwindCSS + React plugin config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies and npm scripts
├── .env.example                      # Environment variable template
│
└── src/
    ├── main.tsx                      # React root mount
    ├── App.tsx                       # App shell: layout, routing, modals
    ├── index.css                     # TailwindCSS import
    │
    ├── types/
    │   └── index.ts                  # All TypeScript interfaces and type aliases
    │
    ├── context/
    │   └── AppContext.tsx            # Global state, filters, auth, actions
    │
    ├── services/
    │   ├── matchingEngine.ts         # Explainable 6-signal overlap matcher
    │   ├── evaluationService.ts      # Benchmark test suite (Precision/Recall/F1)
    │   ├── exportService.ts          # CSV export for cases, institutions, audit
    │   ├── seedData.ts               # Synthetic demo cases, institutions, logs
    │   └── storage.ts                # AppDataService singleton (localStorage CRUD)
    │
    └── components/
        ├── layout/
        │   ├── Header.tsx            # Top nav, role switcher, search, auth trigger
        │   └── Sidebar.tsx           # Collapsible navigation sidebar
        │
        ├── common/
        │   ├── FilterBar.tsx         # Global filter bar (Bureau/Status/Region/Date)
        │   ├── Badges.tsx            # Status, priority, confidence band badges
        │   └── ToastContainer.tsx    # Floating toast notifications
        │
        ├── auth/
        │   └── AuthModal.tsx         # Login and sign-up modal for officers
        │
        ├── dashboard/
        │   └── OverviewDashboard.tsx # KPIs, charts, recent critical cases
        │
        ├── cases/
        │   ├── CaseManagement.tsx    # Case list, search, filters
        │   ├── CaseDetailDrawer.tsx  # Case timeline, actions, remarks, links
        │   └── NewCaseModal.tsx      # New case registration form
        │
        ├── institutions/
        │   ├── InstitutionRegistry.tsx   # Institution list with search and risk index
        │   └── Institution360.tsx        # Full institution profile and case history
        │
        ├── overlap/
        │   └── CrossBureauReview.tsx # Overlap suggestions with explainability UI
        │
        ├── coordination/
        │   ├── CoordinationWorkflow.tsx  # Coordination request queue and responses
        │   └── NewCoordinationModal.tsx  # Dispatch new coordination request
        │
        ├── sla/
        │   └── SLAEscalations.tsx    # SLA board, overdue indicators, escalation
        │
        ├── analytics/
        │   └── AnalyticsReports.tsx  # Charts, filters, CSV export controls
        │
        ├── audit/
        │   └── AuditTrailView.tsx    # Immutable audit log viewer
        │
        ├── admin/
        │   └── SystemAdmin.tsx       # Weight tuner, user list, seed reset
        │
        └── benchmark/
            └── BenchmarkView.tsx     # Evaluation runner and metrics display
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later (or Bun)
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/manshirai09/aicte-caseconnect.git
cd aicte-caseconnect

# 2. Install dependencies
# Note: --legacy-peer-deps is required due to a known esbuild version mismatch
# between vite@8.x (requires esbuild@^0.27) and the root pinned esbuild@0.25.x
npm install --legacy-peer-deps

# 3. Set up environment variables
cp .env.example .env
```

Edit `.env` and replace the placeholders:

```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
APP_URL="http://localhost:3000"
```

### Running the Dev Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Build the production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | TypeScript type-check (no emit) |
| `npm run clean` | Remove `dist/` and `server.js` |

---

## Demo Accounts

The prototype ships with pre-seeded officer accounts. All accounts use the password: `password123`

| Role | Email | Bureau |
|------|-------|--------|
| Senior Management | chairman@aicte-india.org | Regulation Bureau |
| RB Officer | rb.director@aicte-india.org | Regulation Bureau |
| PGRC Officer | pgrc.officer1@aicte-india.org | PGRC |
| Regional Officer | wro.officer@aicte-india.org | Regulation Bureau (Western) |
| Administrator | admin.caseconnect@aicte-india.org | Regulation Bureau |

> You can also register a new officer account via the **Sign Up** flow in the app.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI features |
| `APP_URL` | No | Base URL of the deployment (used for self-referential links) |

---

## Data and Privacy Notice

- All demo data is **fully synthetic**. No real AICTE complaint records, institution data, or personal information is used.
- AI match suggestions are treated as **decision support only** — no case is automatically merged, linked, or closed without officer approval.
- Role-based access controls are simulated in the frontend for demonstration; production deployment would require server-side enforcement.
- Do not commit passwords, API keys, real complaint data, or production credentials to this repository.

---

## Disclaimer

AICTE CaseConnect is a **student project prototype** submitted for Smart India Hackathon 2026. It is not an official AICTE service and does not imply any official partnership, endorsement, access to AICTE internal systems, or use of real complaint data.

---

## License

No license has been added yet. Until a license is explicitly included, do not assume permission to reuse, redistribute, or modify this repository's contents.
