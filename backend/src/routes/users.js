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
          where: { tokenAddress }
        });

        if (creator) {
          const currentPrice = 0.015;
          const currentValue = Number(data.amount) * currentPrice;

          holdings.push({
            tokenAddress,
            creatorName: creator.channelName,
            amount: Number(data.amount),
            currentValue,
            invested: data.invested,
            roi: ((currentValue - data.invested) / data.invested) * 100
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

