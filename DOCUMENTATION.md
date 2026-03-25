# TruthGuard - Fake News Detection System

## Complete Documentation

---

# 1. FLOW CHART

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER FLOW DIAGRAM                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │  START   │
    └────┬─────┘
         │
         ▼
┌─────────────────┐
│  Open Website   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│   Login/Register │────▶│   Dashboard     │
│   Required?      │ YES │   (if not logged│
└────────┬────────┘     │    in, redirect) │
         │ NO          └────────┬────────┘
         ▼                     │
┌─────────────────┐            ▼
│  Demo Mode      │     ┌─────────────────┐
│  (Landing Page)  │     │  Enter News     │
└────────┬────────┘     │  Text           │
         │              └────────┬────────┘
         ▼                       │
┌─────────────────┐              ▼
│  Analyze Text   │     ┌─────────────────┐
│  with AI Model  │────▶│  ML Analysis    │
└─────────────────┘     │  (brain.js)     │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Extract        │
                       │  Features       │
                       └────────┬────────┘
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
      ┌───────────┐     ┌───────────┐     ┌───────────┐
      │ Calculate │     │ Calculate │     │ Calculate │
      │ Keyword   │     │ Style     │     │ Pattern   │
      │ Score     │     │ Score     │     │ Score     │
      └─────┬─────┘     └─────┬─────┘     └─────┬─────┘
            │                 │                 │
            └─────────────────┼─────────────────┘
                              ▼
                    ┌─────────────────┐
                    │ Weighted Final  │
                    │ Score (0-100)  │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                              ▼
    ┌─────────────────┐           ┌─────────────────┐
    │   Score > 45   │           │   Score ≤ 45    │
    │   = FAKE NEWS  │           │   = REAL NEWS  │
    └────────┬────────┘           └────────┬────────┘
             │                              │
             ▼                              ▼
    ┌─────────────────┐           ┌─────────────────┐
    │  Display RED   │           │  Display GREEN │
    │  "FAKE NEWS"   │           │  "REAL NEWS"   │
    │  Badge + Stats │           │  Badge + Stats │
    └────────┬────────┘           └────────┬────────┘
             │                              │
             └──────────────┬───────────────┘
                            ▼
                   ┌─────────────────┐
                   │  Show Analysis  │
                   │  Details +      │
                   │  Save to History│
                   └────────┬────────┘
                            ▼
                   ┌─────────────────┐
                   │      END       │
                   └─────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                       ML MODEL TRAINING FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  Load Dataset   │
