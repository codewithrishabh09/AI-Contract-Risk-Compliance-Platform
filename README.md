# 🧠 LexMind — AI Contract Intelligence Platform

> **Smarter Contract Analysis. Safer Business Decisions.**

LexMind is an **AI-powered Contract Intelligence and Risk & Compliance Platform** designed to help organizations understand contracts faster, identify potential risks, track contract versions, monitor compliance, and ask evidence-backed questions about their documents.

Instead of treating AI as a generic chatbot, LexMind focuses on **grounded contract intelligence** — connecting AI-generated insights back to the actual contract evidence.

---

## 🚀 Why LexMind?

Contracts are often long, complex, and difficult to review manually.

Important clauses related to:

- Payment obligations
- Termination
- Liability
- Renewal
- Compliance
- Financial obligations
- Contractual risks

can easily be overlooked during manual review.

LexMind aims to make this process faster and more reliable by combining:

```text
Contract Management
        +
Document Processing
        +
AI Risk Analysis
        +
Evidence-backed RAG
        +
Compliance Monitoring
        +
Version Tracking
        +
Auditability
        +
Processing Infrastructure
```

into a single workspace.

---

# ✨ Key Features

## 📄 1. Contract Management

LexMind provides a centralized workspace for managing contracts and their versions.

Users can:

- Upload contracts
- View contracts
- Open detailed contract information
- Track contract versions
- View document processing status
- Navigate between contract intelligence modules

---

## 🤖 2. AI Contract Risk Analysis

LexMind analyzes contract content and identifies potentially risky clauses.

Risk findings can contain:

- Risk severity
- Finding category
- Risk title
- Description
- Contract evidence
- Recommendation
- Confidence score
- Page information
- Finding status

### Risk Levels

```text
CRITICAL
HIGH
MEDIUM
LOW
```

This allows users to quickly identify the clauses that require the most attention.

---

# 🔎 3. Evidence-Backed Contract Q&A

LexMind includes an AI contract assistant that allows users to ask questions about a specific contract version.

Example questions:

```text
What are the payment obligations?

What are the termination conditions?

What are the liability provisions?

What are the renewal terms?
```

The system retrieves relevant contract content and generates an answer based on the selected contract version.

Instead of presenting an unsupported answer, the interface exposes the relevant source information.

Example:

```text
AI Answer

The client may terminate the agreement after
the specified period by providing the required
written notice.

Evidence from Contract

Page 2 · Chunk 5
```

This makes the AI response more **traceable and explainable**.

---

# 🧠 RAG Architecture

LexMind's Contract Intelligence layer follows a retrieval-grounded workflow.

```text
                  User Question
                        │
                        ▼
              Selected Contract Version
                        │
                        ▼
                Retrieve Relevant
                Document Chunks
                        │
                        ▼
                   Top-K Context
                        │
                        ▼
                  AI Application
                     Model
                        │
                        ▼
                 Grounded Answer
                        │
                        ▼
                 Source Citations
```

The application sends the question together with the selected:

```text
contractId
versionId
top_k
```

The retrieved context is then used to generate a contract-specific response.

---

# 📊 4. Contract Risk Trends

LexMind tracks risk across different versions of the same contract.

Users can monitor:

- Current risk score
- Previous risk score
- Risk score change
- Risk level
- Finding count
- High-risk findings
- Critical findings
- Version history

Risk direction is represented as:

```text
IMPROVED
WORSENED
UNCHANGED
NO PREVIOUS DATA
```

This makes it possible to understand whether contract risk is increasing or decreasing over time.

---

# 🛡️ 5. Compliance Monitoring

The Compliance workspace provides visibility into contract-related compliance information.

It is designed to help teams move from:

```text
Finding a clause
      ↓
Understanding the risk
      ↓
Monitoring the requirement
      ↓
Taking action
```

rather than treating contract analysis as a one-time operation.

---

# 📜 6. Audit Logs

LexMind maintains audit information for important application activity.

Auditability is especially important for enterprise contract intelligence because users should be able to understand:

- What happened
- When it happened
- Which contract was involved
- Which user initiated the action

---

# ⚙️ 7. Processing Jobs

LexMind includes a real processing-job workflow backed by the backend API.

The Processing Jobs workspace supports:

- Job listing
- Pagination
- Status filtering
- Job-type filtering
- Attempt tracking
- Error information
- Created timestamps
- Started timestamps
- Completed timestamps
- Automatic polling for active jobs

### Job States

```text
QUEUED
RUNNING
SUCCEEDED
FAILED
```

Active jobs are automatically refreshed by the frontend while they are being processed.

---

# 🔐 8. Authentication & Authorization

LexMind uses JWT-based authentication.

The application includes:

- User registration
- User login
- JWT access tokens
- Authenticated user context
- Protected routes
- Public-only authentication routes
- Permission-based backend authorization
- Organization-aware data access

### Authentication Flow

```text
Register
   │
   ▼
Login
   │
   ▼
JWT Access Token
   │
   ▼
Authenticated Frontend Session
   │
   ▼
Authorization Header
   │
   ▼
FastAPI
   │
   ▼
JWT Validation
   │
   ▼
User + Organization Context
   │
   ▼
Permission Checks
```

