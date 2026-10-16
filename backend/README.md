# BooksShop API (backend)

REST API for a book shop, built with **Node.js, Express 5 and MongoDB (Mongoose)**.
It has JWT authentication with roles, email OTP verification, and CRUD for books (with image uploads), and Google sign-in.

## Features

- Register / login with hashed passwords (bcrypt) and JWT tokens
- Role-based access: `user`, `menejer`, `admin`, `superAdmin`
- Books CRUD with pagination; only the owner (or an admin) can edit or delete a book
- Up to 5 images per book (multer, stored in `uploads/`)
- Sign in / register with Google (ID token verified with `google-auth-library`)
- Email OTP codes via Nodemailer (expire after 5 minutes, limited attempts)
- Request validation with Zod, centralized error handling

## Tech stack

Node.js · Express 5 · MongoDB · Mongoose · JWT · bcrypt · Zod · Nodemailer · multer · google-auth-library

## Getting started

```bash
cd backend
npm install
cp .env.example .env   # then fill in your own values
npm run dev
npm test               # API tests, no database needed
npm run create-admin -- you@example.com YourPassword "Your Name"
```

The server starts on `http://localhost:5000` (or the `PORT` you set).

### Environment variables

| Variable | Description |
| --- | --- |
| `PORT` | Port to run on (default `5000`) |
| `DATABASE_URL` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `EMAIL_USER` | Gmail address that sends OTP emails |
| `APP_PASSWORD` | Gmail [app password](https://support.google.com/accounts/answer/185833) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (enables Google sign-in) |
| `UPLOAD_DIR` | Folder for uploaded book images (default `./uploads`) |
| `CLIENT_URL` | Allowed frontend origin for CORS (default `http://localhost:5173`) |

## API overview

Protected routes need the header `Authorization: Bearer <token>`.

### Auth and users

| Method | Route | Access |
| --- | --- | --- |
| POST | `/users/register` | public |
| POST | `/users/login` | public |
| POST | `/users/google` | public (body: `{ credential }`, Google ID token) |
| POST | `/users/send-otp` | public |
| POST | `/users/verify-otp` | public |
| GET | `/users/profile` | logged in |
| GET | `/users` | admin, superAdmin |
| POST | `/users` | superAdmin |
| PUT | `/users/:id` | superAdmin |
| DELETE | `/users/:id` | superAdmin |
| GET | `/admin`, `/superAdmin`, `/menejer` | matching role |

### Books

| Method | Route | Access |
| --- | --- | --- |
| GET | `/books?page=1&limit=9&search=clean&sort=newest` | public |
| GET | `/books/:id` | public |
| GET | `/books/stats?muallifi=<author>` | admin, superAdmin |
| POST | `/books` | logged in (multipart: fields + up to 5 `images` files) |
| PUT | `/books/:id` | owner or admin (multipart: fields, new `images`, `removeImages` = paths to delete) |
| DELETE | `/books/:id` | owner or admin |
| POST | `/books/send`, `/books/verify-otp` | public |

## Project structure

```
├── Routes/        route definitions
├── controllers/   request handlers
├── middlewares/   auth, roles, validation, error handling
├── models/        Mongoose schemas
├── validators/    Zod schemas
├── config/        database and mail setup
├── utils/         token and OTP helpers
├── scripts/       createAdmin.js
├── tests/         API tests
├── app.js         Express app
└── server.js      entry point
```

## Notes

API response messages are written in Uzbek.