│  (93 samples)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Extract        │
│  Features from  │
│  Each Sample    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FEATURE EXTRACTION                            │
├─────────────────────────────────────────────────────────────────┤
│  • Exclamation density    • Capital letter ratio                 │
│  • Fake keyword count     • Clickbait pattern score              │
│  • Average word length    • Sentence complexity                  │
│  • Text length           • Social media indicators              │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Prepare        │
│  Training Data  │
│  (Normalize to  │
│   0-1 range)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Create Neural  │
│  Network        │
│  (brain.js)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Train Model    │
│  (300 iterations│
│  error: 0.005)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Test Model     │
│  (Verify fake   │
│  vs real)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Export Model   │
│  for Predictions│
└─────────────────┘
```

---

# 2. STEP BY STEP EXPLANATION

## 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Landing Page │  │  Dashboard   │  │  Components  │          │
│  │  (index.html)│  │(dashboard.htm│  │  - Navbar    │          │
│  │  - Demo mode │  │  - History   │  │  - Cards     │          │
│  │  - Login     │  │  - Stats     │  │  - Charts   │          │
│  │  - Register  │  │  - Settings  │  │  - Modals   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘          │
│         │                 │                                      │
│         └────────┬────────┘                                      │
│                  │                                               │
│                  ▼                                               │
│         ┌────────────────┐                                      │
│         │  analyzeText() │                                      │
│         │  (Local ML)    │                                      │
│         └────────┬───────┘                                      │
└──────────────────┼──────────────────────────────────────────────┘
                   │
                   │ HTTP Request
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    EXPRESS SERVER                        │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │    │
│  │  │Auth Routes│  │ Predict │  │ History  │  │ Stats  │ │    │
│  │  │- Register │  │  Route  │  │  Route   │  │ Route  │ │    │
│  │  │- Login    │  │         │  │          │  │        │ │    │
│  │  └──────────┘  └────┬─────┘  └──────────┘  └────────┘ │    │
│  │                     │                                   │    │
│  └─────────────────────┼───────────────────────────────────┘    │
│                        │                                         │
│                        ▼                                         │
│               ┌────────────────┐                                 │
│               │   model.js     │                                 │
│               │  (brain.js)    │                                 │
│               └────────┬───────┘                                 │
│                        │                                         │
│                        ▼                                         │
│               ┌────────────────┐                                 │
│               │   data.json    │                                 │
│               │ (93 samples)   │                                 │
│               └────────────────┘                                 │
└─────────────────────────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE                                     │
│  ┌─────────────────────┐   ┌─────────────────────┐            │
│  │   MONGODB           │   │   JWT TOKENS        │            │
│  │   - Users           │   │   - Auth tokens     │            │
│  │   - Predictions     │   │   - Expiry: 7 days  │            │
│  └─────────────────────┘   └─────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

## 2.2 Step-by-Step Process

### STEP 1: User Input

```
┌─────────────────────────────────────────────────────────────┐
│  User enters news text in textarea                           │
│                                                              │
│  Example:                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ BREAKING: Secret cure discovered that big pharma     │   │
│  │ doesn't want you to know!                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  [Analyze with AI]  ← User clicks this button               │
└─────────────────────────────────────────────────────────────┘
```

### STEP 2: Feature Extraction

The system analyzes the text and extracts 8 features:

| Feature | What it Measures | Example |
|---------|-----------------|---------|
| **Exclamation Density** | Ratio of ! marks to words | "!" = 0.33 |
| **Capital Ratio** | % of uppercase letters | "BREAKING" = 0.8 |
| **Keyword Density** | Count of fake keywords | 3 keywords found |
| **Clickbait Score** | Clickbait patterns detected | 2 patterns |
| **Word Length** | Average word length | 5.2 chars |
| **Sentence Complexity** | Avg words per sentence | 8 words |
| **Short Text** | Headline is very short | < 20 words |
| **Social Media** | URLs/hashtags/mentions | 0 found |

### STEP 3: Scoring Calculation

```
┌─────────────────────────────────────────────────────────────┐
│  FAKE SCORE CALCULATION                                    │
│                                                              │
│  fakeScore =                                                │
│  ├── Exclamation:    [0.33] × 15 = 4.95                    │
│  ├── Capital Ratio:  [0.8]  × 8  = 6.40                    │
│  ├── Keywords:       [3]    × 3  = 9.00                    │
│  ├── Clickbait:       [2]    × 3  = 6.00                    │
│  ├── Short Text:      [1]    × 3  = 3.00                    │
│  └── ALL CAPS Bonus:  [1]    × 2  = 2.00                    │
│                                                             │
│  TOTAL = 31.35                                              │
│                                                              │
│  fakeProbability = (31.35 / 25) × 100 = 125.4%             │
│  Capped at 95% → fakeProbability = 95%                      │
│                                                              │
│  isFake = 95% > 45% threshold = TRUE ✓                       │
└─────────────────────────────────────────────────────────────┘
```

### STEP 4: Result Display

```
┌─────────────────────────────────────────────────────────────┐
│                      RESULTS                                │
│                                                              │
│    ┌─────────────────────────────────────────────┐          │
│    │          ⚠️  FAKE NEWS DETECTED            │          │
│    │                                             │          │
│    │  Confidence: 95%                            │          │
│    │  Credibility: 5%                            │          │
│    │                                             │          │
│    │  Analysis:                                 │          │
│    │  • High capital letter usage (80%)        │          │
│    │  • Sensational keywords detected (3)       │          │
│    │  • Clickbait patterns found (2)           │          │
│    └─────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

---

# 3. SAMPLE TEXTS FOR TESTING

## 3.1 FAKE NEWS EXAMPLES

These headlines contain common fake news patterns and should be classified as **FAKE**:

