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

module.exports = router;

