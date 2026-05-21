import { Navbar } from '@/components/Navbar';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      
      <main className="container mx-auto max-w-3xl px-4 py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Terms of Service
        </h1>
        <div className="mt-12 prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed">
            By using Customer Comeback Machine, you agree to the following terms and conditions.
          </p>
          
          <h2 className="mt-10 text-2xl font-bold text-slate-900">1. Service Description</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Customer Comeback Machine provides automated marketing tools for local businesses. We do not guarantee specific business results or revenue increases.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-slate-900">2. User Responsibilities</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            You are responsible for ensuring that the messages sent through our platform comply with local laws and regulations. You must have explicit consent from customers before sending marketing messages.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-slate-900">3. Payment and Subscriptions</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Subscriptions are billed monthly. You can cancel at any time through your dashboard. No refunds are provided for partial months.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-slate-900">4. Limitation of Liability</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Customer Comeback Machine is not liable for any indirect, incidental, or consequential damages arising from the use of our service.
          </p>
          
          <p className="mt-12 text-sm text-slate-500 italic">
            Last updated: May 2024
          </p>
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
