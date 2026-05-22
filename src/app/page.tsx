import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { PricingCard } from '@/components/PricingCard';
import Link from 'next/link';

export default function Home() {
  const plans = [
    {
      name: 'Starter',
      price: '49',
      description: 'The essentials for every local shop.',
      features: [
        'Custom customer opt-in page',
        'Branded QR code signs',
        'Automated Thank-You emails',
        'Review Request emails',
        'Comeback Offer emails',
        'Basic analytics dashboard',
      ],
    },
    {
      name: 'Growth',
      price: '99',
      description: 'Accelerate your growth and build a community.',
      popular: true,
      features: [
        'Everything in Starter',
        'Birthday Club rewards',
        'Referral request system',
        'Win-back campaigns',
        'Monthly campaign suggestions',
        'Customer tagging & segmentation',
        'Downloadable customer list',
      ],
    },
    {
      name: 'Pro',
      price: '199',
      description: 'Maximum impact with advanced automation.',
      features: [
        'Everything in Growth',
        'SMS/Text message marketing',
        'Advanced campaign builder',
        'Automated seasonal promotions',
        'AI-powered review reply suggestions',
        'Testimonial repurposing',
        'Priority support',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="container mx-auto px-6 text-center">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-6xl font-black tracking-tight text-slate-900 sm:text-8xl leading-none">
              Stop Letting Good <br/> Customers <span className="text-amber-500 underline decoration-slate-100 underline-offset-8">Disappear.</span>
            </h1>
            <p className="mt-10 text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto font-medium">
              The automated follow-up system for local shops that turns one-time visitors into lifelong fans—without lifting a finger.
            </p>
            <div className="mt-14 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="px-12 py-6 text-base">
                  Start Your 14-Day Free Trial
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="px-12 py-6 text-base">
                  See How It Works
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex items-center justify-center gap-8 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-xs font-black uppercase tracking-widest">No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-xs font-black uppercase tracking-widest">5-minute setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-50 py-32">
        <div className="container mx-auto px-6">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-amber-500 mb-4">How it works</h2>
            <h3 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl leading-tight">
              Follow-up that runs while you run the business.
            </h3>
          </div>
          
          <div className="grid gap-12 md:grid-cols-3">
            <div className="group rounded-[2.5rem] bg-white p-10 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="mb-8 h-14 w-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="mb-4 text-2xl font-black text-slate-900 leading-tight">Set It and Forget It</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Automatically send thank-yous, review requests, and "miss you" offers based on customer behavior.
              </p>
            </div>
            
            <div className="group rounded-[2.5rem] bg-white p-10 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="mb-8 h-14 w-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-4 text-2xl font-black text-slate-900 leading-tight">Build Your List</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Beautiful QR code signs turn foot traffic into a digital customer database you can reach anytime.
              </p>
            </div>
            
            <div className="group rounded-[2.5rem] bg-white p-10 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
              <div className="mb-8 h-14 w-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="mb-4 text-2xl font-black text-slate-900 leading-tight">More Reviews</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
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