| # | Sample Text | Why It's Fake |
|---|------------|---------------|
| 1 | **BREAKING: Secret cure discovered that big pharma doesn't want you to know!** | ALL CAPS, secret/miracle keywords, conspiracy hint |
| 2 | **Scientists prove coffee cures all diseases - you WON'T believe this MIRACLE!** | Exclamation, ALL CAPS, miracle, clickbait |
| 3 | **SHOCKING: Celebrity secret finally revealed - click to see!** | ALL CAPS, revealed, click to see |
| 4 | **URGENT: What they don't want you to know about health!** | URGENT, conspiracy phrase |
| 5 | **100% natural cure with NO side effects - doctors HATE this!** | ALL CAPS, miracle claim, conspiracy |
| 6 | **This ONE simple TRICK will change your life forever!** | Clickbait, ALL CAPS, sensational |
| 7 | **Government conspiracy EXPOSED - truth finally REVEALED!** | ALL CAPS, conspiracy, exposed/revealed |
| 8 | **MIRACLE weight loss: Lose 20 lbs in ONE week!** | ALL CAPS, miracle, unrealistic claim |
| 9 | **You NEED to share this - the truth about vaccines they won't tell!** | Sensational, conspiracy, peer pressure |
| 10 | **Scientists DISCOVERED this - What they FOUND will SHOCK you!** | ALL CAPS, sensational, clickbait |

### More Fake News Samples:

```
• "BREAKING: Government hiding alien life from public - MUST READ!"
• "Miracle cure discovered - Big Pharma doesn't want you to know!"
• "Scientists reveal ONE simple ingredient that reverses aging!"
• "EXPOSED: What the mainstream media is hiding from you!"
• "They don't want you to know these 5 shocking secrets!"
• "UNBELIEVABLE: What they found in Antarctica will shock the world!"
• "URGENT ALERT: This food causes cancer - stop eating it NOW!"
• "The government is spraying chemicals in the sky - proof revealed!"
```

## 3.2 REAL NEWS EXAMPLES

These headlines follow journalistic standards and should be classified as **REAL**:

| # | Sample Text | Why It's Real |
|---|------------|---------------|
| 1 | **The Federal Reserve announced interest rates will remain unchanged through Q1 next year.** | Factual, no sensationalism |
| 2 | **Scientists published a peer-reviewed study on climate change in Nature journal.** | Cited source, professional |
| 3 | **The government released quarterly economic data showing 3% GDP growth.** | Official source, statistics |
| 4 | **Researchers developed a new treatment showing promising results in clinical trials.** | Professional, qualified |
| 5 | **The UN released a report on global poverty statistics for 2024.** | Official source cited |
| 6 | **Weather experts predict above-average temperatures for summer.** | Qualified experts, factual |
| 7 | **The company reported quarterly earnings with a 5% increase in revenue.** | Factual financial report |
| 8 | **NASA released new images from the Mars rover exploring the Jezero crater.** | Official source, specific |
| 9 | **Health officials reported the latest data on vaccination coverage rates.** | Official source, statistics |
| 10 | **Astronomers detected a new exoplanet using the James Webb space telescope.** | Scientific, cited source |

### More Real News Samples:

```
• "The Supreme Court announced its decision on the pending legal case."
• "Environmental scientists published findings on renewable energy adoption."
• "The transportation department released new safety regulations for vehicles."
• "Researchers found a correlation between exercise and improved mental health."
• "Scientists discovered a new species of marine life in the Pacific Ocean."
• "The education department announced new policies for public schools."
• "Healthcare experts recommend annual checkups for adults over 40."
• "The central bank issued new guidelines for monetary policy."
```

---

# 4. INSTALLATION GUIDE

## 4.1 Prerequisites

Before installing TruthGuard, ensure you have:

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | v14+ | https://nodejs.org/ |
| **MongoDB** | v4.4+ | https://www.mongodb.com/try/download/community |
| **Git** | Any | https://git-scm.com/downloads |

### Verify Installations

```bash
# Check Node.js
node --version
# Expected: v14.x.x or higher

# Check npm
npm --version
# Expected: 6.x.x or higher

# Check MongoDB (if installed locally)
mongod --version
# Or start MongoDB service
```

## 4.2 Installation Steps

### Step 1: Clone or Download the Project

```bash
# If using Git
git clone <repository-url> fake-news-detector
cd fake-news-detector

# Or download and extract ZIP file
# Navigate to the project folder
cd fake-news-detector
```

