const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.get('/:wallet/portfolio', async (req, res) => {
  try {
    const { wallet } = req.params;

    const transactions = await prisma.transaction.findMany({
      where: { buyerWallet: wallet },
      orderBy: { timestamp: 'desc' }
    });

    const holdings = [];
    const tokenMap = new Map();

    for (const tx of transactions) {
      const current = tokenMap.get(tx.tokenAddress) || { amount: BigInt(0), invested: 0 };
      
      if (tx.type === 'buy') {
        current.amount += tx.tokenAmount;
        current.invested += Number(tx.solAmount);
      } else if (tx.type === 'sell') {
        current.amount -= tx.tokenAmount;
        current.invested -= Number(tx.solAmount);
      }
      
      tokenMap.set(tx.tokenAddress, current);
    }

    let totalValue = 0;
    let totalInvested = 0;

    for (const [tokenAddress, data] of tokenMap) {
      if (data.amount > 0) {
        const creator = await prisma.creator.findUnique({
          where: { tokenAddress },
          include: {
            metricsHistory: {
              orderBy: { timestamp: 'desc' },
              take: 1
            }
          }
        });

        if (creator) {
          const currentPrice = 0.015;
          const currentValue = Number(data.amount) * currentPrice;
          const pnl = currentValue - data.invested;
          const pnlPercent = data.invested > 0 ? (pnl / data.invested) * 100 : 0;
          const latestMetrics = creator.metricsHistory[0] || {};

          holdings.push({
            tokenAddress,
            amount: Number(data.amount),
            value: currentValue,
            invested: data.invested,
            pnl,
            pnlPercent,
            creator: {
              id: creator.id,
              channelName: creator.channelName,
              channelAvatar: creator.channelAvatar,
              subscribers: latestMetrics.subscribers || creator.initialSubscribers,
              tokenAddress: creator.tokenAddress
            }
          });

          totalValue += currentValue;
          totalInvested += data.invested;
        }
      }
    }

    const totalROI = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;

    res.json({
      holdings,
      totalValue,
      totalInvested,
      totalROI
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

module.exports = router;

