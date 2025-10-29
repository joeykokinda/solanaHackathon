'use client';

import { useParams, useRouter } from 'next/navigation';
import { API_URL } from '@/lib/config';
import { TrendingUp, TrendingDown, Users, Activity, Eye, Video, Play, MessageCircle, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { buyTokens, sellTokens, getTokensFromSolBuy, getTokensFromSolSell, getUserTokenBalance, getActualSellReturn } from '@/lib/solana';
const getProxiedImageUrl = (url?: string): string | undefined => {
  if (!url || !url.startsWith('https://yt3.ggpht.com/')) {
    return url;
  }
  return `${API_URL}/api/proxy-image?url=${encodeURIComponent(url)}`;
};
export default function CreatorProfile() {
  const params = useParams();
  const router = useRouter();
  const wallet = useWallet();
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [estimatedTokens, setEstimatedTokens] = useState<number>(0);
  const [userBalance, setUserBalance] = useState<number>(0);
  const fetchCreator = async () => {
    try {
      const response = await fetch(`${API_URL}/api/creators/${params.id}`);
      if (!response.ok) {
        router.push('/app');
        return;
      }
      const data = await response.json();
      setCreator(data);
    } catch (error) {
      console.error('Error fetching creator:', error);
      router.push('/app');
    } finally {
      setLoading(false);
    }
  };
  const fetchUserBalance = async () => {
    if (!wallet.publicKey || !creator) return;
      const balance = await getUserTokenBalance(wallet.publicKey.toString(), creator.tokenAddress);
      setUserBalance(balance);
      console.error('Error fetching balance:', error);
      setUserBalance(0);
  useEffect(() => {
    fetchCreator();
  }, [params.id, router]);
    if (creator && wallet.publicKey) {
      fetchUserBalance();
  }, [creator, wallet.publicKey]);
    const timeoutId = setTimeout(async () => {
      if (!amount || !creator) {
        setEstimatedTokens(0);
      const solAmount = parseFloat(amount);
      if (solAmount <= 0 || isNaN(solAmount)) {
      
      try {
        if (activeTab === 'buy') {
          const tokens = await getTokensFromSolBuy(creator.tokenAddress, solAmount);
          setEstimatedTokens(tokens);
        } else {
          const tokens = await getTokensFromSolSell(creator.tokenAddress, solAmount);
        }
      } catch (err) {
        console.error('Error fetching estimated tokens:', err);
        setEstimatedTokens(Math.floor(solAmount / creator.priceSOL));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [amount, creator, activeTab]);
  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  if (!creator) {
    return null;
  
  const isPositive = creator.priceChange24h >= 0;
  const handleMax = async () => {
    if (!wallet.publicKey || !creator || userBalance <= 0) return;
    
      const solValue = await getActualSellReturn(creator.tokenAddress, userBalance);
      setAmount(solValue.toFixed(6));
      console.error('Error calculating max:', error);
      setAmount((userBalance * creator.priceSOL).toFixed(6));
  const handleTrade = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setError('Please connect your wallet first');
      return;
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid SOL amount');
    if (activeTab === 'buy' && (!estimatedTokens || estimatedTokens < 0.001)) {
      setError('Amount too small. Try a larger amount.');
    if (activeTab === 'sell' && (!estimatedTokens || estimatedTokens <= 0)) {
      setError('No tokens to sell or amount too small');
    setProcessing(true);
    setError(null);
    setSuccess(null);
      let signature: string;
      if (activeTab === 'buy') {
        signature = await buyTokens(wallet, creator.tokenAddress, estimatedTokens, 0);
        setSuccess(`✅ Bought ${estimatedTokens.toLocaleString(undefined, { maximumFractionDigits: 2 })} tokens for ${solAmount} SOL! Tx: ${signature.slice(0, 8)}...`);
      } else {
        signature = await sellTokens(wallet, creator.tokenAddress, estimatedTokens, 0);
        setSuccess(`✅ Sold ${estimatedTokens.toLocaleString(undefined, { maximumFractionDigits: 2 })} tokens for ${solAmount} SOL! Tx: ${signature.slice(0, 8)}...`);
      setAmount('');
      setEstimatedTokens(0);
      setTimeout(() => {
        fetchCreator();
        fetchUserBalance();
      }, 2000);
    } catch (err: any) {
      console.error('Transaction error:', err);
      if (err.message && err.message.includes('already been processed')) {
        setSuccess(`✅ Transaction completed! Check your wallet.`);
        setTimeout(() => {
          fetchCreator();
          fetchUserBalance();
        }, 1000);
        setError(err.message || 'Transaction failed. Please try again.');
      setProcessing(false);
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div className="card-no-hover" style={{ 
        marginBottom: '2rem',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          height: '200px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative'
        }}>
          {creator.channelAvatar && (
            <img 
              src={getProxiedImageUrl(creator.channelAvatar)}
              alt=""
              style={{ 
                position: 'absolute',
                bottom: '-48px',
                left: '2rem',
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                border: '4px solid var(--background)',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
            />
          )}
        </div>
        <div style={{ padding: '4rem 2rem 2rem' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>{creator.channelName}</h1>
          <div style={{ 
            display: 'flex', 
            gap: '1rem',
            alignItems: 'center',
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem'
          }}>
            <span>{creator.subscribers.toLocaleString()} subscribers</span>
            <span>•</span>
            <span>{creator.avgViews.toLocaleString()} avg views</span>
            <a 
              href={`https://youtube.com/channel/${creator.youtubeChannelId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)' }}
            >
              View Channel <ExternalLink size={16} />
            </a>
          </div>
      </div>
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div>
          <div className="card-no-hover" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Token Price
                </p>
                <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontVariantNumeric: 'tabular-nums' }}>
                  {creator.priceSOL.toFixed(8)} SOL
                </h2>
                <p style={{ 
                  color: isPositive ? 'var(--success)' : 'var(--danger)',
                  fontSize: '1.125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  {isPositive ? '+' : ''}{creator.priceChange24h.toFixed(2)}% (24h)
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Market Cap</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {creator.marketCap.toFixed(1)} SOL
            </div>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border)'
            }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Volume (24h)
                <p style={{ fontSize: '1.125rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {creator.volume24h.toFixed(2)} SOL
                  Holders
                  {creator.holders}
                  Engagement
                  {(creator.engagementScore * 100).toFixed(1)}%
            <h3 style={{ marginBottom: '1.5rem' }}>Channel Metrics</h3>
              gap: '1.5rem'
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Users size={20} style={{ color: 'var(--text-secondary)' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Subscribers</p>
                </div>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                  {creator.subscribers.toLocaleString()}
                  <Eye size={20} style={{ color: 'var(--text-secondary)' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Avg Views</p>
                  {creator.avgViews.toLocaleString()}
          {creator.recentVideos && creator.recentVideos.length > 0 && (
            <div className="card-no-hover" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Recent Videos</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {creator.recentVideos.map((video) => (
                  <div key={video.id} style={{ cursor: 'pointer' }}>
                    <div style={{ 
                      aspectRatio: '16/9',
                      borderRadius: '0.5rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      marginBottom: '0.75rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.3)'
                      }}>
                        <Play size={48} fill="white" color="white" style={{ opacity: 0.9 }} />
                      </div>
                    </div>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', lineHeight: 1.4 }}>
                      {video.title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {video.views.toLocaleString()} views • {video.uploadedAt}
                    </p>
                  </div>
                ))}
        <div style={{ position: 'sticky', top: '100px', alignSelf: 'flex-start' }}>
          <div className="card-no-hover" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              marginBottom: '1.5rem'
              <button
                onClick={() => setActiveTab('buy')}
                style={{
                  padding: '0.75rem',
                  border: activeTab === 'buy' ? 'none' : '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeTab === 'buy' ? '#10b981' : 'transparent',
                  color: activeTab === 'buy' ? 'white' : '#10b981',
                  transition: 'all 150ms ease'
                }}
              >
                Buy
              </button>
                onClick={() => setActiveTab('sell')}
                  border: activeTab === 'sell' ? 'none' : '1px solid rgba(239, 68, 68, 0.3)',
                  background: activeTab === 'sell' ? '#ef4444' : 'transparent',
                  color: activeTab === 'sell' ? 'white' : '#ef4444',
                Sell
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Amount (SOL)
                </label>
                {activeTab === 'sell' && userBalance > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Balance: {userBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={handleMax}
                      style={{
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: '1px solid #ef4444',
                        background: 'transparent',
                        color: '#ef4444',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
                    >
                      MAX
                    </button>
                )}
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.01"
                step="0.001"
                className="input"
                style={{ fontSize: '1.125rem', fontWeight: 600 }}
              />
            {amount && parseFloat(amount) > 0 && (
              <div className="card-no-hover" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    You {activeTab === 'buy' ? 'Get' : 'Need'}:
                  </span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: '1.125rem', color: 'var(--primary)' }}>
                    {estimatedTokens > 0 ? `${estimatedTokens.toLocaleString(undefined, { maximumFractionDigits: 2 })} tokens` : 'Calculating...'}
                    Price:
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {creator.priceSOL.toFixed(8)} SOL/token
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Slippage:
                  <span style={{ fontWeight: 600 }}>~10%</span>
            )}
            {error && (
              <div style={{ 
                padding: '1rem', 
                marginBottom: '1rem', 
                borderRadius: '0.5rem', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171'
              }}>
                {error}
            {success && (
                background: 'rgba(16, 185, 129, 0.1)', 
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10b981'
                {success}
            <button 
                width: '100%', 
                fontSize: '1rem',
                fontWeight: 600,
                border: 'none',
                borderRadius: '0.5rem',
                cursor: (!amount || parseFloat(amount) <= 0 || processing || !wallet.connected) ? 'not-allowed' : 'pointer',
                background: (!amount || parseFloat(amount) <= 0 || processing || !wallet.connected) 
                  ? '#444' 
                  : (activeTab === 'buy' ? '#10b981' : '#ef4444'),
                color: 'white',
                opacity: (!amount || parseFloat(amount) <= 0 || processing || !wallet.connected) ? 0.5 : 1,
                transition: 'all 150ms ease'
              disabled={!amount || parseFloat(amount) <= 0 || processing || !wallet.connected}
              onClick={handleTrade}
              {processing ? 'Processing...' : !wallet.connected ? 'Connect Wallet' : `${activeTab === 'buy' ? 'Buy' : 'Sell'} ${creator.channelName.split(' ')[0]} Tokens`}
            </button>
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Market Stats</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Volume (24h):</span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{creator.volume24h.toFixed(2)} SOL</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Holders:</span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{creator.holders}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Market Cap:</span>
                  <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{creator.marketCap.toFixed(1)} SOL</span>
          {creator.recentTrades && creator.recentTrades.length > 0 && (
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Trades</h4>
                {creator.recentTrades.map((trade, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ 
                        display: 'inline-block',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '0.25rem',
                        background: trade.type === 'buy' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: trade.type === 'buy' ? 'var(--success)' : 'var(--danger)',
                        marginRight: '0.5rem'
                        {trade.type.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.875rem' }}>{trade.amount} tokens</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                        {trade.price.toFixed(8)} SOL
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        {trade.time}
          <div className="card-no-hover" style={{ padding: '1rem', marginTop: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Token Address
            </p>
            <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', wordBreak: 'break-all', color: 'var(--text-primary)' }}>
              {creator.tokenAddress}
    </div>
  );
}
