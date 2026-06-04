# Syed Hannan Sarmadi — Portfolio

A full-stack personal portfolio built with **Node.js + Express + MongoDB**, featuring dynamic content via REST APIs, a contact form with email delivery, and a dark editorial frontend.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | HTML5, CSS3 (custom), Vanilla JS (ES6+)         |
| Backend    | Node.js 18+, Express.js                         |
| Database   | MongoDB Atlas (Mongoose ODM)                    |
| Email      | Nodemailer (Gmail SMTP)                         |
| Security   | Helmet, express-rate-limit, express-validator   |
| Deployment | Vercel (serverless) + MongoDB Atlas             |

---

## Project Structure

```
portfolio/
├── backend/
│   ├── config/
│   │   ├── db.js          # MongoDB connection
│   │   └── seed.js        # Database seeder
│   ├── controllers/
│   │   ├── profileController.js
│   │   ├── projectController.js
│   │   ├── skillController.js
│   │   └── contactController.js
│   ├── middleware/
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── Profile.js
│   │   ├── Project.js
│   │   ├── Skill.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── profile.js
│   │   ├── projects.js
│   │   ├── skills.js
│   │   └── contact.js
│   └── server.js
├── frontend/
│   └── public/
│       ├── css/style.css
│       ├── js/main.js
│       └── index.html
├── .env.example
├── .gitignore
├── package.json
└── vercel.json
```

---

## REST API Endpoints

| Method | Endpoint           | Description                        |
|--------|--------------------|------------------------------------|
| GET    | /api/health        | Server health check                |
| GET    | /api/profile       | Fetch profile/bio data             |
| GET    | /api/projects      | List all projects                  |
| GET    | /api/projects?featured=true | Featured projects only  |
| GET    | /api/projects/:id  | Single project detail              |
| GET    | /api/skills        | All skill categories + items       |
| POST   | /api/contact       | Submit contact message             |

---

## Local Development Setup

### 1 — Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (free tier works)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords)

### 2 — Clone & Install

```bash
git clone https://github.com/Syed-hannan0910/<your-repo-name>.git
cd <your-repo-name>
npm install
```

### 3 — Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
NODE_ENV=development

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority

# Gmail SMTP (use App Password, NOT your real password)
EMAIL_USER=syedhanshab9802@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_TO=syedhanshab9802@gmail.com

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App passwords → generate one for "Mail".

### 4 — Seed the Database

```bash
npm run seed
```

This inserts your profile, projects, skills, and education data into MongoDB.

### 5 — Start Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site is live.

---

## Deploying to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial portfolio commit"
git remote add origin https://github.com/Syed-hannan0910/<repo>.git
git push -u origin main
```

### Step 2 — Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Vercel auto-detects `vercel.json` — no extra build config needed

### Step 3 — Add Environment Variables in Vercel

In Vercel Dashboard → **Settings → Environment Variables**, add:

| Key                    | Value                                              |
|------------------------|----------------------------------------------------|
| `MONGODB_URI`          | Your Atlas connection string                       |
| `EMAIL_USER`           | `syedhanshab9802@gmail.com`                        |
| `EMAIL_PASS`           | Your Gmail App Password                            |
| `EMAIL_TO`             | `syedhanshab9802@gmail.com`                        |
| `NODE_ENV`             | `production`                                       |
| `RATE_LIMIT_WINDOW_MS` | `900000`                                           |
| `RATE_LIMIT_MAX`       | `100`                                              |

### Step 4 — Deploy

Click **Deploy**. Vercel builds and deploys in ~60 seconds.

Your site is live at: `https://<project-name>.vercel.app`

### Step 5 — Seed Production Database

After deploy, run the seeder locally pointing to your prod Atlas URI:

```bash
# Temporarily set MONGODB_URI to your Atlas prod URI in .env, then:
npm run seed
```

---

## MongoDB Atlas Setup (Free Tier)

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a **free M0 cluster**
3. Under **Database Access** → Add user with password
4. Under **Network Access** → Add `0.0.0.0/0` (allow all IPs, required for Vercel serverless)
5. Under **Databases → Connect → Drivers** → copy the connection string
6. Replace `<password>` in the string and paste into your `.env`

