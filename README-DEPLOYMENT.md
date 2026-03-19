# 🚀 Quick Deployment Guide - HairTP Clinic CCO

Fast-track guide to deploy your application to production.

---

## ⚡ QUICK START (5 minutes)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel --prod
```

**That's it!** Your app is now live! 🎉

---

## 📋 PREREQUISITES

Before deploying:

✅ All tests passing (`npm run test:run`)  
✅ Build successful (`npm run build`)  
✅ No console errors  
✅ Environment variables configured

---

## 🌍 DEPLOYMENT OPTIONS

### Option 1: Vercel CLI (Fastest)

```bash
# Preview deployment
vercel

# Production deployment  
vercel --prod
```

**Pros:** Fast, simple, one command  
**Cons:** Manual deployment

---

### Option 2: GitHub Integration (Recommended)

#### Setup:
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Click "Deploy"

#### Auto-deployments:
- **Main branch** → Production
- **Pull requests** → Preview deployments
- **Other branches** → No deployment

**Pros:** Automated, preview deployments, CI/CD  
**Cons:** Requires GitHub setup

---

### Option 3: Drag & Drop

1. Build locally: `npm run build`
2. Go to [vercel.com](https://vercel.com)
3. Drag `dist` folder
4. Deploy

**Pros:** No CLI needed  
**Cons:** Manual, no CI/CD

---

## 🔧 ENVIRONMENT VARIABLES

### Required (Vercel Dashboard):

```
VITE_APP_ENV=production
VITE_APP_URL=https://your-domain.com
```

### Optional:

```
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project
VITE_GA_ID=G-XXXXXXXXXX
VITE_API_URL=https://api.your-domain.com
```

**Add in:** Vercel Dashboard → Settings → Environment Variables

---

## ✅ PRE-DEPLOYMENT CHECKLIST

Quick checklist before deploying:

- [ ] Tests passing (`npm run test:run`)
- [ ] Build successful (`npm run build`)
- [ ] Preview working (`npm run preview`)
- [ ] Environment variables set
- [ ] No console errors

---

## 📊 POST-DEPLOYMENT VERIFICATION

After deployment, verify:

### Functionality:
```bash
# Open your production URL
# Test:
✅ App loads
✅ Search works
✅ Navigation works
✅ No errors in console
```

### Performance:
```bash
# Run Lighthouse audit
✅ Performance > 95
✅ Accessibility = 100
✅ Best Practices = 100
✅ SEO > 95
```

---

## 🐛 TROUBLESHOOTING

### Build fails?
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment variables not working?
- Ensure prefix: `VITE_`
- Check Vercel Dashboard → Settings → Environment Variables
- Redeploy after adding variables

### 404 on routes?
- Check `vercel.json` is committed
- Verify rewrites configuration

### Slow loading?
```bash
# Analyze bundle
npm run build:analyze

# Check bundle sizes
# Main should be < 200 KB
```

---

## ⏮️ ROLLBACK

If something goes wrong:

### Via Vercel Dashboard:
1. Go to Deployments
2. Find last working deployment
3. Click "Promote to Production"

### Via CLI:
```bash
vercel ls
vercel promote <deployment-url>
```

**Time to rollback:** ~30 seconds

---

## 📈 MONITORING

### Vercel Analytics
Automatically enabled - view in Vercel Dashboard

### Sentry (Error Tracking)
```bash
# Install
npm install @sentry/react

# Configure DSN in Vercel env vars
VITE_SENTRY_DSN=your-dsn
```

### Google Analytics
```bash
# Add GA ID in Vercel env vars
VITE_GA_ID=G-XXXXXXXXXX
```

---

## 🔗 USEFUL LINKS

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Deployment Guide:** See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
- **Production Checklist:** See [PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md)

---

## 💡 TIPS

### Best Practices:
1. ✅ Always test in preview first
2. ✅ Deploy during low-traffic hours
3. ✅ Have rollback plan ready
4. ✅ Monitor for 24h after deployment
5. ✅ Keep team informed

### Performance:
- Use code splitting
- Optimize images
- Enable caching
- Lazy load components
- Monitor bundle sizes

### Security:
- Use HTTPS
- Set security headers
- Enable CSP
- Hide sensitive data
- Rate limit API calls

---

## 🎯 DEPLOYMENT COMMANDS

```bash
# Development
npm run dev                 # Start dev server

# Testing
npm run test               # Run tests
npm run test:coverage      # Coverage report

# Building
npm run build              # Production build
npm run preview            # Preview build

# Deploying
vercel                     # Preview deployment
vercel --prod             # Production deployment
```

---

## 📞 SUPPORT

### Need Help?

1. Check [Troubleshooting](#troubleshooting)
2. See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
3. Review Vercel logs
4. Contact Vercel Support

---

## 🎉 SUCCESS!

**Your HairTP Clinic CCO is now live!**

Monitor your deployment:
- Vercel Dashboard: https://vercel.com/dashboard
- Production URL: https://your-domain.com
- Sentry: https://sentry.io

**Happy deploying! 🚀**

---

**Version:** 1.0.0  
**Last Updated:** 2024-03-15
