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

    const creatorsWithMetrics = await Promise.all(creators.map(async creator => {
      const latestMetrics = creator.metricsHistory[0] || {};
      
      const transactions = await prisma.transaction.findMany({
        where: { tokenAddress: creator.tokenAddress },
        orderBy: { timestamp: 'desc' },
        take: 10
      });

      const tokensBought = transactions.reduce((sum, tx) => {
        if (tx.type === 'buy') return sum + Number(tx.tokenAmount);
        if (tx.type === 'sell') return sum - Number(tx.tokenAmount);
        return sum;
      }, 0);

      const BASE_PRICE_LAMPORTS = 1000;
      const LAMPORTS_PER_SOL = 1_000_000_000;
      
      const supplyInTokens = tokensBought / LAMPORTS_PER_SOL;
      const curve = (supplyInTokens * supplyInTokens) / 10_000;
      const priceInLamports = BASE_PRICE_LAMPORTS + curve;
      const currentPrice = priceInLamports / LAMPORTS_PER_SOL;
      
      const totalSupply = 100_000_000;

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const txs24h = transactions.filter(tx => tx.timestamp >= oneDayAgo);
      
      const volume24h = txs24h.reduce((sum, tx) => sum + Number(tx.solAmount) / 1e9, 0);
      
      const priceYesterday = transactions.length > 0 ? Number(transactions[transactions.length - 1].pricePerToken) : currentPrice;
      const priceChange24h = priceYesterday > 0 ? ((currentPrice - priceYesterday) / priceYesterday) * 100 : 0;

      const uniqueWallets = new Set(transactions.map(tx => tx.buyerWallet));
      const holdersCount = uniqueWallets.size;

      return {
        id: creator.id,
        channelName: creator.channelName,
        channelAvatar: creator.channelAvatar,
        tokenAddress: creator.tokenAddress,
        subscribers: latestMetrics.subscribers || creator.initialSubscribers,
        avgViews: latestMetrics.avgViews || creator.initialAvgViews,
        engagementScore: latestMetrics.engagementRate || 0,
        uploadFrequency: latestMetrics.uploadFrequency || 0,
        priceSOL: currentPrice,
        priceChange24h: priceChange24h,
        volume24h: volume24h,
        holders: holdersCount,
        marketCap: currentPrice * totalSupply,
        launchDate: creator.launchDate,
        youtubeChannelId: creator.youtubeChannelId
      };
    }));

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

    const transactions = await prisma.transaction.findMany({
      where: { tokenAddress: creator.tokenAddress },
      orderBy: { timestamp: 'desc' },
      take: 20
    });

    const tokensBought = transactions.reduce((sum, tx) => {
      if (tx.type === 'buy') return sum + Number(tx.tokenAmount);
      if (tx.type === 'sell') return sum - Number(tx.tokenAmount);
      return sum;
    }, 0);

    const BASE_PRICE_LAMPORTS = 1000;
    const LAMPORTS_PER_SOL = 1_000_000_000;
    
    const supplyInTokens = tokensBought / LAMPORTS_PER_SOL;
    const curve = (supplyInTokens * supplyInTokens) / 10_000;
    const priceInLamports = BASE_PRICE_LAMPORTS + curve;
    const currentPrice = priceInLamports / LAMPORTS_PER_SOL;
    
    const totalSupply = 100_000_000;

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const txs24h = transactions.filter(tx => tx.timestamp >= oneDayAgo);
    
    const volume24h = txs24h.reduce((sum, tx) => sum + Number(tx.solAmount) / 1e9, 0);
    
    const priceYesterday = transactions.length > 0 ? Number(transactions[transactions.length - 1].pricePerToken) : currentPrice;
    const priceChange24h = priceYesterday > 0 ? ((currentPrice - priceYesterday) / priceYesterday) * 100 : 0;

    const uniqueWallets = new Set(transactions.map(tx => tx.buyerWallet));
    const holders = uniqueWallets.size;

    const recentTrades = transactions.length > 0 ? transactions.slice(0, 5).map(tx => ({
      type: tx.type,
      amount: Number(tx.tokenAmount) / 1e9,
      price: Number(tx.pricePerToken),
      time: formatTimeAgo(tx.timestamp),
      wallet: `${tx.buyerWallet.slice(0, 4)}...${tx.buyerWallet.slice(-4)}`
    })) : [];

    const metricsHistorySerialized = creator.metricsHistory.map(m => ({
      ...m,
      totalViews: Number(m.totalViews)
    }));

    res.json({
      id: creator.id,
      channelName: creator.channelName,
      channelAvatar: creator.channelAvatar,
      youtubeChannelId: creator.youtubeChannelId,
      tokenAddress: creator.tokenAddress,
      subscribers: latestMetrics.subscribers || creator.initialSubscribers,
      avgViews: latestMetrics.avgViews || creator.initialAvgViews,
      engagementScore: latestMetrics.engagementRate || 0,
      uploadFrequency: latestMetrics.uploadFrequency || 3.5,
      priceSOL: currentPrice,
      priceChange24h: priceChange24h,
      volume24h: volume24h,
      holders: holders,
      marketCap: currentPrice * totalSupply,
      launchDate: creator.launchDate,
      metricsHistory: metricsHistorySerialized,
      initialSubscribers: creator.initialSubscribers,
      initialAvgViews: creator.initialAvgViews,
      recentTrades: recentTrades,
      recentVideos: []
    });
  } catch (error) {
    console.error('Error fetching creator:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch creator', details: error.message });
  }
});

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

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

