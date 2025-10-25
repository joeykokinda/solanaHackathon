'use client';

import { useState } from 'react';
import CreatorCard from '@/components/CreatorCard';
import SkeletonCard from '@/components/SkeletonCard';
import { MOCK_CREATORS } from '@/lib/mockData';
import { Search } from 'lucide-react';

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
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Markets</h1>
      <div className="flex gap-4 mb-8 flex-wrap">
        <div className="flex-1 min-w-[300px] relative">
          <Search 
            size={18} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 pl-12 text-white"
          />
        </div>

        <select 
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
        >
          <option>All Creators</option>
          <option>Under 5k</option>
          <option>5k-10k</option>
          <option>10k+</option>
        </select>

        <select 
          value={sortValue}
          onChange={(e) => setSortValue(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
        >
          <option>Trending</option>
          <option>Newest</option>
          <option>Volume</option>
          <option>Price</option>
        </select>
      </div>

      {featuredCreators.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Featured</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {featuredCreators.map((creator) => (
              <div key={creator.id} className="min-w-[280px]">
                <CreatorCard creator={creator} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-semibold">All Creators</h2>
        <p className="text-gray-400 text-sm">{filteredCreators.length} creators</p>
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
