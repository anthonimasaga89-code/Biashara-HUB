# Biashara HUB

**Biashara HUB** ni jukwaa (platform) linalotumia AI kuunganisha **Wafanyabiashara**, **Wateja**, na **Creators** (wataalamu wa ubunifu) mahali pamoja.

Kwa ufupi, watu watatu wanakutana hapa:
- **Mfanyabiashara** — anaweka biashara yake, bidhaa zake, na AI inamsaidia kutengeneza matangazo na kuuza.
- **Mteja** — anatafuta bidhaa, anaongea na AI, anaagiza (order), na analipa.
- **Creator** — anatoa huduma zake (design, content, n.k.) na anaajiriwa na wafanyabiashara.

AI inasaidia kwenye mambo matatu makuu:
1. **Marketing** — kutengeneza matangazo/content kwa ajili ya Instagram, Facebook, WhatsApp, TikTok n.k.
2. **Commerce** — kumsaidia mteja kutafuta bidhaa, kuagiza, na kulipa.
3. **Creator Marketplace** — kuunganisha wafanyabiashara na creators.

> **Muhimu:** Bei, stock, order na malipo — hizi zote zinatoka kwenye **database**, si kwenye AI. AI haiwezi kuandika moja kwa moja kwenye database; inaomba tu ruhusa, na backend ndiyo inayofanya kazi hiyo.

---

## Teknolojia Tunazotumia

| Sehemu | Teknolojia |
|---|---|
| Frontend (kinachoonekana) | React |
| Backend (logic) | Python + FastAPI |
| Database | PostgreSQL |
| AI | LLM API (na RAG) |

---

## Muundo wa Mradi

```
backend/
├── app/
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── businesses.py
│   │       ├── creators.py
│   │       ├── products.py
│   │       ├── categories.py
│   │       ├── content.py
│   │       ├── campaigns.py
│   │       ├── social.py
│   │       ├── ai.py
│   │       ├── conversations.py
│   │       ├── knowledge.py
│   │       ├── search.py
│   │       ├── cart.py
│   │       ├── orders.py
│   │       ├── payments.py
│   │       ├── notifications.py
│   │       ├── analytics.py
│   │       ├── subscriptions.py
│   │       └── admin.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── permissions.py
│   │   └── exceptions.py
│   │
│   ├── database/
│   │   ├── session.py
│   │   └── base.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── business.py
│   │   ├── business_member.py
│   │   ├── creator.py
│   │   ├── product.py
│   │   ├── category.py
│   │   ├── content.py
│   │   ├── campaign.py
│   │   ├── social_account.py
│   │   ├── conversation.py
│   │   ├── message.py
│   │   ├── knowledge_source.py
│   │   ├── knowledge_chunk.py
│   │   ├── cart.py
│   │   ├── order.py
│   │   ├── order_item.py
│   │   ├── payment.py
│   │   ├── lead.py
│   │   ├── review.py
│   │   ├── notification.py
│   │   ├── analytics_event.py
│   │   └── subscription.py
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── business.py
│   │   ├── creator.py
│   │   ├── product.py
│   │   ├── content.py
│   │   ├── social.py
│   │   ├── ai.py
│   │   ├── conversation.py
│   │   ├── knowledge.py
│   │   ├── cart.py
│   │   ├── order.py
│   │   ├── payment.py
│   │   ├── notification.py
│   │   ├── analytics.py
│   │   └── subscription.py
│   │
│   ├── services/
│   │   ├── auth/
│   │   ├── business/
│   │   ├── creator/
│   │   ├── product/
│   │   ├── content/
│   │   ├── social/
│   │   ├── ai/
│   │   ├── search/
│   │   ├── commerce/
│   │   ├── payment/
│   │   ├── notification/
│   │   ├── analytics/
│   │   └── subscription/
│   │
│   ├── integrations/
│   │   ├── ai/
│   │   │   ├── client.py
│   │   │   ├── prompts.py
│   │   │   └── providers/
│   │   │
│   │   ├── vector_db/
│   │   │   ├── client.py
│   │   │   └── embeddings.py
│   │   │
│   │   ├── social/
│   │   │   ├── whatsapp.py
│   │   │   ├── facebook.py
│   │   │   ├── instagram.py
│   │   │   ├── tiktok.py
│   │   │   ├── linkedin.py
│   │   │   └── x.py
│   │   │
│   │   └── payments/
│   │       ├── mpesa.py
│   │       ├── airtel_money.py
│   │       ├── mixx.py
│   │       ├── halopesa.py
│   │       ├── cards.py
│   │       └── bank.py
│   │
│   ├── repositories/
│   │   ├── user_repository.py
│   │   ├── business_repository.py
│   │   ├── creator_repository.py
│   │   ├── product_repository.py
│   │   ├── content_repository.py
│   │   └── order_repository.py
│   │
│   ├── workers/
│   │   ├── ai_tasks.py
│   │   ├── content_tasks.py
│   │   ├── social_tasks.py
│   │   ├── notification_tasks.py
│   │   └── analytics_tasks.py
│   │
│   └── utils/
│       ├── validators.py
│       ├── pagination.py
│       ├── file_handler.py
│       ├── slug.py
│       └── helpers.py
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── api/
│
├── migrations/
│
├── requirements.txt
├── requirements-dev.txt
├── alembic.ini
├── .env
├── .env.example
├── Dockerfile
├── README.md
└── .gitignore
```

frontend/
```
frontend/
└── src/
    ├── App.jsx
    ├── components/
    ├── layouts/
    ├── pages/
    │   ├── public/
    │   ├── customer/
    │   ├── business/
    │   ├── creator/
    │   └── admin/
    ├── features/
    │   ├── auth/
    │   ├── products/
    │   ├── ai/
    │   ├── orders/
    │   ├── payments/
    │   ├── social/
    │   ├── analytics/
    │   └── creators/
    ├── services/api/
    ├── hooks/
    ├── context/
    ├── utils/
    └── routes/
```

---

## Jinsi ya Kuanzisha (Backend)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env   # jaza database URL na secrets zako

alembic upgrade head
uvicorn app.main:app --reload
```

Utaona API docs kwenye: `http://localhost:8000/docs`

## Jinsi ya Kuanzisha (Frontend)

```bash
cd frontend
npm install
npm run dev
```

---

## Watumiaji (Roles)

| Role | Anafanya nini |
|---|---|
| **Customer** | Anatafuta, anaagiza, analipa |
| **Business Owner** | Anaweka biashara, bidhaa, anasimamia orders |
| **Creator** | Anatoa huduma zake, anaajiriwa |
| **Admin** | Anasimamia mfumo mzima |

---

## Mpango wa Kufikia Launch — 20 Oktoba 2026

1. Wiki ya 1: Msingi (Auth, Database, Roles)
2. Wiki ya 2: Products, Cart, Orders
3. Wiki ya 3: AI (Content generation, Chat)
4. Wiki ya 4: Malipo na Social Media
5. Wiki ya 5: Analytics, Admin, Testing
6. **20 Oktoba:** Release 🚀

---

*Biashara HUB — imetengenezwa kwa ajili ya wafanyabiashara wa Tanzania, ikiwa tayari kukua Afrika nzima.*
