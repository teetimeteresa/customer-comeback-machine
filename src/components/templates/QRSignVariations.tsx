import React from 'react';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { Sparkles, Heart, Star, ShoppingBag, Crown, Zap } from 'lucide-react';

interface QRSignProps {
  businessName: string;
  businessType: string;
  url: string;
  logoUrl?: string;
}

/**
 * Modern Minimalist Variation
 * Focus on whitespace, clean lines, and professional typography.
 */
export const ModernMinimalistSign: React.FC<QRSignProps> = ({ businessName, businessType, url }) => {
  return (
    <div className="w-[8.5in] h-[11in] bg-white p-16 flex flex-col items-center justify-between border border-slate-200 shadow-sm mx-auto">
      <div className="w-full text-left">
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-2">
          {businessName}
        </h1>
        <p className="text-xl text-amber-500 font-bold uppercase tracking-[0.3em]">
          {businessType}
        </p>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center w-full">
        <div className="mb-12 p-4 bg-white border border-slate-100 shadow-xl rounded-sm">
          <QRCodeDisplay url={url} size={450} />
        </div>
        
        <div className="text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-6">
            Scan to Join the List
          </h2>
          <div className="h-1 w-24 bg-slate-900 mx-auto mb-8"></div>
          <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
            Stay updated with our latest news and receive exclusive offers directly to your inbox.
          </p>
        </div>
      </div>

      <div className="w-full flex justify-between items-end border-t border-slate-100 pt-8">
        <div className="text-xs font-black uppercase tracking-widest text-slate-300">
          Support Your Local {businessType}
        </div>
        <div className="flex gap-4">
          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
            <Zap size={16} />
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
            <Heart size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Rustic Warmth Variation
 * Uses warm tones, softer shapes, and a cozy aesthetic.
 */
export const RusticWarmthSign: React.FC<QRSignProps> = ({ businessName, businessType, url }) => {
  return (
    <div className="w-[8.5in] h-[11in] bg-[#fdfaf7] p-12 flex flex-col items-center justify-between border-[12px] border-[#e7d9c9] rounded-[4rem] shadow-xl mx-auto">
      <div className="text-center">
        <div className="flex justify-center mb-4 text-[#8b6e4e]">
          <Heart size={48} fill="#8b6e4e" opacity={0.2} />
        </div>
        <h1 className="text-5xl font-serif font-black text-[#5d4037] mb-2 italic">
          {businessName}
        </h1>
        <p className="text-lg text-[#8b6e4e] font-bold uppercase tracking-[0.15em]">
          Hand-picked for you
        </p>
      </div>

      <div className="bg-white p-10 rounded-[3.5rem] shadow-inner border-2 border-[#f3e5d8]">
        <QRCodeDisplay url={url} size={420} />
      </div>

      <div className="text-center max-w-xl">
        <h2 className="text-4xl font-serif font-black text-[#5d4037] mb-4">
          Let's Stay in Touch!
        </h2>
        <p className="text-2xl text-[#8b6e4e] leading-relaxed italic">
          Join our local family to receive thank-you treats and birthday surprises.
        </p>
      </div>

      <div className="flex gap-12 text-[#8b6e4e]/60 font-black uppercase tracking-widest text-xs">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#8b6e4e]" />
          <span>Shop Small</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#8b6e4e]" />
          <span>Stay Local</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#8b6e4e]" />
          <span>Thank You</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Luxury Gold Variation
 * High contrast, dark mode, and elegant gold-amber accents.
 */
export const LuxuryGoldSign: React.FC<QRSignProps> = ({ businessName, businessType, url }) => {
  return (
    <div className="w-[8.5in] h-[11in] bg-slate-900 p-0 flex flex-col items-center justify-between border-[2px] border-amber-400/30 shadow-2xl mx-auto overflow-hidden">
      {/* Gold Header Accent */}
      <div className="w-full h-3 bg-gradient-to-r from-amber-200 via-amber-500 to-amber-200"></div>
      
      <div className="pt-20 pb-10 w-full text-center px-12">
        <div className="flex justify-center mb-8">
          <div className="h-24 w-24 rounded-full border-2 border-amber-400/50 flex items-center justify-center p-2">
            <div className="h-full w-full rounded-full bg-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)]">
              <Crown className="text-slate-900" size={40} />
            </div>
          </div>
        </div>
        <h1 className="text-6xl font-black text-white tracking-tight mb-3">
          {businessName}
        </h1>
        <p className="text-xl text-amber-400 font-black uppercase tracking-[0.5em] opacity-80">
          VIP ACCESS ONLY
        </p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-4 bg-amber-500/20 rounded-[3rem] blur-2xl group-hover:bg-amber-500/30 transition-all"></div>
        <div className="relative p-10 bg-slate-800 rounded-[3rem] border border-amber-400/30">
          <QRCodeDisplay url={url} size={400} />
        </div>
      </div>

      <div className="text-center px-16 pb-20">
        <h2 className="text-3xl font-black text-white mb-6">
          Experience the Exceptional
        </h2>
        <p className="text-xl text-slate-400 leading-relaxed font-medium">
          Scan to join our inner circle and enjoy priority access to new collections and private events.
        </p>
      </div>

      {/* Gold Footer Accent */}
      <div className="w-full py-4 bg-slate-800 border-t border-amber-400/20 text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.8em] text-amber-500/60">
          ESTABLISHED SERVICE • QUALITY GUARANTEED
        </span>
      </div>
    </div>
  );
};
