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
                Templates
              </span>
              <span className="ml-4 text-xs text-slate-400">April 25, 2024</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              The Only Local Business Review Request Template You’ll Ever Need
            </h1>
          </header>

          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-600 leading-relaxed italic border-l-4 border-amber-500 pl-6 my-8">
              Stop overthinking your review requests. Use this proven local business review request template to get more Google reviews starting today.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Introduction: Why Simple is Better</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              When it comes to asking for reviews, many business owners overthink the process. They worry about sounding desperate, being annoying, or using the wrong words. So, they end up not asking at all—or they write long, formal emails that customers never read.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              The truth is that most of your happy customers <strong>want</strong> to help you. They just need it to be easy. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              The "perfect" review request is short, honest, and contains a direct link. You aren't asking for a massive favor; you’re asking for a 30-second opinion. Here is the only template you’ll ever need to get more 5-star Google reviews.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The Anatomy of a High-Converting Review Request</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              A successful review request has four key parts:
            </p>
            <ol className="list-decimal pl-6 mb-8 text-slate-600 space-y-2">
              <li><strong>The Personalization:</strong> Use their name. It makes the email feel like a conversation, not a broadcast.</li>
              <li><strong>The "Why":</strong> Remind them that you are a local business and their feedback helps others find you.</li>
              <li><strong>The Low Friction:</strong> State clearly that it only takes a few seconds.</li>
              <li><strong>The Direct Link:</strong> Don't make them search for your business on Google. Send them directly to the review window.</li>
            </ol>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The Template (Copy & Paste Ready)</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Here is a warm, effective template you can use for your boutique, salon, coffee shop, or service business.
            </p>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8 font-mono text-sm text-slate-800">
              <p className="font-bold mb-2">Subject: Could you do us a quick favor?</p>
              <div className="whitespace-pre-wrap">
                Hi [First Name],{"\n\n"}
                Thank you so much for stopping by [Business Name] recently! We loved having you in.{"\n\n"}
                As a local business, we rely on word-of-mouth to grow. Would you mind taking 30 seconds to share your experience with a quick review on Google? {"\n\n"}
                It helps other neighbors find us and helps our team know we’re doing a good job.{"\n\n"}
                **[Link: Leave a Review on Google]**{"\n\n"}
                Thank you for your support!{"\n\n"}
                Best,{"\n"}
                [Your Name/Business Name]
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Where to Use This Template</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              While email is the most common place to use this template, it works across multiple channels:
            </p>
            <ul className="list-disc pl-6 mb-8 text-slate-600 space-y-2">
              <li><strong>SMS/Text:</strong> Shorten the copy slightly, but keep the "quick favor" tone and the direct link.</li>
              <li><strong>QR Code Signage:</strong> Place the copy on a sign at your checkout counter.</li>
              <li><strong>Social Media:</strong> Use the copy in a post to encourage your regulars.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">3 Common Mistakes to Avoid</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              <strong>1. Waiting Too Long:</strong> Send the request within 48 hours while the experience is fresh.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              <strong>2. Making it Hard to Find the Link:</strong> Use a direct Google Review link so they don't have to search.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              <strong>3. Being Too "Salesy":</strong> Don't offer bribes or incentives. Keep it about genuine feedback and support.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-16 mb-6">Conclusion: Your Reputation is One Email Away</h2>
            <p className="text-slate-600 leading-relaxed">
              You don’t need a complicated marketing strategy to build a 5-star reputation. You just need to ask. Take the template above, add your Google review link, and send it to your next 10 customers.
            </p>
          </div>

          <div className="mt-20 rounded-3xl bg-slate-900 p-12 text-center text-white">
            <h2 className="text-2xl font-bold">Want to automate your reviews?</h2>
            <p className="mt-4 text-slate-400">
              Customer Comeback Machine sends this template automatically 2 days after every visit.
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
