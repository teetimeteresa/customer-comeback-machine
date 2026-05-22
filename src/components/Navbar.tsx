import React from 'react';
import { Button } from './Button';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Customer Comeback Machine
          </span>
        </div>
        
        <div className="hidden space-x-8 md:flex">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-amber-500 transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-amber-500 transition-colors">
            Pricing
          </a>
          <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-amber-500 transition-colors">
            FAQ
          </a>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:inline-flex">
            <Button variant="outline" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