---

# 📈 9. Workspace Dashboard

The LexMind dashboard provides a high-level view of the organization's contract workspace.

It includes areas such as:

- Total contracts
- High-risk contracts
- Critical findings
- Pending analysis
- Risk overview
- Risk distribution
- Recent contracts
- Quick actions
- Workspace activity

The dashboard follows the same visual language as the rest of the application.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │      LexMind UI      │
                         │ React + TypeScript   │
                         │       + Vite         │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │      FastAPI         │
                         │       Backend        │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
       │ PostgreSQL   │      │    Redis     │      │ AI / RAG     │
       │  + pgvector  │      │              │      │   Pipeline   │
       └──────────────┘      └──────────────┘      └──────────────┘
              │
              ▼
      Contract Data
      ├── Organizations
      ├── Users
      ├── Contracts
      ├── Versions
      ├── Documents
      ├── Chunks
      ├── Clauses
      ├── Analysis Results
      ├── Risk Findings
      ├── Processing Jobs
      └── Audit Logs
```

---

# 🛠️ Tech Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack React Query
- Tailwind CSS
- Lucide React

## Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- PostgreSQL
- pgvector
- Redis
- JWT Authentication

## AI / ML

- Retrieval-Augmented Generation (RAG)
- Vector Search
- Semantic Retrieval
- Document Chunking
- Evidence-grounded Question Answering
- AI-assisted Risk Analysis
- Confidence Scoring

## Testing & Development

- Pytest
- REST APIs
- Swagger / OpenAPI
- Docker
- Git

---

# 📁 Project Structure

```text
LexMind/
│
├── app/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── dashboard.py
│   │   │   └── health.py
│   │   │
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── jobs.py
│   │       ├── audit.py
│   │       ├── version_analysis.py
│   │       └── ...
│   │
│   ├── models/
│   ├── schemas/
│   ├── repositories/
│   ├── services/
│   └── ...
│
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── features/
│       ├── layouts/
│       ├── lib/
│       │   └── api/
│       ├── pages/
│       ├── types/
│       ├── App.tsx
│       └── index.css
│
├── alembic/
│
├── tests/
│
├── .env.example
├── README.md
└── ...
```

---

# 🗄️ Database Architecture

LexMind uses **PostgreSQL with pgvector** for persistent application data and vector-based retrieval.

The core data relationships follow this structure:

```text
Organization
    │
    ├── Users
    │
    └── Contracts
           │
           └── Contract Versions
                    │
                    ├── Documents
                    │      │
                    │      └── Document Chunks
                    │
                    ├── Clauses
                    │
                    └── Processing Jobs
                    │
                    └── Analysis Results
                              │
                              └── Risk Findings

Organization / Users
        │
        └── Audit Logs
```

This structure allows LexMind to maintain contract history and analyze individual versions independently.

---

# 🔌 API Architecture

Backend APIs are versioned under:

```text
/api/v1
```

Major API areas include:

| API Area | Purpose |
|---|---|
| `/auth` | Authentication |
| `/dashboard` | Workspace dashboard |
| `/contracts` | Contract management |
| `/upload` | Contract upload |
| `/analysis` | AI contract analysis |
| `/findings` | Risk findings |
| `/risk-trends` | Risk tracking |
| `/compliance` | Compliance |
| `/audit` | Audit logs |
| `/jobs` | Processing jobs |
| `/version-analysis` | Version analysis |

### Processing Jobs API

```http
GET /api/v1/jobs
```

Supports:

```text
page
page_size
status
job_type
```

Individual job:

```http
GET /api/v1/jobs/{job_id}
```

---

# 🌐 Application Routes

## Public Routes

```text
/
 /login
 /register
```

## Protected Routes

```text
/dashboard
/profile
/contracts
/contracts/:contractId
/upload
/analysis
/findings
/risk-trends
/compliance
/audit
/jobs
/settings
```

Protected routes require authentication.

---

# 🎨 Design System

LexMind follows a **Premium Legal-Tech** visual identity.

### Color Palette

```text
Sage Green       #9CAF88
Dark Sage        #718060
Soft Sage        #E5EADF

Off White        #F7F5EF
Card             #FFFEFA

Tomato           #E8412C

Dark Ink         #243027
Muted Text       #687268
Border           #DDDCD3
```

### Typography

```text
Playfair Display
→ Major headings and editorial content

DM Sans
→ Application UI and body text
```

The interface is designed to feel:

- Premium
- Calm
- Professional
- Trustworthy
- Enterprise-ready
- Legal-tech focused

The design intentionally avoids generic SaaS gradients and overly aggressive visual effects.

---

# 🔄 Typical User Journey

```text
                     ┌─────────────┐
                     │    Login    │
                     └──────┬──────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  Dashboard  │
                     └──────┬──────┘
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
       Upload Contract             View Contracts
               │                         │
               ▼                         ▼
       Create Contract Version     Contract Details
               │                         │
               ▼                         ▼
       Process Document             Version History
               │                         │
               └────────────┬────────────┘
                            ▼
                     AI Risk Analysis
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
        Risk Findings              Contract Q&A
               │                         │
               │                         ▼
               │                  Evidence / RAG
               │
               └────────────┬────────────┘
                            ▼
                  Compliance + Audit
                            │
                            ▼
                      Risk Trends
