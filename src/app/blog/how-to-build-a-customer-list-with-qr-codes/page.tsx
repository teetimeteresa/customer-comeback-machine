import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      
      <main className="container mx-auto max-w-3xl px-4 py-24">
        <article>
          <header className="mb-12">
            <div className="mb-6">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-600">
                QR Codes
              </span>
              <span className="ml-4 text-xs text-slate-400">April 22, 2024</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              How to Build a Massive Customer List with QR Codes (Step-by-Step)
            </h1>
          </header>

          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-600 leading-relaxed italic border-l-4 border-amber-500 pl-6 my-8">
              Turn foot traffic into a digital goldmine. Learn how to build a customer email list using QR codes in your local shop or restaurant.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Introduction: The Problem of the "Anonymous" Customer</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Every day, dozens of people walk into your shop. They browse, they buy, they smile, and they leave. But do you know who they are? Do you have a way to contact them tomorrow?
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              For most local businesses, 90% of their customers are "anonymous." Once they walk out the door, the only way to reach them again is to hope they happen to see a social media post or walk by your window.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              QR codes have changed the game. They are the bridge between the physical world of your shop and the digital world of your marketing.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Why Paper Sign-Up Sheets are Dead</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Ten years ago, we used clipboards and pens. But paper sign-up sheets have three major flaws:
            </p>
            <ul className="list-disc pl-6 mb-8 text-slate-600 space-y-2">
              <li><strong>Friction:</strong> Most people don't want to stop and write their info by hand.</li>
              <li><strong>Legibility:</strong> Deciphering handwriting is a nightmare for busy owners.</li>
              <li><strong>Privacy:</strong> No one wants their email sitting on a counter for others to see.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Step 1: Create an Irresistible "In-Shop" Offer</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              A QR code is just a tool; the "offer" is the reason people use it. The most effective offers for local shops are:
            </p>
            <div className="grid gap-4 mb-8">
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 font-medium italic">
                "Join our Birthday Club for a free treat on your big day!"
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 font-medium italic">
                "Scan to get 10% off your next visit."
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 font-medium italic">
                "Scan to see if you won a free upgrade today."
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Step 2: Design Your Branded QR Code Signage</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Placement is everything. You want your QR code to be visible at the "moment of peak happiness"—usually right after they’ve made a purchase. Top spots include the checkout counter, table tents, and even shopping bags.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Step 3: Automate the Opt-in Experience</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              The QR code should take them to a mobile-friendly landing page. Keep the form short—just their name, email, and maybe their birthday. As soon as they hit "submit," your system should automatically send them a welcome email.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              This is why a tool like <strong>Customer Comeback Machine</strong> is so powerful. It generates your custom QR code, hosts your opt-in page, and handles the automated follow-up all in one place.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Step 4: Watch Your List Grow While You Sleep</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Once your signs are up, your only job is to provide great service. Every time a customer scans, your digital asset grows. Unlike a social media following, you <strong>own</strong> your email list.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-16 mb-6">Conclusion: Your Most Valuable Business Asset</h2>
            <p className="text-slate-600 leading-relaxed">
              In the long run, your customer list is more valuable than your inventory. It is the insurance policy that ensures your business stays busy. Stop letting customers walk out the door and disappear.
            </p>
          </div>

          <div className="mt-20 rounded-3xl bg-slate-900 p-12 text-center text-white">
            <h2 className="text-2xl font-bold">Start building your list today</h2>
            <p className="mt-4 text-slate-400">
              Get your custom QR code and automated opt-in page with Customer Comeback Machine.
            </p>
            <div className="mt-8 flex justify-center">
              <Button size="lg">Start Your Free Trial</Button>
            </div>
          </div>
        </article>
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
