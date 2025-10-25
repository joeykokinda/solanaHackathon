const { google } = require('googleapis');

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

async function getChannelData(channelId) {
  try {
    const response = await youtube.channels.list({
      part: ['snippet', 'statistics', 'brandingSettings'],
      id: [channelId],
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Channel not found');
    }

    const channel = response.data.items[0];
    const stats = channel.statistics;
    const snippet = channel.snippet;
    const branding = channel.brandingSettings;

    return {
      channelId: channel.id,
      name: snippet.title,
      description: snippet.description,
      avatar: snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
      banner: branding?.image?.bannerExternalUrl || snippet.thumbnails.default?.url,
      customUrl: snippet.customUrl,
      subscribers: parseInt(stats.subscriberCount || 0),
      totalViews: parseInt(stats.viewCount || 0),
      videoCount: parseInt(stats.videoCount || 0),
      publishedAt: snippet.publishedAt,
    };
  } catch (error) {
    console.error('Error fetching channel data:', error.message);
    throw error;
  }
}

async function getChannelVideos(channelId, maxResults = 10) {
  try {
    const response = await youtube.search.list({
      part: ['snippet'],
      channelId: channelId,
      order: 'date',
      type: 'video',
      maxResults: maxResults,
    });

    if (!response.data.items) {
      return [];
    }

    const videoIds = response.data.items.map(item => item.id.videoId).join(',');
    
    const videoStats = await youtube.videos.list({
      part: ['statistics'],
      id: videoIds,
    });

    const videos = response.data.items.map((item, index) => {
      const stats = videoStats.data.items[index]?.statistics || {};
      return {
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        views: parseInt(stats.viewCount || 0),
        likes: parseInt(stats.likeCount || 0),
        comments: parseInt(stats.commentCount || 0),
      };
    });

    return videos;
  } catch (error) {
    console.error('Error fetching channel videos:', error.message);
    throw error;
  }
}

async function calculateAvgViews(channelId) {
  try {
    const videos = await getChannelVideos(channelId, 20);
    if (videos.length === 0) return 0;
    
    const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
    return Math.floor(totalViews / videos.length);
  } catch (error) {
    console.error('Error calculating avg views:', error.message);
    return 0;
  }
}

module.exports = {
  getChannelData,
  getChannelVideos,
  calculateAvgViews,
};

