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
                Automation
              </span>
              <span className="ml-4 text-xs text-slate-400">April 28, 2024</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Small Business Email Automation: A Beginner’s Guide to "Set It and Forget It"
            </h1>
          </header>

          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-600 leading-relaxed italic border-l-4 border-amber-500 pl-6 my-8">
              New to automation? This guide explains how small business email automation works and how it can save you hours of work every week.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Introduction: Automation Isn't Just for Tech Giants</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              When you hear the word "automation," you might think of massive server rooms, complex code, or expensive Silicon Valley marketing agencies. For a long time, the tools to run automated marketing campaigns were locked behind high price tags and technical barriers.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              But times have changed. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Today, email automation is the "secret weapon" for the busiest people on the planet: local business owners. Whether you run a one-person florist shop or a bustling downtown bistro, automation allows you to provide a world-class customer experience without adding a single task to your daily to-do list.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is Email Automation? (In Plain English)</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              At its simplest, email automation is a way to send the right message to the right person at the right time—automatically. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Instead of you sitting down to type an email every time a new customer signs up, you set up a <strong>"Trigger."</strong> When that trigger happens (like a customer scanning a QR code), the system automatically sends a pre-written email (the <strong>"Action"</strong>). 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Think of it like a digital employee who never takes a day off and perfectly follows your instructions every single time.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The 3 Sequences Every Small Business Needs</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              You don't need dozens of complex workflows. Most local businesses can see a massive jump in repeat visits by setting up just these three simple sequences:
            </p>
            <div className="space-y-6 mb-12">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-2">1. The Welcome Sequence</h3>
                <p className="text-slate-600 text-sm">
                  <strong>Trigger:</strong> Customer joins your list.<br/>
                  <strong>Goal:</strong> Say thank you and introduce your brand. This is your "digital handshake."
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-2">2. The Nurture/Review Sequence</h3>
                <p className="text-slate-600 text-sm">
                  <strong>Trigger:</strong> 2-3 days after a visit.<br/>
                  <strong>Goal:</strong> Get a Google review. Checks in to ensure they enjoyed their purchase.
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-2">3. The Win-Back Sequence</h3>
                <p className="text-slate-600 text-sm">
                  <strong>Trigger:</strong> 30-60 days of inactivity.<br/>
                  <strong>Goal:</strong> Bring them back. A gentle reminder that you’re still here.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How Automation Saves Your Sanity</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              The biggest cost in any small business is <strong>time</strong>. If you spend 15 minutes a day manually following up with customers, that’s nearly 100 hours a year. Beyond time, automation saves your budget by focusing on <strong>retention</strong>. It is much cheaper to bring back an old customer than it is to find a new one.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Choosing the Right Tools</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              When choosing a system, look for Simplicity, Integration, and Reliability. Systems like <strong>Customer Comeback Machine</strong> are designed specifically for the non-technical owner who wants results without the headache.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-16 mb-6">Conclusion: Build a Machine</h2>
            <p className="text-slate-600 leading-relaxed">
              The days of manual, one-off marketing emails are over. By embracing "Set It and Forget It" automation, you’re not just sending emails—you’re building an asset that grows your business 24/7.
            </p>
          </div>

          <div className="mt-20 rounded-3xl bg-slate-900 p-12 text-center text-white">
            <h2 className="text-2xl font-bold">Start your automation journey</h2>
            <p className="mt-4 text-slate-400">
              Build your "Customer Comeback Machine" in under 30 minutes.
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
