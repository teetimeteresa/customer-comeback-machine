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
                Email Marketing
              </span>
              <span className="ml-4 text-xs text-slate-400">May 10, 2024</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              5 Customer Follow-Up Email Examples Every Local Shop Should Use
            </h1>
          </header>

          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-600 leading-relaxed italic border-l-4 border-amber-500 pl-6 my-8">
              Need inspiration for your customer emails? Steal these 5 high-converting follow-up email examples designed to bring people back to your shop.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Introduction: The "One-and-Done" Trap</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              For many local businesses, the biggest challenge isn't getting customers in the door—it's getting them to come back a second time. We call this the "One-and-Done" trap. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              A customer visits, has a great experience, leaves happy... and then life happens. They get busy, they forget, or they simply fall out of the habit of visiting you. Email marketing is the most effective antidote to this problem. By sending timely, helpful messages, you stay top-of-mind and give them a reason to return. 
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Here are 5 high-converting follow-up email examples you can copy and use for your shop today.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Example 1: The "Warm Welcome" (Immediate Thank You)</h2>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8 font-mono text-sm text-slate-800">
              <p className="font-bold mb-2">Subject: Thank you for stopping in!</p>
              <div className="whitespace-pre-wrap">
                Hi [First Name],{"\n\n"}
                It was so great to see you at [Business Name] today! We know you have plenty of choices when you’re out and about, and we’re truly grateful you chose to spend your time with us.{"\n\n"}
                We’re a small local team, and customers like you are exactly why we love what we do. {"\n\n"}
                If there’s anything we can do to make your next visit even better, just hit reply and let us know. {"\n\n"}
                Warmly,{"\n"}
                The team at [Business Name]
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Example 2: The "Honest Nudge" (Review Request)</h2>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8 font-mono text-sm text-slate-800">
              <p className="font-bold mb-2">Subject: Quick question for you...</p>
              <div className="whitespace-pre-wrap">
                Hi [First Name],{"\n\n"}
                We hope you’re still enjoying your recent visit to [Business Name]!{"\n\n"}
                As a local business, word-of-mouth means the world to us. Most people find us through reviews from neighbors like you. Would you mind taking 30 seconds to share your experience? {"\n\n"}
                [Link: Leave a Review on Google]{"\n\n"}
                Your feedback helps us grow and helps other people find our shop. Thank you so much for your support!{"\n\n"}
                Best,{"\n"}
                [Business Name]
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Example 3: The "Miss You" (Comeback Offer)</h2>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8 font-mono text-sm text-slate-800">
              <p className="font-bold mb-2">Subject: We miss your face!</p>
              <div className="whitespace-pre-wrap">
                Hi [First Name],{"\n\n"}
                It’s been a little while since we saw you at [Business Name], and we wanted to check in. {"\n\n"}
                We’re currently [mention a new product, seasonal drink, or update], and we think you’d love it. To make your next visit even sweeter, here’s a little something for you:{"\n\n"}
                **[Offer: e.g., 10% off your next purchase / Free upgrade]**{"\n\n"}
                Just show this email at the counter next time you’re in. Can’t wait to see you again!{"\n\n"}
                Cheers,{"\n"}
                [Business Name]
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Example 4: The "Birthday Treat" (Celebration)</h2>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8 font-mono text-sm text-slate-800">
              <p className="font-bold mb-2">Subject: A little something for your big day 🎂</p>
              <div className="whitespace-pre-wrap">
                Hi [First Name],{"\n\n"}
                Your birthday is coming up, and we want to help you celebrate! {"\n\n"}
                We believe everyone deserves a treat on their special day. Next time you stop by [Business Name] during your birthday week, your first [Product/Drink/Treat] is on us!{"\n\n"}
                No strings attached—just our way of saying Happy Birthday and thank you for being part of our community.{"\n\n"}
                See you soon,{"\n"}
                The team at [Business Name]
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Example 5: The "Referral Perk" (Growth)</h2>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mb-8 font-mono text-sm text-slate-800">
              <p className="font-bold mb-2">Subject: Know someone who loves [Product Type]?</p>
              <div className="whitespace-pre-wrap">
                Hi [First Name],{"\n\n"}
                They say good things are meant to be shared. {"\n\n"}
                Do you have a friend who would love [Business Name] as much as you do? If you refer a friend and they sign up for our club, we’ll give you **both** a special treat on your next visit.{"\n\n"}
                [Link: Share your referral code]{"\n\n"}
                Thanks for helping us spread the word and keeping our local community vibrant!{"\n\n"}
                Best,{"\n"}
                [Business Name]
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to Set These Emails on Autopilot</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Copying these templates is a great first step, but the real power comes from **automation**. You shouldn't have to manually track who is due for a "Miss You" email or whose birthday is next week.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Using a tool like Customer Comeback Machine allows you to "set it and forget it." You set the triggers once, and the system handles the rest, bringing customers back while you focus on running your business.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-16 mb-6">Conclusion: Better Follow-Up Starts with One Click</h2>
            <p className="text-slate-600 leading-relaxed">
              Don't let perfection stand in the way of progress. Choose one of the templates above—maybe the "Warm Welcome"—and set it up today. Your customers will appreciate the personal touch, and your bottom line will appreciate the repeat business.
            </p>
          </div>

          <div className="mt-20 rounded-3xl bg-slate-900 p-12 text-center text-white">
            <h2 className="text-2xl font-bold">Ready to automate your follow-up?</h2>
            <p className="mt-4 text-slate-400">
              Set up these exact sequences in under 5 minutes with Customer Comeback Machine.
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
