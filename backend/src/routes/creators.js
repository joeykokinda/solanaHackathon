const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

const MOCK_CREATORS = [
  {
    id: 'mock-1',
    channelName: 'TechStartup Daily',
    tokenAddress: '5Z7vK2mF6tH8nP4wN9bRxYqP3gLtE8dU7sC1wA6hF9pM',
    subscribers: 8500,
    avgViews: 25000,
    engagementScore: 0.12,
    uploadFrequency: 4.2,
    priceSOL: 0.015,
    priceChange24h: 5.2,
    volume24h: 3.4,
    marketCap: 127.5,
    launchDate: new Date('2025-10-20')
  },
  {
    id: 'mock-2',
    channelName: 'Gaming Underdog',
    tokenAddress: '8K9wL3nG7uI9oQ5xO0cSzZrQ4hMuF9eV8tD2xB7iG0qN',
    subscribers: 2100,
    avgViews: 8000,
    engagementScore: 0.18,
    uploadFrequency: 3.5,
    priceSOL: 0.008,
    priceChange24h: -2.1,
    volume24h: 1.8,
    marketCap: 16.8,
    launchDate: new Date('2025-10-18')
  },
  {
    id: 'mock-3',
    channelName: 'Crypto Explained',
    tokenAddress: '9L0xM4oH8vJ0pR6yP1dTaAsR5iNvG0fW9uE3yC8jH1rO',
    subscribers: 12000,
    avgViews: 45000,
    engagementScore: 0.09,
    uploadFrequency: 2.8,
    priceSOL: 0.024,
    priceChange24h: 12.8,
    volume24h: 8.2,
    marketCap: 288.0,
    launchDate: new Date('2025-10-22')
  },
  {
    id: 'mock-4',
    channelName: 'Fitness Revolution',
    tokenAddress: '0M1yN5pH9wK1qS7zQ2eUbBtS6jOw H1gX0vF4zD9kI2sP',
    subscribers: 5400,
    avgViews: 18000,
    engagementScore: 0.15,
    uploadFrequency: 5.0,
    priceSOL: 0.011,
    priceChange24h: 3.4,
    volume24h: 2.1,
    marketCap: 59.4,
    launchDate: new Date('2025-10-19')
  },
  {
    id: 'mock-5',
    channelName: 'Indie Music Hub',
    tokenAddress: '1N2zO6qI0xL2rT8aR3fVcCuT7kPxI2hY1wG5aE0lJ3tQ',
    subscribers: 3200,
    avgViews: 12000,
    engagementScore: 0.21,
    uploadFrequency: 3.1,
    priceSOL: 0.007,
    priceChange24h: 8.9,
    volume24h: 1.2,
    marketCap: 22.4,
    launchDate: new Date('2025-10-21')
  }
];

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

    let creatorsWithMetrics = creators.map(creator => {
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
        priceSOL: 0.01 + Math.random() * 0.02,
        priceChange24h: (Math.random() - 0.5) * 20,
        volume24h: Math.random() * 10,
        marketCap: (latestMetrics.subscribers || creator.initialSubscribers) * 0.01,
        launchDate: creator.launchDate
      };
    });

    if (creatorsWithMetrics.length === 0) {
      creatorsWithMetrics = MOCK_CREATORS;
    }

    const total = creatorsWithMetrics.length;

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

