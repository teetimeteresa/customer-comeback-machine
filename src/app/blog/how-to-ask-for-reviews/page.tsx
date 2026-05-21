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
                Reviews
              </span>
              <span className="ml-4 text-xs text-slate-400">May 12, 2024</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              How to Ask Customers for Reviews Without Feeling Awkward
            </h1>
          </header>

          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-600 leading-relaxed italic border-l-4 border-amber-500 pl-6 my-8">
              Struggle with asking for reviews? Learn how to automate the process and get more 5-star Google reviews for your business without the awkwardness.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Introduction: Why Reviews are the New "Word of Mouth"</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Remember when a "good reputation" meant a few people in town chatting over the fence? Those days are gone. Today, your reputation lives on a 6-inch screen. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              For local businesses, reviews are the lifeblood of trust. They are the first thing a potential customer sees when they search for "best salon near me" or "coffee shops downtown." But let’s be honest: asking a customer for a review can feel incredibly awkward. It feels like you’re asking for a personal favor or, worse, being pushy. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              If you struggle with the "ask," you aren't alone. Here is the ultimate guide to getting more 5-star reviews without the stress.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Why You Can’t Afford to Ignore Your Online Reputation</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              It’s not just about ego. Your Google review count and average rating directly impact your **Local SEO**. Google wants to provide its users with the best possible results. If you have fifty 5-star reviews and your competitor has five, Google is going to show your business first. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              More reviews lead to higher rankings, which lead to more foot traffic, which leads to more sales. It’s a virtuous cycle that starts with a single request.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">The Best Time to Ask for a Review</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Timing is everything. Ask too early, and they haven't had a chance to enjoy the product. Ask too late, and the excitement has faded. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              We call the sweet spot the **"Golden Window."** For most local businesses, this is roughly **48 hours after the purchase or service**. This gives the customer enough time to fully experience what you offer, but the memory of your great service is still fresh and top-of-mind.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">3 Ways to Ask for Reviews Effortlessly</h2>
            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">1. In-Person (The "Genuine" Way)</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Don't make it about the stars; make it about the service. Instead of saying "Can you give us five stars?", try: *"We're so glad you enjoyed your visit! We're a small local shop, and your feedback really helps us grow. If you have a second to share your experience on Google, it would mean the world to us."*
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">2. Physical Signage</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Let your shop do the talking. Place small, tasteful signs at the register or on tables with a QR code that links directly to your Google review page. A simple headline like "Love your visit? Let us know!" is all you need.
            </p>

            <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">3. Automated Follow-Up</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              This is the most effective method because it doesn't rely on you remembering to ask during a busy shift. An automated email or text message sent during the Golden Window ensures that every customer gets a polite nudge without you having to say a word.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Using Automation to Remove the Friction</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              The biggest reason business owners don't get reviews isn't because they're "bad" at it—it's because they're **busy**. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              When you use a system like Customer Comeback Machine, the "ask" happens automatically. The system knows when the customer opted in, waits for the perfect moment, and sends a warm, branded request on your behalf. No awkwardness, no forgetting, just a steady stream of 5-star reviews.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What to Do With Negative Feedback</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              If you ask for reviews, eventually you might get a less-than-perfect one. Don't panic. A negative review is actually a massive opportunity to show off your customer service. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Respond quickly, be professional, and offer to make it right. Often, a customer who sees that you actually care enough to respond will end up being more loyal than one who never had a problem in the first place.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-16 mb-6">Conclusion: Start Building Your 5-Star Reputation Today</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              You don’t need to be a marketing genius or a professional salesperson to get more reviews. You just need a consistent system. 
            </p>
            <p className="text-slate-600 leading-relaxed">
              Stop overthinking the "ask" and start making it a natural part of your customer journey. Whether you use a script, a sign, or an automated sequence, the best time to start building your 5-star reputation is right now. Your next great customer is probably reading your reviews at this very second—give them something great to see.
            </p>
          </div>

          <div className="mt-20 rounded-3xl bg-slate-900 p-12 text-center text-white">
            <h2 className="text-2xl font-bold">Want more reviews on autopilot?</h2>
            <p className="mt-4 text-slate-400">
              Stop feeling awkward and start getting the 5-star ratings you deserve.
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
