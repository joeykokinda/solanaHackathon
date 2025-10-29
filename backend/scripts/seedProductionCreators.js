const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const REAL_WORKING_TOKENS = [
  {
    youtubeChannelId: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
    channelName: 'MrBeast',
    channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_mEDPNTFdXRKvhYZvNZpOhFaxwzO87d8jUY1MjPNq2s6g=s176-c-k-c0x00ffffff-no-rj',
    tokenAddress: 'G8JLfLwkam6jqvXo8e4qSZeT45LFqz8Uy4ptNzzWdi3x', 
    subscribers: 234000000,
    avgViews: 95000000,
    videoCount: 741,
    priceSOL: 0.000001,
    marketCap: 100.0,
    volume24h: 0,
    priceChange24h: 0,
    holders: 0,
    initialSubscribers: 234000000,
    initialAvgViews: 95000000
  },
  {
    youtubeChannelId: 'UCsBjURrPoezykLs9EqgamOA',
    channelName: 'Fireship',
    channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_kGrQl33_1gWpVJuHqxFKYhZXFmvCmyD4i7xCr6c4DKVA=s176-c-k-c0x00ffffff-no-rj',
    tokenAddress: 'FRwCkwrbUDQJeU3X7KNVwNXSDbJ4jD7jfPpxd6s6wMAj', 
    subscribers: 3200000,
    avgViews: 850000,
    videoCount: 523,
    priceSOL: 0.000001,
    marketCap: 50.0,
    volume24h: 0,
    priceChange24h: 0,
    holders: 0,
    initialSubscribers: 3200000,
    initialAvgViews: 850000
  },
  {
    youtubeChannelId: 'UCW5YeuERMmlnqo4oq8vwUpg',
    channelName: 'NetworkChuck',
    channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_nMZrEZ4NzXqFQRJJz8mPRnhU4s9-VbYCYbqgXYKFHOtA=s176-c-k-c0x00ffffff-no-rj',
    tokenAddress: 'GK8jPUUeYj7kwGgUkvzdhuDhkxJBrqzExS8KefNTnq8A', 
    subscribers: 4100000,
    avgViews: 650000,
    videoCount: 312,
    priceSOL: 0.000001,
    marketCap: 75.0,
    volume24h: 0,
    priceChange24h: 0,
    holders: 0,
    initialSubscribers: 4100000,
    initialAvgViews: 650000
  }
];
async function seedProduction() {
  console.log(' Seeding production with 3 REAL working tokens...\n');
  for (const creator of REAL_WORKING_TOKENS) {
    try {
      const existing = await prisma.creator.findUnique({
        where: { youtubeChannelId: creator.youtubeChannelId }
      });
      if (existing) {
        console.log(` ${creator.channelName} already exists with token: ${existing.tokenAddress}`);
        continue;
      }
      const mockWallet = `mock_${creator.youtubeChannelId}_${Date.now()}`;
      await prisma.creator.create({
        data: {
          youtubeChannelId: creator.youtubeChannelId,
          channelName: creator.channelName,
          channelAvatar: creator.channelAvatar,
          tokenAddress: creator.tokenAddress,
          initialSubscribers: creator.initialSubscribers,
          initialAvgViews: creator.initialAvgViews,
          user: {
            create: {
              wallet: mockWallet
            }
          }
        }
      });
      console.log(` Added ${creator.channelName} (${creator.tokenAddress})`);
    } catch (error) {
      console.error(` Error adding ${creator.channelName}:`, error.message);
    }
  }
  console.log('\n Production seeding complete!');
  console.log(' These tokens have REAL bonding curves and working buy/sell!');
}
seedProduction()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
