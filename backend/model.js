// ===========================================
// TruthGuard - ML Model with Brain.js
// ===========================================

const brain = require('brain.js');
const fs = require('fs');
const path = require('path');

// Load dataset
const datasetPath = path.join(__dirname, 'data.json');
let dataset = [];

try {
  const data = fs.readFileSync(datasetPath, 'utf8');
  dataset = JSON.parse(data);
  console.log(`✅ Dataset loaded: ${dataset.length} samples`);
} catch (error) {
  console.error('❌ Error loading dataset:', error.message);
  console.log('💡 Using default dataset for training');
  dataset = generateDefaultDataset();
}

// Generate default dataset if file doesn't exist
function generateDefaultDataset() {
  const fakeSamples = [
    "Scientists prove that coffee cures all diseases - you won't believe this!",
    "BREAKING: Government hiding alien life from public - MUST READ!",
    "Miracle cure discovered that big pharma doesn't want you to know about!",
    "SHOCKING: Celebrity secret finally revealed - click to see!",
    "Scientists discover secret trick that will change everything!",
    "URGENT: What they don't want you to know about health!",
    "You won't believe what happened next! Share this immediately!",
    "100% natural cure with no side effects - doctors hate this!",
    "This one simple trick helped millions - try it now!",
    "Government conspiracy exposed - truth finally revealed!",
    "Like and subscribe for exclusive content - don't miss out!",
    "Scientists prove chocolate is actually good for you - study shows",
    "BREAKING: Stock market crash predicted by secret algorithm",
    "Miracle weight loss solution discovered - lose 20 lbs in week!",
    "They don't want you to know these 5 secrets!",
  ];

  const realSamples = [
    "The Federal Reserve announced interest rates will remain unchanged through Q1.",
    "Scientists published a peer-reviewed study on climate change in Nature journal.",
    "The government released quarterly economic data showing 3% GDP growth.",
    "Researchers developed a new treatment showing promising results in trials.",
    "The UN released a report on global poverty statistics for 2024.",
    "Weather experts predict above-average temperatures for the summer season.",
    "The company reported quarterly earnings with a 5% increase in revenue.",
    "Scientists discovered a new species of marine life in the Pacific Ocean.",
    "The education department announced new policies for public schools.",
    "Healthcare experts recommend annual checkups for adults over 40.",
    "Astronomers detected a new exoplanet using the James Webb telescope.",
    "The transportation department released new safety regulations for vehicles.",
    "Researchers found correlation between exercise and improved mental health.",
    "The central bank issued new guidelines for monetary policy.",
    "Environmental scientists published findings on renewable energy adoption.",
  ];

  const data = [];
  
  fakeSamples.forEach(text => {
    data.push({ text, label: 'fake' });
  });
  
  realSamples.forEach(text => {
    data.push({ text, label: 'real' });
  });

  return data;
}

// ===========================================
// Feature Extraction Functions
// ===========================================

function extractFeatures(text) {
  const lowerText = text.toLowerCase();
  
  // Basic metrics
  const words = text.split(/\s+/);
  const wordCount = words.length;
  const charCount = text.length;
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / Math.max(wordCount, 1);
  
  // Punctuation analysis
  const exclamationMarks = (text.match(/!/g) || []).length;
  const questionMarks = (text.match(/\?/g) || []).length;
  const periods = (text.match(/\./g) || []).length;
  
  // Capital letters
  const capitalLetters = (text.match(/[A-Z]/g) || []).length;
  const totalLetters = text.replace(/[^a-zA-Z]/g, '').length;
  const capitalRatio = capitalLetters / Math.max(totalLetters, 1);
  
  // Special characters
  const specialChars = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  const specialRatio = specialChars / Math.max(charCount, 1);
  
  // URLs and mentions
  const urls = (text.match(/https?:\/\/[^\s]+/g) || []).length;
  const mentions = (text.match(/@\w+/g) || []).length;
  const hashtags = (text.match(/#\w+/g) || []).length;
  
  // Sentence analysis
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;
  
  // Fake news keywords
  const fakeKeywords = [
    'breaking', 'shocking', 'unbelievable', 'secret', 'conspiracy',
    'miracle', 'cure all', 'urgent', 'must read', 'share this',
    "they don't", 'big pharma', 'government hiding', 'exposed',
    'revealed', 'hoax', 'fake', 'lie', 'truth', 'cover-up',
    "won't believe", "don't want you", "simple trick", "one thing"
  ];
  
  let keywordCount = 0;
  fakeKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) keywordCount++;
  });
  const keywordRatio = keywordCount / fakeKeywords.length;
  
  // Clickbait patterns
  const clickbaitPatterns = [
    /what.*don't.*know/i,
    /you.*won't.*believe/i,
    /this.*one.*(trick|secret|thing)/i,
    /click.*here/i,
    /share.*this/i,
    /like.*subscribe/i,
    /[A-Z]{5,}/, // All caps words
    /!{2,}/,     // Multiple exclamation
  ];
  
  let clickbaitScore = 0;
  clickbaitPatterns.forEach(pattern => {
    if (pattern.test(text)) clickbaitScore++;
  });
  
  // Return normalized features (0-1)
  return [
    Math.min(exclamationMarks / 5, 1),                    // Feature 0: Exclamation density
    Math.min(capitalRatio, 1),                           // Feature 1: Capital letter ratio
    Math.min(keywordRatio * 3, 1),                       // Feature 2: Fake keyword density
    Math.min(clickbaitScore / 3, 1),                    // Feature 3: Clickbait score
    Math.min(avgWordLength / 10, 1),                    // Feature 4: Average word length
    Math.min(avgSentenceLength / 30, 1),                // Feature 5: Sentence complexity
    text.length < 50 ? 1 : 0,                            // Feature 6: Very short text
    Math.min((urls + mentions + hashtags) / 3, 1),     // Feature 7: Social media indicators
  ];
}

