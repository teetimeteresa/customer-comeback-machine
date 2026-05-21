import React from 'react';
import { Button } from '@/components/Button';

export default function OptInPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <main className="container mx-auto max-w-lg px-4 py-16">
        {/* Business Branding */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-3xl text-center">B</span>
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
            Bella Boutique
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Join our VIP list to get exclusive offers and stay in the loop!
          </p>
        </div>

        {/* Opt-in Form */}
        <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-semibold text-slate-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                  placeholder="Jane"
                  required
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-semibold text-slate-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                placeholder="jane@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                placeholder="(555) 000-0000"
              />
            </div>

            <div>
              <label htmlFor="birthday" className="block text-sm font-semibold text-slate-700">
                Birthday (Optional)
              </label>
              <input
                type="date"
                id="birthday"
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
              />
              <p className="mt-1 text-xs text-slate-500 italic">We'll send you a special treat on your big day!</p>
            </div>

            <div>
              <label htmlFor="favorite" className="block text-sm font-semibold text-slate-700">
                Favorite Product or Service (Optional)
              </label>
              <input
                type="text"
                id="favorite"
                className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                placeholder="e.g. Silk Scarves"
              />
            </div>

            {/* Consent */}
            <div className="space-y-4 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  required
                />
                <span className="text-sm text-slate-600">
                  I agree to receive email updates and marketing messages from Bella Boutique.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm text-slate-600">
                  I agree to receive text message updates (Standard rates may apply).
                </span>
              </label>
            </div>

            <Button size="lg" className="w-full shadow-lg shadow-amber-500/20 mt-8">
              Count Me In!
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-slate-500">
          Powered by <span className="font-bold">Customer Comeback Machine</span>
        </p>
      </main>
    </div>
  );
}