---

## Key Design Decisions

### MVC / Layered Architecture

```
Request → Route → Middleware (validation, rate-limit) → Controller → Model → DB
```

- **Routes** define endpoints and apply middleware
- **Controllers** contain all business logic
- **Models** define Mongoose schemas with validation
- **Middleware** handles auth, rate limiting, input sanitization independently

### Security Hardening

- `helmet` sets secure HTTP headers
- `express-rate-limit` prevents brute force (5 contact submissions/hour per IP)
- `express-validator` validates and sanitizes all input server-side
- `sanitize-html` strips any HTML/XSS from contact messages before DB storage
- Environment variables for all secrets — never hardcoded
- `express.json({ limit: '10kb' })` prevents payload flooding

### Email Flow

1. User submits form → client-side validation runs first
2. Server re-validates with `express-validator`
3. `sanitize-html` cleans the input
4. Message saved to MongoDB
5. Nodemailer sends owner notification email
6. Auto-reply sent to the sender
7. JSON response returned to client

---

## Available Scripts

```bash
npm start       # Production server
npm run dev     # Development with nodemon (auto-reload)
npm run seed    # Seed MongoDB with portfolio data
```

---

## Customisation

### Update portfolio content

Edit `backend/config/seed.js` and re-run `npm run seed`. All data is driven from the database — no HTML edits needed.

### Add a new project

```js
// In seed.js → projectsData array:
{
  title: 'My New Project',
  subtitle: 'Short Type Label',
  description: 'Brief description for the card.',
  tags: ['React', 'Node.js'],
  github: 'https://github.com/...',
  featured: true,
  order: 5,
  color: '#EC4899'
}
```

Re-run `npm run seed`.

---

## License

MIT © 2026 Syed Hannan Sarmadi

---

## Vercel Deployment Fixes (v2 — 500 Error Resolution)

### Root Causes of the 500 Error

| # | Issue | Fix Applied |
|---|-------|-------------|
| 1 | `app.listen()` ran on serverless → crash before handling requests | Wrapped in `if (NODE_ENV !== 'production')` guard |
| 2 | CORS `origin: false` blocked all Vercel requests | Changed to `origin: '*'` (open) |
| 3 | `express-rate-limit` uses in-memory state → breaks on cold start | Made it a no-op passthrough in production |
| 4 | `morgan` not in production `dependencies` | Moved to `devDependencies`, only loaded locally |
| 5 | MongoDB connection not cached → new connection per request → timeout | Added `global._mongooseConnection` cache pattern |
| 6 | Controllers didn't explicitly call `connectDB()` | Each controller now calls `await connectDB()` first |
| 7 | `vercel.json` static route pattern wrong for PDF/CSS/JS | Explicit per-type routes + `@vercel/static` build |

### Vercel Environment Variables Checklist

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables** and add ALL of these:

```
MONGODB_URI        = mongodb+srv://<user>:<pass>@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
EMAIL_USER         = syedhanshab9802@gmail.com
EMAIL_PASS         = xxxx xxxx xxxx xxxx   ← Gmail App Password (not your real password)
EMAIL_TO           = syedhanshab9802@gmail.com
NODE_ENV           = production
```

> **Critical**: `MONGODB_URI` must have `0.0.0.0/0` whitelisted in MongoDB Atlas Network Access. Vercel's IPs change — wildcard is the only reliable option.

### MongoDB Atlas Network Access

1. Go to Atlas → **Network Access → Add IP Address**
2. Click **Allow Access from Anywhere** → `0.0.0.0/0`
3. Save — changes take ~30 seconds to propagate

### After Deploying

Redeploy from Vercel dashboard (to pick up the new env vars), then verify:
```
https://your-site.vercel.app/api/health   → should return {"status":"ok"}
https://your-site.vercel.app/api/profile  → should return your profile data
```

If `/api/health` works but `/api/profile` returns 500, the issue is MongoDB (check URI + network access).
