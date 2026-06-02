'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { plans } from '@/config/plans';
import Link from 'next/link';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan) {
      setSelectedPlan(plan);
    }
  }, [searchParams]);

  const allPlans = [
    ...plans,
    {
      name: 'Founding Member',
      price: '49',
      description: 'Exclusive lifetime offer for our first 100 customers.',
      features: [
        'Everything in Pro',
        'Lifetime price guarantee',
        'Founding member badge',
        'Direct access to founders',
      ],
      offer: true,
    }
  ];

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('ccm_subscribed', 'true');
      localStorage.setItem('ccm_plan', selectedPlan || 'starter');
      window.location.href = '/dashboard';
    }, 1500);
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Choose your <span className="text-amber-500">growth engine.</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Select a plan to start your 14-day free trial. No credit card required today.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {allPlans.map((plan) => (
              <div 
                key={plan.name}
                className={`relative flex flex-col rounded-3xl border p-6 transition-all hover:shadow-xl ${
                  plan.name === 'Founding Member' 
                    ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20' 
                    : 'border-slate-200 bg-white'
                }`}
              >
                {plan.name === 'Founding Member' && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                    Limited Offer
                  </span>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-extrabold">${plan.price}</span>
                    <span className="ml-1 text-sm font-medium text-slate-500">/mo</span>
                  </div>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg className="h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.name === 'Founding Member' ? 'primary' : 'outline'}
                  onClick={() => setSelectedPlan(plan.name.toLowerCase())}
                >
                  Select {plan.name}
                </Button>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-2 text-slate-500">
            Starting your trial for the <span className="font-bold text-slate-900">{selectedPlan}</span> plan.
          </p>
          
          <form className="mt-8 space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Business Name</label>
              <input 
                required
                type="text" 
                className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-amber-500 focus:ring-amber-500" 
                placeholder="Bella Boutique"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Work Email</label>
              <input 
                required
                type="email" 
                className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-amber-500 focus:ring-amber-500" 
                placeholder="sarah@bellaboutique.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input 
                required
                type="password" 
                className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-amber-500 focus:ring-amber-500" 
                placeholder="••••••••"
              />
            </div>
            <Button 
              type="submit"
              className="w-full py-4 text-lg" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Start 14-Day Free Trial'}
            </Button>
          </form>
          
          <p className="mt-6 text-center text-xs text-slate-400">
            By signing up, you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
        
        <button 
          onClick={() => setSelectedPlan(null)}
          className="mt-8 w-full text-sm font-medium text-slate-500 hover:text-slate-900"
          disabled={isSubmitting}
        >
          ← Change plan
        </button>
      </main>
    </div>
  );
}
