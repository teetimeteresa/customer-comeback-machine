import { Navbar } from '@/components/Navbar';

export default function FAQPage() {
  const faqs = [
    {
      question: "Is this hard to set up?",
      answer: "Not at all! We designed this for busy owners. Most businesses are up and running in less than 5 minutes. You just upload your logo, set your tone, and print your QR code.",
    },
    {
      question: "Do my customers need to download an app?",
      answer: "No. Customers simply scan your QR code, which opens a beautiful mobile-friendly page in their browser. They can join your list in seconds.",
    },
    {
      question: "What if I already have a customer list?",
      answer: "You can easily import your existing customers into Customer Comeback Machine to start automated campaigns immediately.",
    },
    {
      question: "Is the SMS marketing compliant?",
      answer: "Yes. We take compliance very seriously. We use double opt-in for SMS and include clear stop instructions in every message to stay within legal guidelines.",
    },
    {
      question: "Can I cancel at any time?",
      answer: "Of course. There are no long-term contracts. You can cancel your subscription directly from your dashboard whenever you like.",
    },
    {
      question: "Do I need a website to use this?",
      answer: "Nope! We provide you with your own custom public opt-in page. You can use this even if you don't have a business website yet.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      
      <main className="container mx-auto max-w-4xl px-4 py-24">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Frequently Asked <span className="text-amber-500">Questions</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            Everything you need to know about building a customer list that pays for itself.
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-3xl bg-slate-50 p-8 border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">{faq.question}</h3>
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Still have questions? */}
        <div className="mt-20 rounded-3xl bg-amber-50 p-12 text-center border border-amber-100">
          <h2 className="text-2xl font-bold text-slate-900">Still have questions?</h2>
          <p className="mt-4 text-lg text-slate-600">
            We're here to help. Send us a message and we'll get back to you within 24 hours.
          </p>
          <div className="mt-8">
            <a href="/contact" className="inline-flex rounded-xl bg-slate-900 px-8 py-4 font-bold text-white hover:bg-slate-800 transition-colors">
              Contact Support
            </a>
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
