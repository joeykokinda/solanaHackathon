'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { DollarSign, TrendingUp, Percent, ExternalLink, Inbox } from 'lucide-react';
import Link from 'next/link';

const getProxiedImageUrl = (url?: string): string | undefined => {
  if (!url || !url.startsWith('https://yt3.ggpht.com/')) {
    return url;
  }
  return `http://localhost:3001/api/proxy-image?url=${encodeURIComponent(url)}`;
};

export default function Portfolio() {
  const { connected, publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      fetchPortfolio();
    }
  }, [connected, publicKey]);

  const fetchPortfolio = async () => {
    if (!publicKey) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/users/${publicKey.toString()}/portfolio`);
      const data = await response.json();
      
      if (data.holdings) {
        setHoldings(data.holdings);
      }
    } catch (error) {
      setHoldings([]);
    }
  };

  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const totalInvested = holdings.reduce((sum, h) => sum + h.invested, 0);
  const totalPnL = totalValue - totalInvested;
  const totalReturn = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  if (!mounted) {
    return <div className="p-8">Loading...</div>;
  }

  if (!connected) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '6rem auto', 
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <div className="card-no-hover" style={{ padding: '3rem 2rem' }}>
          <h1 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Connect Your Wallet</h1>
          <p style={{ color: 'var(--gray)', marginBottom: '2rem', fontSize: '1rem' }}>
            Connect your wallet to view your portfolio and manage your holdings.
          </p>
          <WalletMultiButton style={{
            margin: '0 auto',
            fontSize: '1rem',
            padding: '0.875rem 2rem'
          }} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Portfolio</h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card-no-hover" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--gray)', marginBottom: '0.5rem' }}>
            Portfolio Value
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
            ${totalValue.toFixed(2)}
          </p>
        </div>

        <div className="card-no-hover" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--gray)', marginBottom: '0.5rem' }}>
            Total Invested
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
            ${totalInvested.toFixed(2)}
          </p>
        </div>

        <div className="card-no-hover" style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--gray)', marginBottom: '0.5rem' }}>
            Total Returns
          </div>
          <p style={{ fontSize: '2rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--green)' }}>
            +{totalReturn.toFixed(1)}%
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--green)' }}>
            +${totalPnL.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="card-no-hover" style={{ marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Holdings</h2>
        </div>
        
        {holdings.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <Inbox size={48} style={{ margin: '0 auto 1rem', color: 'var(--gray)' }} />
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No Holdings Yet</h3>
            <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>
              Start investing in creators to build your portfolio
            </p>
            <Link href="/app">
              <button className="btn-primary">
                Explore Creators
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--gray)', fontWeight: 500 }}>
                    Creator
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--gray)', fontWeight: 500 }}>
                    Amount
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--gray)', fontWeight: 500 }}>
                    Value
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--gray)', fontWeight: 500 }}>
                    P&L
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--gray)', fontWeight: 500 }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <Link href={`/app/creator/${holding.creator.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                        {holding.creator.channelAvatar ? (
                          <img 
                            src={getProxiedImageUrl(holding.creator.channelAvatar)}
                            alt=""
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            backgroundColor: '#444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                          }}>
                            {holding.creator.channelName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{holding.creator.channelName}</div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--gray)' }}>
                            {holding.creator.subscribers.toLocaleString()} subs
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: '0.9375rem' }}>
                      {holding.amount}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 500, fontVariantNumeric: 'tabular-nums', fontSize: '0.9375rem' }}>
                      ${holding.value.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ color: holding.pnl >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 500, fontVariantNumeric: 'tabular-nums', fontSize: '0.9375rem' }}>
                        {holding.pnl >= 0 ? '+' : ''}${holding.pnl.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: holding.pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {holding.pnl >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(1)}%
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <Link href={`/app/creator/${holding.creator.id}`}>
                        <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                          Trade
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card-no-hover" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Transactions</h2>
        </div>
        
        {transactions.length === 0 ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--gray)' }}>No transactions yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--gray)', fontWeight: 500 }}>
                    Date
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--gray)', fontWeight: 500 }}>
                    Type
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--gray)', fontWeight: 500 }}>
                    Creator
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--gray)', fontWeight: 500 }}>
                    Amount
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.875rem', color: 'var(--gray)', fontWeight: 500 }}>
                    SOL
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray)', fontWeight: 500 }}>
                    View
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                      <div>{tx.date}</div>
                      <div style={{ color: 'var(--gray)', fontSize: '0.8125rem' }}>{tx.time}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        border: `1px solid ${tx.type === 'buy' ? 'var(--green)' : 'var(--red)'}`,
                        color: tx.type === 'buy' ? 'var(--green)' : 'var(--red)'
                      }}>
                        {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{tx.creator}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontSize: '0.875rem' }}>
                      {tx.amount} tokens
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 500, fontVariantNumeric: 'tabular-nums', fontSize: '0.875rem' }}>
                      {tx.sol.toFixed(2)} SOL
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <a 
                        href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--gray)', fontSize: '0.875rem' }}
                      >
                        <ExternalLink size={14} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
