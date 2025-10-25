'use client';

import { useParams } from 'next/navigation';
import { MOCK_CREATORS } from '@/lib/mockData';
import { TrendingUp, TrendingDown, Users, Activity, Eye, Video, Play, MessageCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function CreatorProfile() {
  const params = useParams();
  const creator = MOCK_CREATORS.find(c => c.id === params.id) || MOCK_CREATORS[0];
  
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  
  const isPositive = creator.priceChange24h >= 0;
  const estimatedCost = parseFloat(amount || '0') * creator.priceSOL;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div className="card-no-hover" style={{ 
        marginBottom: '2rem',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          height: '200px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative'
        }}>
          {creator.channelAvatar && (
            <img 
              src={creator.channelAvatar}
              alt=""
              style={{ 
                position: 'absolute',
                bottom: '-48px',
                left: '2rem',
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                border: '4px solid var(--background)',
                objectFit: 'cover'
              }}
            />
          )}
        </div>
        <div style={{ padding: '4rem 2rem 2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>{creator.channelName}</h1>
          <div style={{ 
            display: 'flex', 
            gap: '1rem',
            alignItems: 'center',
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem'
          }}>
            <span>{creator.subscribers.toLocaleString()} subscribers</span>
            <span>•</span>
            <span>{creator.avgViews.toLocaleString()} avg views</span>
            <a 
              href={`https://youtube.com/channel/${creator.youtubeChannelId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)' }}
            >
              View Channel <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        '@media (max-width: 1024px)': { gridTemplateColumns: '1fr' }
      }} className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div>
          <div className="card-no-hover" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Token Price
                </p>
                <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontVariantNumeric: 'tabular-nums' }}>
                  {creator.priceSOL.toFixed(3)} SOL
                </h2>
                <p style={{ 
                  color: isPositive ? 'var(--success)' : 'var(--danger)',
                  fontSize: '1.125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  {isPositive ? '+' : ''}{creator.priceChange24h.toFixed(2)}% (24h)
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Market Cap</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {creator.marketCap.toFixed(1)} SOL
                </p>
              </div>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border)'
            }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Volume (24h)
                </p>
                <p style={{ fontSize: '1.125rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {creator.volume24h.toFixed(2)} SOL
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Holders
                </p>
                <p style={{ fontSize: '1.125rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {creator.holders}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Engagement
                </p>
                <p style={{ fontSize: '1.125rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {(creator.engagementScore * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="card-no-hover" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Channel Metrics</h3>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1.5rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Users size={20} style={{ color: 'var(--text-secondary)' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Subscribers</p>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {creator.subscribers.toLocaleString()}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--success)' }}>
                  +{Math.round((creator.subscribers - creator.initialSubscribers) / creator.initialSubscribers * 100)}% since launch
                </p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Eye size={20} style={{ color: 'var(--text-secondary)' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Avg Views</p>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {creator.avgViews.toLocaleString()}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--success)' }}>
                  +{Math.round((creator.avgViews - creator.initialAvgViews) / creator.initialAvgViews * 100)}% since launch
                </p>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Video size={20} style={{ color: 'var(--text-secondary)' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Upload Frequency</p>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {creator.uploadFrequency?.toFixed(1)}
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  videos per week
                </p>
              </div>
            </div>
          </div>

          {creator.recentVideos && creator.recentVideos.length > 0 && (
            <div className="card-no-hover" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Recent Videos</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {creator.recentVideos.map((video) => (
                  <div key={video.id} style={{ cursor: 'pointer' }}>
                    <div style={{ 
                      aspectRatio: '16/9',
                      borderRadius: '0.5rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      marginBottom: '0.75rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.3)'
                      }}>
                        <Play size={48} fill="white" color="white" style={{ opacity: 0.9 }} />
                      </div>
                    </div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', lineHeight: 1.4 }}>
                      {video.title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {video.views.toLocaleString()} views • {video.uploadedAt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'sticky', top: '100px', alignSelf: 'flex-start' }}>
          <div className="card-no-hover" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <button
                onClick={() => setActiveTab('buy')}
                style={{
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeTab === 'buy' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'buy' ? 'white' : 'var(--text-secondary)',
                  transition: 'all 150ms ease'
                }}
              >
                Buy
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                style={{
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeTab === 'sell' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'sell' ? 'white' : 'var(--text-secondary)',
                  transition: 'all 150ms ease'
                }}
              >
                Sell
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Amount (tokens)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="input"
                style={{ fontSize: '1.125rem', fontWeight: 600 }}
              />
            </div>

            {amount && (
              <div className="card-no-hover" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    You {activeTab === 'buy' ? 'Pay' : 'Receive'}:
                  </span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {estimatedCost.toFixed(4)} SOL
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Price:
                  </span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {creator.priceSOL.toFixed(4)} SOL/token
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Slippage:
                  </span>
                  <span style={{ fontWeight: 600 }}>~0.5%</span>
                </div>
              </div>
            )}

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              {activeTab === 'buy' ? 'Buy' : 'Sell'} {creator.channelName.split(' ')[0]} Tokens
            </button>

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Market Stats</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Volume (24h):</span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{creator.volume24h.toFixed(2)} SOL</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Holders:</span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{creator.holders}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Market Cap:</span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{creator.marketCap.toFixed(1)} SOL</span>
                </div>
              </div>
            </div>
          </div>

          {creator.recentTrades && creator.recentTrades.length > 0 && (
            <div className="card-no-hover" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Trades</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {creator.recentTrades.map((trade, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ 
                        display: 'inline-block',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: trade.type === 'buy' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: trade.type === 'buy' ? 'var(--success)' : 'var(--danger)',
                        marginRight: '0.5rem'
                      }}>
                        {trade.type.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.875rem' }}>{trade.amount} tokens</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        {trade.price.toFixed(3)} SOL
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        {trade.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card-no-hover" style={{ padding: '1rem', marginTop: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Token Address
            </p>
            <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', wordBreak: 'break-all', color: 'var(--text-primary)' }}>
              {creator.tokenAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
