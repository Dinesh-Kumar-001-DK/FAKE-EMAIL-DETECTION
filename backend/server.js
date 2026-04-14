// ===========================================
// FakeGuard - Express Server
// ===========================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");

// Load environment variables
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "fakeguard-secret-key-2024";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// ===========================================
// MongoDB Connection
// ===========================================

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/fakeguard";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.log("💡 Server will run in demo mode without MongoDB");
  });

// ===========================================
// User Schema & Model
// ===========================================

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// ===========================================
// Prediction Schema & Model
// ===========================================

const predictionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  result: { type: String, enum: ["fake", "real"] },
  confidence: { type: Number },
  analysis: { type: Array },
  createdAt: { type: Date, default: Date.now },
});

const Prediction = mongoose.model("Prediction", predictionSchema);

// ===========================================
// Import ML Model
// ===========================================

let mlModel;

try {
  mlModel = require("./model");
  console.log("✅ ML Model Loaded Successfully");
} catch (error) {
  console.error("❌ Error loading ML Model:", error.message);
  console.log("💡 Using fallback analysis method");
  mlModel = null;
}

// ===========================================
// Authentication Middleware
// ===========================================

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ===========================================
// Auth Routes
// ===========================================

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Get User Profile
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ===========================================
// Prediction Routes
// ===========================================

// Analyze News (Main prediction endpoint)
app.post("/api/predict", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Text is required for analysis" });
    }

    // Use ML model or fallback
    let result;
    if (mlModel && mlModel.predict) {
      result = mlModel.predict(text);
    } else {
      result = fallbackAnalysis(text);
    }

    // Save prediction to database
    try {
      const prediction = new Prediction({
        userId: req.userId,
        text: text.substring(0, 500),
        result: result.isFake ? "fake" : "real",
        confidence: result.confidence,
        analysis: result.analysis,
      });
      await prediction.save();
    } catch (dbError) {
      console.log("Prediction saved in memory only (DB not available)");
    }

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Prediction Error:", error);
    res.status(500).json({ message: "Error during prediction" });
  }
});

// Get Prediction History
app.get("/api/history", authMiddleware, async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("-__v");

    res.json({ predictions });
  } catch (error) {
    console.error("History Error:", error);
    res.status(500).json({ message: "Error fetching history" });
  }
});

// Get Statistics
app.get("/api/stats", authMiddleware, async (req, res) => {
  try {
    const total = await Prediction.countDocuments({ userId: req.userId });
    const fakes = await Prediction.countDocuments({
      userId: req.userId,
      result: "fake",
    });
    const reals = await Prediction.countDocuments({
      userId: req.userId,
      result: "real",
    });

    res.json({
      total,
      fakes,
      reals,
      accuracy: total > 0 ? Math.round((reals / total) * 100) : 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching statistics" });
  }
});

// ===========================================
// Public Routes (No Auth Required)
// ===========================================

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    modelLoaded: mlModel !== null,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Public Demo (Limited)
app.post("/api/demo", (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    let result;
    if (mlModel && mlModel.predict) {
      result = mlModel.predict(text);
    } else {
      result = fallbackAnalysis(text);
    }

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({ message: "Analysis error" });
  }
});

// ===========================================
// Fallback Analysis (When ML not available)
// ===========================================

function fallbackAnalysis(text) {
  const lowerText = text.toLowerCase();

  const features = {
    wordCount: text.split(/\s+/).length,
    exclamationMarks: (text.match(/!/g) || []).length,
    capitalLetters: (text.match(/[A-Z]/g) || []).length,
  };

  features.exclamationRatio =
    features.exclamationMarks / Math.max(features.wordCount, 1);
  features.capitalRatio =
    features.capitalLetters / Math.max(text.replace(/\s/g, "").length, 1);

  const fakeKeywords = [
    "breaking",
    "shocking",
    "unbelievable",
    "you won't believe",
    "secret",
    "conspiracy",
    "they don't want you to know",
    "miracle",
    "cure all",
    "Scientists prove",
    "urgent",
    "must read",
    "share this",
    "mainstream media won't",
    "big pharma",
    "government hiding",
    "100% natural",
    "no side effects",
    "instant",
    "guaranteed",
  ];

  let keywordCount = 0;
  fakeKeywords.forEach((keyword) => {
    if (lowerText.includes(keyword)) keywordCount++;
  });

  let fakeScore = 0;
  fakeScore += Math.min(features.exclamationRatio * 10, 3);
  fakeScore += Math.min(features.capitalRatio * 5, 2);
  fakeScore += Math.min(keywordCount * 2, 5);
  if (features.wordCount < 20) fakeScore += 2;

  const fakeProbability = Math.min(Math.max((fakeScore / 20) * 100, 10), 95);
  const isFake = fakeProbability > 50;

  const analysis = [];
  if (features.exclamationRatio > 0.05)
    analysis.push(`Excessive exclamation marks (${features.exclamationMarks})`);
  if (features.capitalRatio > 0.3)
    analysis.push(
      `High capital letters (${(features.capitalRatio * 100).toFixed(0)}%)`,
    );
  if (keywordCount > 2)
    analysis.push(`Sensational keywords detected (${keywordCount})`);
  if (features.wordCount < 20)
    analysis.push(`Short headline (${features.wordCount} words)`);
  if (analysis.length === 0) {
    analysis.push("No obvious fake patterns detected");
    analysis.push("Writing appears professional");
  }

  return {
    isFake,
    confidence: isFake ? fakeProbability : 100 - fakeProbability,
    credibilityScore: isFake ? 100 - fakeProbability : fakeProbability,
    analysis,
  };
}

// ===========================================
// Serve Frontend
// ===========================================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});

// ===========================================
// Error Handling
// ===========================================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ===========================================
// Start Server
// ===========================================

const server = app.listen(PORT, () => {
  console.log("");
  console.log("╔════════════════════════════════════════════╗");
  console.log("║     🚀 FakeGuard Server Started 🚀       ║");
  console.log("╠════════════════════════════════════════════╣");
  console.log(`║  📍 Local:   http://localhost:${PORT}        ║`);
  console.log(`║  🌐 Public: http://0.0.0.0:${PORT}         ║`);
  console.log("╠════════════════════════════════════════════╣");
  console.log(
    "║  🧠 ML Model: " +
      (mlModel ? "Loaded ✓" : "Fallback Mode") +
      "                  ║",
  );
  console.log(
    "║  💾 Database: " +
      (mongoose.connection.readyState === 1 ? "Connected ✓" : "Demo Mode") +
      "            ║",
  );
  console.log("╚════════════════════════════════════════════╝");
  console.log("");
});

// Vercel serverless export
module.exports = server;
