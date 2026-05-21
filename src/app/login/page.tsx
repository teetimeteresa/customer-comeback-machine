'use client';

import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24 flex flex-col items-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100">
          <div className="mb-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back.</h1>
            <p className="mt-2 text-slate-500">Log in to manage your customer comeback.</p>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                placeholder="joe@example.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-bold text-amber-600 hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <Button size="lg" className="w-full">
              Log In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account? <a href="/signup" className="font-bold text-amber-600 hover:underline">Sign up for free &rarr;</a>
          </p>
        </div>
      </main>
    </div>
  );
}
