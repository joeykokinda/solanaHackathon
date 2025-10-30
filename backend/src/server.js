require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
const authRoutes = require('./routes/auth');
const creatorsRoutes = require('./routes/creators');
const tokensRoutes = require('./routes/tokens');
const usersRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');
const launchRoutes = require('./routes/launch');
const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = [
  'http://localhost:3000',
  'https://www.youvest.lol',
  'https://youvest.lol',
  'https://solana-hackathon-murex.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); 
    }
  },
  credentials: true
}));
app.use(express.json());
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'YouVest API is running' });
});
app.get('/api/proxy-image', (req, res) => {
  const { url } = req.query;
  if (!url || !url.startsWith('https://yt3.ggpht.com/')) {
    return res.status(400).send('Invalid URL');
  }
  try {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (proxyRes) => {
      res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      proxyRes.pipe(res);
    }).on('error', () => {
      res.status(500).send('Error fetching image');
    });
  } catch (error) {
    res.status(500).send('Error proxying image');
  }
});
app.use('/api/auth', authRoutes);
app.use('/api/creators', creatorsRoutes);
app.use('/api/tokens', tokensRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/launch', launchRoutes);
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`YouVest API server running on port ${PORT}`);
  });
}
module.exports = app;