```

---

# 🧪 Testing

Backend tests are written using Pytest.

Run:

```bash
pytest
```

Frontend production build:

```bash
cd client
npm run build
```

Backend API documentation during development:

```text
http://localhost:8000/docs
```

---

# ⚙️ Local Development

## 1. Clone

```bash
git clone <repository-url>
cd LexMind
```

## 2. Backend

Create a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create environment configuration:

```bash
cp .env.example .env
```

Configure:

```text
PostgreSQL
Redis
JWT
AI / Model configuration
Application settings
```

## 3. Database

Run migrations:

```bash
alembic upgrade head
```

## 4. Start Backend

```bash
uvicorn app.main:app --reload
```

## 5. Frontend

```bash
cd client
npm install
npm run dev
```

Example frontend API configuration:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

# 🔐 Security

LexMind includes several security mechanisms:

- JWT authentication
- Protected frontend routes
- Backend authorization
- Permission checks
- Organization-scoped data access
- Audit logging
- Redis-backed controls where configured
- Controlled document access
- Evidence-grounded AI responses

Secrets and credentials should always be stored in environment variables and should never be committed to Git.

---

# 📌 Current Project Status

### ✅ Implemented

- JWT Authentication
- User Registration
- User Login
- Protected Routes
- Organization-aware access
- Contract Management
- Contract Versions
- Contract Upload
- Document Processing
- AI Contract Analysis
- Risk Findings
- Risk Trends
- Compliance
- Audit Logs
- Contract Q&A
- Evidence-backed RAG
- Processing Jobs API
- Processing Jobs UI
- React Query integration
- Premium Legal-Tech UI
- Workspace Dashboard

### 🚧 In Progress

- Settings with real backend data
- Further dashboard refinements
- Advanced AI/RAG improvements
- Production deployment hardening

---

# 🗺️ Future Roadmap

Potential future improvements:

- Advanced clause extraction
- Hybrid keyword + vector retrieval
- Retrieval reranking
- Contract comparison
- Automated compliance alerts
- Contract obligation tracking
- More granular organization roles
- Background workers
- Queue-based processing
- Kafka event architecture
- Kubernetes deployment
- CI/CD pipeline
- Expanded Pytest coverage
- Observability and monitoring
- AI evaluation pipelines
- Human-in-the-loop contract review
- Advanced document comparison

---

# 👨‍💻 About the Developer

## Rishabh 🚀

**Software Engineer | Backend & AI Engineer**

I am a Computer Science Engineering student focused on building **backend systems, AI-powered applications, RAG systems, and scalable software solutions**.

My primary interests include:

- Backend Engineering
- AI Engineering
- Retrieval-Augmented Generation
- System Design
- Distributed Systems
- REST API Development
- Database Architecture
- Authentication & Authorization
- Developer-focused AI applications

I enjoy building products that combine strong backend engineering with practical AI capabilities rather than building AI features in isolation.

### Technical Focus

```text
Languages
→ Python • C++ • C • JavaScript • SQL

Backend
→ FastAPI • Django • REST APIs

Databases
→ PostgreSQL • MySQL • MongoDB

Infrastructure
→ Redis • Docker • AWS

AI / ML
→ RAG • LangChain • Vector Search • AI Agents

Engineering
→ DSA • DBMS • OS • Computer Networks • System Design
```

### Selected Work

Alongside LexMind, I have worked on projects involving:

- AI-powered resume matching
- AI API security
- anomaly and threat detection
- Redis-based rate limiting
- JWT authentication
- PostgreSQL and vector databases
- AI chat applications
- RAG-based systems
- backend API development

---

# 🔗 Connect With Me

**GitHub:** https://github.com/codewithrishabh09?tab=overview&from=2026-11-01&to=2026-11-16

**LinkedIn:** https://www.linkedin.com/in/rishabh-dwivedi-855857374/

**Role:** Software Engineer | Backend & AI Engineer

---

# ⭐ Why LexMind?

LexMind is built around a simple idea:

> **AI should not just give an answer. It should help users understand why that answer can be trusted.**

The platform therefore combines:

```text
                 LexMind
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
     Contracts     AI          Risk
        │           │           │
        ▼           ▼           ▼
     Versions      RAG      Findings
        │           │           │
        └───────────┼───────────┘
                    │
                    ▼
              Compliance
                    │
                    ▼
                 Audit
                    │
                    ▼
             Safer Decisions
```

The goal is to turn complex contract documents into **clear, traceable, and actionable business intelligence**.

---

# 📄 License

Add the project's final license here before making the repository public.

---

## Built with ❤️ by Rishabh Dwivedi

**LexMind — Smarter Contract Analysis. Safer Business Decisions.**