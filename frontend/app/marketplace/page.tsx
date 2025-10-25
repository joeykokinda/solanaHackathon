'use client';

import { useState } from 'react';
import CreatorCard from '@/components/CreatorCard';
import SkeletonCard from '@/components/SkeletonCard';
import { MOCK_CREATORS } from '@/lib/mockData';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export default function Marketplace() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [sortValue, setSortValue] = useState('trending');

  const filteredCreators = MOCK_CREATORS.filter(creator => 
    creator.channelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>
          Discover Creators
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
          {MOCK_CREATORS.length} creators available
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
          <Search 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)'
            }} 
          />
          <input
            type="text"
            placeholder="Search creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{ paddingLeft: '3rem' }}
          />
        </div>

        <select 
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="input"
          style={{ width: '200px' }}
        >
          <option value="all">All Creators</option>
          <option value="under5k">Under 5k subs</option>
          <option value="5k-10k">5k-10k subs</option>
          <option value="over10k">Over 10k subs</option>
        </select>

        <select 
          value={sortValue}
          onChange={(e) => setSortValue(e.target.value)}
          className="input"
          style={{ width: '200px' }}
        >
          <option value="trending">Trending</option>
          <option value="new">Newest</option>
          <option value="volume">Volume</option>
          <option value="price">Price</option>
        </select>
      </div>

      {loading ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredCreators.length === 0 ? (
        <div className="card-no-hover" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🔍</div>
          <h3 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>No creators found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Try adjusting your search or filters
          </p>
          <button className="btn-primary" onClick={() => setSearchQuery('')}>
            Clear Search
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </div>
  );
}
