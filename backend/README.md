# FakeGuard Backend

## Overview
Node.js Express server with MongoDB database and Brain.js neural network for fake news detection.

## Features
- 🔐 **User Authentication** - JWT-based login/register
- 🧠 **ML Model** - Brain.js neural network trained on 100+ news samples
- 💾 **MongoDB** - User data and prediction history storage
- 🔌 **REST API** - Complete API endpoints for all features

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start MongoDB (Optional)
```bash
# If you have MongoDB installed locally
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env file
```

### 3. Start Server
```bash
npm start
# Server runs at http://localhost:3000
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get user profile |

### Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict` | Analyze news text (Auth required) |
| GET | `/api/history` | Get prediction history |
| GET | `/api/stats` | Get user statistics |

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/demo` | Limited demo prediction |

## Example Requests

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Predict
```bash
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text":"Your news article text here..."}'
```

## ML Model Features

The Brain.js model analyzes 8 features:
1. Exclamation mark density
2. Capital letter ratio
3. Fake keyword frequency
4. Clickbait patterns
5. Average word length
6. Sentence complexity
7. Text length
8. Social media indicators

## Project Structure
```
backend/
├── server.js        # Express server + routes
├── model.js        # Brain.js ML model
├── data.json       # Training dataset
├── package.json    # Dependencies
├── .env           # Environment variables
└── README.md      # This file
```

## Database Schema

### Users
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  createdAt: Date
}
```

### Predictions
```javascript
{
  userId: ObjectId,
  text: String,
  result: 'fake' | 'real',
  confidence: Number,
  analysis: Array,
  createdAt: Date
}
```

## Deployment

### Render
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Railway
1. New Project → Deploy from GitHub
2. Add MongoDB database
3. Configure environment variables

### Heroku
1. Create new app
2. Connect MongoDB Atlas
3. Deploy via GitHub

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check connection string in .env
- For cloud: whitelist your IP address

### ML Model Not Loading
- Dataset file must exist
- Run `node model.js` to test separately

### CORS Errors
- Check if frontend URL is allowed
- Update CORS configuration in server.js

## License
MIT
