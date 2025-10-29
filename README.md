# YouVest - Invest in Creators BEFORE They Blow Up 🚀

A decentralized platform built on Solana that lets you invest in early-stage YouTubers through creator tokens. Powered by bonding curves for fair price discovery.

**Live Demo:** [https://www.youvest.lol/](https://www.youvest.lol/)

**Hackathon:** Cypherpunk Hackathon 2025 by Colosseum  

---

## What is YouVest?

YouVest is a DeFi platform where you can discover and invest in emerging YouTube creators. Think of it as an early-stage stock market for content creators.

### The Problem
- Creators struggle to get funding in their early days
- Fans can't financially benefit from supporting creators they discover early
- No transparent way to value creator growth potential
- As an avid YouTube watcher, I can't invest in high-potential creators I discover

### The Solution
- **Tokenize Creators**: Each YouTuber gets their own SPL token on Solana
- **Bonding Curve Pricing**: Token price automatically adjusts based on supply and demand
- **Growth-Linked Value**: Token value tied to creator metrics (subscribers, views)
- **Instant Liquidity**: Buy or sell tokens anytime through the bonding curve

### How It Works

1. **Discover** - Browse early-stage YouTubers (that consent) using real YouTube API data, you must sign up to be here...
2. **Invest** - Buy creator tokens on Solana. Price increases as more people buy (bonding curve)
3. **Track** - Monitor token value as creators grow
4. **Trade** - Sell anytime for profit (or loss). Liquidity is built into the bonding curve

---

## Architecture

### Smart Contracts (Solana/Anchor)
- **Token Factory Program**: Creates SPL tokens for each verified creator
- **Bonding Curve Program**: Handles all buy/sell transactions with automatic price discovery using a quadratic bonding curve

### Backend (Node.js + Express) Hosted on Railway read mroe below
- RESTful API for creators, tokens, and transactions
- YouTube OAuth integration for creator verification
- YouTube Data API v3 integration for pulling subscriber/view counts
- PostgreSQL database with Prisma ORM
- Cron job for periodic metrics updates

### Frontend (Next.js + React) Hosted on vercel read more below
- Landing page with creator discovery
- Individual creator profiles with charts
- Wallet integration (Phantom, Solflare, etc.)
- Portfolio tracking for investors
- Token launch flow for creators

### Bonding Curve Formula
```
price = base_price + (tokens_sold² × curve_factor)
```
- **Base Price**: 0.000001 SOL (1,000 lamports)
- **Curve Factor**: Price increases quadratically with supply
- Simple and transparent - no complex multipliers

---

### Deployed Services
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (Node.js + PostgreSQL)
- **Smart Contracts**: Solana Devnet

### Using the Production App

1. **Visit** [https://www.youvest.lol/](https://www.youvest.lol/)
2. **Connect Wallet** - Use Phantom or Solflare (make sure you're on Devnet)
3. **Browse Creators** - Discover early-stage YouTubers
4. **Buy Tokens** - Click any creator to view their profile and buy tokens
5. **Track Portfolio** - View your holdings in the Portfolio page

**Note:** IMPORTANT*** - The app runs on Solana DEVNET - you'll need devnet SOL GET IT FROM HERE AND AIRDROP TO ACCOUNT - [SolFaucet](https://solfaucet.com/).


##Features

### For Investors
- **Early Discovery**: Find creators before they blow up
- **Fair Pricing**: Bonding curve = no manipulation, pure math
- **Instant Liquidity**: Sell anytime, no need for order books
- **Portfolio Tracking**: Real-time holdings view
- **Low Fees**: ~$0.00025 per transaction on Solana

### For Creators
- **Easy Launch**: Connect YouTube, create token in minutes
- **No Upfront Cost**: Fans provide initial liquidity
- **Growth Alignment**: Token value grows with trading activity
- **Built-in Liquidity**: No need to bootstrap a market
- **Verified Ownership**: YouTube OAuth verification


## Future Improvements & Ideas

### Smart Contract Enhancements
- **Dynamic Engagement Multipliers**: Automatically adjust token price based on subscriber growth rate, view velocity, and engagement metrics
- **Creator Rewards**: Allocate % of trading fees back to creators as royalties
- **Staking Mechanism**: Let token holders stake for voting rights or bonus rewards
- **Graduated Bonding Curves**: Move to full DEX liquidity pool after hitting market cap milestone
- **Multi-Platform Support**: Extend beyond YouTube to TikTok, Twitch, Instagram

### Oracle Integration
- **Chainlink Oracles**: Pull verified YouTube metrics directly on-chain
- **Real-time Price Updates**: Update token multipliers based on live creator performance
- **Decentralized Verification**: Multiple oracle nodes verify creator metrics
- **Automated Rebalancing**: Smart contract adjusts prices based on oracle data

### Advanced Features
- **Social Features**: Comment on creators, share portfolios, leaderboards
- **Creator NFTs**: Special edition NFTs for top token holders
- **Token Bundles**: Buy diversified "index funds" of multiple creators
- **Limit Orders**: Set buy/sell orders at specific prices
- **Futures/Options**: Speculate on future creator growth
- **DAO Governance**: Token holders vote on platform decisions

### UX Improvements
- **Mobile App**: Native iOS/Android apps with push notifications
- **Price Alerts**: Get notified when creator tokens hit target prices
- **Advanced Charts**: More detailed analytics and historical data
- **Creator Dashboard**: Analytics for creators to see their token performance
- **Referral System**: Earn rewards for bringing new users/creators

### Business Model
- **Trading Fees**: Small % fee on each transaction (0.5-1%)
- **Creator Listing Fees**: Optional premium listings for featured placement
- **Premium Features**: Advanced analytics, API access for power users
- **Partnerships**: Collaborate with creator agencies and MCNs

### Technical Debt
- **Mainnet Migration**: Move from Devnet to Solana Mainnet
- **Performance Optimization**: Cache layer with Redis, CDN for assets
- **Security Audits**: Full smart contract audit before mainnet
- **Rate Limiting**: Better API rate limits and DDoS protection
- **Error Handling**: More robust error messages and retry logic



Built for **Cypherpunk Hackathon 2025** by Colosseum

**YouVest - Find the next MrBeast before everyone else does! HODL 🚀**
