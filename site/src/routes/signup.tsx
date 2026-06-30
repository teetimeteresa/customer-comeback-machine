import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-amber-500 to-rose-600 bg-clip-text text-transparent mb-2">
            Secure Your Founding Spot
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Join the Connection Guard and stop letting revenue drift away.
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Business Name</label>
            <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="e.g. Acme Dentistry" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Work Email</label>
            <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 focus:ring-2 focus:ring-rose-500 outline-none transition-all" placeholder="name@business.com" />
          </div>
          <button className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-lg rounded-xl shadow-lg shadow-rose-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98] mt-4">
            Claim My $49/mo Lifetime Rate
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-400">
          No credit card required for trial • Secure setup takes 5 minutes • GDPR Compliant
        </p>
      </div>
    </div>
  );
}
