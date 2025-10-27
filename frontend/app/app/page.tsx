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
      const response = await fetch('http://localhost:3001/api/creators');
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
    <div className="p-8 max-w-[1600px] mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Markets</h1>
      
      <div className="flex gap-4 mb-8">
        <div className="flex-1 max-w-2xl relative">
          <Search 
            size={20} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors"
          />
        </div>

        <select 
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors cursor-pointer min-w-[150px]"
        >
          <option value="all">All Creators</option>
          <option value="under5k">Under 5k</option>
          <option value="5k-10k">5k-10k</option>
          <option value="10k+">10k+</option>
        </select>

        <select 
          value={sortValue}
          onChange={(e) => setSortValue(e.target.value)}
          className="bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors cursor-pointer min-w-[150px]"
        >
          <option value="trending">Trending</option>
          <option value="newest">Newest</option>
          <option value="volume">Volume</option>
          <option value="price">Price</option>
        </select>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold">All Creators</h2>
        <p className="text-gray-400 text-sm mt-1">{filteredCreators.length} creators</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredCreators.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-lg p-16 text-center">
          <h3 className="text-lg font-medium mb-2">No creators found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
          <button className="btn" onClick={() => setSearchQuery('')}>
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      )}
    </div>
  );
}
