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
                Growth
              </span>
              <span className="ml-4 text-xs text-slate-400">May 15, 2024</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              7 Proven Strategies to Get More Repeat Customers for Your Local Business
            </h1>
          </header>

          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-600 leading-relaxed italic border-l-4 border-amber-500 pl-6 my-8">
              Most local business owners spend their days chasing the "new." New foot traffic, new social media followers, new email subscribers. But here’s the cold, hard truth: acquiring a new customer is up to five times more expensive than keeping an existing one.
            </p>

            <p className="text-slate-600 leading-relaxed mb-6">
              The real profit in a boutique, a salon, or a coffee shop isn't made on the first visit—it’s made on the third, the tenth, and the fiftieth. When you turn a one-time visitor into a regular, you aren't just gaining a sale; you're building a sustainable engine for growth. Here are 7 proven strategies to help you stop the "one-and-done" cycle and start building true customer loyalty.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">1. Master the Art of the "Thank You"</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              When was the last time a business truly thanked you for your support? Not just a printed receipt, but a genuine expression of gratitude. In the rush of a busy Saturday, it's easy to let the "thank you" become a reflex. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Focus on immediate gratitude. A simple automated message sent an hour after a visit can make a customer feel seen and valued in a way that big-box stores simply can't match.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">2. Implement an Automated Follow-Up System</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Consistency is the enemy of the small business owner. You're busy. You're understaffed. You forget to send that follow-up email. Automation ensures nobody falls through the cracks, even when the shop is overflowing. By setting up a "machine" to handle your communications, you maintain the relationship while you focus on the work.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">3. Start a Birthday Club</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              The power of celebrating your customers cannot be overstated. It’s the easiest excuse to get them back in the door once a year. People love to be celebrated, and a small birthday treat creates a positive emotional association with your brand that lasts long after the candle is blown out.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">4. Ask for Feedback (and Actually Use It)</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Showing you care about their experience builds trust and loyalty. When a customer knows their voice matters, they feel like a partner in your business, not just a transaction. Use automated surveys or review requests to keep a pulse on your shop's reputation.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">5. Create a "Comeback Offer"</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Sometimes people just need a little nudge. A timely incentive—like a 10% discount on their next visit sent 7 days after their first—can trigger that second visit. Once they've visited twice, the likelihood of them becoming a "regular" increases exponentially.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">6. Leverage Social Proof and Reviews</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              How seeing other happy customers encourages people to return. Positive reviews are the new word-of-mouth. When your customers see a thriving community of fans online, it reinforces their decision to keep coming back to you.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">7. Build a Community, Not Just a Customer List</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Moving from transactional to relational business. Use your follow-ups to share stories about your team, your products, and your values. People don't just buy what you do; they buy why you do it.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-16 mb-6">Conclusion: Your Next Sale is Already in Your Database</h2>
            <p className="text-slate-600 leading-relaxed">
              Stop chasing new leads and start nurturing existing ones. Your most profitable growth comes from people who already know and trust you. By implementing even a few of these strategies, you'll see your repeat visit rate climb and your stress levels drop.
            </p>
          </div>

          <div className="mt-20 rounded-3xl bg-slate-900 p-12 text-center text-white">
            <h2 className="text-2xl font-bold">Want these strategies on autopilot?</h2>
            <p className="mt-4 text-slate-400">
              Customer Comeback Machine does all of this for you while you run your shop.
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
