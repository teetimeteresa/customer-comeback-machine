import { Navbar } from '@/components/Navbar';
import { PricingCard } from '@/components/PricingCard';
import Link from 'next/link';
import { plans } from '@/config/plans';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Plans built for <span className="text-amber-500">local growth.</span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Stop letting customers walk out and disappear. Choose the plan that helps you build a list and bring them back.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>

        {/* Done-for-You Setup */}
        <div className="mt-20 rounded-3xl bg-amber-500 p-1 bg-[linear-gradient(to_right,#F59E0B,#D97706)]">
          <div className="rounded-[22px] bg-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold text-slate-900">“Done-for-You” Setup</h2>
              <p className="mt-4 text-lg text-slate-600">
                Want us to handle everything? We'll set up your business profile, customize your messages, and design your QR signs for a one-time fee of <span className="font-bold text-amber-600">$497</span>.
              </p>
            </div>
            <Link href="/contact">
              <button className="whitespace-nowrap rounded-xl bg-amber-500 px-8 py-4 font-bold text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-colors">
                Add Setup to Any Plan
              </button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-100 bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Customer Comeback Machine. Built for local businesses.
          </p>
        </div>
      </footer>
    </div>
  );
}