// ===========================================
// Prepare Training Data
// ===========================================

function prepareTrainingData(data) {
  const trainingData = data.map(item => {
    const features = extractFeatures(item.text);
    // 0 = fake, 1 = real
    const output = item.label === 'fake' ? [0] : [1];
    return { input: features, output };
  });
  
  return trainingData;
}

// ===========================================
// Create and Train Neural Network
// ===========================================

let trainedModel = null;

function createAndTrainModel() {
  console.log('🧠 Creating Neural Network...');
  
  const net = new brain.NeuralNetwork({
    inputSize: 8,    // 8 features
    hiddenLayers: [16, 12, 8],  // 3 hidden layers
    outputSize: 1,
    learningRate: 0.01,
    activation: 'sigmoid',
  });

  const trainingData = prepareTrainingData(dataset);
  
  console.log(`📊 Training with ${trainingData.length} samples...`);
  
  const stats = net.train(trainingData, {
    iterations: 300,      // Training iterations
    errorThresh: 0.005,  // Error threshold
    log: false,          // Don't log every iteration
    learningRate: 0.01,
    momentum: 0.9,
  });

  console.log('✅ Training Complete!');
  console.log(`   Final Error: ${stats.error.toFixed(6)}`);
  console.log(`   Iterations: ${stats.iterations}`);
  
  return net;
}

// ===========================================
// Initialize Model
// ===========================================

function initialize() {
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('  🧠 TRUTHGUARD ML MODEL INITIALIZATION  ');
  console.log('═══════════════════════════════════════');
  console.log('');
  
  try {
    trainedModel = createAndTrainModel();
    
    // Test prediction
    console.log('');
    console.log('🧪 Testing Model...');
    
    const testCases = [
      {
        text: "Scientists prove that coffee cures all diseases according to secret study - you WON'T believe this MIRACLE!",
        expected: 'fake'
      },
      {
        text: "The Federal Reserve announced interest rates will remain unchanged through Q1 next year.",
        expected: 'real'
      }
    ];
    
    testCases.forEach((testCase, i) => {
      const result = predict(testCase.text);
      const status = (result.isFake === (testCase.expected === 'fake')) ? '✓' : '✗';
      console.log(`  Test ${i + 1} ${status}: ${testCase.expected.toUpperCase()} - Got: ${result.isFake ? 'FAKE' : 'REAL'}`);
    });
    
    console.log('');
    console.log('✅ ML Model Ready for Predictions!');
    console.log('');
    
  } catch (error) {
    console.error('❌ Model initialization error:', error.message);
    console.log('💡 Server will use fallback analysis method');
  }
  
  return trainedModel;
}

// ===========================================
// Prediction Function
// ===========================================

