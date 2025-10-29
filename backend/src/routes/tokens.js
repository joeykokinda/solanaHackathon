const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
router.get('/:address/price', async (req, res) => {
  try {
    const { address } = req.params;
    const creator = await prisma.creator.findUnique({
      where: { tokenAddress: address }
    });
    if (!creator) {
      return res.status(404).json({ error: 'Token not found' });
    }
    const basePrice = 0.01;
    const growthFactor = 1.5;
    const currentPrice = basePrice * growthFactor;
    res.json({
      price: currentPrice,
      priceChange24h: 0,
      marketCap: currentPrice * 100000
    });
  } catch (error) {
    console.error('Error fetching price:', error);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});
router.get('/:address/chart', async (req, res) => {
  try {
    const { address } = req.params;
    const { timeframe = '7d' } = req.query;
    const creator = await prisma.creator.findUnique({
      where: { tokenAddress: address },
      include: {
        metricsHistory: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });
    if (!creator) {
      return res.status(404).json({ error: 'Token not found' });
    }
    const data = creator.metricsHistory.map((metric, index) => ({
      timestamp: metric.timestamp.toISOString(),
      price: 0.01 * (1 + index * 0.1)
    }));
    res.json({ data });
  } catch (error) {
    console.error('Error fetching chart:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});
router.post('/:address/buy', async (req, res) => {
  try {
    const { address } = req.params;
    const { buyer, amount } = req.body;
    if (!buyer || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const creator = await prisma.creator.findUnique({
      where: { tokenAddress: address }
    });
    if (!creator) {
      return res.status(404).json({ error: 'Token not found' });
    }
    const price = 0.015;
    const totalCost = amount * price;
    res.json({
      price,
      totalCost,
      message: 'Transaction prepared - sign with wallet'
    });
  } catch (error) {
    console.error('Error preparing buy:', error);
    res.status(500).json({ error: 'Failed to prepare buy transaction' });
  }
});
module.exports = router;
