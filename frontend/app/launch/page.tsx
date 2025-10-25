'use client';

import { useState } from 'react';
import { Youtube, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LaunchToken() {
  const [step, setStep] = useState(1);

  const mockChannelData = {
    name: 'TechStartup Daily',
    avatar: 'https://yt3.ggpht.com/ytc/AIdro_l7JGPKu6JRzE9qk-3qX6',
    subscribers: 8500,
    videos: 156,
    avgViews: 25000
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ marginBottom: '0.75rem', fontSize: '2rem' }}>Launch Your Creator Token</h1>
        <p style={{ fontSize: '1rem', color: 'var(--gray)' }}>
          Turn your YouTube channel into a tradeable asset
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginBottom: '2.5rem',
        gap: '0.75rem',
        alignItems: 'center'
      }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: step >= s ? '2px solid var(--white)' : '2px solid var(--border)',
              background: step >= s ? 'var(--white)' : 'transparent',
              color: step >= s ? 'var(--black)' : 'var(--gray)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}>
              {s}
            </div>
            {s < 3 && (
              <div style={{
                width: '48px',
                height: '2px',
                background: step > s ? 'var(--white)' : 'var(--border)'
              }} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card-no-hover" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <Youtube size={56} style={{ color: 'var(--white)', margin: '0 auto 1.25rem', display: 'block' }} />
          <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>Step 1: Verify Your Channel</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Connect your YouTube account to verify ownership and import your channel data
          </p>

          <button 
            className="btn-primary" 
            style={{ padding: '0.875rem 2rem', fontSize: '1rem', marginBottom: '2rem' }}
            onClick={() => setStep(2)}
          >
            Connect with YouTube
          </button>

          <div style={{ 
            padding: '1.25rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            textAlign: 'left'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>
              Requirements:
            </h4>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0, 
              color: 'var(--gray)',
              fontSize: '0.875rem',
              lineHeight: 1.8
            }}>
              <li style={{ paddingLeft: '1.25rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                1,000+ subscribers
              </li>
              <li style={{ paddingLeft: '1.25rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Active channel (10+ videos)
              </li>
              <li style={{ paddingLeft: '1.25rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                Regular upload schedule
              </li>
            </ul>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card-no-hover" style={{ padding: '2.5rem 2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.5rem' }}>Step 2: Confirm Your Details</h2>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            padding: '1.25rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <img 
              src={mockChannelData.avatar}
              alt=""
              style={{ width: '56px', height: '56px', borderRadius: '50%' }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{mockChannelData.name}</h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>
                {mockChannelData.subscribers.toLocaleString()} subscribers • {mockChannelData.videos} videos
              </p>
            </div>
            <CheckCircle size={24} style={{ color: 'var(--green)' }} />
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div className="card-no-hover" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray)', marginBottom: '0.5rem' }}>
                Average Views
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                {mockChannelData.avgViews.toLocaleString()}
              </p>
            </div>
            <div className="card-no-hover" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray)', marginBottom: '0.5rem' }}>
                Total Videos
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                {mockChannelData.videos}
              </p>
            </div>
          </div>

          <div style={{ 
            padding: '1.25rem',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
              Token Distribution
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--gray)', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Initial Supply:</span>
                <span style={{ fontWeight: 600, color: 'var(--white)' }}>100,000,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>You Receive (20%):</span>
                <span style={{ fontWeight: 600, color: 'var(--green)' }}>20,000,000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>For Public Sale (80%):</span>
                <span style={{ fontWeight: 600, color: 'var(--white)' }}>80,000,000</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn"
              style={{ flex: 1 }}
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button 
              className="btn-primary"
              style={{ flex: 1, padding: '0.875rem 1.5rem', fontSize: '1rem' }}
              onClick={() => setStep(3)}
            >
              Launch Token
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card-no-hover" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <CheckCircle size={56} style={{ color: 'var(--green)', margin: '0 auto 1.25rem', display: 'block' }} />
          <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>Token Launched Successfully!</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Your token is now live and tradeable
          </p>

          <div className="card-no-hover" style={{ padding: '1.25rem', marginBottom: '2rem', textAlign: 'left' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray)', marginBottom: '0.5rem' }}>
              Token Address
            </p>
            <p style={{ 
              fontSize: '0.8125rem', 
              fontFamily: 'monospace', 
              wordBreak: 'break-all',
              color: 'var(--white)'
            }}>
              5Z7vK2mF6tH8nP4wN9bRxYqP3gLtE8dU7sC1wA6hF9pM
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/creator/mock-1">
              <button className="btn-primary" style={{ padding: '0.875rem 1.75rem' }}>
                View Your Profile
              </button>
            </Link>
            <button className="btn" style={{ padding: '0.875rem 1.75rem' }}>
              Share on Twitter
            </button>
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '1.5rem',
        padding: '1rem',
        border: '1px solid rgba(255, 0, 0, 0.3)',
        borderRadius: '0.5rem',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'flex-start',
        fontSize: '0.875rem'
      }}>
        <AlertCircle size={18} style={{ color: 'var(--red)', flexShrink: 0, marginTop: '0.125rem' }} />
        <div style={{ color: 'var(--gray)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--white)' }}>Important:</strong> Launching a token is permanent. Make sure you understand the risks and responsibilities.
        </div>
      </div>
    </div>
  );
}
