import { PrismaClient } from '@prisma/client';
import { Keypair } from '@solana/web3.js';

const prisma = new PrismaClient();

const TEST_CREATORS = [
  {
    channelName: "TechStartup Daily",
    channelId: "UC8A0M0eDttdB1a9gULnQ",
    channelAvatar: "https://yt3.ggpht.com/ytc/AIdro_n1234",
    subscribers: 8500,
    avgViews: 25000,
    engagementRate: 0.12,
    uploadFreq: 4.2,
  },
  {
    channelName: "Gaming Underdog", 
    channelId: "UC123qwe456rty",
    channelAvatar: "https://yt3.ggpht.com/ytc/AIdro_n5678",
    subscribers: 2100,
    avgViews: 8000,
    engagementRate: 0.18,
    uploadFreq: 3.5,
  },
  {
    channelName: "Crypto Explained",
    channelId: "UCabc789xyz123",
    channelAvatar: "https://yt3.ggpht.com/ytc/AIdro_n9abc",
    subscribers: 12000,
    avgViews: 45000,
    engagementRate: 0.09,
    uploadFreq: 2.8,
  },
  {
    channelName: "Fitness Revolution",
    channelId: "UCdef456abc789",
    channelAvatar: "https://yt3.ggpht.com/ytc/AIdro_ndef1",
    subscribers: 5400,
    avgViews: 18000,
    engagementRate: 0.15,
    uploadFreq: 5.0,
  },
  {
    channelName: "Indie Music Hub",
    channelId: "UCghi789def012",
    channelAvatar: "https://yt3.ggpht.com/ytc/AIdro_nghi2",
    subscribers: 3200,
    avgViews: 12000,
    engagementRate: 0.21,
    uploadFreq: 3.1,
  },
];

async function main() {
  console.log("\n🚀 Seeding YouVest database with test creators...\n");

  for (const creatorData of TEST_CREATORS) {
    console.log(`📺 Creating: ${creatorData.channelName}`);
    
    const creatorKeypair = Keypair.generate();
    const tokenMint = Keypair.generate();
    
    let user = await prisma.user.findUnique({
      where: { wallet: creatorKeypair.publicKey.toString() }
    });
    
    if (!user) {
      user = await prisma.user.create({
        data: { wallet: creatorKeypair.publicKey.toString() }
      });
    }

    const creator = await prisma.creator.create({
      data: {
        userId: user.id,
        youtubeChannelId: creatorData.channelId,
        channelName: creatorData.channelName,
        channelAvatar: creatorData.channelAvatar,
        tokenAddress: tokenMint.publicKey.toString(),
        initialSubscribers: creatorData.subscribers,
        initialAvgViews: creatorData.avgViews,
        status: "active"
      }
    });

    await prisma.metricsHistory.create({
      data: {
        creatorId: creator.id,
        subscribers: creatorData.subscribers,
        totalViews: BigInt(creatorData.avgViews * 100),
        videoCount: 50 + Math.floor(Math.random() * 100),
        avgViews: creatorData.avgViews,
        engagementRate: creatorData.engagementRate,
        uploadFrequency: creatorData.uploadFreq,
      }
    });

    console.log(`   💎 Token: ${tokenMint.publicKey.toString().slice(0, 8)}...`);
    console.log(`   ✅ Stored in database (ID: ${creator.id})`);

    const numTrades = 15 + Math.floor(Math.random() * 35);
    console.log(`   💸 Creating ${numTrades} mock trades...`);
    
    let totalVolume = 0;
    let currentPrice = 0.01;

    for (let i = 0; i < numTrades; i++) {
      const buyerKeypair = Keypair.generate();
      const tokenAmount = 10 + Math.floor(Math.random() * 490);
      const solAmount = tokenAmount * currentPrice;
      totalVolume += solAmount;
      
      currentPrice *= (1 + (Math.random() * 0.04 - 0.01));

      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);

      await prisma.transaction.create({
        data: {
          tokenAddress: tokenMint.publicKey.toString(),
          buyerWallet: buyerKeypair.publicKey.toString(),
          txSignature: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: Math.random() > 0.15 ? 'buy' : 'sell',
          tokenAmount: BigInt(Math.floor(tokenAmount * 1e9)),
          solAmount: BigInt(Math.floor(solAmount * 1e9)),
          pricePerToken: currentPrice,
          timestamp: timestamp
        }
      });
    }

    console.log(`   📊 Total volume: ${totalVolume.toFixed(2)} SOL\n`);
  }

  console.log("✨ DONE! Database seeded with test creators!");
  console.log(`📺 ${TEST_CREATORS.length} creators added`);
  console.log(`💰 Backend API: http://localhost:3001/api/creators`);
  console.log(`🌐 Frontend: http://localhost:3000/marketplace\n`);

  await prisma.$disconnect();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error);
    process.exit(1);
  });

