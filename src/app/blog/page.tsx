import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';

export default function BlogPage() {
  const posts = [
    {
      title: '7 Proven Strategies to Get More Repeat Customers for Your Local Business',
      excerpt: 'Discover how to turn one-time visitors into lifelong fans. These 7 proven customer retention strategies will help your local business grow.',
      category: 'Growth',
      date: 'May 15, 2024',
      slug: 'how-to-get-more-repeat-customers',
    },
    {
      title: 'How to Ask Customers for Reviews Without Feeling Awkward',
      excerpt: 'Struggle with asking for reviews? Learn how to automate the process and get more 5-star Google reviews for your business.',
      category: 'Reviews',
      date: 'May 12, 2024',
      slug: 'how-to-ask-for-reviews',
    },
    {
      title: '5 Customer Follow-Up Email Examples Every Local Shop Should Use',
      excerpt: 'Need inspiration for your customer emails? Steal these 5 high-converting follow-up email examples designed to bring people back.',
      category: 'Email Marketing',
      date: 'May 10, 2024',
      slug: 'customer-follow-up-email-examples',
    },
    {
      title: '10 Creative Birthday Club Ideas for Small Businesses to Boost Loyalty',
      excerpt: 'Ready to launch a birthday club? Check out these 10 creative ideas for local businesses to delight customers and increase repeat visits.',
      category: 'Loyalty',
      date: 'May 8, 2024',
      slug: 'birthday-club-ideas',
    },
    {
      title: '5 Low-Cost Loyalty Program Ideas for Boutiques and Retailers',
      excerpt: 'You don\'t need a complex points system. Here are 5 simple and effective loyalty program ideas for boutiques that actually work.',
      category: 'Boutiques',
      date: 'May 5, 2024',
      slug: 'loyalty-program-ideas-for-boutiques',
    },
    {
      title: '5 Salon Customer Follow-Up Ideas to Keep Your Chairs Full',
      excerpt: 'Don\'t wait for them to book. Learn 5 salon customer follow-up ideas that increase rebooking rates and build long-term client loyalty.',
      category: 'Salons',
      date: 'May 3, 2024',
      slug: 'salon-customer-follow-up-ideas',
    },
    {
      title: 'How to Turn Morning Commuters into Daily Regulars: Coffee Shop Retention Ideas',
      excerpt: 'Small margins mean you need repeat visits. Discover 7 coffee shop customer retention ideas to build a loyal community of regulars.',
      category: 'Coffee Shops',
      date: 'May 1, 2024',
      slug: 'coffee-shop-customer-retention-ideas',
    },
    {
      title: 'Small Business Email Automation: A Beginner’s Guide to "Set It and Forget It"',
      excerpt: 'New to automation? This guide explains how small business email automation works and how it can save you hours of work every week.',
      category: 'Automation',
      date: 'April 28, 2024',
      slug: 'small-business-email-automation',
    },
    {
      title: 'The Only Local Business Review Request Template You’ll Ever Need',
      excerpt: 'Stop overthinking your review requests. Use this proven local business review request template to get more Google reviews starting today.',
      category: 'Templates',
      date: 'April 25, 2024',
      slug: 'local-business-review-request-template',
    },
    {
      title: 'How to Build a Massive Customer List with QR Codes (Step-by-Step)',
      excerpt: 'Turn foot traffic into a digital goldmine. Learn how to build a customer email list using QR codes in your local shop or restaurant.',
      category: 'QR Codes',
      date: 'April 22, 2024',
      slug: 'how-to-build-a-customer-list-with-qr-codes',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            The <span className="text-amber-500">Comeback</span> Blog
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
            Tips, templates, and strategies to help small businesses thrive through better customer follow-up.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article key={index} className="flex flex-col rounded-3xl bg-white p-8 shadow-sm border border-slate-100 transition-all hover:shadow-md">
              <div className="mb-4">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-600">
                  {post.category}
                </span>
                <span className="ml-4 text-xs text-slate-400">{post.date}</span>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-slate-900 line-clamp-2">
                <a href={`/blog/${post.slug}`} className="hover:text-amber-500 transition-colors">
                  {post.title}
                </a>
              </h2>
              <p className="mb-8 text-slate-600 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-auto">
                <a href={`/blog/${post.slug}`} className="text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors">
                  Read Article &rarr;
                </a>
              </div>
            </article>
          ))}
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
