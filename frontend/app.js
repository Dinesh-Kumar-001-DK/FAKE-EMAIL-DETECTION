// ========================================
// FakeGuard - Frontend Application
// ========================================

// API Base URL - Update this to your backend URL
const API_URL = 'http://localhost:3000/api';

// Store tokens
let authToken = localStorage.getItem('authToken');
let currentUser = localStorage.getItem('user');

// ========================================
// Utility Functions
// ========================================

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

function scrollToDemo() {
    document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// Demo Feature (Simulated Analysis)
// ========================================

function switchDemoTab(tab) {
    const tabs = document.querySelectorAll('.demo-tab');
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    const textarea = document.getElementById('demoInput');
    if (tab === 'headline') {
        textarea.placeholder = 'Paste a news headline here...\n\nExample: BREAKING: Scientists Discover Hidden Truth About [Topic] That Mainstream Media Won\'t Tell You!';
    } else {
        textarea.placeholder = 'Paste a full news article here...\n\nStart typing or paste an article to analyze...';
    }
}

function runDemo() {
    const input = document.getElementById('demoInput').value.trim();
    const resultDiv = document.getElementById('demoResult');
    
    if (!input) {
        alert('Please enter some text to analyze');
        return;
    }
    
    // Show loading state
    const resultBadge = document.getElementById('resultBadge');
    const resultLabel = document.getElementById('resultLabel');
    const resultConfidence = document.getElementById('resultConfidence');
    
    resultBadge.className = 'result-badge';
    resultBadge.innerHTML = '<i class="bi bi-hourglass-split"></i> Analyzing...';
    resultLabel.textContent = 'Analyzing...';
    resultConfidence.textContent = '...';
    resultDiv.style.display = 'block';
    
    // Simulate AI analysis with delay
    setTimeout(() => {
        const analysis = analyzeNews(input);
        displayResults(analysis);
    }, 1500);
}

function analyzeNews(text) {
    const lowerText = text.toLowerCase();
    
    // Feature extraction
    const features = {
        length: text.length,
        wordCount: text.split(/\s+/).length,
        exclamationMarks: (text.match(/!/g) || []).length,
        questionMarks: (text.match(/\?/g) || []).length,
        capitalLetters: (text.match(/[A-Z]/g) || []).length,
        specialChars: (text.match(/[^a-zA-Z0-9\s]/g) || []).length,
        urls: (text.match(/https?:\/\/[^\s]+/g) || []).length,
    };
    
    // Calculate ratios
    features.exclamationRatio = features.exclamationMarks / Math.max(features.wordCount, 1);
    features.capitalRatio = features.capitalLetters / Math.max(text.replace(/\s/g, '').length, 1);
    features.specialCharRatio = features.specialChars / Math.max(text.length, 1);
    
    // Fake news keyword detection
    const fakeKeywords = [
        'breaking', 'shocking', 'unbelievable', 'you won\'t believe', 'secret', 
        'conspiracy', 'they don\'t want you to know', 'miracle', 'cure all',
        'Scientists prove', 'Scientists discover', 'Scientists reveal',
        'urgent', 'must read', 'share this', 'like and subscribe',
        'mainstream media won\'t', 'big pharma', 'government hiding',
        '100% natural', 'no side effects', 'instant', 'guaranteed'
    ];
    
    const clickbaitPatterns = [
        /what (they|she|he|you) (don\'t|won\'t) (want|tell) (you|us)/i,
        /(shocking|breaking|unbelievable|outrageous)/i,
        /click (here|now|bait)/i,
        /(like|subscribe|share)/i,
        /this (one|simple|single) (trick|secret|thing|hack)/i,
        /(miracle|cure|revolutionary|game-changing)/i,
        /(Scientists|Doctors|Experts) (prove|discover|reveal|confirm)/i,
        /[A-Z]{5,}/g, // All caps words
        /!{2,}/g, // Multiple exclamation marks
    ];
    
    let keywordScore = 0;
    fakeKeywords.forEach(keyword => {
        if (lowerText.includes(keyword)) keywordScore++;
    });
    
    let clickbaitScore = 0;
    clickbaitPatterns.forEach(pattern => {
        if (pattern.test(text)) clickbaitScore++;
    });
    
    // Calculate fake probability
    let fakeScore = 0;
    fakeScore += Math.min(features.exclamationRatio * 10, 3);
    fakeScore += Math.min(features.capitalRatio * 5, 2);
    fakeScore += Math.min(keywordScore * 2, 5);
    fakeScore += Math.min(clickbaitScore * 3, 5);
    
    // Adjust based on text length (fake news often too short or too emotional)
    if (features.wordCount < 20) fakeScore += 2;
    
    // Normalize to percentage
    const fakeProbability = Math.min(Math.max(fakeScore / 20 * 100, 10), 95);
    const isFake = fakeProbability > 50;
    
    // Generate analysis details
    const analysisDetails = [];
    
    if (features.exclamationRatio > 0.05) {
        analysisDetails.push(`Excessive exclamation marks detected (${features.exclamationMarks} found)`);
    }
    if (features.capitalRatio > 0.3) {
        analysisDetails.push(`High use of capital letters (${(features.capitalRatio * 100).toFixed(0)}%)`);
    }
    if (keywordScore > 2) {
        analysisDetails.push(`Multiple sensational keywords detected (${keywordScore} found)`);
    }
    if (clickbaitScore > 0) {
        analysisDetails.push(`Clickbait patterns identified (${clickbaitScore} patterns)`);
    }
    if (features.wordCount < 20) {
        analysisDetails.push(`Headline is very short (${features.wordCount} words)`);
    }
    if (features.urls > 0) {
        analysisDetails.push(`Contains ${features.urls} URL(s) - verify source`);
    }
    
    if (analysisDetails.length === 0) {
        analysisDetails.push('No obvious fake news patterns detected');
        analysisDetails.push('Writing appears professional and balanced');
    }
    
    return {
        isFake,
        confidence: isFake ? fakeProbability : 100 - fakeProbability,
        credibilityScore: isFake ? 100 - fakeProbability : fakeProbability,
        analysis: analysisDetails,
        features
    };
}

function displayResults(analysis) {
    const resultBadge = document.getElementById('resultBadge');
    const resultLabel = document.getElementById('resultLabel');
    const resultConfidence = document.getElementById('resultConfidence');
    const credibilityMeter = document.getElementById('credibilityMeter');
    const analysisList = document.getElementById('analysisList');
    
    // Update badge
    if (analysis.isFake) {
        resultBadge.className = 'result-badge fake';
        resultBadge.innerHTML = '<i class="bi bi-exclamation-triangle-fill"></i> <span>Fake News Detected</span>';
    } else {
        resultBadge.className = 'result-badge real';
        resultBadge.innerHTML = '<i class="bi bi-check-circle-fill"></i> <span>Likely Real News</span>';
    }
    
    resultLabel.textContent = analysis.isFake ? 'Fake' : 'Real';
    resultConfidence.textContent = `${analysis.confidence.toFixed(0)}% confidence`;
    
    // Update meter with animation
    setTimeout(() => {
        credibilityMeter.style.width = `${analysis.credibilityScore}%`;
        credibilityMeter.style.background = analysis.isFake 
            ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
            : 'linear-gradient(135deg, #10b981, #059669)';
    }, 100);
    
    // Update analysis list
    analysisList.innerHTML = analysis.analysis
        .map(item => `<li><i class="bi bi-info-circle"></i> ${item}</li>`)
        .join('');
}

// ========================================
// Authentication Functions
// ========================================

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
        // Try backend API first
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            authToken = data.token;
            currentUser = JSON.stringify(data.user);
            
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            
            // Redirect to dashboard or reload
            window.location.href = 'dashboard.html';
        } else {
            errorDiv.textContent = data.message || 'Login failed. Please try again.';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        // If backend not available, show demo mode
        console.log('Backend not available, using demo mode');
        if (email && password) {
            localStorage.setItem('authToken', 'demo-token');
            localStorage.setItem('user', JSON.stringify({ name: email.split('@')[0], email }));
            
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            window.location.href = 'dashboard.html';
        } else {
            errorDiv.textContent = 'Please enter email and password';
            errorDiv.style.display = 'block';
        }
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const errorDiv = document.getElementById('registerError');
    
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (password.length < 8) {
        errorDiv.textContent = 'Password must be at least 8 characters';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        // Try backend API first
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
            
            showAlert('Account created successfully! Welcome to FakeGuard!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            errorDiv.textContent = data.message || 'Registration failed. Please try again.';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        // Demo mode registration
        console.log('Backend not available, using demo mode');
        localStorage.setItem('authToken', 'demo-token');
        localStorage.setItem('user', JSON.stringify({ name, email }));
        
        bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
        showAlert('Account created successfully! (Demo Mode)', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }
}

// ========================================
// Event Listeners
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Clear form fields on modal close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('hidden.bs.modal', () => {
            const forms = modal.querySelectorAll('form');
            forms.forEach(form => form.reset());
            const alerts = modal.querySelectorAll('.alert');
            alerts.forEach(alert => alert.style.display = 'none');
        });
    });
    
    // Initialize demo if present
    if (document.getElementById('demoInput')) {
        // Add keyboard shortcut for demo
        document.getElementById('demoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                runDemo();
            }
        });
    }
});

// ========================================
// Dashboard Functions (for dashboard.html)
// ========================================

async function predictNews(text) {
    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ text })
        });
        
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Prediction failed');
        }
    } catch (error) {
        // Fallback to local analysis
        return {
            ...analyzeNews(text),
            isLocal: true
        };
    }
}

// Export for use in other scripts
window.FakeGuard = {
    predictNews,
    analyzeNews,
    API_URL,
    showAlert
};
