'use client';

import React from 'react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Sparkles, Heart, Star, ShoppingBag } from 'lucide-react';

interface QRSignTemplateProps {
  businessName: string;
  businessType: string;
  url: string;
}

export const QRSignTemplate: React.FC<QRSignTemplateProps> = ({ 
  businessName, 
  businessType, 
  url 
}) => {
  return (
    <div id="qr-sign-template" className="w-[8.5in] h-[11in] bg-white p-12 flex flex-col items-center justify-between border-[16px] border-amber-500 shadow-2xl mx-auto print:shadow-none print:border-amber-500">
      <div className="w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-5xl">{businessName.charAt(0)}</span>
          </div>
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-2">
          {businessName}
        </h1>
        <p className="text-2xl text-slate-500 font-medium uppercase tracking-[0.2em]">
          {businessType}
        </p>
      </div>

      <div className="flex flex-col items-center flex-grow justify-center py-12">
        <div className="relative mb-12">
          <div className="absolute -top-12 -left-12 text-amber-400">
            <Sparkles size={48} />
          </div>
          <div className="absolute -bottom-12 -right-12 text-amber-400">
            <Sparkles size={48} />
          </div>
          <div className="p-8 bg-slate-50 rounded-[3rem] border-4 border-slate-100 shadow-inner">
            <QRCodeDisplay url={url} size={400} />
          </div>
        </div>
        
        <div className="text-center max-w-2xl">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Join Our VIP Club!
          </h2>
          <p className="text-2xl text-slate-600 leading-relaxed">
            Scan to get a special treat on your next visit and stay in the loop with our newest arrivals!
          </p>
        </div>
      </div>

      <div className="w-full border-t-2 border-slate-100 pt-12 flex justify-center gap-16 text-slate-400">
        <div className="flex items-center gap-3">
          <Heart className="text-amber-500" />
          <span className="font-bold">Support Local</span>
        </div>
        <div className="flex items-center gap-3">
          <Star className="text-amber-500" />
          <span className="font-bold">Leave a Review</span>
        </div>
        <div className="flex items-center gap-3">
          <ShoppingBag className="text-amber-500" />
          <span className="font-bold">Shop Small</span>
        </div>
      </div>
      
      <div className="mt-8 text-slate-300 text-sm font-medium">
        Powered by Customer Comeback Machine
      </div>
    </div>
  );
};
