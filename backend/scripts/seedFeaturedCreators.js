const { PrismaClient } = require('@prisma/client');
const { getChannelData, calculateAvgViews, getChannelVideos } = require('../src/services/youtube');
const prisma = new PrismaClient();
const FEATURED_CHANNELS = [
  'UCsBjURrPoezykLs9EqgamOA',
  'UC29ju8bIPH5as8OGnQzwJyA',
  'UCW5YeuERMmlnqo4oq8vwUpg',
  'UC8butISFwT-Wl7EV0hUK0BQ',
  'UCeVMnSShP_Iviwkknt83cww',
  'UCRvqjQPSeaWn-uEx-w0XOIg',
  'UCl2oCaw8hdR_kbqyqd2klIA',
  'UCZM8XQjNOyG2ElPpEUtNasA',
  'UC4sS8q8E5ayyghbhFl6PNNQ',
  'UCd1pqe_AX0XLJPeN2RFQcyA',
];
async function seedFeaturedCreators() {
  console.log(' Starting to seed featured creators from YouTube...\n');
  for (const channelId of FEATURED_CHANNELS) {
    try {
      console.log(` Fetching data for channel: ${channelId}`);
      const channelData = await getChannelData(channelId);
      const avgViews = await calculateAvgViews(channelId);
      const videos = await getChannelVideos(channelId, 5);
      const wallet = `YV${Math.random().toString(36).substring(2, 15)}`;
      let user = await prisma.user.findUnique({
        where: { wallet },
      });
      if (!user) {
        user = await prisma.user.create({
          data: { wallet },
        });
      }
      const existingCreator = await prisma.creator.findUnique({
        where: { youtubeChannelId: channelId },
      });
      if (existingCreator) {
        console.log(`   ️  Channel already exists: ${channelData.name}`);
        continue;
      }
      const creator = await prisma.creator.create({
        data: {
          userId: user.id,
          youtubeChannelId: channelId,
          channelName: channelData.name,
          channelAvatar: channelData.avatar,
          tokenAddress: `TOKEN${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
          initialSubscribers: channelData.subscribers,
          initialAvgViews: avgViews,
          status: 'active',
        },
      });
      await prisma.metricsHistory.create({
        data: {
          creatorId: creator.id,
          subscribers: channelData.subscribers,
          totalViews: BigInt(channelData.totalViews),
          videoCount: channelData.videoCount,
          avgViews: avgViews,
          engagementRate: videos.length > 0 
            ? videos.reduce((sum, v) => sum + (v.likes / v.views), 0) / videos.length
            : 0.08,
          uploadFrequency: 3.5,
        },
      });
      console.log(`    Added: ${channelData.name}`);
      console.log(`    ${channelData.subscribers.toLocaleString()} subs | ${avgViews.toLocaleString()} avg views`);
      console.log(`    Token: ${creator.tokenAddress}\n`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`    Error processing ${channelId}:`, error.message);
      console.log('');
    }
  }
  console.log(' Seeding complete!');
  await prisma.$disconnect();
}
seedFeaturedCreators()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
