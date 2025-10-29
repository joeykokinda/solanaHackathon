# Deployment Guide

## Step 1: Database (Neon PostgreSQL)

1. Go to https://neon.tech
2. Sign up / Login
3. Create a new project
4. Copy the connection string (it looks like: `postgresql://user:pass@host.neon.tech/database?sslmode=require`)

## Step 2: Deploy Backend (Railway)

1. Go to https://railway.app
2. Sign up / Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select: `solanaHackahton` repo → `backend` folder
5. Add environment variables:
   - `DATABASE_URL` = (paste Neon connection string)
   - `PORT` = 3001
   - `NODE_ENV` = production
   - `YOUTUBE_API_KEY` = (your YouTube API key)
6. Click "Deploy"
7. Once deployed, copy the Railway URL (like: `https://your-app.up.railway.app`)

## Step 3: Deploy Frontend (Vercel)

1. Go to https://vercel.com
2. Sign up / Login with GitHub  
3. Click "New Project"
4. Import `solanaHackahton` repository
5. Set Root Directory to: `frontend`
6. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = (paste Railway backend URL)
   - `NEXT_PUBLIC_SOLANA_RPC` = https://api.devnet.solana.com
   - `NEXT_PUBLIC_SOLANA_NETWORK` = devnet
7. Click "Deploy"

## Step 4: Setup Database

After backend is deployed:

```bash
# SSH into Railway or use their CLI
railway login
railway link
railway run npx prisma db push
railway run npm run seed
```

## Done! 🚀

Your app is now live at your Vercel URL!

