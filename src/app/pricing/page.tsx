import { Navbar } from '@/components/Navbar';
import { PricingCard } from '@/components/PricingCard';

export default function PricingPage() {
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
                Want a dedicated partner to get you launched? We'll handle everything—from setting up your profile to customizing your messages—so you can stay focused on your customers.
              </p>
              <p className="mt-2 text-sm text-amber-600 font-bold uppercase tracking-widest italic">
                ✨ Includes a 1-on-1 success call to ensure you're ready to win.
              </p>
            </div>
            <button className="whitespace-nowrap rounded-xl bg-amber-500 px-8 py-4 font-bold text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-colors">
              Add Setup to Any Plan
            </button>
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
