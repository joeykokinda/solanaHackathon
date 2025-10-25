require('dotenv').config();
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { google } = require('googleapis');

const prisma = new PrismaClient();
const youtube = google.youtube({ 
  version: 'v3', 
  auth: process.env.YOUTUBE_API_KEY 
});

async function updateCreatorMetrics() {
  console.log('[Metrics] Starting update...');
  
  try {
    const creators = await prisma.creator.findMany({
      where: { status: 'active' }
    });
    
    console.log(`[Metrics] Found ${creators.length} active creators`);
    
    for (const creator of creators) {
      try {
        console.log(`[Metrics] Updating ${creator.channelName}...`);
        
        const channel = await youtube.channels.list({
          part: 'statistics',
          id: creator.youtubeChannelId
        });
        
        if (!channel.data.items || channel.data.items.length === 0) {
          console.error(`[Metrics] Channel not found: ${creator.youtubeChannelId}`);
          continue;
        }

        const stats = channel.data.items[0].statistics;
        
        const videos = await youtube.search.list({
          part: 'id',
          channelId: creator.youtubeChannelId,
          maxResults: 10,
          order: 'date',
          type: 'video'
        });
        
        if (!videos.data.items || videos.data.items.length === 0) {
          console.log(`[Metrics] No recent videos for ${creator.channelName}`);
          continue;
        }

        const videoIds = videos.data.items.map(v => v.id.videoId);
        
        const videoStats = await youtube.videos.list({
          part: 'statistics',
          id: videoIds.join(',')
        });
        
        let totalViews = 0;
        let totalLikes = 0;
        let totalComments = 0;

        videoStats.data.items.forEach(v => {
          totalViews += parseInt(v.statistics.viewCount || 0);
          totalLikes += parseInt(v.statistics.likeCount || 0);
          totalComments += parseInt(v.statistics.commentCount || 0);
        });

        const avgViews = Math.floor(totalViews / videoStats.data.items.length);
        const avgLikes = totalLikes / videoStats.data.items.length;
        const avgComments = totalComments / videoStats.data.items.length;
        
        const engagementRate = avgViews > 0 ? (avgLikes + avgComments * 5) / avgViews : 0;
        const uploadFrequency = videoStats.data.items.length / 7;
        
        await prisma.metricsHistory.create({
          data: {
            creatorId: creator.id,
            subscribers: parseInt(stats.subscriberCount),
            totalViews: BigInt(stats.viewCount),
            videoCount: parseInt(stats.videoCount),
            avgViews,
            engagementRate,
            uploadFrequency
          }
        });
        
        console.log(`[Metrics] Updated ${creator.channelName} - ${stats.subscriberCount} subs`);
        
      } catch (error) {
        console.error(`[Metrics] Error updating ${creator.channelName}:`, error.message);
      }
    }
    
    console.log('[Metrics] Update complete');
  } catch (error) {
    console.error('[Metrics] Fatal error:', error);
  }
}

cron.schedule('0 * * * *', updateCreatorMetrics);

if (require.main === module) {
  console.log('[Metrics] Running manual update...');
  updateCreatorMetrics().then(() => {
    console.log('[Metrics] Manual update complete');
    process.exit(0);
  });
}

module.exports = { updateCreatorMetrics };

