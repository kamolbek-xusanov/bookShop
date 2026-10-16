# BooksShop frontend

React + Vite single-page app for the BooksShop API.

```bash
npm install
cp .env.example .env    # set VITE_API_URL (default http://localhost:5000)
npm run dev             # development server
npm run build           # production build in dist/
npm test                # UI tests (Vitest + Testing Library)
npm run lint
```

## Structure

```
src/
├── components/   ui/ (buttons, fields, modal ...), layout/, auth/, books/, users/
├── context/      auth and toast providers
├── hooks/        useAuth, useToast, useDebounce, useTheme, useGoogleAuth
├── locales/      uz, en, ru translations
├── pages/        Home, Books, Users, Login, Register, Profile ...
├── routes/       ProtectedRoute (login + role guard)
├── services/     axios client and API calls, i18n setup
└── utils/        helpers (JWT decode, error messages, book covers)
```

The JWT is kept in `localStorage`. When the API answers `401` for a logged-in user, the app logs out automatically.
