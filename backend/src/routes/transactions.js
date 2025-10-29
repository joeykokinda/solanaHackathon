const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
router.post('/', async (req, res) => {
  try {
    const { signature, wallet, tokenAddress, type, tokenAmount, solAmount } = req.body;
    if (!signature || !wallet || !tokenAddress || !type || !tokenAmount || !solAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const transaction = await prisma.transaction.create({
      data: {
        txSignature: signature,
        buyerWallet: wallet,
        tokenAddress: tokenAddress,
        type: type,
        tokenAmount: BigInt(Math.floor(tokenAmount * 1e9)),
        solAmount: BigInt(Math.floor(solAmount * 1e9)),
        pricePerToken: solAmount / tokenAmount,
        timestamp: new Date()
      }
    });
    res.json({ success: true, transaction });
  } catch (error) {
    console.error('Error recording transaction:', error);
    res.status(500).json({ error: 'Failed to record transaction' });
  }
});
router.get('/recent/:tokenAddress', async (req, res) => {
  try {
    const { tokenAddress } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const transactions = await prisma.transaction.findMany({
      where: { tokenAddress },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const transactions = await prisma.transaction.findMany({
      where: { buyerWallet: walletAddress },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        creator: {
          select: {
            channelName: true,
            channelAvatar: true
          }
        }
      }
    });
    const formattedTransactions = transactions.map(tx => ({
      signature: tx.txSignature,
      transactionType: tx.transactionType,
      amount: (Number(tx.tokenAmount) / 1e9).toString(),
      solAmount: (Number(tx.solAmount) / 1e9).toString(),
      createdAt: tx.createdAt,
      creator: tx.creator
    }));
    res.json({ transactions: formattedTransactions });
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions', transactions: [] });
  }
});
module.exports = router;
