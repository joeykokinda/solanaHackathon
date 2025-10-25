'use client';

import { useState } from 'react';
import CreatorCard from '@/components/CreatorCard';
import SkeletonCard from '@/components/SkeletonCard';
import { MOCK_CREATORS } from '@/lib/mockData';
import { Search } from 'lucide-react';
import Aurora from '@/components/ui/Aurora';

export default function Markets() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [sortValue, setSortValue] = useState('trending');

  const filteredCreators = MOCK_CREATORS.filter(creator => 
    creator.channelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredCreators = MOCK_CREATORS.slice(0, 5);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Aurora 
        colorStops={['#0a0a0a', '#1a1a1a', '#0a0a0a']}
        amplitude={0.6}
        blend={0.3}
        speed={0.2}
      />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ 
        display: 'flex', 
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--gray)'
            }} 
          />
          <input
            type="text"
            placeholder="Search creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{ paddingLeft: '2.75rem', height: '42px' }}
          />
        </div>

        <select 
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          style={{ 
            width: '180px',
            height: '42px',
            padding: '0 1rem',
            backgroundColor: 'var(--black-card)',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--white)',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Creators</option>
          <option value="under5k">Under 5k</option>
          <option value="5k-10k">5k-10k</option>
          <option value="over10k">Over 10k</option>
        </select>

        <select 
          value={sortValue}
          onChange={(e) => setSortValue(e.target.value)}
          style={{ 
            width: '180px',
            height: '42px',
            padding: '0 1rem',
            backgroundColor: 'var(--black-card)',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--white)',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          <option value="trending">Trending</option>
          <option value="new">Newest</option>
          <option value="volume">Volume</option>
          <option value="price">Price</option>
        </select>
      </div>

      {featuredCreators.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
            Featured
          </h2>
          <div style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            scrollSnapType: 'x mandatory',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}>
            {featuredCreators.map((creator) => (
              <div key={creator.id} style={{ 
                minWidth: '280px',
                scrollSnapAlign: 'start'
              }}>
                <CreatorCard creator={creator} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
          All Creators
        </h2>
        <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>
          {filteredCreators.length} creators
        </p>
      </div>

      {loading ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.25rem'
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredCreators.length === 0 ? (
        <div className="card-no-hover" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '0.5rem', fontWeight: 500 }}>No creators found</h3>
          <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>
            Try adjusting your search or filters
          </p>
          <button className="btn" onClick={() => setSearchQuery('')}>
            Clear Search
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
