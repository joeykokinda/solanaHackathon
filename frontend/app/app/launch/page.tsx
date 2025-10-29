'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Youtube, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { launchCreatorToken } from '@/lib/launchToken';
import Link from 'next/link';

export default function LaunchToken() {
  const wallet = useWallet();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channelData, setChannelData] = useState<any>(null);
  const [launchResult, setLaunchResult] = useState<any>(null);

  const handleConnectYouTube = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setError('Please connect your Solana wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/launch/auth-url');
      const data = await response.json();
      
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const authWindow = window.open(
        data.authUrl,
        'YouTube Authorization',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      const checkWindow = setInterval(() => {
        try {
          if (authWindow?.closed) {
            clearInterval(checkWindow);
            setLoading(false);
            setError('Authorization cancelled');
          }
        } catch (e) {
        }
      }, 1000);

      window.addEventListener('message', async (event) => {
        if (event.data.type === 'youtube-auth-code') {
          clearInterval(checkWindow);
          authWindow?.close();

          try {
            const verifyResponse = await fetch('http://localhost:3001/api/launch/verify-channel', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                code: event.data.code,
                wallet: wallet.publicKey!.toString()
              })
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.error || 'Failed to verify channel');
            }

            const channelInfo = await verifyResponse.json();
            setError(null); // Clear any previous errors
            setChannelData(channelInfo);
            setStep(2);
          } catch (err: any) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }
      });

    } catch (err: any) {
      setError(err.message || 'Failed to start YouTube authorization');
      setLoading(false);
    }
  };

  const handleLaunchToken = async () => {
    if (!wallet.connected || !channelData) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await launchCreatorToken({
        wallet,
        channelData: {
          youtubeChannelId: channelData.youtubeChannelId,
          channelName: channelData.channelName,
          channelAvatar: channelData.channelAvatar,
          subscribers: channelData.subscribers,
          avgViews: channelData.avgViews,
          videoCount: channelData.videoCount
        }
      });

      setLaunchResult(result);
      setStep(3);
    } catch (err: any) {
      console.error('Launch error:', err);
      setError(err.message || 'Failed to launch token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ marginBottom: '0.75rem', fontSize: '2rem' }}>Launch Your Creator Token</h1>
        <p style={{ fontSize: '1rem', color: 'var(--gray)' }}>
          Turn your YouTube channel into a tradeable asset on Solana
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

      {error && (
        <div style={{ 
          padding: '1rem', 
          marginBottom: '1.5rem', 
          borderRadius: '0.5rem', 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171'
        }}>
          {error}
        </div>
      )}

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
            onClick={handleConnectYouTube}
            disabled={loading || !wallet.connected}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" style={{ display: 'inline-block', marginRight: '0.5rem' }} />
                Connecting...
              </>
            ) : !wallet.connected ? (
              'Connect Wallet First'
            ) : (
              'Connect with YouTube'
            )}
          </button>

          <div style={{ 
            padding: '1.25rem',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '0.5rem',
            textAlign: 'left',
            background: 'rgba(59, 130, 246, 0.05)'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--primary)' }}>
              🎉 Hackathon Demo Mode
            </h4>
            <p style={{ 
              color: 'var(--gray)',
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              margin: 0
            }}>
              Requirements disabled for testing! Any YouTube channel can mint a token during the hackathon. In production, channels need 1,000+ subscribers and 10+ videos.
            </p>
          </div>
        </div>
      )}

      {step === 2 && channelData && (
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
            {channelData.channelAvatar && (
              <img 
                src={channelData.channelAvatar}
                alt=""
                style={{ width: '56px', height: '56px', borderRadius: '50%' }}
              />
            )}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{channelData.channelName}</h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>
                {channelData.subscribers.toLocaleString()} subscribers • {channelData.videoCount} videos
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
                {channelData.avgViews.toLocaleString()}
              </p>
            </div>
            <div className="card-no-hover" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray)', marginBottom: '0.5rem' }}>
                Total Videos
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                {channelData.videoCount}
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
              disabled={loading}
            >
              Back
            </button>
            <button 
              className="btn-primary"
              style={{ flex: 1, padding: '0.875rem 1.5rem', fontSize: '1rem' }}
              onClick={handleLaunchToken}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ display: 'inline-block', marginRight: '0.5rem' }} />
                  Creating Token...
                </>
              ) : (
                'Launch Token'
              )}
            </button>
          </div>
        </div>
      )}

      {step === 3 && launchResult && (
        <div className="card-no-hover" style={{ padding: '2.5rem 2rem', textAlign: 'center' }}>
          <CheckCircle size={56} style={{ color: 'var(--green)', margin: '0 auto 1.25rem', display: 'block' }} />
          <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>Token Launched Successfully!</h2>
          <p style={{ color: 'var(--gray)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Your token is now live and tradeable on YouVest
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
              {launchResult.tokenMint}
            </p>
          </div>

          <div className="card-no-hover" style={{ padding: '1.25rem', marginBottom: '2rem', textAlign: 'left' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray)', marginBottom: '0.5rem' }}>
              Transaction
            </p>
            <a 
              href={`https://explorer.solana.com/tx/${launchResult.signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                fontSize: '0.8125rem', 
                fontFamily: 'monospace', 
                wordBreak: 'break-all',
                color: 'var(--primary)'
              }}
            >
              {launchResult.signature}
            </a>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/app">
              <button className="btn-primary" style={{ padding: '0.875rem 1.75rem' }}>
                View Markets
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
          <strong style={{ color: 'var(--white)' }}>Important:</strong> Launching a token is permanent and creates a real smart contract on Solana. Make sure you understand the risks and responsibilities.
        </div>
      </div>
    </div>
  );
}
