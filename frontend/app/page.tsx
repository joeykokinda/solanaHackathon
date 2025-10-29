'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { API_URL } from '@/lib/config';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PublicNav from '@/components/PublicNav';
import Aurora from '@/components/ui/Aurora';
import CreatorCard from '@/components/CreatorCard';
export default function LandingPage() {
  const { connected } = useWallet();
  const router = useRouter();
  const [featuredCreators, setFeaturedCreators] = useState<any[]>([]);
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await fetch(`${API_URL}/api/creators`);
        const data = await response.json();
        setFeaturedCreators(data.creators?.slice(0, 3) || []);
      } catch (error) {
        console.error('Error fetching creators:', error);
      }
    };
    fetchCreators();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const revealLines = document.querySelectorAll('.reveal-line');
      revealLines.forEach((line) => {
        const rect = line.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top <= windowHeight * 0.75) {
          const delay = parseInt(line.getAttribute('data-delay') || '0');
          setTimeout(() => {
            (line as HTMLElement).style.opacity = '1';
            (line as HTMLElement).style.transform = 'translateY(0)';
            (line as HTMLElement).style.transition = 'opacity 0.8s ease, transform 0.8s ease';
          }, delay * 200);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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
        <div style={{ position: 'relative', zIndex: 1 }}>
          <section style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '2rem',
            textAlign: 'center',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
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
            maxWidth: '800px',
            margin: '0 auto',
            padding: '8rem 2rem',
            textAlign: 'center',
            minHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div className="scroll-reveal-text">
              <h2 style={{ 
                fontSize: '3rem', 
                fontWeight: 700, 
                marginBottom: '2rem',
                lineHeight: 1.3,
                opacity: 0.95
              }}>
                What if you found MrBeast at 1,000 subscribers?
              </h2>
              <p style={{ 
                fontSize: '1.75rem', 
                color: 'var(--gray-light)', 
                marginBottom: '1rem',
                lineHeight: 1.5,
                opacity: 0,
                transform: 'translateY(30px)'
              }} className="reveal-line" data-delay="0">
                PewDiePie filming in his Swedish bedroom.
              </p>
              <p style={{ 
                fontSize: '1.75rem', 
                color: 'var(--gray-light)', 
                marginBottom: '1rem',
                lineHeight: 1.5,
                opacity: 0,
                transform: 'translateY(30px)'
              }} className="reveal-line" data-delay="1">
                Emma Chamberlain before her first brand deal.
              </p>
              <p style={{ 
                fontSize: '1.75rem', 
                color: 'var(--gray-light)', 
                marginBottom: '3rem',
                lineHeight: 1.5,
                opacity: 0,
                transform: 'translateY(30px)'
              }} className="reveal-line" data-delay="2">
                The next viral creator is uploading right now.
              </p>
            </div>
          </section>
          <section id="how-it-works" style={{ 
            maxWidth: '1000px', 
            margin: '0 auto',
            padding: '8rem 2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>
              How It Works
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem'
            }}>
              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
                <h3 style={{ marginBottom: '0.75rem' }}>Discover</h3>
                <p style={{ color: 'var(--gray)', lineHeight: 1.6 }}>
                  Find early-stage YouTubers with 1k-50k subscribers using YouTube API data
                </p>
              </div>
              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
                <h3 style={{ marginBottom: '0.75rem' }}>Invest</h3>
                <p style={{ color: 'var(--gray)', lineHeight: 1.6 }}>
                  Buy creator tokens on Solana. Price increases as more people buy (bonding curve)
                </p>
              </div>
              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
                <h3 style={{ marginBottom: '0.75rem' }}>Track</h3>
                <p style={{ color: 'var(--gray)', lineHeight: 1.6 }}>
                  Watch token value grow as creators gain subs. Sell anytime for profit (or loss)
                </p>
              </div>
            </div>
          </section>
          {featuredCreators.length > 0 && (
            <section id="featured" style={{ 
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '8rem 2rem'
            }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '3rem', textAlign: 'center' }}>
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
          )}
          <section style={{ 
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '8rem 2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>
              Why YouVest?
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              textAlign: 'left'
            }}>
              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}></div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>Spot Talent Early</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  Get in before they blow up. Tokens are cheapest when creators have &lt;5k subs.
                </p>
              </div>
              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}></div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>Fair Pricing</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  Bonding curve = no BS. Price goes up with demand, down with sells. Pure math.
                </p>
              </div>
              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="32" height="32" viewBox="0 0 397.7 311.7" style={{ display: 'block' }}>
                    <linearGradient id="solana-gradient" x2="0.35" y2="1">
                      <stop offset="0%" stopColor="#00FFA3" />
                      <stop offset="50%" stopColor="#DC1FFF" />
                      <stop offset="100%" stopColor="#00FFA3" />
                    </linearGradient>
                    <path fill="url(#solana-gradient)" d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zm0-64.6c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7zM6.5 3.8h317.4c3.5 0 6.8 1.4 9.2 3.8l62.7 62.7c4.1 4.1 1.2 11.1-4.6 11.1H73.8c-3.5 0-6.8-1.4-9.2-3.8L1.9 14.9C-2.2 10.8.7 3.8 6.5 3.8z"/>
                  </svg>
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>Built on Solana</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  Fast transactions, low fees (~$0.00025). Your tokens, your wallet, your control.
                </p>
              </div>
            </div>
          </section>
          <section id="for-creators" style={{ 
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '8rem 2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
              Are You a Creator?
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'var(--gray-light)', 
              marginBottom: '4rem',
              maxWidth: '700px',
              margin: '0 auto 4rem'
            }}>
              Launch your own token in minutes. Connect your YouTube channel and let your fans invest in your growth.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.125rem' }}>Connect YouTube</h3>
                <p style={{ color: 'var(--gray)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Verify ownership of your channel with one click
                </p>
              </div>
              <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪙</div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.125rem' }}>Launch Token</h3>
                <p style={{ color: 'var(--gray)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Create a real token on Solana with a bonding curve
                </p>
              </div>
              <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.125rem' }}>Grow Together</h3>
                <p style={{ color: 'var(--gray)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Your fans profit when you grow. Built-in liquidity
                </p>
              </div>
            </div>
            <a href="/app/launch" className="btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
              Launch Your Token →
            </a>
          </section>
          <section id="faq" style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            padding: '8rem 2rem'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem', textAlign: 'center' }}>
              FAQ
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'left' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>How does the bonding curve work?</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  More buyers = higher price. More sellers = lower price. It's automatic - no market manipulation possible.
                </p>
              </div>
              <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'left' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Can I actually sell my tokens?</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  Yes. Sell back to the bonding curve anytime. Liquidity is built-in.
                </p>
              </div>
              <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'left' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>What if the creator stops posting?</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  Then your token probably drops in value. This is risky - only invest what you can lose.
                </p>
              </div>
              <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'left' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Do creators know about this?</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  Not yet. We're pulling public YouTube data. Creators can claim their profile later for rewards.
                </p>
              </div>
              <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'left' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Is this legal?</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  We're not financial advisors. This is experimental DeFi. DYOR (do your own research).
                </p>
              </div>
              <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'left' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>What's the catch?</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  It's a hackathon project. Bugs exist. Only on devnet for now. Use at your own risk.
                </p>
              </div>
            </div>
          </section>
          <section style={{ 
            maxWidth: '800px',
            margin: '0 auto',
            padding: '8rem 2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
              Ready to Find the Next MrBeast?
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: 'var(--gray-light)',
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}>
              Connect your Solana wallet and start discovering underrated creators.
            </p>
            <a href="/app" className="btn-primary" style={{ fontSize: '1.125rem' }}>
              Launch App
            </a>
          </section>
          <footer style={{ 
            padding: '4rem 2rem',
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
            color: 'var(--gray)'
          }}>
            <p style={{ fontSize: '0.875rem' }}>
              Built for Cypherpunk Hackathon 2025 | Deadline: Oct 30
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
