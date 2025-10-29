'use client';

import { useState, useEffect } from 'react';
import CreatorCard from '@/components/CreatorCard';
import SkeletonCard from '@/components/SkeletonCard';
import { Search } from 'lucide-react';

export default function Markets() {
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [sortValue, setSortValue] = useState('trending');

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/creators`);
      const data = await response.json();
      console.log('Fetched creators:', data.creators?.length, 'creators');
      console.log('Sample creator:', data.creators?.[0]);
      setCreators(data.creators || []);
    } catch (error) {
      console.error('Error fetching creators:', error);
      setCreators([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = creators.filter(creator => 
    creator.channelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Markets</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '600px', position: 'relative' }}>
          <Search 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--gray)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{ paddingLeft: '3rem', width: '100%' }}
          />
        </div>

        <select 
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          style={{ minWidth: '180px' }}
        >
          <option value="all">All Creators</option>
          <option value="under5k">Under 5k</option>
          <option value="5k-10k">5k-10k</option>
          <option value="10k+">10k+</option>
        </select>

        <select 
          value={sortValue}
          onChange={(e) => setSortValue(e.target.value)}
          style={{ minWidth: '180px' }}
        >
          <option value="trending">Trending</option>
          <option value="newest">Newest</option>
          <option value="volume">Volume</option>
          <option value="price">Price</option>
        </select>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>All Creators</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>{filteredCreators.length} creators</p>
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
        <div className="card-no-hover" style={{ 
          padding: '4rem 2rem', 
          textAlign: 'center' 
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '0.5rem' }}>No creators found</h3>
          <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>Try adjusting your search or filters</p>
          <button className="btn" onClick={() => setSearchQuery('')}>
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
