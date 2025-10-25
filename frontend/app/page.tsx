'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PublicNav from '@/components/PublicNav';
import Aurora from '@/components/ui/Aurora';
import { MOCK_CREATORS } from '@/lib/mockData';
import CreatorCard from '@/components/CreatorCard';

export default function LandingPage() {
  const { connected } = useWallet();
  const router = useRouter();
  const featuredCreators = MOCK_CREATORS.slice(0, 3);

  useEffect(() => {
    if (connected) {
      router.push('/app');
    }
  }, [connected, router]);

  return (
    <>
      <PublicNav />
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <Aurora 
          colorStops={['#0a0a0a', '#1a1a1a', '#0a0a0a']}
          amplitude={0.6}
          blend={0.3}
          speed={0.2}
        />
        
        <div style={{ position: 'relative', zIndex: 1, paddingTop: '120px' }}>
          <section style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '4rem 2rem',
            textAlign: 'center'
          }}>
            <h1 style={{ 
              fontSize: '4rem', 
              fontWeight: 700, 
              marginBottom: '1.5rem',
              lineHeight: 1.1
            }}>
              Invest in Creators<br />Before They Blow Up
            </h1>
            
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--gray-light)', 
              marginBottom: '3rem',
              maxWidth: '600px',
              margin: '0 auto 3rem'
            }}>
              Buy tokens of YouTubers with 1k-50k subs. Profit as they grow.
            </p>

            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <a href="/app" className="btn-primary">
                Explore Creators
              </a>
              <a href="/app" className="btn">
                Launch App
              </a>
            </div>
          </section>

          <section style={{ 
            maxWidth: '1000px', 
            margin: '6rem auto', 
            padding: '0 2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>
              How It Works
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem'
            }}>
              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <h3 style={{ marginBottom: '0.75rem' }}>Discover</h3>
                <p style={{ color: 'var(--gray)' }}>
                  Find early-stage YouTubers with 1k-50k subscribers
                </p>
              </div>

              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
                <h3 style={{ marginBottom: '0.75rem' }}>Invest</h3>
                <p style={{ color: 'var(--gray)' }}>
                  Buy creator tokens on the bonding curve
                </p>
              </div>

              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
                <h3 style={{ marginBottom: '0.75rem' }}>Profit</h3>
                <p style={{ color: 'var(--gray)' }}>
                  Token value grows as the creator gains subscribers
                </p>
              </div>
            </div>
          </section>

          <section style={{ 
            maxWidth: '1200px', 
            margin: '6rem auto', 
            padding: '0 2rem'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
              Featured Creators
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem'
            }}>
              {featuredCreators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <a href="/app" className="btn">
                View All Creators →
              </a>
            </div>
          </section>

          <section style={{ 
            maxWidth: '1000px', 
            margin: '6rem auto', 
            padding: '4rem 2rem',
            textAlign: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-around',
              gap: '3rem',
              marginBottom: '4rem',
              flexWrap: 'wrap'
            }}>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  127
                </div>
                <div style={{ color: 'var(--gray)' }}>Creators</div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  $45k
                </div>
                <div style={{ color: 'var(--gray)' }}>Volume</div>
              </div>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  2,341
                </div>
                <div style={{ color: 'var(--gray)' }}>Investors</div>
              </div>
            </div>

            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
              Ready to get started?
            </h2>
            <a href="/app" className="btn-primary" style={{ fontSize: '1.125rem' }}>
              Launch App
            </a>
          </section>
        </div>
      </div>
    </>
  );
}
