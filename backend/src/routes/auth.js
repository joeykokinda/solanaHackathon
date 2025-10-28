const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  'http://localhost:3000/app/launch/callback'
);

router.post('/youtube', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.readonly']
  });
  res.json({ authUrl: url });
});

router.get('/youtube/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    
    const response = await youtube.channels.list({
      part: 'snippet,statistics',
      mine: true
    });
    
    if (!response.data.items || response.data.items.length === 0) {
      return res.status(404).json({ error: 'No YouTube channel found' });
    }

    const channel = response.data.items[0];
    
    res.json({
      youtubeChannelId: channel.id,
      channelName: channel.snippet.title,
      channelAvatar: channel.snippet.thumbnails.default.url,
      subscribers: parseInt(channel.statistics.subscriberCount),
      totalViews: parseInt(channel.statistics.viewCount),
      videoCount: parseInt(channel.statistics.videoCount),
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token
    });
  } catch (error) {
    console.error('YouTube OAuth error:', error);
    res.status(500).json({ error: 'Failed to authenticate with YouTube' });
  }
});

module.exports = router;

