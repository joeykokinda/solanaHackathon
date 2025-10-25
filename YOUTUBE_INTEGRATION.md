# 🎬 YouTube Data Integration Guide

## ✅ What's Built

### Backend YouTube Service
- **Location:** `backend/src/services/youtube.js`
- Fetches real channel data (avatars, banners, stats)
- Gets recent videos with thumbnails
- Calculates average views

### Seed Script for Real Creators
- **Location:** `backend/scripts/seedFeaturedCreators.js`
- Imports 5 real YouTube channels:
  - Fireship
  - Traversy Media
  - Web Dev Simplified
  - freeCodeCamp
  - Code Bullet

## 🔑 Get YouTube API Key

1. Go to https://console.cloud.google.com
2. Create a new project (or select existing)
3. Enable **YouTube Data API v3**
4. Go to Credentials → Create Credentials → API Key
5. Copy the API key

## 🚀 Run the Script

### 1. Add API Key to .env
```bash
cd backend
echo "YOUTUBE_API_KEY=YOUR_API_KEY_HERE" >> .env
```

### 2. Run the Seed Script
```bash
cd /home/joey/Projects/BSProjects/solanaHackahton/backend
node scripts/seedFeaturedCreators.js
```

### Expected Output:
```
🚀 Starting to seed featured creators from YouTube...

📺 Fetching data for channel: UCsBjURrPoezykLs9EqgamOA
   ✅ Added: Fireship
   📊 125,000 subs | 45,000 avg views
   💎 Token: TOKENabc123xyz

📺 Fetching data for channel: UC29ju8bIPH5as8OGnQzwJyA
   ✅ Added: Traversy Media
   📊 1,980,000 subs | 85,000 avg views
   💎 Token: TOKENdef456uvw

✨ Seeding complete!
```

## 🎨 Frontend Updates

### New Design - Ultra Clean Black & White
- **Pure black background** (#0a0a0a)
- **White text and borders** - no gradients, no colors
- **White outline buttons** that fill on hover
- Clean, minimal, professional

### What Changed:
- Removed all purple/indigo colors
- Removed all gradients
- Updated all cards to black with white borders
- Clean white outline buttons
- Minimal hover animations

## 📱 Check It Out

1. **Frontend:** http://localhost:3000
   - Landing page: Clean black & white hero
   - Marketplace: Minimal creator cards
   - All pages updated to new design

2. **Backend:** http://localhost:3001
   - API should return real YouTube data after seeding

## 🎯 Next Steps

### Optional: Add More Creators
Edit `backend/scripts/seedFeaturedCreators.js` and add more channel IDs:
```javascript
const FEATURED_CHANNELS = [
  'UCX6OQ3DkcsbYNE6H8uQQuVA',  // MrBeast
  'UC_x5XG1OV2P6uZZ5FSM9Ttw',  // Google Developers
  'UCeVMnSShP_Iviwkknt83cww',  // Code Bullet
  // Add more...
];
```

### Update Marketplace to Use Real Data
Replace mock data with API calls:
```tsx
// In marketplace/page.tsx
const { data: creators } = useSWR('/api/creators');
```

## ⚠️ Important Notes

- YouTube API has rate limits (10,000 quota units/day)
- Each channel fetch uses ~3 quota units
- Script waits 1 second between requests to avoid hitting limits
- Real avatars and thumbnails are fetched automatically

---

**Design is now ULTRA CLEAN - black, white, no BS! 🔥**

