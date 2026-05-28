import React from 'react';
import { Button } from './Button';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-50 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
            <Sparkles className="text-white h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-slate-900 leading-none">Comeback</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 mt-1">Machine</span>
          </div>
        </Link>
        
        <div className="hidden space-x-10 md:flex">
          <a  href="/?#features" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">
            Features
          </a>
          <a href="/?#pricing" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">
            Pricing
          </a>
          <Link href="/blog" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">
            Resources
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:inline-flex text-sm font-bold text-slate-500 hover:text-slate-900 px-4">
            Log In
          </Link>
          <Link href="/signup">
            <Button size="lg" className="rounded-2xl shadow-lg shadow-amber-500/20">
              Try for Free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
