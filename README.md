# YouVest - Invest in Creators Before They Blow Up

**Hackathon:** Cypherpunk Hackathon 2025 by Colosseum  
**Deadline:** October 30, 2025  
**Status:** In Development

## 🎯 Quick Start

This project is built with **YouVest** (formerly CreatorVest) branding throughout.

### Prerequisites
- Rust & Solana CLI installed
- Node.js v18+
- PostgreSQL
- YouTube API credentials

### 1. Smart Contracts (Solana/Anchor)

```bash
cd contracts
anchor build
anchor test

# Deploy to devnet
solana config set --url devnet
anchor deploy
```

**Program IDs:**
- Token Factory: `CRVM5Hp5N5ndUKXg7EUUKpwmXpL5pY6zcP2isHpMMDyW`
- Bonding Curve: `BNDWUP35iNkC9W1PSGQBFbwL4QtFbVGG6H51Fz9PxvW8`

### 2. Backend API

```bash
cd backend

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Set up database
npm run prisma:generate
npm run prisma:migrate

# Start server
npm run dev
```

API runs on `http://localhost:3001`

### 3. Frontend

```bash
cd frontend

# Set up environment
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:3001
# NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📁 Project Structure

```
solanaHackahton/
├── contracts/           # Anchor smart contracts
│   ├── programs/
│   │   ├── token-factory/      # Creator token creation
│   │   └── bonding-curve/      # Buy/sell mechanism
│   └── Anchor.toml
├── backend/            # Express API
│   ├── src/
│   │   ├── routes/            # API endpoints
│   │   ├── cron/              # Metrics scraper
│   │   └── server.js
│   └── prisma/
│       └── schema.prisma      # Database schema
└── frontend/           # Next.js web app
    ├── app/                   # Pages
    ├── components/            # React components
    └── package.json
```

## 🎮 Key Features

### Smart Contracts
- **Token Factory**: Creates SPL tokens for each creator
- **Bonding Curve**: Automatic price discovery based on demand
- **Metrics Oracle**: Updates engagement multipliers

### Backend
- YouTube OAuth verification
- Hourly metrics scraping
- RESTful API for creators, tokens, transactions
- PostgreSQL database with Prisma ORM

### Frontend
- Landing page
- Creator marketplace
- Creator profiles with buy/sell widgets
- Wallet connection (Phantom, Solflare)
- Portfolio tracking

## 📊 Database

PostgreSQL with Prisma ORM. Schema includes:
- Users (wallet addresses)
- Creators (YouTube channels + token data)
- MetricsHistory (subscriber/view tracking)
- Transactions (buy/sell history)

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
YOUTUBE_API_KEY="..."
YOUTUBE_CLIENT_ID="..."
YOUTUBE_CLIENT_SECRET="..."
SOLANA_RPC_URL="https://api.devnet.solana.com"
TOKEN_FACTORY_PROGRAM_ID="CRVM5Hp5N5ndUKXg7EUUKpwmXpL5pY6zcP2isHpMMDyW"
BONDING_CURVE_PROGRAM_ID="BNDWUP35iNkC9W1PSGQBFbwL4QtFbVGG6H51Fz9PxvW8"
JWT_SECRET="..."
PORT=3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_TOKEN_FACTORY_PROGRAM_ID=CRVM5Hp5N5ndUKXg7EUUKpwmXpL5pY6zcP2isHpMMDyW
NEXT_PUBLIC_BONDING_CURVE_PROGRAM_ID=BNDWUP35iNkC9W1PSGQBFbwL4QtFbVGG6H51Fz9PxvW8
```

## 🚀 Deployment

### Smart Contracts
Already deployed to Solana Devnet

### Backend (Railway)
```bash
git push
# Connect to Railway
# Add environment variables
# Auto-deploy
```

### Frontend (Vercel)
```bash
git push
# Import to Vercel
# Add environment variables
# Deploy
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/youtube` - Initiate YouTube OAuth
- `GET /api/auth/youtube/callback` - Handle OAuth callback

### Creators
- `GET /api/creators` - List all creators
- `GET /api/creators/:id` - Get creator details
- `POST /api/creators/launch` - Create new creator token

### Tokens
- `GET /api/tokens/:address/price` - Get current price
- `GET /api/tokens/:address/chart` - Get price history
- `POST /api/tokens/:address/buy` - Prepare buy transaction

### Users
- `GET /api/users/:wallet/portfolio` - Get user holdings

## 🎥 Demo Script

1. Show landing page
2. Browse marketplace
3. Click on creator profile
4. Connect wallet
5. Buy tokens (live transaction)
6. Show portfolio
7. Explain mechanics

## 📚 Documentation

- `CURSOR_PROMPT.md` - AI assistant guidance
- `backendread.md` - Backend API documentation
- `frontend.md` - Frontend component guide

## 🏆 Hackathon Submission

**Judging Criteria:**
- Innovation: Novel DeFi + creator economy hybrid
- Technical Complexity: Multiple programs, oracles, full-stack
- Usefulness: Solves real creator funding problem
- UX: Clean, intuitive interface
- Demo: Live transactions with real creators

## 🔧 Troubleshooting

### Contracts won't build
```bash
rustup update
cargo clean
anchor build
```

### Database connection error
```bash
npm run prisma:generate
npm run prisma:migrate
```

### YouTube API quota exceeded
- Free tier = 10k requests/day
- Cache metrics for 1 hour
- Request quota increase

Built for Cypherpunk Hackathon 2025 by Colosseum

---

**Remember:** YouVest - Invest in creators before they blow up! 🚀

