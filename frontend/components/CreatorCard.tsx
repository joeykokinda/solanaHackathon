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

const getProxiedImageUrl = (url?: string): string | undefined => {
  if (!url || !url.startsWith('https://yt3.ggpht.com/')) {
    return url;
  }
  return `http://localhost:3001/api/proxy-image?url=${encodeURIComponent(url)}`;
};

const getCreatorColor = (channelName: string): string => {
  const colorMap: { [key: string]: string } = {
    'fireship': '#FF6B35',
    'traversy': '#E63946',
    'net ninja': '#6C63FF',
    'freecodecamp': '#0A0A23',
    'codewithharry': '#FF0000',
    'benjamin cowen': '#4169E1',
    'lark': '#10B981',
    'eattheblocks': '#8B5CF6',
    'boston': '#DC2626',
    'mrbeast': '#00A8E8',
    'pewdiepie': '#FF0000',
    'markiplier': '#E50000',
    'techstartup': '#4ECDC4',
    'gaming': '#9D4EDD',
    'crypto': '#F72585',
    'fitness': '#06FFA5',
    'indie': '#FFB703',
    'music': '#FB5607',
    'solana': '#14F195',
    'web3': '#9945FF'
  };

  const lowerName = channelName.toLowerCase();
  for (const [key, color] of Object.entries(colorMap)) {
    if (lowerName.includes(key)) {
      return color;
    }
  }
  return '#2a2a2a';
};

export default function CreatorCard({ creator }: CreatorCardProps) {
  const isPositive = creator.priceChange24h >= 0;
  const brandColor = getCreatorColor(creator.channelName);
  
  return (
    <Link 
      href={`/app/creator/${creator.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
        <div style={{
          height: '80px',
          background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}dd 100%)`,
          position: 'relative',
          borderBottom: '1px solid var(--border)'
        }}>
          {creator.channelAvatar ? (
            <img 
              src={getProxiedImageUrl(creator.channelAvatar)}
              alt={`${creator.channelName} avatar`}
              style={{ 
                position: 'absolute',
                bottom: '-28px',
                left: '16px',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '4px solid var(--black)',
                objectFit: 'cover',
                backgroundColor: '#1a1a1a',
                zIndex: 10
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div style={{ 
              position: 'absolute',
              bottom: '-28px',
              left: '16px',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '4px solid var(--black)',
              backgroundColor: brandColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              zIndex: 10
            }}>
              {creator.channelName.charAt(0)}
            </div>
          )}
        </div>

        <div style={{ padding: '1.5rem', paddingTop: '2.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.25rem', color: 'var(--white)' }}>
            {creator.channelName}
          </h3>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '1rem',
            color: 'var(--gray)',
            fontSize: '0.875rem'
          }}>
            <span>{creator.subscribers?.toLocaleString()} subs</span>
            <span>•</span>
            <span style={{ 
              color: isPositive ? 'var(--green)' : 'var(--red)',
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
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '0.375rem' }}>
              <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {(creator.avgViews / 1000).toFixed(1)}k
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>
                Avg Views
              </div>
            </div>
            <div style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '0.375rem' }}>
              <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                {(creator.engagementScore * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>
                Engage
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray)', marginBottom: '0.25rem' }}>
              Token Price
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem', fontVariantNumeric: 'tabular-nums' }}>
              {creator.priceSOL.toFixed(8)} SOL
            </div>
            <div style={{ 
              fontSize: '0.875rem',
              color: isPositive ? 'var(--green)' : 'var(--red)',
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
            color: 'var(--gray)',
            marginBottom: '1rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Activity size={14} />
              {creator.volume24h.toFixed(1)} SOL
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Users size={14} />
              {creator.holders || 0}
            </div>
          </div>

          <button className="btn" style={{ width: '100%', fontSize: '0.875rem', padding: '0.625rem' }}>
            View Profile
          </button>
        </div>
      </div>
    </Link>
  );
}
