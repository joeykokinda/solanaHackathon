const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { google } = require('googleapis');
const { calculateAvgViews } = require('../services/youtube');
const router = express.Router();
const prisma = new PrismaClient();
const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/app/launch/callback';
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  REDIRECT_URI
);
router.get('/auth-url', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]
  });
  res.json({ authUrl });
});
router.post('/verify-channel', async (req, res) => {
  try {
    const { code, wallet } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }
    if (!wallet) {
      return res.status(400).json({ error: 'Wallet address required' });
    }
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
    const stats = channel.statistics;
    const subscribers = parseInt(stats.subscriberCount || 0);
    const videoCount = parseInt(stats.videoCount || 0);
    console.log('YouTube channel data:', {
      name: channel.snippet.title,
      subscribers,
      thumbnails: Object.keys(channel.snippet.thumbnails || {})
    });
    const existing = await prisma.creator.findUnique({
      where: { youtubeChannelId: channel.id }
    });
    if (existing) {
      return res.status(400).json({ 
        error: 'This channel already has a token launched' 
      });
    }
    let avgViews = 0;
    try {
      avgViews = await calculateAvgViews(channel.id);
    } catch (e) {
      avgViews = Math.floor(parseInt(stats.viewCount) / videoCount);
    }
    const avatar = channel.snippet.thumbnails.medium?.url 
      || channel.snippet.thumbnails.high?.url 
      || channel.snippet.thumbnails.default?.url
      || `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.snippet.title)}&size=200`;
    res.json({
      youtubeChannelId: channel.id,
      channelName: channel.snippet.title,
      channelAvatar: avatar,
      subscribers,
      videoCount,
      totalViews: parseInt(stats.viewCount || 0),
      avgViews,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token
    });
  } catch (error) {
    console.error('Verify channel error:', error);
    res.status(500).json({ error: 'Failed to verify YouTube channel' });
  }
});
router.post('/create-token', async (req, res) => {
  try {
    const { 
      wallet,
      youtubeChannelId,
      channelName,
      channelAvatar,
      subscribers,
      avgViews,
      videoCount,
      tokenMint
    } = req.body;
    if (!wallet || !youtubeChannelId || !tokenMint) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    let user = await prisma.user.findUnique({
      where: { wallet }
    });
    if (!user) {
      user = await prisma.user.create({
        data: { wallet }
      });
    }
    const existingCreator = await prisma.creator.findUnique({
      where: { youtubeChannelId }
    });
    if (existingCreator) {
      return res.status(400).json({ 
        error: 'Token already exists for this channel' 
      });
    }
    const creator = await prisma.creator.create({
      data: {
        userId: user.id,
        youtubeChannelId,
        channelName,
        channelAvatar,
        tokenAddress: tokenMint,
        initialSubscribers: subscribers,
        initialAvgViews: avgViews,
        status: 'active'
      }
    });
    await prisma.metricsHistory.create({
      data: {
        creatorId: creator.id,
        subscribers: subscribers,
        totalViews: BigInt(avgViews * videoCount),
        videoCount: videoCount,
        avgViews: avgViews,
        engagementRate: 0.1,
        uploadFrequency: 3.5
      }
    });
    console.log(` Created token for ${channelName} (${tokenMint})`);
    res.json({
      success: true,
      creator: {
        id: creator.id,
        tokenAddress: creator.tokenAddress,
        channelName: creator.channelName,
        youtubeChannelId: creator.youtubeChannelId
      }
    });
  } catch (error) {
    console.error('Create token error:', error);
    res.status(500).json({ error: 'Failed to create token' });
  }
});
module.exports = router;
