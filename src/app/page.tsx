import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { PricingCard } from '@/components/PricingCard';
import Link from 'next/link';
import { plans } from '@/config/plans';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      
      {/* Founding Member Alert Banner */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-center shadow-lg">
        <p className="text-sm font-semibold text-white sm:text-base">
          🚀 <span className="hidden sm:inline">Founding Member Special: </span>
          We're looking for our first 10 partners. Lock in the Founding Rate (
          <span className="font-extrabold">$49/mo lifetime</span>) for all Growth features.{' '}
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
            3 spots left
          </span>
        </p>
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
              Stop Letting Good Customers <span className="text-amber-500">Disappear.</span>
            </h1>
            <p className="mt-8 text-xl text-slate-600 leading-relaxed">
              Customer Comeback Machine is the automated follow-up system that turns one-time visitors into lifelong fans—without adding a single task to your to-do list.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/pricing">
                <Button size="lg" className="shadow-lg shadow-amber-500/20">
                  Start Your 14-Day Free Trial
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg">
                  See How It Works
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              No credit card required • Simple 5-minute setup
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Follow-up that runs while you run the business.
            </h2>
          </div>
          
          <div className="grid gap-12 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="mb-4 h-12 w-12 rounded-xl bg-amber-100 p-3 text-amber-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Set It and Forget It</h3>
              <p className="text-slate-600">
                Automatically send thank-yous, review requests, and "miss you" offers based on customer behavior.
              </p>
            </div>
            
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="mb-4 h-12 w-12 rounded-xl bg-blue-100 p-3 text-blue-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Build Your List Effortlessly</h3>
              <p className="text-slate-600">
                Use beautiful QR code signs to turn foot traffic into a digital customer database you can reach anytime.
              </p>
            </div>
            
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="mb-4 h-12 w-12 rounded-xl bg-emerald-100 p-3 text-emerald-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">More Reviews, Less Work</h3>
              <p className="text-slate-600">
                Get Google reviews on autopilot while the experience is fresh. No more awkward asking in person.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Simple, transparent pricing.
            </h2>
            <p className="mt-4 text-xl text-slate-600">
              Choose the plan that fits your business stage.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
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
