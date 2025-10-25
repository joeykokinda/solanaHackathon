'use client';

import { useState } from 'react';
import { Youtube, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function LaunchToken() {
  const [step, setStep] = useState(1);
  const [channelConnected, setChannelConnected] = useState(false);

  const mockChannelData = {
    name: 'TechStartup Daily',
    avatar: 'https://yt3.ggpht.com/ytc/AIdro_l7JGPKu6JRzE9qk-3qX6',
    subscribers: 8500,
    videos: 156,
    avgViews: 25000
  };

  return (
    <>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ marginBottom: '1rem' }}>Launch Your Creator Token</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
            Turn your YouTube channel into a tradeable asset
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          marginBottom: '3rem',
          gap: '1rem'
        }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step >= s ? 'var(--primary)' : 'var(--surface)',
                border: step >= s ? 'none' : '2px solid var(--border)',
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
                  width: '60px',
                  height: '2px',
                  background: step > s ? 'var(--primary)' : 'var(--border)'
                }} />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="card-no-hover" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <Youtube size={64} style={{ color: 'var(--primary)', margin: '0 auto 1.5rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>Step 1: Verify Your Channel</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Connect your YouTube account to verify ownership and import your channel data
            </p>

            <button 
              className="btn-primary" 
              style={{ padding: '1rem 2rem', fontSize: '1.125rem', marginBottom: '2rem' }}
              onClick={() => {
                setChannelConnected(true);
                setTimeout(() => setStep(2), 1000);
              }}
            >
              Connect with YouTube
            </button>

            <div style={{ 
              padding: '1.5rem',
              background: 'rgba(79, 70, 229, 0.1)',
              borderRadius: '0.5rem',
              textAlign: 'left'
            }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                Requirements:
              </h4>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0, 
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                lineHeight: 1.8
              }}>
                <li style={{ paddingLeft: '1.5rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  1,000+ subscribers
                </li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Active channel (10+ videos)
                </li>
                <li style={{ paddingLeft: '1.5rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0 }}>•</span>
                  Regular upload schedule
                </li>
              </ul>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card-no-hover" style={{ padding: '3rem 2rem' }}>
            <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Step 2: Confirm Your Details</h2>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1.5rem',
              background: 'var(--surface)',
              borderRadius: '0.5rem',
              marginBottom: '2rem'
            }}>
              <img 
                src={mockChannelData.avatar}
                alt=""
                style={{ width: '64px', height: '64px', borderRadius: '50%' }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{mockChannelData.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {mockChannelData.subscribers.toLocaleString()} subscribers • {mockChannelData.videos} videos
                </p>
              </div>
              <CheckCircle size={24} style={{ color: 'var(--success)' }} />
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div className="card-no-hover" style={{ padding: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Average Views
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {mockChannelData.avgViews.toLocaleString()}
                </p>
              </div>
              <div className="card-no-hover" style={{ padding: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Total Videos
                </p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {mockChannelData.videos}
                </p>
              </div>
            </div>

            <div style={{ 
              padding: '1.5rem',
              background: 'rgba(79, 70, 229, 0.1)',
              borderRadius: '0.5rem',
              marginBottom: '2rem'
            }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
                Token Distribution
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Initial Token Supply:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>100,000,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>You Receive (20%):</span>
                  <span style={{ fontWeight: 600, color: 'var(--success)' }}>20,000,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>For Public Sale (80%):</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>80,000,000</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button 
                className="btn-primary"
                style={{ flex: 1, padding: '1rem 2rem', fontSize: '1.125rem' }}
                onClick={() => setStep(3)}
              >
                Launch Token
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card-no-hover" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <CheckCircle size={64} style={{ color: 'var(--success)', margin: '0 auto 1.5rem' }} />
            <h2 style={{ marginBottom: '1rem', color: 'var(--success)' }}>Token Launched Successfully!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Your token is now live and tradeable. Share with your audience to drive demand!
            </p>

            <div className="card-no-hover" style={{ padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Token Address
              </p>
              <p style={{ 
                fontSize: '0.875rem', 
                fontFamily: 'monospace', 
                wordBreak: 'break-all',
                background: 'var(--surface)',
                padding: '0.75rem',
                borderRadius: '0.375rem'
              }}>
                5Z7vK2mF6tH8nP4wN9bRxYqP3gLtE8dU7sC1wA6hF9pM
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/creator/mock-1">
                <button className="btn-primary" style={{ padding: '1rem 2rem' }}>
                  View Your Profile
                </button>
              </Link>
              <button className="btn-secondary" style={{ padding: '1rem 2rem' }}>
                Share on Twitter
              </button>
            </div>
          </div>
        )}

        <div className="card-no-hover" style={{ 
          padding: '1.5rem',
          marginTop: '2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <AlertCircle size={20} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '0.125rem' }} />
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Important:</strong> Launching a token is permanent. Make sure you understand the risks and responsibilities. Your token will be publicly tradeable and subject to market forces.
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

