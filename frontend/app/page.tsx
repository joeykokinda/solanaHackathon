'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { API_URL } from '@/lib/config';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PublicNav from '@/components/PublicNav';
import Silk from '@/components/Silk';
import CreatorCard from '@/components/CreatorCard';
import SpotlightCard from '@/components/SpotlightCard';
import ScrollFloat from '@/components/ScrollFloat';
import ShinyText from '@/components/ShinyText';
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
      <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#000000', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Silk
            speed={5}
            scale={1}
            color="#3a2a5a"
            noiseIntensity={1.5}
            rotation={0}
          />
        </div>
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
              lineHeight: 1.1,
              color: 'white'
            }}>
              Invest in Creators<br />
              <span style={{
                background: 'linear-gradient(135deg, #00FFA3 0%, #DC1FFF 50%, #00FFA3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>BEFORE</span> They Blow Up
            </h1>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'rgba(255, 255, 255, 0.7)', 
              marginBottom: '3rem',
              maxWidth: '600px',
              margin: '0 auto 3rem'
            }}>
              Invest in small YouTubers with a lot of potential. Profit as they grow.
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
                <ShinyText text="Launch App" speed={3} />
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
                color: 'white',
                opacity: 0,
                transform: 'translateY(30px)'
              }} className="reveal-line" data-delay="0">
                What if you found MrBeast at 1,000 subscribers?
              </h2>
              <p style={{ 
                fontSize: '1.75rem', 
                color: 'rgba(255, 255, 255, 0.7)', 
                marginBottom: '1rem',
                lineHeight: 1.5,
                opacity: 0,
                transform: 'translateY(30px)'
              }} className="reveal-line" data-delay="1">
                PewDiePie filming in his Swedish bedroom.
              </p>
              <p style={{ 
                fontSize: '1.75rem', 
                color: 'rgba(255, 255, 255, 0.7)', 
                marginBottom: '1rem',
                lineHeight: 1.5,
                opacity: 0,
                transform: 'translateY(30px)'
              }} className="reveal-line" data-delay="2">
                Emma Chamberlain before her first brand deal.
              </p>
              <p style={{ 
                fontSize: '1.75rem', 
                color: 'rgba(255, 255, 255, 0.7)', 
                marginBottom: '3rem',
                lineHeight: 1.5,
                opacity: 0,
                transform: 'translateY(30px)'
              }} className="reveal-line" data-delay="3">
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
            <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem', color: 'white' }}>
              How It Works
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem'
            }}>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <h3 style={{ marginBottom: '0.75rem', color: 'white', fontSize: '1.5rem', fontWeight: 600 }}>Discover</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                  Find early-stage YouTubers with 1k-50k subscribers using YouTube API data
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <h3 style={{ marginBottom: '0.75rem', color: 'white', fontSize: '1.5rem', fontWeight: 600 }}>Invest</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                  Buy creator tokens on Solana. Price increases as more people buy (bonding curve)
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <h3 style={{ marginBottom: '0.75rem', color: 'white', fontSize: '1.5rem', fontWeight: 600 }}>Track</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                  Watch token value grow as creators gain subs. Sell anytime for profit (or loss)
                </p>
              </SpotlightCard>
            </div>
          </section>
          {featuredCreators.length > 0 && (
            <section id="featured" style={{ 
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '8rem 2rem',
              textAlign: 'center'
            }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '3rem', color: 'white' }}>
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
            <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem', color: 'white' }}>
              Why YouVest?
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              textAlign: 'left'
            }}>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <div style={{ marginBottom: '1rem' }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="2" />
                    <path d="M20 10 L20 20 L28 16 Z" fill="white" />
                  </svg>
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', color: 'white', fontWeight: 600 }}>Spot Talent Early</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                  Get in before they blow up. Tokens are cheapest when creators have &lt;5k subs.
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <div style={{ marginBottom: '1rem' }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect x="8" y="12" width="24" height="16" stroke="white" strokeWidth="2" rx="2" />
                    <path d="M12 20 L20 24 L28 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', color: 'white', fontWeight: 600 }}>Fair Pricing</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                  Bonding curve = no BS. Price goes up with demand, down with sells. Pure math.
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <div style={{ marginBottom: '1rem' }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <polygon points="20,8 32,15 32,25 20,32 8,25 8,15" stroke="white" strokeWidth="2" fill="none" />
                    <circle cx="20" cy="20" r="4" fill="white" />
                  </svg>
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', color: 'white', fontWeight: 600 }}>Built on Solana</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6 }}>
                  Fast transactions, low fees (~$0.00025). Your tokens, your wallet, your control.
                </p>
              </SpotlightCard>
            </div>
          </section>
          <section id="for-creators" style={{ 
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '8rem 2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white' }}>
              Are You a Creator?
            </h2>
            <p style={{ 
              fontSize: '1.25rem', 
              color: 'rgba(255, 255, 255, 0.7)', 
              marginBottom: '4rem',
              maxWidth: '700px',
              margin: '2rem auto 4rem'
            }}>
              Launch your own token in minutes. Connect your YouTube channel and let your fans invest in your growth.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect x="8" y="10" width="24" height="20" rx="2" stroke="white" strokeWidth="2" />
                    <polygon points="16,18 24,22 16,26" fill="white" />
                  </svg>
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.125rem', color: 'white', fontWeight: 600 }}>Connect YouTube</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Verify ownership of your channel with one click
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2" />
                    <circle cx="20" cy="20" r="8" fill="white" />
                  </svg>
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.125rem', color: 'white', fontWeight: 600 }}>Launch Token</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Create a real token on Solana with a bonding curve
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M20 8 L30 15 L30 25 L20 32 L10 25 L10 15 Z" stroke="white" strokeWidth="2" fill="none" />
                    <path d="M20 16 L20 24 M16 20 L24 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.125rem', color: 'white', fontWeight: 600 }}>Grow Together</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Your fans profit when you grow. Built-in liquidity
                </p>
              </SpotlightCard>
            </div>
            <a href="/app/launch" className="btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
              Launch Your Token →
            </a>
          </section>
          <section id="faq" style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            padding: '8rem 2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '4rem', color: 'white' }}>
              FAQ
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'white', fontWeight: 600, textAlign: 'left' }}>How does the bonding curve work?</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, textAlign: 'left' }}>
                  More buyers = higher price. More sellers = lower price. It's automatic - no market manipulation possible.
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'white', fontWeight: 600, textAlign: 'left' }}>Can I actually sell my tokens?</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, textAlign: 'left' }}>
                  Yes. Sell back to the bonding curve anytime. Liquidity is built-in.
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'white', fontWeight: 600, textAlign: 'left' }}>What if the creator stops posting?</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, textAlign: 'left' }}>
                  Then your token probably drops in value. This is risky - only invest what you can lose.
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'white', fontWeight: 600, textAlign: 'left' }}>Do creators know about this?</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, textAlign: 'left' }}>
                  Not yet. We're pulling public YouTube data. Creators can claim their profile later for rewards.
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'white', fontWeight: 600, textAlign: 'left' }}>Is this legal?</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, textAlign: 'left' }}>
                  We're not financial advisors. This is experimental DeFi. DYOR (do your own research).
                </p>
              </SpotlightCard>
              <SpotlightCard spotlightColor="rgba(153, 69, 255, 0.2)">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'white', fontWeight: 600, textAlign: 'left' }}>What's the catch?</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, textAlign: 'left' }}>
                  It's a hackathon project. Bugs exist. Only on devnet for now. Use at your own risk.
                </p>
              </SpotlightCard>
            </div>
          </section>
          <section style={{ 
            maxWidth: '800px',
            margin: '0 auto',
            padding: '8rem 2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'white' }}>
              Ready to Find the Next MrBeast?
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: 'rgba(255, 255, 255, 0.7)',
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
