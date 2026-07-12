# Pass-Manager

Your own password manager — save, view, and manage website credentials in one place.

## Features
- Add, edit, and delete saved passwords
- Copy site URL, username, or password to clipboard
- Toggle password visibility
- MongoDB-backed storage (local database)

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS

**Backend**
- Node.js
- Express
- MongoDB
- dotenv, body-parser

## Getting Started

### Backend
```bash
cd backend
npm install
npm start
```

Create a `.env` file in `backend/` with:
```
MONGO_URI=mongodb://localhost:27017/pass-manager
PORT=3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
