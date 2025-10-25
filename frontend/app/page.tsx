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
        background: 'var(--black)',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem'
      }}>
        <div style={{ maxWidth: '1200px', width: '100%', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            marginBottom: '1.5rem',
            lineHeight: 1.1,
            fontWeight: 600,
            letterSpacing: '-0.02em'
          }}>
            Invest in Creators<br />Before They Blow Up
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
            color: 'var(--gray)',
            maxWidth: '700px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6
          }}>
            Buy tokens of YouTubers with 1k-50k subscribers. Profit as they grow to millions.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/marketplace">
              <button className="btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                Explore Creators
              </button>
            </Link>
            <Link href="/how-it-works">
              <button className="btn" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                How It Works
              </button>
            </Link>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            maxWidth: '900px',
            margin: '0 auto',
            paddingTop: '3rem',
            borderTop: '1px solid var(--border)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.25rem', fontVariantNumeric: 'tabular-nums' }}>
                {PLATFORM_STATS.totalCreators}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>
                Creators
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.25rem', fontVariantNumeric: 'tabular-nums' }}>
                ${(PLATFORM_STATS.totalVolume / 1000).toFixed(1)}k
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>
                Total Volume
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.25rem', fontVariantNumeric: 'tabular-nums' }}>
                {PLATFORM_STATS.totalInvestors.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>
                Investors
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>How YouVest Works</h2>
          <p style={{ color: 'var(--gray)', fontSize: '1.125rem' }}>
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
            <Search size={40} style={{ color: 'var(--white)', margin: '0 auto 1rem', display: 'block' }} />
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>Discover Early Talent</h3>
            <p style={{ color: 'var(--gray)', lineHeight: 1.6 }}>
              Find YouTubers with 1k-50k subscribers before they go viral
            </p>
          </div>
          <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'center' }}>
            <TrendingUp size={40} style={{ color: 'var(--white)', margin: '0 auto 1rem', display: 'block' }} />
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>Buy Creator Tokens</h3>
            <p style={{ color: 'var(--gray)', lineHeight: 1.6 }}>
              Purchase tokens on a bonding curve. Price increases with demand.
            </p>
          </div>
          <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'center' }}>
            <DollarSign size={40} style={{ color: 'var(--white)', margin: '0 auto 1rem', display: 'block' }} />
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>Earn Returns</h3>
            <p style={{ color: 'var(--gray)', lineHeight: 1.6 }}>
              Sell as creators grow to millions. Reward early supporters.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>Featured Creators</h2>
            <Link href="/marketplace">
              <button className="btn">View All</button>
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
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Ready to invest in the next Mr Beast?</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '2rem', fontSize: '1.125rem' }}>
            Join thousands of investors supporting creators
          </p>
          <Link href="/marketplace">
            <button className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
              Browse Creators
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
