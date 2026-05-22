'use client';

import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { ArrowRight, CheckCircle2, Store, Sparkles, MessageSquare } from 'lucide-react';
import { signup } from './actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    try {
      const result = await signup(formData);
      if (result.error) {
        setError(result.error);
        setIsPending(false);
      } else {
        // Since it's a new account, we usually log them in here, 
        // but for now let's just go to onboarding
        router.push('/onboarding');
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 max-w-xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Start your <span className="text-amber-500">free trial.</span>
          </h1>
          <p className="mt-8 text-xl text-slate-600 leading-relaxed">
            Join hundreds of local shop owners who are already bringing customers back on autopilot.
          </p>
          
          <div className="mt-12 space-y-6">
            {[
              '14-day free trial, no credit card required',
              'Set up your QR code in under 5 minutes',
              'Automated follow-ups from day one',
              'Cancel or pause anytime'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="font-semibold text-slate-700">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100">
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                placeholder="Joe Shopowner"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                placeholder="joe@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <Button size="lg" className="w-full" disabled={isPending}>
              {isPending ? 'Creating Account...' : 'Create My Account'}
              {!isPending && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account? <a href="/login" className="font-bold text-amber-600 hover:underline">Log in &rarr;</a>
          </p>
        </div>
      </main>
    </div>
  );
}
