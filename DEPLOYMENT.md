# Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide walks you through deploying your Zudoku application with the frontend on Vercel and the backend on Render.

## Prerequisites

- [ ] GitHub account with your project repository pushed
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] Render account (sign up at [render.com](https://render.com))
- [ ] Clerk account with production credentials
- [ ] All environment variables ready (see `.env.example`)

## Deployment Architecture

```
┌─────────────────┐         ┌─────────────────┐
│  Vercel         │         │  Render         │
│  (Frontend)     │ ──────> │  (Backend)      │
│  Zudoku Build   │  HTTPS  │  Express Server │
└─────────────────┘         └─────────────────┘
         │                           │
         │                           │
         └──────────┬────────────────┘
                    │
              ┌─────▼──────┐
              │   Clerk    │
              │    Auth    │
              └────────────┘
```

---

## Phase 1: Deploy Backend to Render

### Step 1: Push Code to GitHub

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Add deployment configurations"
git push origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your repository (`zudoku`)
3. Configure the service:

   **Basic Settings:**
   - **Name**: `zudoku-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`

   **Advanced Settings:**
   - **Plan**: Free (or paid for better performance)
   - **Auto-Deploy**: Yes (deploys on git push)

4. Click **"Create Web Service"**

### Step 4: Configure Environment Variables

In the Render Dashboard for your service:

1. Go to **"Environment"** tab
2. Add the following environment variables:

   | Key | Value | Notes |
   |-----|-------|-------|
   | `NODE_ENV` | `production` | Required |
   | `CLERK_SECRET_KEY` | `sk_live_xxxxx` | From Clerk Dashboard |
   | `CLERK_JWKS_URI` | `https://your-app.clerk.accounts.dev/.well-known/jwks.json` | From Clerk |
   | `FRONTEND_URL` | `https://your-app.vercel.app` | **Add after Vercel deployment** |
   | `PORT` | `10000` | Auto-set by Render |

   **Optional (for paid API features):**
   - `yourdomain_UNSPLASH_KEY` - Domain-specific API keys

3. Click **"Save Changes"**

### Step 5: Get Backend URL

1. Wait for deployment to complete (5-10 minutes)
2. Your backend URL will be: `https://zudoku-backend.onrender.com`
3. **Copy this URL** - you'll need it for Vercel

### Step 6: Test Backend (Optional)

You can test the backend is running:
```bash
curl https://zudoku-backend.onrender.com
```

⚠️ **Note**: Most endpoints require authentication, so you'll get 401 errors without a valid token.

---

## Phase 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Select the `zudoku` repository

### Step 3: Configure Build Settings

Vercel should auto-detect settings from `vercel.json`, but verify:

- **Framework Preset**: Other
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.zudoku/dist`
- **Install Command**: `npm install`

### Step 4: Configure Environment Variables

1. In **"Environment Variables"** section, add:

   | Key | Value | Environment |
   |-----|-------|-------------|
   | `ZUDOKU_PUBLIC_BACKEND_URL` | `https://zudoku-backend.onrender.com` | Production, Preview, Development |
   | `ZUDOKU_PUBLIC_CLERK_PUB_KEY` | `pk_live_xxxxx` | Production, Preview, Development |

   Replace with your actual values:
   - Backend URL from Phase 1, Step 5
   - Clerk publishable key from Clerk Dashboard

2. Click **"Deploy"**

### Step 5: Get Frontend URL

1. Wait for deployment to complete (3-5 minutes)
2. Your frontend URL will be: `https://your-app.vercel.app`
3. **Copy this URL** - you need to update Render backend

### Step 6: Verify Deployment

Visit your Vercel URL and check:
- [ ] Site loads correctly
- [ ] Clerk authentication works
- [ ] API documentation is visible

---

## Phase 3: Update Backend with Frontend URL

### Step 1: Update Render Environment Variable

1. Go back to Render Dashboard
2. Open your backend service
3. Go to **"Environment"** tab
4. Update `FRONTEND_URL`:
   - **Value**: `https://your-app.vercel.app` (your actual Vercel URL)
5. Click **"Save Changes"**

### Step 2: Redeploy Backend

Render will automatically redeploy with the new environment variable. Wait for it to complete.

### Step 3: Update Clerk Settings

1. Go to Clerk Dashboard
2. Navigate to **"Domains"** or **"JWT Templates"**
3. Add your production URLs:
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://zudoku-backend.onrender.com`
4. Configure CORS settings if needed

---

## Phase 4: Test Full Application

### Test Checklist:

1. **Frontend Access**:
   - [ ] Visit `https://your-app.vercel.app`
   - [ ] UI loads correctly
   - [ ] Clerk login works

2. **Authentication**:
   - [ ] Sign in with Clerk
   - [ ] Session persists across page reloads

3. **API Endpoints** (Basic Tier):
   - [ ] Try zippopotam API: `/api/zippopotam/us/90210`
   - [ ] Verify response works

4. **API Endpoints** (Paid Tier):
   - [ ] Set user role to "paid" in Clerk metadata
   - [ ] Try httpbin API: `/api/httpbin/get`
   - [ ] Try unsplash API (if configured): `/api/unsplash/photos`

---

## Environment Variables Summary

### Vercel (Frontend)
```env
ZUDOKU_PUBLIC_BACKEND_URL=https://zudoku-backend.onrender.com
ZUDOKU_PUBLIC_CLERK_PUB_KEY=pk_live_xxxxx
```

### Render (Backend)
```env
NODE_ENV=production
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_JWKS_URI=https://your-app.clerk.accounts.dev/.well-known/jwks.json
FRONTEND_URL=https://your-app.vercel.app
PORT=10000
# Optional domain-specific keys:
# company_UNSPLASH_KEY=xxxxx
```

---

## Troubleshooting

### Issue: CORS Errors

**Symptom**: `CORS policy blocked` errors in browser console

**Solution**:
1. Verify `FRONTEND_URL` in Render matches your exact Vercel URL
2. Check that backend is deployed with updated environment variables
3. Clear browser cache and try again

### Issue: 401 Unauthorized

**Symptom**: All API requests return 401

**Solution**:
1. Verify Clerk keys are correct in both Vercel and Render
2. Check `CLERK_JWKS_URI` is correct
3. Ensure user is logged in with Clerk
4. Check browser cookies - `__session` cookie should be present

### Issue: 403 Forbidden (Paid APIs)

**Symptom**: Paid APIs return 403 error

**Solution**:
1. Check user role in Clerk Dashboard → Users → Public Metadata
2. Should be: `{"role": "paid"}`
3. If using domain-specific API keys, verify environment variable format:
   - Correct: `company_UNSPLASH_KEY`
   - User email: `user@company.com`

### Issue: Backend Not Responding

**Symptom**: Timeout or no response from backend

**Solution**:
1. Check Render logs: Dashboard → Service → Logs
2. Verify all required environment variables are set
3. Check if service is running (should show "Live")
4. Try restarting the service

### Issue: Build Failures

**Frontend (Vercel)**:
1. Check build logs in Vercel
2. Verify `ZUDOKU_PUBLIC_BACKEND_URL` is set
3. Ensure `package.json` has correct scripts

**Backend (Render)**:
1. Check deploy logs in Render
2. Verify `npm install` completes successfully
3. Check Node version compatibility

---

## Updating Deployments

### Update Frontend (Vercel)

Vercel auto-deploys on every push to `main`:

```bash
git add .
git commit -m "Update frontend"
git push origin main
```

### Update Backend (Render)

Render also auto-deploys on every push to `main`:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

### Manual Redeployment

**Vercel**: 
1. Go to project → Deployments
2. Click ⋯ on latest deployment → Redeploy

**Render**:
1. Go to service dashboard
2. Click "Manual Deploy" → Deploy latest commit

---

## Performance Optimization

### Render Free Tier Limitations

- Service spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- Upgrade to paid plan for always-on service

**Mitigation**: Use a service like [UptimeRobot](https://uptimerobot.com) to ping your backend every 5 minutes.

### Vercel Edge Network

- Automatically cached at edge locations worldwide
- Use ISR (Incremental Static Regeneration) for dynamic content
- Enable Edge Functions for faster serverless compute

---

## Security Best Practices

1. **Environment Variables**: Never commit `.env` to git
2. **Clerk Keys**: Use production keys in production
3. **HTTPS**: Always enforced in production (Vercel/Render handle this)
4. **API Keys**: Store domain-specific keys securely
5. **CORS**: Keep `FRONTEND_URL` restricted to your Vercel domain
6. **Rate Limiting**: Consider adding rate limiting to backend
7. **Logging**: Monitor logs for suspicious activity

---

## Custom Domains (Optional)

### Vercel Custom Domain

1. Go to project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown

### Render Custom Domain

1. Go to service → Settings → Custom Domain
2. Add your domain
3. Configure DNS records:
   ```
   CNAME backend.yourdomain.com → zudoku-backend.onrender.com
   ```

4. Update environment variables with new domains

---

## Costs

### Free Tier

- **Vercel**: 100GB bandwidth/month, unlimited deployments
- **Render**: 750 hours/month, 1 GB RAM, sleeps after inactivity

### Paid Plans

**Vercel Pro** ($20/month):
- 1TB bandwidth
- Better performance
- Team features

**Render Starter** ($7/month):
- Always-on service
- No cold starts
- Better performance

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Clerk Docs**: https://clerk.com/docs
- **Zudoku Docs**: https://zudoku.dev/docs

---

## Deployment Checklist

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] `.env.example` updated
- [ ] Clerk production keys ready
- [ ] All tests passing locally

### Render Backend
- [ ] Service created
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] Backend URL copied

### Vercel Frontend
- [ ] Project imported
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Frontend URL copied

### Post-Deployment
- [ ] Backend `FRONTEND_URL` updated
- [ ] Clerk domains configured
- [ ] Full application tested
- [ ] Documentation updated
- [ ] Team notified

---

**Congratulations! Your application is now deployed and live!** 🎉
