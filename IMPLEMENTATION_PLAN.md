# Fake News Detection System - Implementation Plan

## Project Overview
A Node.js-based fake news detection system using brain.js neural network for ML, with a user-friendly web interface.

---

## Technology Stack
| Component | Technology |
|-----------|------------|
| Backend | Node.js + Express |
| ML Library | brain.js (Neural Network) |
| Database | MongoDB (for user auth & storing predictions) |
| Frontend | HTML, CSS, Bootstrap, Vanilla JS |

---

## Project Structure
```
fake-news-detector/
│
├── frontend/
│   ├── index.html          # Landing page + Login/Register
│   ├── dashboard.html      # Main app after login
│   ├── style.css           # Custom styles
│   └── app.js              # Frontend logic
│
├── backend/
│   ├── server.js           # Express server + API routes
│   ├── model.js            # Brain.js training & prediction logic
│   ├── data.json           # Sample dataset (500-1000 news samples)
│   ├── auth.js             # User authentication middleware
│   └── db.js               # MongoDB connection
│
├── package.json
└── README.md
```

---

## Phase 1: Dataset Design

### Sample Dataset Structure (data.json)
```json
[
  { "text": "News article text...", "label": "fake" },
  { "text": "News article text...", "label": "real" }
]
```

### Feature Engineering (for brain.js)
1. **Keyword Frequency** - Count suspicious keywords (fake: "shocking", "you won't believe", "urgent", "conspiracy")
2. **Text Length** - Fake news tends to be shorter or longer
3. **Exclamation Marks** - Fake news often uses excessive punctuation
4. **Capital Letters Ratio** - ALL CAPS usage
5. **Special Characters** - Symbols and emojis
6. **Sentence Structure** - Average word/sentence length

### Dataset Size Recommendation
- Start with 500-1000 samples for testing
- Expand to 5000+ for better accuracy
- Use balanced classes (50% fake, 50% real)

---

## Phase 2: Brain.js Model Architecture

### Input Features (6 features normalized 0-1)
1. Suspicious keyword score (0-1)
2. Text length normalized (0-1)
3. Exclamation ratio (0-1)
4. Capital letter ratio (0-1)
5. Special character ratio (0-1)
6. Average word length (0-1)

### Neural Network Configuration
```javascript
{
  inputSize: 6,
  hiddenLayers: [12, 8],  // 2 hidden layers
  outputSize: 1,          // 0 = fake, 1 = real
  learningRate: 0.01,
  activation: 'sigmoid'
}
```

### Training Parameters
- Epochs: 100-200
- Error threshold: 0.005
-shuffle: true

---

## Phase 3: Backend Implementation

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/register | User registration |
| POST | /api/login | User login |
| POST | /api/predict | Predict news (requires auth) |
| GET | /api/history | Get prediction history |
| POST | /api/train | Retrain model (admin) |

### MongoDB Collections
1. **users** - email, password (hashed), createdAt
2. **predictions** - userId, text, result, confidence, createdAt

---

## Phase 4: Frontend Design

### Landing Page (index.html)
- Hero section with app description
- Features showcase
- Login/Register forms
- Clean Bootstrap design

### Dashboard (dashboard.html)
- News input textarea
- Predict button
- Results display with confidence percentage
- Prediction history table
- Logout button

---

## Phase 5: Implementation Steps

### Step 1: Setup & Dependencies
```
npm init -y
npm install express brain.js mongoose bcryptjs jsonwebtoken cors body-parser
```

### Step 2: Create Dataset
- Generate 500 sample entries in data.json
- Mix of real and fake news patterns

### Step 3: Implement Model (model.js)
- Feature extraction functions
- Brain.js network setup
- Training function
- Prediction function

### Step 4: Build Server (server.js)
- Express setup
- Auth routes
- Prediction API
- MongoDB connection

### Step 5: Frontend Development
- Landing page with Bootstrap
- Dashboard with results display
- API integration with fetch()

### Step 6: Testing & Optimization
- Test with sample news
- Adjust model parameters
- Improve accuracy

---

## Phase 6: Scaling Recommendations

### Short-term (Improve Current System)
1. Increase dataset to 10,000+ samples
2. Add more features (sentiment analysis, named entity count)
3. Use cross-validation for better accuracy
4. Add text preprocessing (stemming, stop word removal)

### Long-term (Production Scale)
1. Move model to separate ML service
2. Use TensorFlow.js for better performance
3. Implement caching for frequent predictions
4. Add real-time news API integration
5. Deploy to cloud (AWS/GCP/Azure)
6. Use Redis for session management
7. Add rate limiting and API authentication

---

## Estimated Accuracy
- With 500 samples: 70-80%
- With 2000+ samples: 85-90%
- With advanced features: 90-95%

---

## Next Steps After Approval
1. Create package.json with dependencies
2. Generate sample dataset (500 entries)
3. Implement model.js with feature extraction
4. Build server.js with all APIs
5. Create frontend files
6. Test the complete system

---

Please review this plan and let me know if you want to:
- Modify any feature extraction approach
- Change the model architecture
- Adjust the project structure
- Add/remove any functionality

Once approved, I'll implement the complete system.
