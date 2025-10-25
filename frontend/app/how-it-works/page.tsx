'use client';

import { Search, TrendingUp, DollarSign, Shield, Zap, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Footer from '@/components/Footer';

const FAQS = [
  {
    q: 'How does pricing work?',
    a: 'Tokens use a bonding curve algorithm. Price increases automatically as more tokens are bought and decreases when tokens are sold. This ensures fair price discovery based on supply and demand.'
  },
  {
    q: 'Is this safe?',
    a: 'Yes! All transactions happen on-chain via Solana smart contracts. Funds are secured by blockchain technology and your wallet remains in your control at all times.'
  },
  {
    q: 'How do I start?',
    a: 'Simply connect your Solana wallet (like Phantom), browse the marketplace, and buy tokens from creators you believe in. You can sell at any time.'
  },
  {
    q: 'What happens to the creator?',
    a: 'Creators receive 20% of their token supply upfront when launching. The remaining 80% is available for public trading on the bonding curve.'
  },
  {
    q: 'Can I lose money?',
    a: 'Yes, like any investment, token prices can go down. Only invest what you can afford to lose. Past performance does not guarantee future results.'
  }
];

export default function HowItWorks() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ marginBottom: '1rem' }}>How YouVest Works</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
            Invest in creators before they go viral. Profit as they grow.
          </p>
        </div>

        <div style={{ position: 'relative', marginBottom: '6rem' }}>
          <div style={{ 
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'var(--border)',
            transform: 'translateX(-50%)'
          }} />

          {[
            {
              icon: Search,
              title: 'Discover',
              description: 'Find talented YouTubers with 1k-10k subscribers before they go viral. Browse metrics like engagement rate, upload frequency, and growth trends.'
            },
            {
              icon: TrendingUp,
              title: 'Invest',
              description: 'Buy creator tokens using SOL. Tokens are priced on a bonding curve—price increases as more people buy. Early investors get the best prices.'
            },
            {
              icon: DollarSign,
              title: 'Profit',
              description: 'Sell your tokens at any time as creators grow. When a creator with 5k subs grows to 500k, early supporters can earn significant returns.'
            }
          ].map((step, i) => (
            <div key={i} style={{ 
              display: 'grid',
              gridTemplateColumns: i % 2 === 0 ? '1fr 80px 1fr' : '1fr 80px 1fr',
              gap: '2rem',
              marginBottom: '3rem',
              alignItems: 'center'
            }}>
              {i % 2 === 0 && (
                <>
                  <div className="card-no-hover" style={{ padding: '2rem', textAlign: 'right' }}>
                    <h3 style={{ marginBottom: '0.75rem' }}>{step.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {step.description}
                    </p>
                  </div>
                  <div style={{ 
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    zIndex: 1,
                    position: 'relative',
                    margin: '0 auto',
                    border: '4px solid var(--background)'
                  }}>
                    {i + 1}
                  </div>
                  <div />
                </>
              )}
              {i % 2 === 1 && (
                <>
                  <div />
                  <div style={{ 
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    zIndex: 1,
                    position: 'relative',
                    margin: '0 auto',
                    border: '4px solid var(--background)'
                  }}>
                    {i + 1}
                  </div>
                  <div className="card-no-hover" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '0.75rem' }}>{step.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {step.description}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Why YouVest?</h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
              The future of creator investment
            </p>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            <div className="card-no-hover" style={{ padding: '2rem' }}>
              <Shield size={40} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Secure & Transparent</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                All transactions are on-chain and verifiable. No hidden fees or middlemen.
              </p>
            </div>
            <div className="card-no-hover" style={{ padding: '2rem' }}>
              <Zap size={40} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Fast & Cheap</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Built on Solana for instant transactions with minimal fees. Trade in seconds, not minutes.
              </p>
            </div>
            <div className="card-no-hover" style={{ padding: '2rem' }}>
              <TrendingUp size={40} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Early Access</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Invest in creators before they blow up. Early supporters get the best prices and biggest returns.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="card-no-hover" style={{ overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>{faq.q}</span>
                  <ChevronDown 
                    size={20} 
                    style={{ 
                      transition: 'transform 200ms ease',
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} 
                  />
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.5rem 1.5rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card-no-hover" style={{ 
          padding: '4rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(10, 14, 39, 1) 100%)'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Ready to get started?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.125rem' }}>
            Start investing in creators today
          </p>
          <Link href="/marketplace">
            <button className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Explore Creators
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}

