'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 80;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <>
      <style jsx global>{`
        .wallet-adapter-button {
          background: linear-gradient(135deg, #9945FF 0%, #14F195 100%) !important;
          padding: 6px 14px !important;
          height: auto !important;
          max-height: 36px !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          border-radius: 8px !important;
          line-height: 1.4 !important;
        }
        .wallet-adapter-button:hover {
          background: linear-gradient(135deg, #8835EE 0%, #13E085 100%) !important;
        }
      `}</style>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <motion.nav
          className="w-full bg-black/90 backdrop-blur-md border border-gray-600 pointer-events-auto"
          initial={false}
          animate={{
            width: scrolled ? '900px' : '100%',
            borderRadius: scrolled ? '9999px' : '0px',
            marginTop: scrolled ? '20px' : '0px',
            paddingLeft: scrolled ? '24px' : '48px',
            paddingRight: scrolled ? '24px' : '48px',
            paddingTop: scrolled ? '12px' : '16px',
            paddingBottom: scrolled ? '12px' : '16px',
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0.0, 0.2, 1],
          }}
        >
          <div className="flex items-center justify-between relative">
            <a href="/" className="flex items-center gap-2 text-white text-xl font-bold z-10">
              <span>YouVest</span>
            </a>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 text-sm">
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#featured" className="text-gray-300 hover:text-white transition-colors">
                Creators
              </a>
              <a href="#faq" className="text-gray-300 hover:text-white transition-colors">
                FAQ
              </a>
            </div>

            <div className="shrink-0 z-10">
              <WalletMultiButton />
            </div>
          </div>
        </motion.nav>
      </div>
    </>
  );
}

