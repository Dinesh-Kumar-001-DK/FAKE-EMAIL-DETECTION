# TruthGuard Deployment Guide

Deploy to Vercel - Free for frontend & backend hosting.

---

## Prerequisites

1. [Vercel Account](https://vercel.com) - Sign up with GitHub
2. [Git installed](https://git-scm.com)
3. GitHub repository created

---

## Step 1: Push Code to GitHub

```bash
cd fake-news-detector
git init
git add .
git commit -m "TruthGuard - Fake News Detection System"
```

Create a new repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

---

## Step 2: Deploy Frontend (Static)

The frontend is static HTML/CSS/JS - deploy directly to Vercel.

### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: frontend
5. Click **Deploy**

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

---

## Step 3: Deploy Backend (Node.js API)

Vercel supports Node.js serverless functions.

### Create vercel.json

Create `vercel.json` in root directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

### Update Backend for Vercel

Modify `backend/server.js`:

```javascript
// Replace app.listen() with:
const server = app.listen();
module.exports = server;
```

### Deploy Backend

1. Go to Vercel Dashboard
2. Import the same repository
3. Configure:
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: backend
4. Click **Deploy**

---

## Step 4: Update Frontend API URL

After backend deployment, update `frontend/app.js`:

```javascript
// Change this:
const API_URL = 'http://localhost:3000/api';

// To your Vercel URL:
const API_URL = 'https://your-project.vercel.app/api';
```

---

## Vercel Limits (Free Tier)

| Feature | Limit |
|---------|-------|
| Bandwidth | 100GB/month |
| Serverless Functions | 100 hours |
| Build Time | 10 min |
| Custom Domains | 1 |

---

## Alternative: Deploy Frontend Only

For free hosting without backend serverless:

### Frontend-Only Alternative

1. Deploy frontend to Vercel (static)
2. Use browser-based detection in `frontend/app.js`

The `analyzeNews()` function already works in the browser!

---

## Quick Deploy Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy production
vercel --prod
```

---

## Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your-secret-key
```

---

## Troubleshooting

### 404 Errors
- Check vercel.json routes configuration
- Ensure file paths are correct

### API Not Working
- Add `"rewrites"` to vercel.json instead of routes
- Check function logs in Vercel Dashboard

### CORS Errors
- Update backend/server.js CORS configuration:
```javascript
app.use(cors({
  origin: 'https://your-project.vercel.app'
}));
```

---

## Production URL

After deployment:
- Frontend: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api`

---

## Next Steps

1. Add custom domain (optional)
2. Set up MongoDB Atlas for database
3. Configure SSL (automatic on Vercel)

---

## Support

- [Vercel Docs](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/cli)