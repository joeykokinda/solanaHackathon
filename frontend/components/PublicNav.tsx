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
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.nav
        className="w-full bg-black/90 backdrop-blur-md border border-white/10 pointer-events-auto"
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
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-white text-xl font-bold">
            <span>YouVest</span>
          </a>

          <div className="flex-1"></div>

          <div className="shrink-0">
            <WalletMultiButton />
          </div>
        </div>
      </motion.nav>
    </div>
  );
}

