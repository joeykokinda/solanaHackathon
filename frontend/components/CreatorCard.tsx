'use client';

import Link from 'next/link';
import { TrendingUp, TrendingDown, Activity, Users } from 'lucide-react';

interface CreatorCardProps {
  creator: {
    id: string;
    channelName: string;
    channelAvatar?: string;
    subscribers: number;
    avgViews: number;
    engagementScore: number;
    uploadFrequency?: number;
    priceSOL: number;
    priceChange24h: number;
    volume24h: number;
    holders?: number;
    tokenAddress: string;
  };
}

export default function CreatorCard({ creator }: CreatorCardProps) {
  const isPositive = creator.priceChange24h >= 0;
  
  return (
    <Link 
      href={`/creator/${creator.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
        <div style={{
          aspectRatio: '16/9',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative'
        }}>
          {creator.channelAvatar && (
            <img 
              src={creator.channelAvatar}
              alt=""
              style={{ 
                position: 'absolute',
                bottom: '-24px',
                left: '16px',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '4px solid var(--background)',
                objectFit: 'cover'
              }}
            />
          )}
        </div>

        <div style={{ padding: '1.5rem', paddingTop: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            {creator.channelName}
          </h3>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '1rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem'
          }}>
            <span>{creator.subscribers?.toLocaleString()} subscribers</span>
            <span>•</span>
            <span style={{ 
              color: isPositive ? 'var(--success)' : 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isPositive ? '+' : ''}{creator.priceChange24h.toFixed(1)}%
            </span>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <div className="card-no-hover" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {(creator.avgViews / 1000).toFixed(1)}k
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Avg Views
              </div>
            </div>
            <div className="card-no-hover" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {(creator.engagementScore * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Engage
              </div>
            </div>
            <div className="card-no-hover" style={{ padding: '0.75rem', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {creator.uploadFrequency?.toFixed(1) || 2.5}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                per week
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
              Token Price
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem', fontVariantNumeric: 'tabular-nums' }}>
              {creator.priceSOL.toFixed(3)} SOL
            </div>
            <div style={{ 
              fontSize: '0.875rem',
              color: isPositive ? 'var(--success)' : 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {isPositive ? '+' : ''}{creator.priceChange24h.toFixed(1)}% 24h
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Activity size={14} />
              Vol: {creator.volume24h.toFixed(1)} SOL
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Users size={14} />
              {creator.holders || 0} holders
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', fontSize: '0.875rem' }}>
            View Profile
          </button>
        </div>
      </div>
    </Link>
  );
}