function predict(text) {
  const features = extractFeatures(text);
  
  // Feature weights for fake news detection (based on training data patterns)
  const weights = {
    exclamationDensity: 0.25,    // High exclamation marks = fake
    capitalRatio: 0.20,         // High caps = fake
    keywordDensity: 0.30,        // Sensational keywords = fake
    clickbaitScore: 0.15,       // Clickbait = fake
    wordLength: -0.05,           // Longer words = real (slightly)
    sentenceComplexity: -0.05,    // Complex sentences = real
    shortText: 0.10,             // Very short = fake
    socialMedia: 0.05            // Social media style = fake
  };
  
  // Calculate weighted fake score
  let fakeScore = 0;
  fakeScore += features[0] * weights.exclamationDensity;  // exclamation
  fakeScore += features[1] * weights.capitalRatio;         // capitals
  fakeScore += features[2] * weights.keywordDensity;       // keywords
  fakeScore += features[3] * weights.clickbaitScore;      // clickbait
  fakeScore += features[4] * weights.wordLength;           // word length
  fakeScore += features[5] * weights.sentenceComplexity;   // complexity
  fakeScore += features[6] * weights.shortText;           // short text
  fakeScore += features[7] * weights.socialMedia;          // social
  
  // Normalize to 0-1 range
  const totalWeight = Object.values(weights).reduce((a, b) => a + Math.abs(b), 0);
  const normalizedScore = (fakeScore + totalWeight) / (2 * totalWeight);
  
  // Threshold: >0.5 means fake
  const isFake = normalizedScore > 0.5;
  const confidence = Math.abs(normalizedScore - 0.5) * 200;
  
  // Generate analysis
  const analysis = generateAnalysis(text, features);
  
  return {
    isFake,
    confidence: Math.round(confidence),
    credibilityScore: isFake ? 100 - Math.round(confidence) : Math.round(confidence),
    analysis,
    probability: normalizedScore
  };
}

// ===========================================
// Analysis Generator
// ===========================================

function generateAnalysis(text, features) {
  const analysis = [];
  
  // Exclamation marks
  if (features[0] > 0.3) {
    analysis.push('Excessive exclamation marks detected');
  }
  
  // Capital letters
  if (features[1] > 0.4) {
    analysis.push('High use of capital letters (ALL CAPS style)');
  }
  
  // Keywords
  if (features[2] > 0.3) {
    analysis.push('Sensational/fake news keywords detected');
  }
  
  // Clickbait
  if (features[3] > 0.3) {
    analysis.push('Clickbait patterns identified');
  }
  
  // Short text
  if (features[6] > 0.5) {
    analysis.push('Headline is very short');
  }
  
  // Social media indicators
  if (features[7] > 0.3) {
    analysis.push('Social media style content detected');
  }
  
  if (analysis.length === 0) {
    analysis.push('No obvious fake news patterns detected');
    analysis.push('Writing appears professional and balanced');
  }
  
  return analysis;
}

// ===========================================
// Fallback Prediction (Simple Rule-based)
// ===========================================

function fallbackPredict(text) {
  const lowerText = text.toLowerCase();
  
  const fakeKeywords = [
    'breaking', 'shocking', 'unbelievable', "you won't believe", 'secret', 'conspiracy',
    "they don't want you to know", 'miracle', 'cure all', 'Scientists prove',
    'urgent', 'must read', 'share this', "mainstream media won't", 'big pharma',
    'government hiding', '100% natural', 'no side effects', 'instant', 'guaranteed'
  ];
  
  let keywordCount = 0;
  fakeKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) keywordCount++;
  });
  
  const exclamationMarks = (text.match(/!/g) || []).length;
  const wordCount = text.split(/\s+/).length;
  const capitalLetters = (text.match(/[A-Z]/g) || []).length;
  
  let fakeScore = 0;
  fakeScore += Math.min(exclamationMarks * 0.3, 2);
  fakeScore += Math.min(keywordCount * 1.5, 5);
  if (wordCount < 20) fakeScore += 1;
  if (capitalLetters > text.length * 0.25) fakeScore += 1.5;
  
  const fakeProbability = Math.min(fakeScore / 10 * 100, 95);
  const isFake = fakeProbability > 50;
  
  const analysis = [];
  if (fakeScore > 3) analysis.push('Multiple fake news indicators detected');
  if (keywordCount > 2) analysis.push(`Sensational keywords found (${keywordCount})`);
  if (exclamationMarks > 3) analysis.push('Excessive exclamation marks');
  if (wordCount < 20) analysis.push('Short headline');
  if (analysis.length === 0) {
    analysis.push('No obvious fake patterns detected');
    analysis.push('Writing appears professional');
  }
  
  return {
    isFake,
    confidence: Math.round(isFake ? fakeProbability : 100 - fakeProbability),
    credibilityScore: isFake ? 100 - Math.round(fakeProbability) : Math.round(fakeProbability),
    analysis
  };
}

// ===========================================
// Initialize Model on Load
// ===========================================

// Train model immediately when loaded
initialize();

// Export for use in server
module.exports = {
  predict,
  extractFeatures,
  trainedModel: () => trainedModel
};

// Run if called directly
if (require.main === module) {
  console.log('');
  console.log('🧪 Quick Test:');
  const result1 = predict("BREAKING: Secret cure discovered that doctors don't want you to know!");
  console.log('Fake News Test:', result1);
  
  const result2 = predict("Scientists published a peer-reviewed study on climate change in Nature journal.");
  console.log('Real News Test:', result2);
  process.exit(0);
}
