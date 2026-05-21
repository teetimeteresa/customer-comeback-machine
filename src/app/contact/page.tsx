import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-16 md:grid-cols-2">
            {/* Left Side: Copy */}
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                Let's <span className="text-amber-500">Chat.</span>
              </h1>
              <p className="mt-8 text-xl text-slate-600 leading-relaxed">
                Have a question about the plans? Need help getting set up? Or just want to see if we're a good fit for your shop?
              </p>
              
              <div className="mt-12 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Email Us</h3>
                    <p className="text-slate-600">hello@customercomeback.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Live Support</h3>
                    <p className="text-slate-600">Available Mon-Fri, 9am - 5pm EST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                    placeholder="Joe Local"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                    Business Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                    placeholder="joe@localbakery.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700">
                    How can we help?
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                    placeholder="Tell us about your business..."
                    required
                  ></textarea>
                </div>

                <Button size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-100 bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Customer Comeback Machine. Built for local businesses.
          </p>
        </div>
      </footer>
    </div>
  );
}
