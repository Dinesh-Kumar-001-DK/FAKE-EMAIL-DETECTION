# TruthGuard - Fake News Detection System

A beautiful, AI-powered fake news detection system built with Node.js, brain.js, and MongoDB.

![TruthGuard Banner](https://img.shields.io/badge/TruthGuard-Fake%20News%20Detector-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-v6.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

---

## Features

- **AI-Powered Detection** - Uses brain.js neural network for accurate fake news detection
- **Beautiful UI** - Dark/noir theme with modern design
- **User Authentication** - Secure login/register with JWT tokens
- **Dashboard** - Track history, statistics, and analysis
- **Real-time Analysis** - Instant fake news detection
- **MongoDB Integration** - Store users and prediction history
- **Responsive Design** - Works on desktop and mobile

---

## Quick Start

### Prerequisites

- Node.js v14+
- MongoDB v4.4+ (optional - runs in demo mode)

### Installation

```bash
# Clone the repository
git clone https://github.com/Dinesh-Kumar-001-DK/goutham_client.git
cd goutham_client

# Install backend dependencies
cd backend
npm install

# Start the server
node server.js

# Open browser
# http://localhost:3000
```

---

## Project Structure

```
fake-news-detector/
├── frontend/
│   ├── index.html          # Landing page
│   ├── dashboard.html      # Main dashboard
│   ├── test.html          # Quick test page
│   ├── style.css          # Styles
│   └── app.js             # JavaScript
├── backend/
│   ├── server.js          # Express server
│   ├── model.js           # ML model (brain.js)
│   ├── data.json          # Training dataset (93 samples)
│   ├── package.json       # Dependencies
│   ├── .env               # Environment config
│   ├── .gitignore        # Git ignore
│   ├── requirements.txt   # Requirements list
│   └── README.md          # Backend docs
├── DOCUMENTATION.md        # Full documentation
├── IMPLEMENTATION_PLAN.md  # Implementation details
└── README.md              # This file
```

---

## How It Works

### ML Model Features Analyzed:

1. **Exclamation Density** - Ratio of ! marks to words
2. **Capital Letter Ratio** - Percentage of uppercase letters
3. **Fake Keyword Density** - Count of sensational keywords
4. **Clickbait Score** - Clickbait pattern detection
5. **Word Length** - Average word length
6. **Sentence Complexity** - Average words per sentence
7. **Text Length** - Short headlines are more suspicious
8. **Social Media Indicators** - URLs, hashtags, mentions

### Scoring System:

- **> 45%** = FAKE NEWS (Red badge)
- **≤ 45%** = REAL NEWS (Green badge)

---

## Sample Test Texts

### Fake News (Should show FAKE):

```
BREAKING: Secret cure discovered that big pharma doesn't want you to know!
Scientists prove coffee cures all diseases - you WON'T believe this MIRACLE!
URGENT: What they don't want you to know about health!
```

### Real News (Should show REAL):

```
The Federal Reserve announced interest rates will remain unchanged through Q1.
Scientists published a peer-reviewed study on climate change in Nature journal.
NASA released new images from the Mars rover exploring the Jezero crater.
```

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

## Configuration

Create `backend/.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fakeguard
JWT_SECRET=your-secret-key-here
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Backend runtime |
| Express.js | Web framework |
| brain.js | Neural network ML |
| MongoDB | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Bootstrap 5 | UI framework |

---

## Documentation

For detailed documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)

---

## License

MIT License - Feel free to use and modify!

---

## Author

**Dinesh Kumar**

---

**Built with ❤️ to fight fake news**
