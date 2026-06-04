'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';

export default function OpticalStylePage() {
  const [isJoined, setIsSuccess] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  if (isJoined) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in duration-500">
          <div className="h-24 w-24 rounded-[2.5rem] bg-linear-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-200 mx-auto">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">See you soon!</h1>
            <p className="mt-4 text-lg text-slate-500 font-medium leading-relaxed">
              Your **2024 Frame Style Guide** is on its way to your inbox. 
              We can't wait to help you find your next look.
            </p>
          </div>
          <div className="pt-4">
            <Button size="lg" className="w-full bg-slate-900 text-white shadow-xl hover:bg-slate-800" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Sophisticated Header */}
      <header className="bg-slate-900 text-white py-4 px-6 sticky top-0 z-50 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c3.55 0 6.715 1.85 8.7 4.65M12 19c-4.477 0-8.268-2.943-9.542-7" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">Vision & Vogue</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>Frames</span>
          <span>Experience</span>
          <span>Contact</span>
        </div>
      </header>

      <main>
        {/* Hero Section: Style & Vision Experience */}
        <section className="relative pt-20 pb-32 bg-slate-50 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-8 border border-indigo-100 shadow-sm">
                Elevating the optical experience
              </div>
              <h1 className="text-6xl font-black tracking-tight text-slate-900 sm:text-8xl leading-[0.9] mb-10">
                Your Style Has <br/> <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-500 italic">No Expiration.</span>
              </h1>
              <p className="text-xl font-medium text-slate-500 leading-relaxed max-w-2xl mx-auto mb-12">
                Shift your perspective from a medical exam to a **Style & Vision Experience**. 
                Find the frames that don't just help you see, but help you *be seen*.
              </p>
              
              {/* Lead Magnet CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#join" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full px-10 py-6 bg-slate-900 text-white shadow-2xl hover:bg-slate-800 transition-all active:scale-95">
                    Download 2024 Style Guide
                  </Button>
                </a>
                <a href="#refresh" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full px-10 py-6 text-slate-600 border-2 border-slate-100 hover:border-indigo-200 hover:text-indigo-600">
                    Book My Refresh
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* The 6-Month Tune-Up Offer */}
        <section className="py-24 bg-white border-y border-slate-50">
          <div className="container mx-auto px-4 max-w-5xl mx-auto">
            <div className="rounded-[3rem] bg-linear-to-br from-indigo-600 to-blue-700 p-12 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-indigo-200/50 group">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-white/10 blur-3xl group-hover:scale-110 transition-transform duration-500"></div>
              
              <div className="relative z-10 grid gap-12 lg:grid-cols-2 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white mb-6 backdrop-blur-md">
                    Complimentary Service
                  </div>
                  <h2 className="text-4xl font-black leading-[0.9] sm:text-5xl mb-6">
                    The 6-Month <br/> Frame Tune-Up
                  </h2>
                  <p className="text-lg font-medium text-indigo-50 leading-relaxed mb-8">
                    Your frames work hard every day. Bring them back for a professional **ultrasonic cleaning** and **screw tightening** on us. No appointment needed.
                  </p>
                  <ul className="space-y-4">
                    {['Professional Sonic Cleaning', 'Alignment Check', 'Screw & Nosepad Tightening'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm font-bold">
                        <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="hidden lg:flex justify-center">
                   <div className="h-64 w-64 rounded-full border-8 border-white/10 flex items-center justify-center animate-pulse">
                      <svg className="h-32 w-32 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Insurance Benefit Reminder Section */}
        <section id="refresh" className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
             <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0 100 L100 0 L100 100 Z" fill="currentColor" />
             </svg>
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-black tracking-tight sm:text-6xl leading-[0.9] mb-8">
              Don't Let Your <span className="text-indigo-400">Benefits Expire.</span>
            </h2>
            <p className="text-xl font-medium text-slate-400 leading-relaxed mb-12">
              Most insurance plans reset on January 1st. Use your vision benefits now for a **Style & Sight** refresh. New year, new view.
            </p>
            <div className="grid gap-6 md:grid-cols-3 mb-16">
              {[
                { title: 'New Vision Script', desc: 'Precise calibration for 2024' },
                { title: 'Elite Styling', desc: '1-on-1 frame curation' },
                { title: 'Digital Upgrade', desc: 'Blue light & glare protection' },
              ].map((item) => (
                <div key={item.title} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
                   <h3 className="text-lg font-black mb-2">{item.title}</h3>
                   <p className="text-sm font-medium text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <Button size="lg" className="px-16 py-6 bg-indigo-500 text-white shadow-2xl shadow-indigo-500/20 hover:bg-indigo-400 transition-all active:scale-95 text-lg">
              Book My Styling Session
            </Button>
          </div>
        </section>

        {/* Opt-in Section: Style Guide Download */}
        <section id="join" className="py-32 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid gap-20 lg:grid-cols-2 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 border border-slate-100 shadow-sm">
                  Exclusive Access
                </div>
                <h2 className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl leading-[0.9] mb-10">
                  The 2024 <br/> <span className="text-indigo-600">Style Guide.</span>
                </h2>
                <p className="text-xl font-medium text-slate-500 leading-relaxed max-w-lg">
                  Join our **Inner Circle** to receive the digital 2024 Frame Style Guide immediately, plus early access to designer drops and seasonal refreshes.
                </p>
                <div className="mt-12 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-slate-700">Digital Style Guide (PDF)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-slate-700">VIP Designer Drop Alerts</span>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-blue-600 rounded-[3.5rem] blur-xl opacity-10 group-hover:opacity-20 transition duration-500"></div>
                <div className="relative rounded-[3.5rem] bg-white p-10 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100">
                  <form className="space-y-8" onSubmit={handleJoin}>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-5 font-medium transition-all focus:border-indigo-400 focus:bg-white outline-hidden" 
                        placeholder="Jane Vogue"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        className="block w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-5 font-medium transition-all focus:border-indigo-400 focus:bg-white outline-hidden" 
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div className="pt-4">
                      <Button size="lg" className="w-full py-6 text-lg bg-slate-900 text-white shadow-xl hover:bg-slate-800">
                        Get The Style Guide
                      </Button>
                    </div>
                    <p className="text-center text-xs font-medium text-slate-400 leading-relaxed">
                      By joining, you agree to receive digital style guides and curated vision updates from Vision & Vogue.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-md">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">Vision & Vogue</span>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} • Elevating Optical Retention
            </p>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              Powered by Customer Comeback Machine
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
