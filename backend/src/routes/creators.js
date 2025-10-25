const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { limit = 20, offset = 0, sortBy = 'launchDate' } = req.query;
    
    const creators = await prisma.creator.findMany({
      where: { status: 'active' },
      include: {
        metricsHistory: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { launchDate: 'desc' }
    });

    const creatorsWithMetrics = creators.map(creator => {
      const latestMetrics = creator.metricsHistory[0] || {};
      return {
        id: creator.id,
        channelName: creator.channelName,
        channelAvatar: creator.channelAvatar,
        tokenAddress: creator.tokenAddress,
        subscribers: latestMetrics.subscribers || creator.initialSubscribers,
        avgViews: latestMetrics.avgViews || creator.initialAvgViews,
        engagementScore: latestMetrics.engagementRate || 0,
        uploadFrequency: latestMetrics.uploadFrequency || 0,
        launchDate: creator.launchDate
      };
    });

    const total = await prisma.creator.count({ where: { status: 'active' } });

    res.json({
      creators: creatorsWithMetrics,
      total
    });
  } catch (error) {
    console.error('Error fetching creators:', error);
    res.status(500).json({ error: 'Failed to fetch creators' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const creator = await prisma.creator.findUnique({
      where: { id: req.params.id },
      include: {
        metricsHistory: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    const latestMetrics = creator.metricsHistory[creator.metricsHistory.length - 1] || {};

    res.json({
      id: creator.id,
      channelName: creator.channelName,
      channelAvatar: creator.channelAvatar,
      youtubeChannelId: creator.youtubeChannelId,
      tokenAddress: creator.tokenAddress,
      subscribers: latestMetrics.subscribers || creator.initialSubscribers,
      avgViews: latestMetrics.avgViews || creator.initialAvgViews,
      engagementScore: latestMetrics.engagementRate || 0,
      uploadFrequency: latestMetrics.uploadFrequency || 0,
      launchDate: creator.launchDate,
      metricsHistory: creator.metricsHistory,
      initialSubscribers: creator.initialSubscribers,
      initialAvgViews: creator.initialAvgViews
    });
  } catch (error) {
    console.error('Error fetching creator:', error);
    res.status(500).json({ error: 'Failed to fetch creator' });
  }
});

router.post('/launch', async (req, res) => {
  try {
    const { wallet, youtubeChannelId, channelName, channelAvatar, subscribers, avgViews, tokenAddress } = req.body;

    if (!wallet || !youtubeChannelId || !tokenAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let user = await prisma.user.findUnique({ where: { wallet } });
    if (!user) {
      user = await prisma.user.create({ data: { wallet } });
    }

    const existingCreator = await prisma.creator.findUnique({
      where: { youtubeChannelId }
    });

    if (existingCreator) {
      return res.status(400).json({ error: 'Creator already exists' });
    }

    const creator = await prisma.creator.create({
      data: {
        userId: user.id,
        youtubeChannelId,
        channelName: channelName || 'Unknown Creator',
        channelAvatar,
        tokenAddress,
        initialSubscribers: subscribers || 0,
        initialAvgViews: avgViews || 0,
        status: 'active'
      }
    });

    await prisma.metricsHistory.create({
      data: {
        creatorId: creator.id,
        subscribers: subscribers || 0,
        totalViews: BigInt(0),
        videoCount: 0,
        avgViews: avgViews || 0,
        engagementRate: 0,
        uploadFrequency: 0
      }
    });

    res.json({
      id: creator.id,
      tokenAddress: creator.tokenAddress,
      message: 'Creator token launched successfully'
    });
  } catch (error) {
    console.error('Error launching creator:', error);
    res.status(500).json({ error: 'Failed to launch creator token' });
  }
});

module.exports = router;

