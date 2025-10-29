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
          const tokenAmountInUnits = Number(data.amount) / 1e9;
          
          const transactions = await prisma.transaction.findMany({
            where: { tokenAddress: creator.tokenAddress }
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
          
          const currentValue = tokenAmountInUnits * currentPrice;
          const investedInSOL = data.invested / 1e9;
          const pnl = currentValue - investedInSOL;
          const pnlPercent = investedInSOL > 0 ? (pnl / investedInSOL) * 100 : 0;
          const latestMetrics = creator.metricsHistory[0] || {};

          holdings.push({
            tokenAddress,
            amount: tokenAmountInUnits,
            value: currentValue,
            invested: investedInSOL,
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
          totalInvested += investedInSOL;
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

