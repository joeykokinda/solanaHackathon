const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Adding mock creators...');

  const mockCreators = [
    {
      youtubeChannelId: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
      channelName: 'MrBeast',
      channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_mEDPNTFdXRKvhYZvNZpOhFaxwzO87d8jUY1MjPNq2s6g=s176-c-k-c0x00ffffff-no-rj',
      subscribers: 234000000,
      avgViews: 95000000,
      videoCount: 741,
      tokenAddress: 'MrBeastToken111111111111111111111111111',
      priceSOL: 0.0001,
      marketCap: 100.0,
      volume24h: 25.5,
      priceChange24h: 15.3,
      holders: 1247
    },
    {
      youtubeChannelId: 'UCsBjURrPoezykLs9EqgamOA',
      channelName: 'Fireship',
      channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_kGrQl33_1gWpVJuHqxFKYhZXFmvCmyD4i7xCr6c4DKVA=s176-c-k-c0x00ffffff-no-rj',
      subscribers: 3200000,
      avgViews: 850000,
      videoCount: 523,
      tokenAddress: 'FireshipToken111111111111111111111111',
      priceSOL: 0.00005,
      marketCap: 50.0,
      volume24h: 12.3,
      priceChange24h: 8.7,
      holders: 892
    },
    {
      youtubeChannelId: 'UCW5YeuERMmlnqo4oq8vwUpg',
      channelName: 'NetworkChuck',
      channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_nMZrEZ4NzXqFQRJJz8mPRnhU4s9-VbYCYbqgXYKFHOtA=s176-c-k-c0x00ffffff-no-rj',
      subscribers: 4100000,
      avgViews: 650000,
      videoCount: 312,
      tokenAddress: 'NetworkChuckToken1111111111111111111',
      priceSOL: 0.000075,
      marketCap: 75.0,
      volume24h: 18.9,
      priceChange24h: -3.2,
      holders: 634
    },
    {
      youtubeChannelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
      channelName: 'freeCodeCamp',
      channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_nH4P6p-Xw1Nxu48GZ7kGF_e8DvRlqCsWs8Hw6eW0EJ=s176-c-k-c0x00ffffff-no-rj',
      subscribers: 9800000,
      avgViews: 320000,
      videoCount: 1847,
      tokenAddress: 'FreeCodeCampToken11111111111111111',
      priceSOL: 0.00012,
      marketCap: 120.0,
      volume24h: 32.1,
      priceChange24h: 22.4,
      holders: 1523
    },
    {
      youtubeChannelId: 'UCeVMnSShP_Iviwkknt83cww',
      channelName: 'CodeWithHarry',
      channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_lHjl0zKdY9X2kvH_nUzz_kPZq_VQ4RZL9qRE_3c9A=s176-c-k-c0x00ffffff-no-rj',
      subscribers: 5600000,
      avgViews: 420000,
      videoCount: 892,
      tokenAddress: 'CodeWithHarryToken111111111111111',
      priceSOL: 0.00008,
      marketCap: 85.0,
      volume24h: 15.7,
      priceChange24h: 5.1,
      holders: 743
    }
  ];

  for (const creator of mockCreators) {
    try {
      const existing = await prisma.creator.findUnique({
        where: { youtubeChannelId: creator.youtubeChannelId }
      });

      if (existing) {
        console.log(`✓ ${creator.channelName} already exists`);
        continue;
      }

      await prisma.creator.create({
        data: creator
      });

      console.log(`✅ Added ${creator.channelName}`);
    } catch (error) {
      console.error(`❌ Error adding ${creator.channelName}:`, error.message);
    }
  }

  console.log('✨ Done! Mock creators added.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

