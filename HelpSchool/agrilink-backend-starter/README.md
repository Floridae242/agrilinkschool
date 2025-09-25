# AgriLink Backend (Express + Prisma + PostgreSQL)

## Setup
```bash
npm i
cp .env.example .env  # set DATABASE_URL
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Endpoints
- `GET /health`
- `GET /api/products`
- `POST /api/orders`  body: { items: [{productId, qty, price}], pickupPoint? }
- `GET /api/metrics`
