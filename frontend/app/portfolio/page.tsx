'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, Percent, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { MOCK_CREATORS } from '@/lib/mockData';

const MOCK_HOLDINGS = [
  {
    creator: MOCK_CREATORS[0],
    amount: 150,
    value: 217.50,
    invested: 175.00,
    pnl: 42.50,
    pnlPercent: 24.3
  },
  {
    creator: MOCK_CREATORS[1],
    amount: 200,
    value: 160.00,
    invested: 130.00,
    pnl: 30.00,
    pnlPercent: 23.1
  },
  {
    creator: MOCK_CREATORS[2],
    amount: 100,
    value: 240.00,
    invested: 180.00,
    pnl: 60.00,
    pnlPercent: 33.3
  }
];

const MOCK_TRANSACTIONS = [
  { date: 'Oct 24, 2025', time: '2:30 PM', type: 'buy', creator: 'TechStartup Daily', amount: 50, sol: 0.75, signature: '5Z7vK2mF6tH8...' },
  { date: 'Oct 23, 2025', time: '4:15 PM', type: 'sell', creator: 'Gaming Underdog', amount: 30, sol: 0.24, signature: '8K9wL3nG7uI9...' },
  { date: 'Oct 22, 2025', time: '11:20 AM', type: 'buy', creator: 'Crypto Explained', amount: 100, sol: 2.40, signature: '9L0xM4oH8vJ0...' },
];

export default function Portfolio() {
  const totalValue = MOCK_HOLDINGS.reduce((sum, h) => sum + h.value, 0);
  const totalInvested = MOCK_HOLDINGS.reduce((sum, h) => sum + h.invested, 0);
  const totalPnL = totalValue - totalInvested;
  const totalReturn = (totalPnL / totalInvested) * 100;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Your Portfolio</h1>

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
              {MOCK_HOLDINGS.map((holding, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Link href={`/creator/${holding.creator.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                      <img 
                        src={holding.creator.channelAvatar}
                        alt=""
                        style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                      />
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
                      +${holding.pnl.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: holding.pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      +{holding.pnlPercent.toFixed(1)}%
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <Link href={`/creator/${holding.creator.id}`}>
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
      </div>

      <div className="card-no-hover" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Transactions</h2>
        </div>
        
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
              {MOCK_TRANSACTIONS.map((tx, i) => (
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
      </div>
    </div>
  );
}
