# YouVest - Invest in Creators Before They Blow Up 🚀

A decentralized platform built on Solana that lets you invest in early-stage YouTubers (1k-50k subscribers) through creator tokens. Powered by bonding curves for fair price discovery.

**🌐 Live Demo:** [https://solana-hackathon-murex.vercel.app/app](https://solana-hackathon-murex.vercel.app/app)

**Hackathon:** Cypherpunk Hackathon 2025 by Colosseum  
**Deadline:** October 30, 2025

---

## 🎯 What is YouVest?

YouVest is a DeFi platform where you can discover and invest in emerging YouTube creators. Think of it as an early-stage stock market for content creators.

### The Problem
- Creators struggle to get funding in their early days
- Fans can't financially benefit from supporting creators they discover early
- No transparent way to value creator growth potential

### The Solution
- **Tokenize Creators**: Each YouTuber gets their own token on Solana
- **Bonding Curve Pricing**: Token price automatically adjusts based on supply and demand
- **Growth-Linked Value**: As creators gain subscribers/views, their token value increases
- **Instant Liquidity**: Buy or sell tokens anytime through the bonding curve

### How It Works

1. **Discover** - Browse early-stage YouTubers with 1k-50k subscribers using real YouTube API data
2. **Invest** - Buy creator tokens on Solana. Price increases as more people buy (bonding curve mechanism)
3. **Track** - Monitor token value as creators grow. Metrics are updated hourly from YouTube
4. **Trade** - Sell anytime for profit (or loss). Liquidity is built into the bonding curve

---

## 🏗️ Architecture

### Smart Contracts (Solana/Anchor)
- **Token Factory Program**: Creates SPL tokens for each verified creator
- **Bonding Curve Program**: Handles all buy/sell transactions with automatic price discovery
- **Metrics Oracle**: Updates engagement multipliers based on creator performance

### Backend (Node.js + Express)
- RESTful API for creators, tokens, and transactions
- YouTube OAuth integration for creator verification
- Hourly cron job scrapes YouTube metrics (subscribers, views, engagement rate)
- PostgreSQL database with Prisma ORM

### Frontend (Next.js + React)
- Landing page with creator discovery
- Individual creator profiles with live charts
- Wallet integration (Phantom, Solflare, etc.)
- Portfolio tracking for investors
- Token launch flow for creators

### Bonding Curve Formula
```
price = base_price + (tokens_sold² × curve_factor) × engagement_multiplier
```
- **Base Price**: 0.000001 SOL (1,000 lamports)
- **Curve Factor**: Increases price as supply grows
- **Engagement Multiplier**: Adjusts based on subscriber growth, view velocity, and upload frequency

---

## 🚀 Running Locally

### Prerequisites
- **Rust** (latest stable) & **Solana CLI** v1.18+
- **Anchor CLI** v0.30+
- **Node.js** v18+
- **PostgreSQL** (local or cloud instance)
- **YouTube API Credentials** (Google Cloud Console)
- **Solana Wallet** with devnet SOL

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/solanaHackahton.git
cd solanaHackahton
```

### 2. Smart Contracts Setup

```bash
cd contracts

solana config set --url devnet

anchor build

anchor test

anchor deploy
```

**Deployed Program IDs (Devnet):**
- Token Factory: `CRVM5Hp5N5ndUKXg7EUUKpwmXpL5pY6zcP2isHpMMDyW`
- Bonding Curve: `BNDWUP35iNkC9W1PSGQBFbwL4QtFbVGG6H51Fz9PxvW8`

### 3. Backend Setup

```bash
cd backend

npm install

cp .env.example .env
```

**Configure `.env`:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/youvest"

YOUTUBE_API_KEY="your_youtube_api_key"
YOUTUBE_CLIENT_ID="your_oauth_client_id"
YOUTUBE_CLIENT_SECRET="your_oauth_client_secret"

SOLANA_RPC_URL="https://api.devnet.solana.com"
TOKEN_FACTORY_PROGRAM_ID="CRVM5Hp5N5ndUKXg7EUUKpwmXpL5pY6zcP2isHpMMDyW"
BONDING_CURVE_PROGRAM_ID="BNDWUP35iNkC9W1PSGQBFbwL4QtFbVGG6H51Fz9PxvW8"

JWT_SECRET="your_random_secret_key"
PORT=3001
```

**Initialize Database:**
```bash
npm run prisma:generate
npm run prisma:migrate

npm run seed
```

**Start Backend:**
```bash
npm run dev
```
Server runs on `http://localhost:3001`

### 4. Frontend Setup

```bash
cd frontend

npm install
```

**Create `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_TOKEN_FACTORY_PROGRAM_ID=CRVM5Hp5N5ndUKXg7EUUKpwmXpL5pY6zcP2isHpMMDyW
NEXT_PUBLIC_BONDING_CURVE_PROGRAM_ID=BNDWUP35iNkC9W1PSGQBFbwL4QtFbVGG6H51Fz9PxvW8
```

**Start Frontend:**
```bash
npm run dev
```
App runs on `http://localhost:3000`

---

## 🌍 Production Deployment

**Live Application:** [https://solana-hackathon-murex.vercel.app/app](https://solana-hackathon-murex.vercel.app/app)

### Deployed Services
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (Node.js + PostgreSQL)
- **Smart Contracts**: Solana Devnet

### Using the Production App

1. **Visit** [https://solana-hackathon-murex.vercel.app/app](https://solana-hackathon-murex.vercel.app/app)
2. **Connect Wallet** - Use Phantom or Solflare (make sure you're on Devnet)
3. **Browse Creators** - Discover early-stage YouTubers
4. **Buy Tokens** - Click any creator to view their profile and buy tokens
5. **Track Portfolio** - View your holdings in the Portfolio page

**Note:** The production app runs on Solana Devnet, so you'll need devnet SOL (get it from [SolFaucet](https://solfaucet.com/)).

---

## 📁 Project Structure

```
solanaHackahton/
├── contracts/              # Anchor smart contracts
│   ├── programs/
│   │   ├── token-factory/      # SPL token creation logic
│   │   └── bonding-curve/      # Buy/sell with price curves
│   ├── target/
│   │   ├── idl/               # Program IDLs
│   │   └── deploy/            # Compiled programs (.so files)
│   └── Anchor.toml
│
├── backend/               # Express REST API
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   │   ├── auth.js        # YouTube OAuth
│   │   │   ├── creators.js    # Creator CRUD
│   │   │   ├── tokens.js      # Token pricing/charts
│   │   │   └── transactions.js
│   │   ├── services/
│   │   │   └── youtube.js     # YouTube API wrapper
│   │   ├── cron/
│   │   │   └── updateMetrics.js  # Hourly metrics scraper
│   │   └── server.js
│   ├── prisma/
│   │   ├── schema.prisma      # Database models
│   │   └── migrations/
│   └── scripts/
│       ├── seedFeaturedCreators.js
│       └── createRealTokens.js
│
└── frontend/              # Next.js web app
    ├── app/
    │   ├── page.tsx           # Landing page
    │   ├── app/
    │   │   ├── page.tsx       # Creator marketplace
    │   │   ├── creator/[id]/  # Creator profile
    │   │   ├── portfolio/     # User holdings
    │   │   └── launch/        # Token creation flow
    │   └── layout.tsx
    ├── components/
    │   ├── CreatorCard.tsx
    │   ├── AppSidebar.tsx
    │   └── ui/
    └── lib/
        ├── solana.ts          # Wallet/program utilities
        ├── launchToken.ts     # Token creation logic
        └── config.ts
```

---

## 🎮 Key Features

### For Investors
- **Early Discovery**: Find creators before they blow up
- **Fair Pricing**: Bonding curve = no manipulation, pure math
- **Instant Liquidity**: Sell anytime, no need for order books
- **Portfolio Tracking**: Real-time PnL and holdings
- **Low Fees**: ~$0.00025 per transaction on Solana

### For Creators
- **Easy Launch**: Connect YouTube, create token in minutes
- **No Upfront Cost**: Fans provide initial liquidity
- **Growth Alignment**: Your token value grows with your channel
- **Built-in Liquidity**: No need to bootstrap a market
- **Transparent Metrics**: All data pulled from YouTube API

---

## 📊 Database Schema

PostgreSQL with Prisma ORM:

- **Users** - Wallet addresses
- **Creators** - YouTube channel info + token addresses
- **MetricsHistory** - Hourly snapshots (subscribers, views, engagement)
- **Transactions** - Buy/sell history with signatures

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/youtube` - Initiate YouTube OAuth
- `GET /api/auth/youtube/callback` - Handle OAuth callback

### Creators
- `GET /api/creators` - List all creators (with pagination/filters)
- `GET /api/creators/:id` - Get creator details + latest metrics
- `POST /api/creators/launch` - Create new creator token (requires OAuth)

### Tokens
- `GET /api/tokens/:address/price` - Get current token price
- `GET /api/tokens/:address/chart` - Get price history (24h/7d/30d)
- `POST /api/tokens/:address/buy` - Prepare buy transaction
- `POST /api/tokens/:address/sell` - Prepare sell transaction

### Users
- `GET /api/users/:wallet/portfolio` - Get user token holdings
- `GET /api/users/:wallet/transactions` - Get transaction history

---

## 🛠️ Tech Stack

### Smart Contracts
- **Solana** - Blockchain
- **Anchor** - Rust framework for Solana programs
- **SPL Token** - Fungible token standard

### Backend
- **Node.js** + **Express** - API server
- **PostgreSQL** - Database
- **Prisma** - ORM
- **YouTube Data API v3** - Metrics scraping
- **node-cron** - Scheduled jobs

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Price charts
- **Solana Wallet Adapter** - Wallet connection
- **SWR** - Data fetching

---

## 🔧 Troubleshooting

### Smart Contracts Won't Build
```bash
rustup update
solana-install update
cargo clean
anchor build
```

### Database Connection Error
```bash
npm run prisma:generate
npm run prisma:migrate
```

### YouTube API Quota Exceeded
- Free tier = 10,000 requests/day
- Metrics are cached for 1 hour
- Request quota increase from Google Cloud Console

### Wallet Not Connecting
- Ensure you're on Devnet in your wallet settings
- Clear browser cache and reload
- Try a different wallet (Phantom/Solflare)

### Transaction Failing
- Check you have enough devnet SOL (get from [SolFaucet](https://solfaucet.com/))
- Ensure programs are deployed to devnet
- Check browser console for detailed error messages

---

## 📝 Scripts

### Backend
```bash
npm run dev              # Start development server with hot reload
npm run start            # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run seed             # Seed featured creators + create tokens
npm run cron             # Manually run metrics update
```

### Frontend
```bash
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server
```

### Contracts
```bash
anchor build             # Compile programs
anchor test              # Run tests
anchor deploy            # Deploy to configured cluster
```

---

## 🏆 Hackathon Submission Notes

**Judging Criteria:**
- ✅ **Innovation** - Novel hybrid of DeFi + creator economy
- ✅ **Technical Complexity** - Multiple Solana programs, oracles, full-stack integration
- ✅ **Usefulness** - Solves real creator funding problem, enables fan investments
- ✅ **UX** - Clean, intuitive interface with live transactions
- ✅ **Demo-Ready** - Deployed on Devnet with real YouTube data

**What Makes This Special:**
1. **Bonding curves** provide instant liquidity without needing market makers
2. **YouTube integration** automatically updates token value based on real metrics
3. **Low barriers** - creators launch tokens in minutes, investors buy with a click
4. **Composable** - tokens are standard SPL tokens, can be used in other DeFi protocols

---

## 📚 Additional Documentation

- **API Docs**: See `backend/` for detailed endpoint documentation
- **Smart Contract Docs**: See `contracts/programs/` for program logic
- **UI Components**: See `frontend/components/` for React components

---

## ⚠️ Disclaimer

This is a hackathon project built for demonstration purposes. 

- **Not Financial Advice** - Do your own research
- **Experimental** - Use at your own risk
- **Devnet Only** - No real money involved (yet)
- **No Guarantees** - Creator tokens may lose value

---

## 🙏 Acknowledgments

Built for **Cypherpunk Hackathon 2025** by Colosseum

**Technologies Used:**
- Solana blockchain
- Anchor framework
- YouTube Data API
- Vercel (hosting)
- Railway (backend hosting)

---

**YouVest - Find the next MrBeast before everyone else does! 🚀**
