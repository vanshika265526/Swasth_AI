# SwasthAI Backend

A professional Node.js + Express + MongoDB backend for SwasthAI.

## Folder Structure

- `controllers/` — Route logic (business logic)
- `models/` — Mongoose models (database schemas)
- `routes/` — Express route definitions
- `middlewares/` — Express middlewares (e.g., auth)
- `utils/` — Utility/helper functions

## Setup

1. Copy `.env.example` to `.env` and fill in your values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/users/register` — Register a new user
- `POST /api/users/login` — Login and get JWT
- `POST /api/recipes/` — Create a recipe (auth required)
- `GET /api/recipes/` — List all recipes
- `GET /api/recipes/:id` — Get recipe by ID
- `PUT /api/recipes/:id` — Update recipe (auth required)
- `DELETE /api/recipes/:id` — Delete recipe (auth required)

## Tech Stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT Auth
- bcryptjs
- express-validator

---

**For more details, see the code and comments in each file.** 