"use client";

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';

export default function ROICalculator() {
  const [ticket, setTicket] = useState(350);
  const [customers, setCustomers] = useState(200);
  const [churn, setChurn] = useState(25);
  const [calculated, setCalculated] = useState(false);

  const calculate = () => {
    if (ticket <= 0 || customers <= 0) return;
    setCalculated(true);
  };

  const annualLostRevenue = Math.round(ticket * customers * 12 * (churn / 100));
  const recoveredByCCM = Math.round(annualLostRevenue * 0.4); // 40% recovery rate

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-slate-900 pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900">
            How much revenue is <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-600">
              leaking out of your business?
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Most local business owners focus on getting <strong>new</strong> customers, while their 
            existing ones quietly slip away. Use this tool to see the real cost of a "one-time visitor."
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Input Card */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="text-amber-500">01.</span> Your Business Stats
            </h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Average Ticket Size ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={ticket}
                    onChange={(e) => { setTicket(Number(e.target.value)); setCalculated(false); }}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-10 pr-4 text-xl font-bold focus:border-amber-500 focus:bg-white transition-all outline-none"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400 font-medium italic">Example: A typical Med Spa appointment is $350.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Monthly Customers (#)
                </label>
                <input
                  type="number"
                  value={customers}
                  onChange={(e) => { setCustomers(Number(e.target.value)); setCalculated(false); }}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-4 text-xl font-bold focus:border-amber-500 focus:bg-white transition-all outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Estimated Churn Rate (%)
                  </label>
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold text-sm">
                    {churn}%
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={75}
                  value={churn}
                  onChange={(e) => { setChurn(Number(e.target.value)); setCalculated(false); }}
                  className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-2">
                  <span>Legendary (5%)</span>
                  <span>Average (25%)</span>
                  <span>Leaky Bucket (50%+)</span>
                </div>
              </div>

              <button
                onClick={calculate}
                className="w-full bg-slate-900 text-white font-black text-xl py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
              >
                Calculate Revenue Bleed
              </button>
            </div>
          </div>

          {/* Results Side */}
          <div className="relative h-full">
            {!calculated ? (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">Ready to see the results?</h3>
                <p className="text-slate-400 max-w-[200px]">Enter your stats on the left and click calculate.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-white rounded-3xl p-8 border-2 border-rose-100 shadow-xl shadow-rose-500/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="text-6xl text-rose-500 font-black">!</span>
                  </div>
                  <h3 className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-4">Annual Revenue Lost</h3>
                  <p className="text-5xl md:text-7xl font-black text-slate-900 mb-2">
                    ${annualLostRevenue.toLocaleString()}
                  </p>
                  <p className="text-slate-500 font-medium">
                    This is how much your business is "bleeding" every year from customers who never return.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-rose-600 rounded-3xl p-8 text-white shadow-2xl shadow-rose-600/20">
                  <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4">Recovered by Connection Guard</h3>
                  <p className="text-5xl md:text-7xl font-black text-white mb-2">
                    ${recoveredByCCM.toLocaleString()}
                  </p>
                  <p className="text-white/90 font-medium">
                    Our automated win-back system typically recovers 40% of churned revenue. 
                    <strong> That's profit back in your pocket.</strong>
                  </p>
                </div>

                <div className="p-4 text-center">
                  <a 
                    href="/signup?source=roi-calculator"
                    className="inline-flex items-center gap-2 text-rose-600 font-bold hover:gap-4 transition-all group"
                  >
                    Claim your $49/mo Founding Member spot 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </div>
            )}
            
            {/* Trust Badges */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-2xl">🔒</span>
                <div className="leading-tight">
                  <p className="text-xs font-black uppercase text-slate-400">Privacy</p>
                  <p className="text-sm font-bold text-slate-600">Secure Audit</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-2xl">⚡</span>
                <div className="leading-tight">
                  <p className="text-xs font-black uppercase text-slate-400">Setup</p>
                  <p className="text-sm font-bold text-slate-600">10 Min Fix</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
