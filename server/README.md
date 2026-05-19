# KEPlans API

REST API for **KEPlans**, a house-plans e-commerce platform. Customers browse architectural designs, place orders, and receive digital plan documents after admin approval. Admins manage designs, orders, and uploads.

## Tech stack

| Layer | Technology |
|--------|------------|
| Runtime | Node.js, TypeScript (ESM) |
| Framework | Express 5 |
| ORM | Prisma 7 + PostgreSQL (Neon) |
| Auth | JWT (`Bearer` token) |
| Email | Nodemailer (Brevo SMTP) |
| Media | Cloudinary |
| Payments | Stripe webhooks (optional) |
| Background jobs | Inngest |

## Project structure

```
server/
├── config/           # Prisma, Cloudinary, Nodemailer
├── controllers/      # Route handlers
├── middleware/       # auth, admin
├── routes/           # Express routers
├── prisma/           # schema.prisma
├── inngest/          # Background functions
├── types/express/    # Request type extensions
├── prisma.config.ts  # Prisma 7 datasource URL
└── server.ts         # Entry point
```

## Prerequisites

- Node.js 20+
- Neon PostgreSQL database
- (Optional) Cloudinary, Brevo SMTP, Stripe, Inngest accounts

## Setup

1. **Install dependencies**

   ```bash
   cd server
   npm install
   ```

2. **Environment variables**

   Copy `.env.example` to `.env` and fill in values:

   ```bash
   cp .env.example .env
   ```

3. **Prisma**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

   Optional seed data:

   ```bash
   npm run seed
   ```

4. **Run development server**

   ```bash
   npm run server
   ```

   Or without nodemon:

   ```bash
   npm start
   ```

   API base: `http://localhost:5000`

## Environment variables

See `.env.example` for the full list. Required for core features:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `ADMIN_EMAILS` | Comma-separated emails allowed as admin |

## API routes

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |

### Auth (`/api/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | — | Register user |
| POST | `/login` | — | Login, returns JWT |

### Designs (`/api/designs`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/featured` | — | Featured designs |
| GET | `/` | — | List (query: category, search, minPrice, maxPrice, sort) |
| GET | `/:id` | — | Single design |
| POST | `/` | Admin | Create design |
| PUT | `/:id` | Admin | Update design |
| DELETE | `/:id` | Admin | Delete design |

### Orders (`/api/orders`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | User | Create order |
| GET | `/` | User | My orders |
| GET | `/:id` | User | Order detail |
| GET | `/all` | Admin | All orders |
| PUT | `/:id/status` | Admin | Update status (emails on Approved) |

### Admin (`/api/admin`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/stats` | Admin | Dashboard stats |

### Upload (`/api/upload`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | User | Upload images/videos/documents to Cloudinary |

### Other

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/stripe` | Stripe webhook (raw body) |
| * | `/api/inngest` | Inngest serve endpoint |

**Auth header:** `Authorization: Bearer <token>`

## Prisma notes (v7 + Neon)

- Client is generated to `node_modules/@prisma/client` (standard output).
- Database URL lives in `prisma.config.ts`, not in `schema.prisma`.
- Runtime uses `@prisma/adapter-neon` with the Neon serverless driver.

## Deploy

1. Set all environment variables on your host (Vercel, Railway, Render, etc.).
2. Run `npx prisma generate` in build step.
3. Run migrations or `npx prisma db push` against production DB.
4. Start with `npm start` (uses `tsx server.ts`).
5. Point Stripe webhook to `https://your-domain/api/stripe`.
6. Register Inngest app URL at `https://your-domain/api/inngest`.

## Scripts

| Script | Command |
|--------|---------|
| `npm start` | Start server |
| `npm run server` | Dev with nodemon |
| `npm run build` | TypeScript compile to `dist/` |
| `npm run seed` | Seed sample designs |

## License

ISC
