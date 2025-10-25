# YouVest - Project Overview

**Invest in creators before they blow up**

Built for: Cypherpunk Hackathon 2025 by Colosseum  
Status: ✅ Smart Contracts Deployed | 🔨 Backend & Frontend Ready to Run  
Deadline: October 30, 2025

---

## 🎯 What We Built

A Solana-based platform where fans can invest in early-stage YouTubers (1k-10k subs) by buying creator tokens. Token prices increase via a bonding curve as more fans buy in, rewarding early supporters.

**Think:** Pump.fun but for real creators with real metrics, not memecoins.

---

## ✅ COMPLETED

### 1. Smart Contracts (Solana/Anchor) - DEPLOYED ✅

**Token Factory Program**
- Creates SPL tokens for each creator
- Tracks YouTube metrics (subscribers, views, engagement)
- Stores initial baseline metrics for price calculations
- **Deployed:** `7yNsJvKUNgxdAHgCRY2SWb7GqsaL5HxTgSfpraHQCYdh`

**Bonding Curve Program**
- Automated buy/sell with dynamic pricing
- Price formula: `base_price * (1 + tokens_bought/10M) * engagement_multiplier`
- Built-in slippage protection
- Liquidity always available (no order books)
- **Deployed:** `ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi`

**Location:** `/contracts/programs/`

### 2. Backend API (Express + Node.js) - READY ✅

**Built & Tested:**
- Express REST API server
- PostgreSQL database with Prisma ORM
- YouTube OAuth authentication flow
- Creator management (list, details, token launch)
- Token pricing endpoints
- User portfolio tracking
- Automated metrics scraper (cron job - hourly updates)

**Database Schema:**
- Users (wallet addresses)
- Creators (YouTube channels + token addresses)
- MetricsHistory (time-series subscriber/view data)
- Transactions (buy/sell records)

**Location:** `/backend/src/`

### 3. Frontend Infrastructure (Next.js) - READY ✅

**Installed & Configured:**
- Next.js 14 with React
- TypeScript
- TailwindCSS
- Solana Wallet Adapter (Phantom, Solflare support)
- Recharts (for analytics)
- SWR (data fetching)

**Location:** `/frontend/`

---

## 📋 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    SOLANA DEVNET                         │
│  ┌────────────────────┐    ┌──────────────────────┐    │
│  │  Token Factory     │    │   Bonding Curve      │    │
│  │  Creates tokens    │    │   Buy/Sell logic     │    │
│  └────────────────────┘    └──────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │ Web3.js
                          │
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Express)                       │
│  ┌────────────────────────────────────────────────┐    │
│  │  REST API                                       │    │
│  │  • /api/creators (list, details, launch)       │    │
│  │  • /api/tokens (price, chart)                  │    │
│  │  • /api/users (portfolio)                      │    │
│  │  • /api/auth (YouTube OAuth)                   │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │  PostgreSQL (Prisma)                           │    │
│  │  • Users, Creators, Metrics, Transactions      │    │
│  └────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────┐    │
│  │  Cron Jobs                                      │    │
│  │  • Hourly YouTube metrics scraper              │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │ REST API
                          │
┌─────────────────────────────────────────────────────────┐
│                FRONTEND (Next.js + React)                │
│  • Landing page                                         │
│  • Creator marketplace                                  │
│  • Creator profiles with buy/sell                       │
│  • Wallet connection                                    │
│  • Portfolio tracking                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 How It Works

### 1. Creator Launches Token
1. YouTuber connects wallet + authorizes YouTube OAuth
2. Backend verifies channel ownership (1k-10k subs required)
3. Token Factory creates 100M SPL tokens
4. Bonding Curve initialized with base price 0.01 SOL
5. Creator gets 20% immediately, 80% vests over time

### 2. Fans Buy Tokens
1. Fan connects wallet (Phantom/Solflare)
2. Browses creator marketplace
3. Clicks "Buy" on creator profile
4. Bonding Curve calculates price based on demand
5. Transaction signed → tokens transferred
6. Price increases for next buyer

### 3. Price Discovery
```
Current Price = Base Price × Demand Multiplier × Engagement Multiplier

Where:
- Base Price = 0.01 SOL (fixed)
- Demand Multiplier = (1 + tokens_bought / 10M)
- Engagement Multiplier = sqrt(current_views / initial_views)
```

### 4. Metrics Update
- Cron job runs hourly
- Fetches latest YouTube stats (subs, views, engagement)
- Updates engagement multiplier in bonding curve
- Stores history in database for charts

---

## 📂 Project Structure

```
solanaHackahton/
├── contracts/
│   ├── programs/
│   │   ├── token-factory/
│   │   │   └── src/lib.rs          ✅ Token creation
│   │   └── bonding-curve/
│   │       └── src/lib.rs          ✅ Buy/sell logic
│   ├── Anchor.toml                 ✅ Program addresses
│   └── target/deploy/              ✅ Compiled .so files
│
├── backend/
│   ├── src/
│   │   ├── server.js               ✅ Express app
│   │   ├── routes/
│   │   │   ├── auth.js             ✅ YouTube OAuth
│   │   │   ├── creators.js         ✅ Creator CRUD
│   │   │   ├── tokens.js           ✅ Token pricing
│   │   │   └── users.js            ✅ Portfolio
│   │   └── cron/
│   │       └── updateMetrics.js    ✅ Metrics scraper
│   ├── prisma/
│   │   └── schema.prisma           ✅ Database schema
│   └── package.json
│
└── frontend/
    ├── app/                        🔨 Need to build pages
    ├── components/                 🔨 Need to build components
    └── package.json                ✅ Dependencies installed
```

