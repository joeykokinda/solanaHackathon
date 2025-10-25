# Backend Setup Guide

## Step 1: Start PostgreSQL (if not running)

```bash
# Check if running
psql --version

# If PostgreSQL service isn't running, start it:
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Or on Mac:
brew services start postgresql
```

## Step 2: Create Database

```bash
# Create the database (use your system username)
createdb youvest

# Or if that doesn't work, use psql:
psql -U postgres
CREATE DATABASE youvest;
\q
```

## Step 3: Setup Environment Variables

The `.env` file has been created at `/backend/.env`

**⚠️ IMPORTANT:** You need to add real YouTube API credentials:

1. Go to https://console.cloud.google.com
2. Create a new project (or select existing)
3. Enable "YouTube Data API v3"
4. Go to "Credentials" → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs: `http://localhost:3001/api/auth/youtube/callback`
7. Copy the Client ID and Client Secret
8. Also create an API Key (for the metrics scraper)

Then update `.env`:
```env
YOUTUBE_API_KEY="your_actual_api_key"
YOUTUBE_CLIENT_ID="your_actual_client_id.apps.googleusercontent.com"
YOUTUBE_CLIENT_SECRET="your_actual_client_secret"
```

## Step 4: Install Dependencies & Setup Database

```bash
cd /home/joey/Projects/BSProjects/solanaHackahton/backend

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# This creates all tables: Users, Creators, MetricsHistory, Transactions
```

## Step 5: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
YouVest API server running on port 3001
```

## Step 6: Test API

```bash
# In a new terminal
curl http://localhost:3001/health

# Should return:
# {"status":"ok","message":"YouVest API is running"}
```

## API Endpoints Available

- `GET /health` - Health check
- `POST /api/auth/youtube` - Start YouTube OAuth
- `GET /api/auth/youtube/callback` - OAuth callback
- `GET /api/creators` - List all creators
- `GET /api/creators/:id` - Get creator details
- `POST /api/creators/launch` - Create new creator token
- `GET /api/tokens/:address/price` - Get token price
- `GET /api/tokens/:address/chart` - Get price history
- `POST /api/tokens/:address/buy` - Prepare buy transaction
- `GET /api/users/:wallet/portfolio` - Get user portfolio

## Troubleshooting

### "Database does not exist"
```bash
createdb youvest
# or
psql -U postgres -c "CREATE DATABASE youvest;"
```

### "Connection refused" 
```bash
# Start PostgreSQL
sudo systemctl start postgresql
```

### "YouTube API quota exceeded"
- Free tier = 10,000 requests/day
- The metrics scraper runs hourly
- With 3 creators, you'll use ~72 requests/day
- Request quota increase if needed

### Port 3001 already in use
```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9
```

## Next: Build Frontend

Once backend is running, move to frontend:
```bash
cd /home/joey/Projects/BSProjects/solanaHackahton/frontend
# See SETUP_FRONTEND.md
```

