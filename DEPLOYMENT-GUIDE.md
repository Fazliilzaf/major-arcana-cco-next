# 🚀 HairTP Clinic - Deployment Guide

Complete guide for deploying HairTP Clinic CCO to production.

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Build Process](#build-process)
4. [Deployment to Vercel](#deployment-to-vercel)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Monitoring Setup](#monitoring-setup)
7. [Post-Deployment](#post-deployment)
8. [Rollback Procedures](#rollback-procedures)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 PREREQUISITES

### Required:
- ✅ Node.js 20+ installed
- ✅ npm or pnpm installed
- ✅ Git repository setup
- ✅ Vercel account
- ✅ All tests passing (`npm run test:run`)

### Optional:
- Sentry account (for error tracking)
- Google Analytics ID (for analytics)
- Custom domain

---

## 🌍 ENVIRONMENT SETUP

### 1. Copy Environment Template

```bash
cp .env.example .env.local
```

### 2. Configure Variables

Edit `.env.local` with your values:

```env
# Application
VITE_APP_URL=https://your-domain.com

# API (if applicable)
VITE_API_URL=https://api.your-domain.com/v1
VITE_API_KEY=your_api_key_here

# Monitoring (optional)
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project
VITE_GA_ID=G-XXXXXXXXXX

# Features
VITE_FEATURE_AI_ENABLED=true
VITE_FEATURE_ANALYTICS=true
VITE_FEATURE_ERROR_TRACKING=true
```

### 3. Environment Files

We use three environment files:

| File | Purpose | When Loaded |
|------|---------|-------------|
| `.env.development` | Development | `npm run dev` |
| `.env.production` | Production defaults | `npm run build` |
| `.env.local` | Local overrides | Always (gitignored) |

**⚠️ NEVER commit `.env.local` or secrets to git!**

---

## 🏗️ BUILD PROCESS

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests

```bash
npm run test:run
```

Ensure all 189 tests pass before deployment.

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in `/dist`.

### 4. Preview Build Locally

```bash
npm run preview
```

Open `http://localhost:4173` to test production build.

### 5. Analyze Bundle (Optional)

```bash
npm run build:analyze
```

Check bundle sizes and optimization opportunities.

---

## 🚀 DEPLOYMENT TO VERCEL

### Method 1: Vercel CLI (Recommended)

#### Install Vercel CLI

```bash
npm install -g vercel
```

#### Login to Vercel

```bash
vercel login
```

#### Deploy to Preview

```bash
npm run deploy:preview
```

This creates a preview deployment for testing.

#### Deploy to Production

```bash
npm run deploy
```

This deploys to production (your custom domain).

---

### Method 2: GitHub Integration (Automated)

#### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Select repository

#### 2. Configure Project

**Framework Preset:** Vite
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

#### 3. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
VITE_APP_ENV=production
VITE_APP_URL=https://your-domain.com
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project
VITE_GA_ID=G-XXXXXXXXXX
```

**Important:** Add separately for:
- ✅ Production
- ✅ Preview
- ✅ Development

#### 4. Deploy

Click "Deploy" - Vercel will:
1. Install dependencies
2. Run build
3. Deploy to CDN
4. Generate preview URL

---

### Method 3: Manual Upload

#### 1. Build Locally

```bash
npm run build
```

#### 2. Upload `dist/` Folder

Use Vercel's drag-and-drop interface:
1. Go to vercel.com
2. Drag `dist` folder to upload
3. Deploy

⚠️ **Not recommended for production!** Use Method 1 or 2.

---

## 🔄 CI/CD PIPELINE

### GitHub Actions Workflow

Our CI/CD pipeline (`.github/workflows/ci-cd.yml`) automatically:

1. ✅ **Lint & Type Check** - Validates code quality
2. ✅ **Run Tests** - All 189 tests must pass
3. ✅ **Build** - Creates production bundle
4. ✅ **Deploy Preview** - For pull requests
5. ✅ **Deploy Production** - On merge to `main`
6. ✅ **Lighthouse CI** - Performance checks

### Required Secrets

Add these to GitHub Settings → Secrets:

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

**How to get these:**

1. **VERCEL_TOKEN:**
   - Go to Vercel → Settings → Tokens
   - Create new token
   - Copy value

2. **VERCEL_ORG_ID & VERCEL_PROJECT_ID:**
   - Run `vercel` in project
   - Check `.vercel/project.json`
   - Copy `orgId` and `projectId`

### Deployment Triggers

| Event | Action | Environment |
|-------|--------|-------------|
| Push to `main` | Deploy | Production |
| Push to `develop` | Run tests | - |
| Pull Request | Deploy + Test | Preview |
| Manual | Deploy | Any |

---

## 📊 MONITORING SETUP

### 1. Sentry (Error Tracking)

#### Install Sentry SDK

```bash
npm install @sentry/react
```

#### Configure DSN

Add to environment variables:

```env
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project
VITE_FEATURE_ERROR_TRACKING=true
```

Sentry will auto-initialize in production.

### 2. Google Analytics

#### Add GA ID

```env
VITE_GA_ID=G-XXXXXXXXXX
VITE_FEATURE_ANALYTICS=true
```

Analytics will auto-initialize in production.

### 3. Vercel Analytics

Automatically enabled on Vercel. View in Vercel Dashboard → Analytics.

### 4. Web Vitals

Performance metrics automatically tracked:
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Time to First Byte (TTFB)

---

## ✅ POST-DEPLOYMENT CHECKLIST

After deployment, verify:

### Functionality:
- [ ] App loads correctly
- [ ] All pages accessible
- [ ] Search works
- [ ] Message selection works
- [ ] Response studio opens
- [ ] Multi-select works
- [ ] Keyboard shortcuts work
- [ ] Theme switcher works
- [ ] No console errors

### Performance:
- [ ] Lighthouse score 95+
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Bundle size < 200 KB (main)

### Security:
- [ ] HTTPS enabled
- [ ] Security headers present
- [ ] CSP configured
- [ ] No exposed secrets
- [ ] XSS protection active

### Monitoring:
- [ ] Sentry receiving events
- [ ] Analytics tracking
- [ ] Error alerts configured
- [ ] Performance monitoring active

### SEO:
- [ ] Meta tags present
- [ ] Sitemap accessible
- [ ] Robots.txt configured
- [ ] Social media cards

---

## ⏮️ ROLLBACK PROCEDURES

### Method 1: Vercel Dashboard

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Deployments"
4. Find previous successful deployment
5. Click "Promote to Production"

### Method 2: Vercel CLI

```bash
# List deployments
vercel ls

# Promote specific deployment
vercel promote <deployment-url>
```

### Method 3: Git Revert

```bash
# Revert last commit
git revert HEAD

# Push to trigger new deployment
git push origin main
```

### Emergency Rollback

If immediate rollback needed:

1. Open Vercel Dashboard
2. Go to Deployments
3. Click "..." on last working deployment
4. Click "Promote to Production"

**Time to rollback:** ~30 seconds

---

## 🐛 TROUBLESHOOTING

### Build Fails

**Problem:** Build fails with "Module not found"

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

### Environment Variables Not Working

**Problem:** Env vars are undefined in app

**Solution:**
- Ensure vars are prefixed with `VITE_`
- Restart dev server after changes
- Check Vercel dashboard for production

---

### Bundle Too Large

**Problem:** Bundle size exceeds 200 KB

**Solution:**
```bash
# Analyze bundle
npm run build:analyze

# Check for large dependencies
# Consider code splitting or lazy loading
```

---

### Deployment Timeout

**Problem:** Vercel deployment times out

**Solution:**
- Check build logs for errors
- Ensure dependencies install correctly
- Verify build command is correct
- Contact Vercel support if persistent

---

### 404 on Routes

**Problem:** Direct URLs return 404

**Solution:**
- Check `vercel.json` has rewrites configured
- Ensure SPA fallback is enabled
- Verify routes are defined correctly

---

### Performance Issues

**Problem:** Slow loading times

**Solution:**
1. Check Lighthouse report
2. Optimize images
3. Enable lazy loading
4. Check CDN caching
5. Review bundle size

---

## 📚 USEFUL COMMANDS

```bash
# Development
npm run dev              # Start dev server
npm test                 # Run tests in watch mode

# Testing
npm run test:run         # Run all tests once
npm run test:coverage    # Generate coverage report
npm run test:ui          # Open test UI

# Building
npm run build            # Production build
npm run preview          # Preview production build
npm run build:analyze    # Analyze bundle

# Deployment
npm run deploy:preview   # Deploy to preview
npm run deploy           # Deploy to production
```

---

## 🔗 USEFUL LINKS

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Vite Docs:** https://vitejs.dev
- **Sentry Docs:** https://docs.sentry.io
- **Lighthouse:** https://developers.google.com/web/tools/lighthouse

---

## 📞 SUPPORT

### Issues?

1. Check [Troubleshooting](#troubleshooting)
2. Review build logs in Vercel
3. Check Sentry for errors
4. Review GitHub Actions logs

### Need Help?

- Vercel Support: https://vercel.com/support
- Create GitHub Issue
- Check documentation

---

## 🎉 SUCCESS!

If you've followed this guide, your HairTP Clinic CCO application should be:

- ✅ Deployed to production
- ✅ Optimized for performance
- ✅ Monitored for errors
- ✅ Secured with HTTPS
- ✅ Backed up with rollback capability

**🚀 Your app is live and ready for users!**

---

**Version:** 1.0.0  
**Last Updated:** 2024-03-15  
**Maintained by:** HairTP Clinic Development Team