---

## 🚀 Next Steps

### 1. Setup Backend (15 minutes)

```bash
cd /home/joey/Projects/BSProjects/solanaHackahton/backend

# Create .env file
cat > .env << 'EOF'
DATABASE_URL="postgresql://user:password@localhost:5432/youvest"
YOUTUBE_API_KEY="your_api_key"
YOUTUBE_CLIENT_ID="your_client_id"
YOUTUBE_CLIENT_SECRET="your_secret"
YOUTUBE_REDIRECT_URI="http://localhost:3001/api/auth/youtube/callback"
SOLANA_RPC_URL="https://api.devnet.solana.com"
TOKEN_FACTORY_PROGRAM_ID="7yNsJvKUNgxdAHgCRY2SWb7GqsaL5HxTgSfpraHQCYdh"
BONDING_CURVE_PROGRAM_ID="ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi"
PORT=3001
JWT_SECRET="random_secret_here"
FRONTEND_URL="http://localhost:3000"
EOF

# Setup database
npx prisma generate
npx prisma migrate dev --name init

# Start server
npm run dev
```

### 2. Build Frontend Pages (2-3 hours)

**Need to create:**
- `app/layout.tsx` - Wallet provider wrapper
- `app/page.tsx` - Landing page ("Invest in creators before they blow up")
- `app/marketplace/page.tsx` - Browse creators grid
- `app/creator/[id]/page.tsx` - Profile + buy/sell widget
- `components/Header.tsx` - Nav with wallet button
- `components/CreatorCard.tsx` - Creator card component
- `components/TokenBuyWidget.tsx` - Buy/sell interface

**Create frontend env:**
```bash
cd /home/joey/Projects/BSProjects/solanaHackahton/frontend

cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_TOKEN_FACTORY_PROGRAM_ID=7yNsJvKUNgxdAHgCRY2SWb7GqsaL5HxTgSfpraHQCYdh
NEXT_PUBLIC_BONDING_CURVE_PROGRAM_ID=ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi
EOF
```

### 3. Test End-to-End (1 hour)

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Connect wallet (Phantom on devnet)
4. Onboard test creator via YouTube OAuth
5. Buy tokens from creator profile
6. Verify transaction on Solana Explorer

### 4. Onboard Real Creators (1 hour)

- Find 3 YouTubers with 1k-10k subs
- Have them authorize via YouTube OAuth
- Launch their tokens
- Test buying from each

### 5. Prepare Demo (2 hours)

- Create 5-slide pitch deck
- Practice 5-minute demo script
- Record backup video
- Take screenshots for submission

---

## 🎥 Demo Script (5 Minutes)

**Hook (30s):** "Ever discover a YouTuber early and wish you invested in them? With YouVest, you can."

**Problem (30s):** Small creators can't get funding. Fans get no reward for early support.

**Solution (1m):** Buy creator tokens early, profit as they grow. Bonding curve ensures fair pricing.

**Live Demo (2m):**
1. Show marketplace
2. Click creator profile
3. Connect Phantom wallet
4. Buy tokens (live transaction)
5. Show portfolio

**Tech (1m):** Solana smart contracts, YouTube OAuth, real metrics, no rug pulls (vesting).

**Close (30s):** "3 creators launched, $X trading volume, live on devnet. This is the future of creator funding."

---

## 📊 What Makes This Win

**Innovation:** Novel DeFi + creator economy hybrid  
**Technical:** Multiple Solana programs, oracles, full-stack  
**Useful:** Solves real problem (creator funding gap)  
**UX:** Clean interface, 2-click buy process  
**Traction:** Real creators, real transactions  

---

## 🔗 Important Links

**Deployed Programs (Solana Devnet):**
- Token Factory: https://explorer.solana.com/address/7yNsJvKUNgxdAHgCRY2SWb7GqsaL5HxTgSfpraHQCYdh?cluster=devnet
- Bonding Curve: https://explorer.solana.com/address/ASKaLZvuV9TW6MKxNjQoKAQihzEAaVDzMryFqgvzDswi?cluster=devnet

**Resources:**
- Hackathon: https://arena.colosseum.org
- Solana Docs: https://docs.solana.com
- Anchor Docs: https://www.anchor-lang.com

---

## ⏱️ Time Estimate to Demo

**Total:** ~6-8 hours

- Backend setup: 15 min
- Frontend pages: 2-3 hours
- Integration testing: 1 hour  
- Onboard creators: 1 hour
- Demo prep: 2 hours
- Buffer: 1 hour

---

## 🏆 Success Metrics

- ✅ Smart contracts deployed and working
- ⬜ Backend running with database
- ⬜ Frontend showing real data
- ⬜ 3+ creators with tokens launched
- ⬜ $500+ in test trading volume
- ⬜ Wallet connection working
- ⬜ Live demo ready

---

Last Updated: October 25, 2025  
**Status:** Smart contracts deployed ✅ Backend ready ✅ Frontend infrastructure ready ✅

