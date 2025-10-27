'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import PublicNav from '@/components/PublicNav';
import Aurora from '@/components/ui/Aurora';
import CreatorCard from '@/components/CreatorCard';
import { motion, useInView, useScroll, useTransform } from 'motion/react';

export default function LandingPage() {
  const { connected } = useWallet();
  const router = useRouter();
  const [featuredCreators, setFeaturedCreators] = useState<any[]>([]);
  const textSectionRef = useRef(null);
  
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/creators');
        const data = await response.json();
        setFeaturedCreators(data.creators?.slice(0, 3) || []);
      } catch (error) {
        console.error('Error fetching creators:', error);
      }
    };
    fetchCreators();
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: textSectionRef,
    offset: ["start end", "end start"]
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const creator1Opacity = useTransform(scrollYProgress, [0.15, 0.3], [0, 1]);
  const creator1Scale = useTransform(scrollYProgress, [0.15, 0.3], [0.8, 1]);
  const creator2Opacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const creator2Scale = useTransform(scrollYProgress, [0.3, 0.45], [0.8, 1]);
  const creator3Opacity = useTransform(scrollYProgress, [0.45, 0.6], [0, 1]);
  const creator3Scale = useTransform(scrollYProgress, [0.45, 0.6], [0.8, 1]);
  const creator4Opacity = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);
  const creator4Scale = useTransform(scrollYProgress, [0.6, 0.75], [0.8, 1]);
  const closingOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
  const buttonOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const buttonScale = useTransform(scrollYProgress, [0.85, 0.95], [0.9, 1]);

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

          <motion.section 
            ref={textSectionRef}
            style={{ 
              minHeight: '200vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'sticky',
              top: '0',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: '1100px',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <motion.div
                style={{ 
                  opacity: headerOpacity,
                  marginBottom: '3rem'
                }}
              >
                <p style={{ 
                  fontSize: '2.5rem', 
                  color: 'var(--gray-light)', 
                  lineHeight: 1.6,
                  fontWeight: 400
                }}>
                  What if you could invest in...
                </p>
              </motion.div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '4rem', width: '100%' }}>
                <motion.div
                  style={{
                    opacity: creator1Opacity,
                    scale: creator1Scale
                  }}
                >
                  <h2 style={{ fontSize: '4rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.2 }}>
                    MrBeast
                  </h2>
                  <p style={{ fontSize: '1.75rem', color: 'var(--gray)' }}>
                    before he hit 1 million subs?
                  </p>
                </motion.div>

                <motion.div
                  style={{
                    opacity: creator2Opacity,
                    scale: creator2Scale
                  }}
                >
                  <h2 style={{ fontSize: '4rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.2 }}>
                    PewDiePie
                  </h2>
                  <p style={{ fontSize: '1.75rem', color: 'var(--gray)' }}>
                    when he was just a gaming kid in Sweden?
                  </p>
                </motion.div>

                <motion.div
                  style={{
                    opacity: creator3Opacity,
                    scale: creator3Scale
                  }}
                >
                  <h2 style={{ fontSize: '4rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.2 }}>
                    Emma Chamberlain
                  </h2>
                  <p style={{ fontSize: '1.75rem', color: 'var(--gray)' }}>
                    before the coffee empire?
                  </p>
                </motion.div>

                <motion.div
                  style={{
                    opacity: creator4Opacity,
                    scale: creator4Scale
                  }}
                >
                  <h2 style={{ fontSize: '4rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.2 }}>
                    Markiplier
                  </h2>
                  <p style={{ fontSize: '1.75rem', color: 'var(--gray)' }}>
                    when he had 5,000 subscribers?
                  </p>
                </motion.div>
              </div>

              <motion.div
                style={{ 
                  opacity: closingOpacity,
                  marginBottom: '3rem'
                }}
              >
                <p style={{ 
                  fontSize: '2rem', 
                  color: 'var(--gray-light)', 
                  marginBottom: '1rem',
                  lineHeight: 1.5,
                  fontWeight: 400
                }}>
                  You can't go back in time.
                </p>
                <p style={{ 
                  fontSize: '2.75rem', 
                  color: 'var(--white)', 
                  fontWeight: 600,
                  lineHeight: 1.4
                }}>
                  But you can spot the next one.
                </p>
              </motion.div>

              <motion.div
                style={{
                  opacity: buttonOpacity,
                  scale: buttonScale
                }}
              >
                <a href="/app" className="btn-primary" style={{ fontSize: '1.25rem', padding: '1.25rem 2.5rem' }}>
                  Explore Creators
                </a>
              </motion.div>
            </div>
          </motion.section>

          <section id="how-it-works" style={{ 
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
                <p style={{ color: 'var(--gray)', lineHeight: 1.6 }}>
                  Find early-stage YouTubers with 1k-50k subscribers using YouTube API data
                </p>
              </div>

              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
                <h3 style={{ marginBottom: '0.75rem' }}>Invest</h3>
                <p style={{ color: 'var(--gray)', lineHeight: 1.6 }}>
                  Buy creator tokens on Solana. Price increases as more people buy (bonding curve)
                </p>
              </div>

              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
                <h3 style={{ marginBottom: '0.75rem' }}>Track</h3>
                <p style={{ color: 'var(--gray)', lineHeight: 1.6 }}>
                  Watch token value grow as creators gain subs. Sell anytime for profit (or loss)
                </p>
              </div>
            </div>
          </section>

          <section id="featured" style={{ 
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
            padding: '0 2rem',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>
              Why YouVest?
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              textAlign: 'left'
            }}>
              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>Spot Talent Early</h3>
                <p style={{ color: 'var(--gray)', lineHeight: 1.6 }}>
                  Get in before they blow up. Tokens are cheapest when creators have &lt;5k subs.
                </p>
              </div>

              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔐</div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>Fair Pricing</h3>
                <p style={{ color: 'var(--gray)', lineHeight: 1.6 }}>
                  Bonding curve = no BS. Price goes up with demand, down with sells. Pure math.
                </p>
              </div>

              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💎</div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>Built on Solana</h3>
                <p style={{ color: 'var(--gray)', lineHeight: 1.6 }}>
                  Fast transactions, low fees (~0.000005 SOL). Your tokens, your wallet, your control.
                </p>
              </div>
            </div>
          </section>

          <section id="faq" style={{ 
            maxWidth: '800px', 
            margin: '6rem auto', 
            padding: '0 2rem'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>
              FAQ
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>How does the bonding curve work?</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  More buyers = higher price. More sellers = lower price. It's automatic - no market manipulation possible.
                </p>
              </div>

              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Can I actually sell my tokens?</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  Yes. Sell back to the bonding curve anytime. Liquidity is built-in.
                </p>
              </div>

              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>What if the creator stops posting?</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  Then your token probably drops in value. This is risky - only invest what you can lose.
                </p>
              </div>

              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Do creators know about this?</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  Not yet. We're pulling public YouTube data. Creators can claim their profile later for rewards.
                </p>
              </div>

              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Is this legal?</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  We're not financial advisors. This is experimental DeFi. DYOR (do your own research).
                </p>
              </div>

              <div className="card-no-hover" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>What's the catch?</h3>
                <p style={{ color: 'var(--gray-light)', lineHeight: 1.6 }}>
                  It's a hackathon project. Bugs exist. Only on devnet for now. Use at your own risk.
                </p>
              </div>
            </div>
          </section>

          <section style={{ 
            maxWidth: '1000px', 
            margin: '6rem auto 2rem', 
            padding: '4rem 2rem',
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
            maxWidth: '1200px', 
            margin: '0 auto', 
            padding: '3rem 2rem',
            textAlign: 'center',
            borderTop: '1px solid var(--border)',
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
