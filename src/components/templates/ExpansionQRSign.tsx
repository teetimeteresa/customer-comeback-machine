'use client';

import React from 'react';
import { Sparkles, Heart, Star, PawPrint, Car, Coffee, Cake, Flower2 } from 'lucide-react';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';

export type ExpansionNicheId = 'pet-grooming' | 'auto-detailing' | 'boutique-coffee' | 'artisan-bakery' | 'yoga-pilates';

export interface ExpansionNiche {
  id: ExpansionNicheId;
  name: string;
  bizName: string;
  tagline: string;
  hook: string;
  valueProp: string;
  color: string;
  icon: React.ReactNode;
  url: string;
}

export const expansionNiches: ExpansionNiche[] = [
  {
    id: 'pet-grooming',
    name: 'Pet Grooming',
    bizName: 'Paw-fect Styles',
    tagline: 'Professional Pet Stylists',
    hook: 'Join the Grooming Club!',
    valueProp: 'Scan to get a "Clean Pup" treat and automated reminders for your next refresh.',
    color: 'from-teal-500 to-emerald-600',
    icon: <PawPrint size={64} className="text-white" />,
    url: 'https://customercomebackmachine.com/welcome/pet-grooming'
  },
  {
    id: 'auto-detailing',
    name: 'Auto Detailing',
    bizName: 'Gloss & Gleam',
    tagline: 'Showroom Quality Detailing',
    hook: 'Keep Your Car Showroom Ready',
    valueProp: 'Scan to lock in seasonal detailing alerts and earn credits toward your next ceramic coating.',
    color: 'from-blue-600 to-indigo-700',
    icon: <Car size={64} className="text-white" />,
    url: 'https://customercomebackmachine.com/welcome/auto-detailing'
  },
  {
    id: 'boutique-coffee',
    name: 'Boutique Coffee',
    bizName: 'The Daily Grind',
    tagline: 'Craft Coffee & Community',
    hook: 'Skip the Line & Earn a Treat',
    valueProp: 'Scan to join our loyalty circle. Get your 10th cup on us and exclusive fresh roast alerts.',
    color: 'from-orange-700 to-amber-900',
    icon: <Coffee size={64} className="text-white" />,
    url: 'https://customercomebackmachine.com/welcome/boutique-coffee'
  },
  {
    id: 'artisan-bakery',
    name: 'Artisan Bakery',
    bizName: 'Golden Crust',
    tagline: 'Hand-Crafted Daily',
    hook: 'Join Our Birthday Club',
    valueProp: 'Scan for a free croissant today! We will also send you a special treat on your birthday.',
    color: 'from-rose-400 to-pink-600',
    icon: <Cake size={64} className="text-white" />,
    url: 'https://customercomebackmachine.com/welcome/artisan-bakery'
  },
  {
    id: 'yoga-pilates',
    name: 'Yoga & Pilates',
    bizName: 'Soul Flow Studio',
    tagline: 'Find Your Flow Studio',
    hook: 'Your Wellness Journey Starts Here',
    valueProp: 'Scan to get a special intro class offer and stay updated on new class styles and workshops.',
    color: 'from-purple-400 to-indigo-500',
    icon: <Flower2 size={64} className="text-white" />,
    url: 'https://customercomebackmachine.com/welcome/yoga-pilates'
  }
];

interface ExpansionQRSignProps {
  niche: ExpansionNiche;
}

export const ExpansionQRSign: React.FC<ExpansionQRSignProps> = ({ niche }) => {
  return (
    <div id={`qr-sign-${niche.id}`} className="w-[8.5in] h-[11in] bg-white p-12 flex flex-col items-center justify-between border-[16px] border-amber-500 shadow-2xl mx-auto print:shadow-none mb-20 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div className="w-full text-center relative z-10">
        <div className="flex justify-center mb-6">
          <div className={`h-24 w-24 rounded-3xl bg-gradient-to-br ${niche.color} flex items-center justify-center shadow-xl rotate-3`}>
            {niche.icon}
          </div>
        </div>
        <h1 className="text-6xl font-black text-slate-900 tracking-tight mb-2 uppercase">
          {niche.bizName}
        </h1>
        <p className="text-2xl text-slate-500 font-bold uppercase tracking-[0.3em]">
          {niche.tagline}
        </p>
      </div>

      <div className="flex flex-col items-center flex-grow justify-center py-8 relative z-10 w-full">
        <div className="relative mb-10">
          <div className="absolute -top-10 -left-10 text-amber-400 animate-pulse">
            <Sparkles size={60} />
          </div>
          <div className="absolute -bottom-10 -right-10 text-rose-400 animate-pulse delay-75">
            <Sparkles size={60} />
          </div>
          <div className="p-10 bg-white rounded-[4rem] border-8 border-slate-50 shadow-2xl relative">
             <QRCodeDisplay url={niche.url} size={300} />
          </div>
        </div>
        
        <div className="text-center max-w-2xl px-4">
          <h2 className={`text-5xl font-black mb-6 bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent leading-tight`}>
            {niche.hook}
          </h2>
          <div className="h-2 w-32 bg-gradient-to-r from-amber-500 to-rose-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-3xl text-slate-700 font-semibold leading-snug italic">
            {niche.valueProp}
          </p>
        </div>
      </div>

      <div className="w-full border-t-4 border-slate-50 pt-10 flex justify-center gap-12 text-slate-400 relative z-10">
        <div className="flex items-center gap-3">
          <Heart className="text-rose-500" fill="currentColor" fillOpacity={0.2} />
          <span className="font-black uppercase tracking-wider">Support Local</span>
        </div>
        <div className="flex items-center gap-3">
          <Star className="text-amber-500" fill="currentColor" fillOpacity={0.2} />
          <span className="font-black uppercase tracking-wider">Leave a Review</span>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col items-center gap-2 relative z-10">
        <div className="text-slate-300 text-xs font-black uppercase tracking-[0.5em]">
          Powered by Customer Comeback Machine
        </div>
        <div className="flex gap-1">
          <div className="h-1 w-8 bg-amber-500 rounded-full"></div>
          <div className="h-1 w-4 bg-rose-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
