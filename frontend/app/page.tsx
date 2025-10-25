'use client';

import Link from 'next/link';
import { Search, TrendingUp, DollarSign, Users, Activity, BarChart } from 'lucide-react';
import CreatorCard from '@/components/CreatorCard';
import { MOCK_CREATORS, PLATFORM_STATS } from '@/lib/mockData';
import Footer from '@/components/Footer';

export default function Home() {
  const featuredCreators = MOCK_CREATORS.slice(0, 3);

  return (
    <>
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(10, 14, 39, 1) 50%, rgba(118, 75, 162, 0.1) 100%)',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem'
      }}>
        <div style={{ maxWidth: '1200px', width: '100%', textAlign: 'center' }}>
          <h1 className="text-gradient" style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            marginBottom: '1.5rem',
            lineHeight: 1.1
          }}>
            Invest in Creators<br />Before They Blow Up
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6
          }}>
            Buy tokens of YouTubers with 1k-10k subscribers. Profit as they grow to millions.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/marketplace">
              <button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                Discover Creators
              </button>
            </Link>
            <Link href="/how-it-works">
              <button className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                How It Works
              </button>
            </Link>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div className="card-no-hover" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <Users size={32} style={{ color: 'var(--primary)', margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem', fontVariantNumeric: 'tabular-nums' }}>
                {PLATFORM_STATS.totalCreators}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Creators
              </div>
            </div>
            <div className="card-no-hover" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <Activity size={32} style={{ color: 'var(--primary)', margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem', fontVariantNumeric: 'tabular-nums' }}>
                ${(PLATFORM_STATS.totalVolume / 1000).toFixed(1)}k
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Total Volume
              </div>
            </div>
            <div className="card-no-hover" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <BarChart size={32} style={{ color: 'var(--primary)', margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem', fontVariantNumeric: 'tabular-nums' }}>
                {PLATFORM_STATS.totalInvestors.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Investors
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>How YouVest Works</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            Three simple steps to start investing
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'center' }}>
            <Search size={48} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '0.75rem' }}>Discover Early Talent</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Find YouTubers with 1k-10k subscribers before they go viral
            </p>
          </div>
          <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'center' }}>
            <TrendingUp size={48} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '0.75rem' }}>Buy Creator Tokens</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Purchase tokens on a bonding curve. Price increases with demand.
            </p>
          </div>
          <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'center' }}>
            <DollarSign size={48} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '0.75rem' }}>Earn Returns</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Sell as creators grow to millions. Reward early supporters.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>Featured Creators</h2>
            <Link href="/marketplace">
              <button className="btn-secondary">View All</button>
            </Link>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {featuredCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        </div>

        <div className="card-no-hover" style={{ 
          padding: '4rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(10, 14, 39, 1) 100%)'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Ready to invest in the next Mr Beast?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.125rem' }}>
            Join thousands of investors supporting creators
          </p>
          <Link href="/marketplace">
            <button className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Browse Creators
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
