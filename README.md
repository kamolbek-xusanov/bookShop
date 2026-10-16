# BooksShop

A full-stack book shop: browse and search books, register and log in, and add, edit or delete your own books. Admins also manage users.

**Stack:** React 19 · Vite · Tailwind CSS 4 · TanStack Query · i18next (uz / en / ru) · Node.js · Express 5 · MongoDB (Mongoose) · JWT · Zod

## Features

- Modern responsive UI in three languages (Uzbek, English, Russian)
- Register and log in with JWT; sessions expire automatically
- Role-based access: `user`, `menejer`, `admin`, `superAdmin`
- Books: search, pagination, create / edit / delete (owners and admins)
- Up to 5 photos per book (JPG, PNG, WEBP, GIF, 5 MB each); the first one is the cover
- Sign in or register with Google in one click
- Light and dark theme (follows the system, remembered per browser)
- Users: list for admins, full management for superAdmin
- Email OTP codes (Nodemailer), request validation, centralized error handling
- Automated tests for both the API and the UI

## Project structure

```
├── backend/    Express + MongoDB REST API
└── frontend/   React single-page app
```

## Getting started

You need Node.js 20+ and a MongoDB database (a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # fill in DATABASE_URL, JWT_SECRET, ...
npm run dev              # http://localhost:5000
```

Make your first admin (after registering in the app, or with a new email):

```bash
npm run create-admin -- you@example.com YourPassword "Your Name"
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL must point to the backend
npm run dev              # http://localhost:5173
```

## Tests

```bash
cd backend && npm test      # API: auth, roles, validation, OTP
cd frontend && npm test     # UI: login, register, route guards, book forms
```

## Google sign-in

1. Open [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials → Create credentials → OAuth client ID** → type **Web application**.
2. Add `http://localhost:5173` (and your real site URL later) under **Authorized JavaScript origins**.
3. Copy the client ID into **both** `.env` files:
   - `backend/.env` → `GOOGLE_CLIENT_ID=...`
   - `frontend/.env` → `VITE_GOOGLE_CLIENT_ID=...`

Without a client ID the Google button is hidden and everything else still works.

## Book images

Images are uploaded with the book (multipart form) and stored in `backend/uploads/`, served at `/uploads/<file>`.
On hosts with a temporary disk (Render free tier, Heroku, ...) uploaded files disappear on every redeploy. In that case
mount a persistent disk and set `UPLOAD_DIR` to it, or switch the storage to Cloudinary / S3.

## Roles

| Role | Can do |
| --- | --- |
| `user` | Browse, add own books, edit/delete own books |
| `menejer` | same as `user` |
| `admin` | + manage all books, view users |
| `superAdmin` | + create, edit and delete users |

## Author

Kamol Xusanov, [@kamolbek-xusanov](https://github.com/kamolbek-xusanov)
