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
                Salons
              </span>
              <span className="ml-4 text-xs text-slate-400">May 3, 2024</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              5 Salon Customer Follow-Up Ideas to Keep Your Chairs Full
            </h1>
          </header>

          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-600 leading-relaxed italic border-l-4 border-amber-500 pl-6 my-8">
              Don't wait for them to book. Learn 5 salon customer follow-up ideas that increase rebooking rates and build long-term client loyalty.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Introduction: Bridging the 6-Week Gap</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              For stylists and salon owners, the most stressful part of the job isn't the complex color correction—it’s the empty chair. You can provide a flawless service today, but if that client doesn't come back in 6 to 8 weeks, your business isn't growing; it’s just treading water.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              In the beauty industry, the relationship often goes silent the moment the client walks out the door. You hope they loved their look enough to remember to call you in two months, but life gets busy. Habits change. They might see a "New Client" special at the salon down the street and decide to give it a try.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Follow-up is the bridge that keeps you connected to your clients between appointments. Here are 5 salon follow-up ideas that will help you keep your chairs full and your clients loyal.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Idea 1: The 48-Hour "Love Your Hair" Check-in</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              A few days after a big color change or a new cut, send a quick message to check in. 
            </p>
            <blockquote className="bg-slate-50 p-6 rounded-2xl border-l-4 border-amber-500 text-slate-700 italic mb-6">
              "Hi Jessica! Just wanted to check in and see how you’re loving your new color now that you’ve lived with it for a few days. Hope you’re feeling fabulous!"
            </blockquote>
            <p className="text-slate-600 leading-relaxed mb-6">
              This does two things: it shows you care about the result, not just the payment, and it gives them an opening to ask questions about maintenance or styling. This small touch builds massive trust.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Idea 2: Automated Rebooking Reminders</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Most people don't mean to go 12 weeks between cuts; they just forget to check their calendars. Automated rebooking reminders are a game-changer for salon productivity.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              If a client hasn't booked their next appointment by the 5-week mark, a friendly, automated nudge can be the reminder they need. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              <em>"We haven't seen you on the schedule yet! We’re starting to fill up for next month—would you like to grab your usual spot?"</em>
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Idea 3: Product Usage Tips and Tutorials</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              You sold them a professional-grade shampoo or a styling cream during their visit. Follow up a week later with a quick tip on how to get the most out of it. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Maybe it’s a 30-second video on how to achieve that salon blowout at home or a simple reminder to use cool water when rinsing their new color. By providing education, you move from being a "service provider" to being a "trusted advisor."
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Idea 4: The "New Look" Social Media Shoutout</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              With your client’s permission, take a "before and after" photo and tag them in a social media story or post. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              People love to feel like models. When you feature them, they are likely to share that post with their own friends and family, which serves as a powerful testimonial for your skills. Plus, it’s a digital memory of their visit that keeps your salon top-of-mind.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Idea 5: Targeted Birthday and Anniversary Offers</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Celebrate their "Salon Anniversary" (the date of their first visit) or their birthday with a special add-on. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              <em>"Happy 1-year Salon Anniversary, Maria! To celebrate, your deep conditioning treatment is on us during your next visit."</em>
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Anniversary offers are particularly effective because they reward long-term loyalty and make the client feel like part of the salon family.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-16 mb-6">Conclusion: Your Client Relationship Starts When They Leave the Chair</h2>
            <p className="text-slate-600 leading-relaxed">
              The cut and color are only half the job. The other half is the relationship you build outside of the salon. By implementing a consistent follow-up system, you remove the guesswork from your schedule. You’ll spend less time worrying about empty chairs and more time doing what you love: making your clients look and feel their best. 
            </p>
          </div>

          <div className="mt-20 rounded-3xl bg-slate-900 p-12 text-center text-white">
            <h2 className="text-2xl font-bold">Keep your salon chairs full</h2>
            <p className="mt-4 text-slate-400">
              Automate your rebooking reminders and anniversary offers with Customer Comeback Machine.
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
