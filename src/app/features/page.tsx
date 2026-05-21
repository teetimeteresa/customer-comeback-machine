import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';

export default function FeaturesPage() {
  const features = [
    {
      title: 'Automated Thank-Yous',
      description: 'Send a warm thank-you message immediately after a customer joins your list. Make them feel valued from day one.',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: 'Google Review Requests',
      description: 'Automatically ask for reviews 2 days after their visit. Build your online reputation without the manual effort.',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      title: 'Comeback Offers',
      description: 'Lapsed customers? We send a "We miss you" email with a custom offer to bring them back through your doors.',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Birthday Club',
      description: 'Collect birthdays automatically and send a special gift 7 days before their big day. Create loyal fans for life.',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-1.5-.454M21 12.727c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-1.5-.454M21 9.909c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-1.5-.454M3 8V4a2 2 0 012-2h14a2 2 0 012 2v4M5 20h14a2 2 0 012 2v2H3v-2a2 2 0 012-2z" />
        </svg>
      ),
    },
    {
      title: 'Referral Engine',
      description: 'Incentivize your best customers to spread the word. Automate the referral request and track the results.',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Analytics Dashboard',
      description: 'See exactly how many people are opting in, clicking your offers, and leaving reviews. Data-driven growth.',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      
      <main>
        {/* Header */}
        <section className="bg-slate-50 py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Features built for <span className="text-amber-500">busy owners.</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-3xl mx-auto">
              We took the most effective marketing strategies and automated them. You run the business, we'll handle the comeback.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="group rounded-3xl border border-slate-100 p-8 transition-all hover:border-amber-100 hover:bg-amber-50/50">
                  <div className="mb-6 h-14 w-14 rounded-2xl bg-amber-100 p-3.5 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-slate-900 py-24 text-center text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to automate your follow-up?</h2>
            <p className="mt-6 text-xl text-slate-400">Join hundreds of local businesses growing with us.</p>
            <div className="mt-10 flex justify-center">
              <Button size="lg" className="px-12">
                Start Your Free Trial
              </Button>
            </div>
          </div>
        </section>
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
