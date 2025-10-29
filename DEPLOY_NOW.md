# 🚀 DEPLOY NOW - Step by Step

## ✅ Code is Ready!

All code has been updated to use environment variables. Now deploy:

---

## 1️⃣ DATABASE (2 minutes)

### Option A: Neon (Recommended - Free & Fast)
1. Go to: https://neon.tech
2. Click "Sign up" (use GitHub)
3. Click "Create Project"
4. Copy the connection string (looks like `postgresql://...neon.tech/...`)

### Option B: Supabase
1. Go to: https://supabase.com
2. Sign up → New Project
3. Go to Settings → Database → Connection String
4. Copy the "Connection Pooling" string

**✅ Save your DATABASE_URL somewhere safe!**

---

## 2️⃣ BACKEND API (5 minutes)

1. **Go to: https://railway.app**
2. Sign up with GitHub
3. Click **"New Project"**
4. Click **"Deploy from GitHub repo"**
5. Select: `solanaHackahton`
6. Click **"Add variables"** and add:
   ```
   DATABASE_URL = [paste your database URL from step 1]
   PORT = 3001
   NODE_ENV = production
   YOUTUBE_API_KEY = [your YouTube API key if you have one, or leave blank]
   ```
7. Railway will auto-detect and deploy!
8. Click **"Generate Domain"** to get your URL
9. **✅ Copy your Railway URL** (like `https://your-app.up.railway.app`)

### Initialize Database:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link
railway login
railway link

# Run migrations and seed
railway run npx prisma db push
railway run npm run seed
```

---

## 3️⃣ FRONTEND (3 minutes)

1. **Go to: https://vercel.com**
2. Sign up with GitHub
3. Click **"Add New"** → **"Project"**
4. Import `solanaHackahton`
5. Set **Root Directory** to: `frontend`
6. Click **"Environment Variables"** and add:
   ```
   NEXT_PUBLIC_API_URL = [paste your Railway URL from step 2]
   NEXT_PUBLIC_SOLANA_RPC = https://api.devnet.solana.com
   NEXT_PUBLIC_SOLANA_NETWORK = devnet
   ```
7. Click **"Deploy"**

---

## 🎉 DONE!

Your app is live at: `https://your-app.vercel.app`

**Share it with anyone!** They can:
- Connect their Solana wallet
- Buy/sell creator tokens
- View their portfolio
- Launch their own tokens

---

## 📱 Next Steps

1. Test the deployed app
2. If YouTube proxies fail, add your Vercel domain to CORS in backend
3. Share your app URL!

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check Railway logs
- Verify DATABASE_URL is correct
- Run `railway run npx prisma generate`

**Frontend API errors?**
- Check NEXT_PUBLIC_API_URL has no trailing slash
- Verify Railway backend is running
- Check browser console for errors

**Database empty?**
- Run: `railway run npm run seed`

---

## 🔥 Pro Tips

1. **Add custom domain on Vercel** (free)
2. **Monitor Railway logs** for errors
3. **Scale up if needed** (both have free tiers)
4. **Enable CORS** in backend for your domain

---

**Need help?** Check Railway/Vercel docs or ask!

