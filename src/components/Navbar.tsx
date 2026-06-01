'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Customer Comeback Machine
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden space-x-8 md:flex">
          <Link href="/#features" className="text-sm font-medium text-slate-600 hover:text-amber-500 transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-amber-500 transition-colors">
            Pricing
          </Link>
          <Link href="/faq" className="text-sm font-medium text-slate-600 hover:text-amber-500 transition-colors">
            FAQ
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <Link href="/signup">
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

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/#features" 
              className="text-base font-medium text-slate-600 px-2 py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="text-base font-medium text-slate-600 px-2 py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/faq" 
              className="text-base font-medium text-slate-600 px-2 py-1"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
          </div>
          <div className="pt-4 border-t border-slate-50 flex flex-col gap-3">
            <Link href="/signup" className="w-full">
              <Button variant="outline" className="w-full">Log In</Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
