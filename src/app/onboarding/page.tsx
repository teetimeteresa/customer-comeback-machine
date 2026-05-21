import React from 'react';
import OnboardingForm from './OnboardingForm';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-amber-500 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Comeback Machine</span>
          </div>
          <div className="text-sm font-medium text-slate-500">
            Welcome, {session.user.name}
          </div>
        </div>
      </header>

      <main>
        <OnboardingForm />
      </main>

      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Customer Comeback Machine. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