### Step 2: Install Backend Dependencies

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Expected output:
# added 150 packages in 10s
```

### Step 3: Configure Environment

Create a `.env` file in the `backend` folder:

```bash
# Create .env file
touch .env    # Linux/Mac
# OR create manually in Windows

# Add the following content:
```

```env
# Server Configuration
PORT=3000

# MongoDB Connection
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/fakeguard

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fakeguard

# JWT Secret (change this in production!)
JWT_SECRET=truthguard-secret-key-2024
```

### Step 4: Setup MongoDB

#### Option A: Local MongoDB (Recommended for development)

```bash
# Windows
# Start MongoDB service
net start MongoDB

# Or using mongod directly
mongod --dbpath "C:\data\db"

# Linux/Mac
sudo systemctl start mongod
# Or
mongod --dbpath /data/db
```

#### Option B: MongoDB Atlas (Cloud - for production)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free cluster
4. Get connection string
5. Replace `MONGODB_URI` in `.env`

### Step 5: Start the Server

```bash
# From backend folder
cd backend
node server.js

# Expected output:
# ╔════════════════════════════════════════════╗
# ║     🚀 FakeGuard Server Started 🚀       ║
# ╠════════════════════════════════════════════╣
# ║  📍 Local:   http://localhost:3000        ║
# ║  🌐 Public: http://0.0.0.0:3000         ║
# ╠════════════════════════════════════════════╣
# ║  🧠 ML Model: Loaded ✓                   ║
# ║  💾 Database: Connected ✓                ║
# ╚════════════════════════════════════════════╝
```

### Step 6: Access the Application

Open your browser and go to:

```
http://localhost:3000
```

You should see the TruthGuard landing page!

## 4.3 Troubleshooting

### Port 3000 Already in Use

```bash
# Find process using port 3000
netstat -ano | grep 3000

# Kill the process (Windows)
taskkill /F /PID <PID_NUMBER>

# Kill the process (Linux/Mac)
kill -9 <PID_NUMBER>

# Or use a different port
# Edit .env: PORT=3001
```

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
# Windows
net start | findstr Mongo

# Linux
sudo systemctl status mongod

# Test connection
mongosh
# If this works, MongoDB is running
```

### Module Not Found Errors

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### ML Model Not Loading

```bash
# Check if brain.js is installed
npm list brain.js

# If not, install it
npm install brain.js

# Check data.json exists
ls -la data.json
```

---

# 5. PROJECT STRUCTURE

```
fake-news-detector/
├── frontend/
│   ├── index.html          # Landing page
│   ├── dashboard.html      # Main dashboard
│   └── test.html          # Quick test page
├── backend/
│   ├── server.js          # Express server
│   ├── model.js           # ML model (brain.js)
│   ├── data.json          # Training dataset
│   ├── package.json       # Dependencies
│   ├── .env               # Environment config
│   └── node_modules/      # npm packages
├── DOCUMENTATION.md        # This file
├── IMPLEMENTATION_PLAN.md  # Project plan
└── README.md              # Quick start guide
```

---

# 6. API ENDPOINTS

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

# 7. KEY FEATURES

- [x] Beautiful dark/noir theme
- [x] User authentication (login/register)
- [x] Real-time news analysis
- [x] ML-powered detection using brain.js
- [x] Dashboard with history and statistics
- [x] Sample test buttons
- [x] Back to Home navigation
- [x] MongoDB integration
- [x] JWT authentication
- [x] Responsive design

---

# 8. TECHNICAL DETAILS

### Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **ML Library**: brain.js (Neural Network)
- **Authentication**: JWT, bcrypt

### ML Model Configuration

```javascript
{
  inputSize: 8,           // Number of features
  hiddenLayers: [16, 12, 8],
  outputSize: 1,
  learningRate: 0.01,
  activation: 'sigmoid',
  iterations: 300,
  errorThresh: 0.005
}
```

### Scoring Thresholds

- **> 45%**: Classified as FAKE NEWS
- **≤ 45%**: Classified as REAL NEWS

---

# 9. SUPPORT

For issues or questions, please check:
- GitHub Issues page
- Project documentation
- Console logs for debugging

---

**TruthGuard - Fighting Fake News with AI** 🛡️
