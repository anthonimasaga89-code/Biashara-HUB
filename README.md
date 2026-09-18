
<div align="center">

# BIASHARA HUB

**AI-Powered Business, Commerce & Creator Ecosystem**

*Connecting businesses, customers and content creators through one AI-native platform.*

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

**Target Release:** 20 October 2026 · **Market:** Tanzania (Africa-ready architecture)

</div>

---

## About The Project

Biashara HUB is an AI-powered digital ecosystem that brings together three core
capabilities on one platform:

| Pillar | What it does |
|---|---|
| **AI Marketing** | Generates and adapts business content for different social platforms; campaign creation, review, scheduling and analytics |
| **AI Commerce** | Product discovery, AI-assisted conversations, recommendations, cart, checkout, orders, payments and customer support |
| **Creator Marketplace** | Creator profiles, portfolios, services, discovery, hiring, service orders, payments and reviews |

AI acts as the connecting intelligence layer across all three — but the **database
is always the source of truth** for prices, stock, orders and payment state. AI
never writes directly to the database; it can only request actions that are
validated and executed by authorized backend services.

### Guiding Principles

- Database and verified business data are authoritative — not AI-generated content.
- Businesses, creators, customers and administrators have distinct experiences and permissions.
- The initial release is a **modular monolith** for speed and a realistic delivery timeline.
- The architecture is **Africa-ready**: country, currency, language, timezone, payment and delivery are configurable, not hard-coded.
- Third-party social/payment integrations are adapter-based.

---

## User Roles

| Role | Core Responsibility |
|---|---|
| **Customer** | Discover and purchase products/services |
| **Business Owner** | Operate a business: profile, products, orders, AI assistant, campaigns, analytics |
| **Creator** | Offer creative/professional services via profile, portfolio and AI Studio |
| **Super Admin** | Govern the platform: users, businesses, creators, orders, payments, reports |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (responsive web-first) |
| Backend | Python + FastAPI |
| Database | PostgreSQL |
| AI | LLM API + Retrieval-Augmented Generation (RAG) |
| Vector Retrieval | Vector database/store |
| Storage | Object/file storage for images, video and documents |
| Auth | Token/session-based, role-based authorization |
| API | REST/JSON |
| Deployment | Docker, cloud-hosted |

---

## System Overview

```
User Browser
    │
    ▼
React Web App
    │  HTTPS
    ▼
FastAPI Backend
    ├── PostgreSQL
    ├── Vector Store
    ├── Object Storage
    ├── LLM Provider
    ├── Payment Provider(s)
    ├── Social Provider(s)
    └── Notification Provider(s)
```

---

## Project Structure

```
backend/
├── app/
│   ├── main.py
│   │
│   ├── api/
│   │   ├── router.py
│   │   └── v1/                 # one file per route group
│   │       ├── auth.py  users.py  businesses.py  business_members.py
│   │       ├── creators.py  products.py  categories.py  media.py
│   │       ├── content.py  campaigns.py  social_accounts.py
│   │       ├── ai.py  conversations.py  knowledge.py  search.py
│   │       ├── cart.py  orders.py  payments.py
│   │       ├── creator_services.py  creator_orders.py
│   │       ├── leads.py  reviews.py  notifications.py
│   │       └── analytics.py  subscriptions.py  admin.py
│   │
│   ├── core/                   # config, security, permissions, exceptions, logging, constants
│   ├── database/                # session, base, migrations
│   ├── models/                  # one file per entity (SQLAlchemy)
│   ├── schemas/                 # one file per domain (Pydantic)
│   ├── services/                # one subfolder per domain (business logic)
│   ├── repositories/            # organized by domain (database access layer)
│   ├── integrations/
│   │   ├── llm/                 # client, prompts, providers
│   │   ├── vector_db/           # client, embeddings
│   │   ├── social/              # facebook, instagram, whatsapp, tiktok, linkedin, x
│   │   └── payments/            # mpesa, airtel_money, mixx, halopesa, cards, bank
│   ├── workers/                 # content_tasks, ai_tasks, notification_tasks, analytics_tasks, social_tasks
│   └── utils/                   # validators, pagination, file_handler, slug, helpers
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── api/
│
├── alembic.ini
├── requirements.txt
├── requirements-dev.txt
├── .env / .env.example
├── Dockerfile
└── README.md

frontend/
└── src/
    ├── App.jsx
    │
    ├── components/                 # shared/reusable UI components
    │
    ├── layouts/                    # shell layouts per experience
    │
    ├── pages/
    │   ├── public/                 # home, search, product/business/creator pages
    │   ├── customer/                # cart, checkout, account, orders
    │   ├── business/                 # business dashboard pages
    │   ├── creator/                  # creator dashboard pages
    │   └── admin/                    # admin dashboard pages
    │
    ├── features/                   # domain-oriented feature modules
    │   ├── auth/
    │   ├── products/
    │   ├── ai/
    │   ├── orders/
    │   ├── payments/
    │   ├── social/
    │   ├── analytics/
    │   └── creators/
    │
    ├── services/
    │   └── api/                    # HTTP client(s) consuming the FastAPI backend
    │
    ├── hooks/                      # shared custom hooks
    ├── context/                    # global/shared React context providers
    ├── utils/                      # shared frontend utilities
    └── routes/                     # route definitions per experience
```

