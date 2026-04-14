# TruthGuard - AI Agent Instructions

## Project Overview

**TruthGuard** is a fake news detection system built with Node.js, Express, brain.js (neural network ML), and MongoDB. It provides AI-powered analysis to determine if news content is fake or real.

---

## Running the Project

### Development Mode

```bash
cd backend
node server.js
```

Server runs at: `http://localhost:3000`

### Testing

- Landing page: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`
- Test page: `http://localhost:3000/test`

---

## Key Commands

| Command | Description |
|---------|-------------|
| `node server.js` | Start the Express server |
| `node server.js` (in backend/) | Full stack with ML model |

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **ML**: brain.js (neural network)
- **Database**: MongoDB
- **Auth**: JWT + bcryptjs
- **Frontend**: HTML5, CSS3, Vanilla JS, Bootstrap 5

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get user profile |
| POST | `/api/predict` | Yes | Analyze news text |
| GET | `/api/history` | Yes | Get prediction history |
| GET | `/api/stats` | Yes | Get user statistics |
| POST | `/api/demo` | No | Demo prediction (no auth) |
| GET | `/api/health` | No | Health check |

---

## Project Structure

```
fake-news-detector/
├── frontend/
│   ├── index.html      # Landing page
│   ├── dashboard.html # Main dashboard
│   ├── test.html     # Quick test page
│   ├── style.css    # CSS styles
│   └── app.js      # Frontend JS
├── backend/
│   ├── server.js    # Express server
│   ├── model.js    # ML model (brain.js)
│   ├── data.json  # Training dataset
│   └── package.json
├── README.md
├── DOCUMENTATION.md
├── IMPLEMENTATION_PLAN.md
└── AGENTS.md
```

---

## Important Files

- `backend/server.js` - Main server, auth routes, prediction endpoints
- `backend/model.js` - ML model training & prediction
- `frontend/app.js` - Frontend analysis logic (`analyzeNews()` function)
- `frontend/dashboard.html` - User dashboard with sidebar navigation

---

## ML Detection Logic

The fake news detection uses keyword and pattern analysis:

**Fake indicators:**
- Exclamation marks (!)
- ALL CAPS words
- Sensational keywords (breaking, shocking, secret, conspiracy, etc.)
- Clickbait patterns
- Short headline length (<20 words)

**Threshold:** >45% = FAKE, ≤45% = REAL

---

## Testing Credentials

For testing, use any email/password (system works in demo mode without MongoDB).

---

## Common Tasks

### Adding a new feature
1. Edit `backend/server.js` for API changes
2. Edit `frontend/app.js` or `frontend/dashboard.html` for UI changes

### Modifying ML threshold
- Backend: Edit `fallbackAnalysis()` in `server.js` line ~333
- Frontend: Edit `analyzeNews()` in `app.js` line ~136

### Adding sample test cases
- Edit `loadSample()` in `dashboard.html` line ~1272

---

## Environment Variables (Optional)

Create `backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fakeguard
JWT_SECRET=your-secret-key
```

---

## Dependencies

```bash
cd backend
npm install
```

Key packages: express, mongoose, brain.js, jsonwebtoken, bcryptjs, cors, dotenv