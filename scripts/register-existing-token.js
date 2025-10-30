require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function registerToken() {
  const tokenAddress = process.argv[2];
  const youtubeChannelId = process.argv[3];
  const channelName = process.argv[4];
  const walletAddress = process.argv[5];
  
  if (!tokenAddress || !youtubeChannelId || !channelName || !walletAddress) {
    console.log('Usage: node register-existing-token.js <TOKEN_ADDRESS> <YOUTUBE_CHANNEL_ID> <CHANNEL_NAME> <WALLET>');
    console.log('\nExample:');
    console.log('node register-existing-token.js "ABC123..." "UCxxxxx" "Joe Kokinda" "9Si1...CxFH"');
    process.exit(1);
  }

  try {
    const existing = await prisma.creator.findUnique({
      where: { youtubeChannelId }
    });

    if (existing) {
      console.log(`✅ Token already registered!`);
      console.log(`   Token: ${existing.tokenAddress}`);
      console.log(`   Channel: ${existing.channelName}`);
      return;
    }

    let user = await prisma.user.findUnique({
      where: { wallet: walletAddress }
    });

    if (!user) {
      user = await prisma.user.create({
        data: { wallet: walletAddress }
      });
      console.log(`✅ Created user: ${walletAddress}`);
    }

    const creator = await prisma.creator.create({
      data: {
        userId: user.id,
        youtubeChannelId,
        channelName,
        channelAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&size=200`,
        tokenAddress,
        initialSubscribers: 2,
        initialAvgViews: 21,
        status: 'active'
      }
    });

    await prisma.metricsHistory.create({
      data: {
        creatorId: creator.id,
        subscribers: 2,
        totalViews: BigInt(42),
        videoCount: 2,
        avgViews: 21,
        engagementRate: 0.1,
        uploadFrequency: 1.0
      }
    });

    console.log(`\n🎉 SUCCESS! Token registered in database:`);
    console.log(`   Token Address: ${tokenAddress}`);
    console.log(`   Channel: ${channelName}`);
    console.log(`   YouTube ID: ${youtubeChannelId}`);
    console.log(`\n✅ You can now view it at: https://www.youvest.lol/app`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

registerToken();

