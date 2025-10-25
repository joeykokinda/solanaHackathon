require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const creatorsRoutes = require('./routes/creators');
const tokensRoutes = require('./routes/tokens');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'YouVest API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/creators', creatorsRoutes);
app.use('/api/tokens', tokensRoutes);
app.use('/api/users', usersRoutes);

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