### Frontend Experiences

| Experience | Primary pages/features |
|---|---|
| **Public / Customer** | Home, search, products, businesses, creators, categories, product detail, business profile, creator profile, AI chat, cart, checkout, account, orders |
| **Business Dashboard** | Overview, products, orders, customers, leads, AI assistant, content, campaigns, social media, analytics, team, subscription, settings |
| **Creator Dashboard** | Overview, portfolio, services, projects, messages, AI Studio, orders, payments, reviews, analytics, settings |
| **Admin Dashboard** | Overview, users, businesses, creators, products, orders, payments, AI usage, reports, subscriptions, analytics, system settings |

> The web app is responsive-first (phone, tablet, desktop). Native mobile apps are a later roadmap item.
> Frontend consumes FastAPI over HTTP/JSON and never treats client-side state as authoritative for price, stock, order status or payment state.

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Docker (optional, recommended)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# edit .env with DATABASE_URL, SECRET_KEY, LLM/API keys, etc.

alembic upgrade head
uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Docker (Recommended)

```bash
docker-compose up --build
```

---

## Database Domains

| Domain | Tables (examples) |
|---|---|
| Users | users, roles, permissions, user_permissions |
| Business | businesses, business_members, business_settings, business_categories |
| Products | products, product_images, product_videos, categories, inventory |
| Creators | creators, creator_services, creator_portfolios, creator_skills, creator_reviews |
| Content | content_posts, content_variants, media_assets, campaigns, scheduled_posts |
| Social | social_accounts, social_platforms, publishing_logs |
| AI | conversations, messages, knowledge_sources, knowledge_chunks, embeddings, ai_usage |
| Commerce | carts, cart_items, orders, order_items, order_status_history |
| Payments | payments, payment_transactions, payment_methods |
| Analytics | analytics_events, content_metrics, conversion_events, business_metrics |
| Subscriptions | plans, subscriptions, usage_limits |
| Notifications | notifications, notification_logs |

> Business data is **tenant-scoped**: one business's data is never accessible to another without an explicitly authorized workflow.

---

## Core Order Flow

```
Order Placed → Payment Received → Business Confirmed
    → Preparing → Out for Delivery → Delivered
```

Carts can hold products from multiple businesses. Checkout creates a
**parent order** with **business-specific sub-orders**. Each business must
manually confirm its own sub-order before fulfillment.

---

## MVP Scope

| Area | Scope |
|---|---|
| Customer | Marketplace, search, product/business pages, AI chat, cart, checkout, order tracking |
| Business | Registration, profile, products, orders, AI assistant, AI Content Studio |
| Creator | Registration, profile, portfolio, services, basic hiring flow |
| Admin | Users, businesses, creators, products, orders, basic analytics |
| AI | Content generation, platform adaptation, business RAG, customer assistant, recommendations, controlled actions |
| Payments | Provider abstraction + selected viable integration(s) |

---

## Security

- Secure authentication and password hashing
- Role-based access control and permission checks
- Tenant isolation between businesses
- Server-side validation of all business operations
- Payment webhook verification
- Rate limiting on auth and AI endpoints
- Audit logs for sensitive admin/business actions
- Secrets stored via environment/secret management — never in source code
- AI guardrails: never fabricate price, stock, payment or order state

---

## Roadmap to Launch (20 Oct 2026)

| Period | Focus |
|---|---|
| 18–20 Sep | Requirements + architecture — frozen scope, repo structure, ERD/API plan |
| 21–27 Sep | Foundation — React, FastAPI, PostgreSQL, auth, roles, business/creator profiles |
| 28 Sep–4 Oct | Core commerce — products, search, marketplace, cart, orders |
| 5–11 Oct | AI core — content generation, RAG, customer assistant, recommendations |
| 12–16 Oct | Integrations — payments, social adapters, notifications |
| 17–18 Oct | Analytics + admin dashboard |
| 19 Oct | QA + deployment |
| 20 Oct | 🚀 Release |

---

## License

*(License to be determined.)*

---

<div align="center">

**Built with FastAPI · Designed for Businesses, Customers & Creators · Made for Tanzania, built for Africa**

</div>
