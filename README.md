# WealthManager

> Professional Asset & Wealth Management Platform
## WebSite : https://wealthmanager-uema.onrender.com/
---

## Overview

WealthManager is a full-stack web application designed to help users manage personal and investment assets. It provides secure authentication, hierarchical asset categorization, transaction tracking, and interactive data visualization. The project is split into a React/Vite frontend (`client/`) and a Node.js/Express/MongoDB backend (`server/`).

## Technologies Used

- **Frontend:** React 19, Vite, styled-components, Axios, React Router, Recharts
- **Backend:** Node.js, Express, MongoDB (Mongoose), Passport.js, Joi, connect-mongo, dotenv
- **Dev Tools:** ESLint, EJS, ejs-mate
- **Deployment:** Render (backend API base URL)
- **Session/Auth:** express-session, passport-local-mongoose

## Architecture

- **Frontend (`client/`)**: Built with React 19, Vite, and styled-components. Features modular components, hooks for state/context, and protected routes for authenticated access.
- **Backend (`server/`)**: Node.js with Express, MongoDB via Mongoose, Passport.js for authentication, and modular controllers/routes. Asset data is organized in nested categories with cascade deletion and value aggregation.
- **API Communication**: RESTful endpoints, with Axios on the frontend (`client/src/servises/apis/apis.js`).
- **Session & Auth**: Passport-local-mongoose for user management, sessions via express-session and connect-mongo.

## Key Features

- **User Authentication**: Registration and login via Passport.js. See `client/src/componets/layoutComponets/authentication/` and `server/middlewares/Authentication.js`.
- **Asset Management**: Hierarchical categories, products, transactions, and statements. Cascade deletion and nesting up to 4 levels. See `server/models/assets/assetsCat.js`.
- **Data Visualization**: Interactive charts for asset performance (`client/src/pages/assets/charts.jsx`).
- **Flash Messaging**: Context-based flash messages for user feedback (`client/src/hooks/flashContext.jsx`).
- **Auto-Refresh**: User/session data auto-refreshes for up-to-date views (`client/src/hooks/userContext.jsx`).

## Project Structure

```
wealthManager/
├── client/         # React frontend
│   ├── src/
│   │   ├── componets/         # UI components (layout, single, route protection)
│   │   ├── hooks/             # Custom hooks (user, flash, form, etc.)
│   │   ├── pages/             # Page-level components
│   │   ├── servises/          # API abstraction
│   │   ├── styles/            # Global/theme styles
│   │   └── utills/            # Helpers/utilities
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── server/         # Node.js backend
│   ├── config/              # DB connection
│   ├── controllers/         # Business logic
│   ├── middlewares/         # Auth, CORS, session, parsing
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routers
│   ├── utills/              # Logging, errors, helpers
│   ├── package.json
│   └── server.js
├── LICENSE.txt
└── README.md
```

## Setup & Usage

### Prerequisites

- Node.js v18+
- npm (or yarn)
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository**
2. **Install dependencies**
   - Frontend: `cd client && npm install`
   - Backend: `cd server && npm install`
3. **Environment Variables**
   - Backend: Create `.env` in `server/` with at least `DB_URL` and `PORT`.
4. **Run Development Servers**
   - Frontend: `cd client && npm run dev`
   - Backend: `cd server && npm start`

### API Base URL

- The frontend expects the backend at `https://wealthmanager-backend-1y3o.onrender.com` (see `apis.js`). Update as needed for local development.

## Developer Workflows

- **Frontend Build**: `npm run build` (Vite)
- **Frontend Lint**: `npm run lint`
- **Backend Start**: `npm start`
- **Backend DB Indexes**: Auto-created on startup (`server/config/connectDB.js`)
- **Session & Auth**: Managed via Passport.js and express-session
- **Debugging**: Use browser dev tools for frontend; Node.js debugger or console for backend

## Conventions & Patterns

- **Component Organization**: UI split into layout, single, and route protection components
- **Hooks**: Custom hooks for context, form, auto-refresh, etc.
- **API Abstraction**: All HTTP requests via Axios instance (`apis.js`)
- **Cascade Deletion**: Asset categories delete child products/transactions/statements recursively
- **Protected Routes**: React Router + custom protection (`protectedRoute.jsx`)
- **Flash Messages**: Context-based, auto-dismissed
- **Data Structure**: See `structure.txt` for user/category schema

## License

MIT License. See `LICENSE.txt`.

---

## 📞 Contact

For any inquiries or feedback, please reach out to:

Email: amirsheikhvia@gmail.com

GitHub: https://github.com/VampireTRIBE
