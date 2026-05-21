import { Navbar } from '@/components/Navbar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      
      <main className="container mx-auto max-w-3xl px-4 py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Privacy Policy
        </h1>
        <div className="mt-12 prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed">
            At Customer Comeback Machine, we take your privacy and your customers' privacy seriously. This policy explains how we collect, use, and protect your data.
          </p>
          
          <h2 className="mt-10 text-2xl font-bold text-slate-900">1. Data We Collect</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            We collect information that business owners provide during account creation, such as business name, email, and contact details. We also store customer opt-in data (names, emails, phone numbers) collected through your unique QR codes.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-slate-900">2. How We Use Data</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Business owner data is used to provide the service, process payments, and communicate account updates. Customer data is used solely for the purpose of sending automated marketing messages on behalf of your business.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-slate-900">3. Data Security</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            We implement industry-standard security measures to protect all data stored on our platform. We do not sell or share customer data with third parties for their own marketing purposes.
          </p>

          <h2 className="mt-10 text-2xl font-bold text-slate-900">4. Compliance</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            We provide tools to help you stay compliant with email and SMS marketing laws, including clear consent checkboxes and automated unsubscribe/STOP functionality.
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
