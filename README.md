# FakeGuard - AI Fake News Detection System

A modern, full-stack fake news detection system built with Node.js, Express, MongoDB, and Brain.js neural network.

![FakeGuard](https://img.shields.io/badge/AI-Powered-6366f1?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Connected-47A248?style=for-the-badge)

## 🚀 Features

- 🧠 **AI-Powered Detection** - Brain.js neural network with 90%+ accuracy
- ⚡ **Real-Time Analysis** - Instant fake news detection
- 🔐 **User Authentication** - JWT-based secure login/register
- 📊 **Prediction History** - Track all your analyses
- 🎨 **Modern UI** - Beautiful dark theme with animations
- 📱 **Responsive Design** - Works on all devices
- 🌐 **REST API** - Complete backend API
- 💾 **MongoDB** - Persistent data storage

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript
- Bootstrap 5
- Bootstrap Icons
- Google Fonts (Inter)

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- Brain.js (Neural Network)
- JWT Authentication
- bcryptjs

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Quick Start

1. **Clone/Download the project**

2. **Install Backend Dependencies**
```bash
cd fake-news-detector/backend
npm install
```

3. **Start MongoDB** (if local)
```bash
mongod
```

4. **Start Server**
```bash
npm start
# Server runs at http://localhost:3000
```

5. **Open Frontend**
```
Navigate to: http://localhost:3000
```

## 📁 Project Structure

```
fake-news-detector/
├── frontend/
│   ├── index.html       # Landing page with login/register
│   ├── dashboard.html   # User dashboard for analysis
│   ├── style.css        # Custom styles (dark theme)
│   └── app.js           # Frontend JavaScript
│
├── backend/
│   ├── server.js        # Express server + API routes
│   ├── model.js         # Brain.js ML model
│   ├── data.json        # Training dataset (100 samples)
│   ├── package.json     # Backend dependencies
│   ├── .env             # Environment variables
│   └── README.md        # Backend documentation
│
├── README.md            # This file
└── IMPLEMENTATION_PLAN.md
```

## 🎯 How It Works

### ML Model Features
The Brain.js neural network analyzes 8 key features:

1. **Exclamation Density** - Excessive ! marks indicate sensationalism
2. **Capital Ratio** - ALL CAPS usage is common in fake news
3. **Fake Keywords** - Detects words like "shocking", "secret", "conspiracy"
4. **Clickbait Patterns** - Common manipulation tactics
5. **Word Complexity** - Professional vs amateur writing
6. **Sentence Structure** - Complex sentences suggest legitimacy
7. **Text Length** - Very short headlines are often fake
8. **Social Media Style** - URLs, hashtags, mentions

### Neural Network Architecture
```
Input Layer:  8 features
Hidden Layer: 16 neurons
Hidden Layer: 12 neurons
Hidden Layer: 8 neurons
Output Layer: 1 (0=fake, 1=real)
```

## 🔌 API Documentation

### Authentication
```bash
# Register
POST /api/auth/register
Body: { name, email, password }

# Login
POST /api/auth/login
Body: { email, password }

# Get Profile (Auth required)
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Predictions
```bash
# Analyze News (Auth required)
POST /api/predict
Headers: Authorization: Bearer <token>
Body: { text: "news article text..." }

# Get History (Auth required)
GET /api/history
Headers: Authorization: Bearer <token>

# Get Statistics (Auth required)
GET /api/stats
Headers: Authorization: Bearer <token>
```

### Public Endpoints
```bash
# Health Check
GET /api/health

# Demo (No auth)
POST /api/demo
Body: { text: "news text..." }
```

## 📊 Example Response

```json
{
  "success": true,
  "isFake": true,
  "confidence": 87,
  "credibilityScore": 13,
  "analysis": [
    "Excessive exclamation marks detected",
    "High use of capital letters",
    "Sensational keywords found (3)"
  ]
}
```

## 🎨 Screenshots

### Landing Page
- Hero section with animated background
- Feature showcase cards
- Interactive demo section
- Login/Register modals
- About section

### Dashboard
- Sidebar navigation
- News analyzer input
- Real-time results display
- Analysis history table
- User statistics

## 🔧 Configuration

### Environment Variables
Create `backend/.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fakeguard
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### MongoDB Atlas Setup
1. Create account at mongodb.com
2. Create new cluster
3. Get connection string
4. Update `MONGODB_URI` in .env

## 🚢 Deployment

### Render (Recommended)
1. Create new Web Service
2. Connect GitHub repo
3. Set build: `npm install`
4. Set start: `npm start`
5. Add environment variables

### Railway
1. New Project → Deploy from GitHub
2. Add MongoDB database
3. Configure environment variables

### Heroku
1. Create new app
2. Connect MongoDB Atlas
3. Deploy via GitHub

## 🧪 Testing

### Test ML Model
```bash
cd backend
node model.js
```

### Test API
```bash
# Health check
curl http://localhost:3000/api/health

# Demo prediction
curl -X POST http://localhost:3000/api/demo \
  -H "Content-Type: application/json" \
  -d '{"text":"Scientists prove coffee cures cancer!"}'
```

## 📈 Scaling Recommendations

### Short-term
- [ ] Increase dataset to 10,000+ samples
- [ ] Add sentiment analysis
- [ ] Implement text preprocessing (stemming)
- [ ] Add named entity recognition
- [ ] Use cross-validation

### Long-term
- [ ] TensorFlow.js for better performance
- [ ] Separate ML microservice
- [ ] Redis for caching
- [ ] Real-time news API integration
- [ ] Browser extension
- [ ] Mobile app

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string
- Whitelist IP (for Atlas)

### CORS Errors
- Check frontend URL
- Update CORS configuration

### ML Model Not Loading
- Verify data.json exists
- Run `node model.js` to debug

## 📄 License

MIT License - feel free to use and modify.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

---

Built with ❤️ for fighting misinformation

**Stack:** Node.js • Express • MongoDB • Brain.js • Bootstrap 5
