import { createFileRoute } from "@tanstack/react-router";

type PricingSearch = {
  niche?: "dentistry" | "hvac" | "chiropractic";
};

export const Route = createFileRoute("/pricing")({
  validateSearch: (search: Record<string, unknown>): PricingSearch => {
    return {
      niche: (search.niche as PricingSearch["niche"]) || undefined,
    };
  },
  component: Pricing,
});

const NICHE_BANNERS = {
  dentistry: {
    headline: "🦷 The Smile Guard — $49/mo Lifetime for Miami/Phoenix Dentists",
    body: "First 10 cosmetic dentistry practices in Miami and Phoenix get the Connection Guard's automated recall system at the Founding Member rate.",
    perks: [
      { name: "Automated 6-month recall", value: "$12k-$18k recovered per 100 patients" },
      { name: "Invisalign progress tracking", value: "Keeps $5k+ treatments on schedule" },
      { name: "Owner HQ Mobile App", value: "Included free" },
      { name: "Setup Fee", value: "$497 WAIVED" },
    ],
    math: "One Invisalign patient pays for your entire year of CCM.",
    cta: "Claim Your Smile Guard →"
  },
  hvac: {
    headline: "🏠 The Annual Contract Machine — $49/mo Lifetime for Phoenix HVAC",
    body: "First 10 HVAC companies in Phoenix get the Connection Guard's automated contract conversion system at the Founding Member rate.",
    perks: [
      { name: "Emergency-to-contract conversion", value: "Turn 25% of callers into annual contracts" },
      { name: "CPC cost recovery", value: "Stop paying $50-$150 per Google click twice" },
      { name: "Owner HQ Mobile App", value: "Included free" },
      { name: "Setup Fee", value: "$497 WAIVED" },
    ],
    math: "One annual contract ($579) pays for CCM. The rest is pure growth.",
    cta: "Claim Your Contract Machine →"
  },
  chiropractic: {
    headline: "🦴 The Wellness Compliance System — $49/mo Lifetime for Miami Chiropractors",
    body: "First 10 chiropractic practices in Miami get the Connection Guard's automated patient compliance system at the Founding Member rate.",
    perks: [
      { name: "Patient compliance boost", value: "40% more patients complete their recovery plan" },
      { name: "Maintenance revenue", value: "$1,200-$2,400/yr per retained patient" },
      { name: "Owner HQ Mobile App", value: "Included free" },
      { name: "Setup Fee", value: "$497 WAIVED" },
    ],
    math: "One maintenance patient ($1,800/yr) pays for 3 YEARS of CCM.",
    cta: "Claim Your Wellness System →"
  },
  generic: {
    headline: "🛡️ Founding Member Offer — $49/mo Lifetime",
    body: "Be one of the first 10 businesses in your niche to lock in our lowest possible rate forever.",
    perks: [
      { name: "Full Automation Suite", value: "Included" },
      { name: "Owner HQ Mobile App", value: "Included free" },
      { name: "White-glove Support", value: "Included" },
      { name: "Setup Fee", value: "$497 WAIVED" },
    ],
    math: "One recovered customer pays for the year.",
    cta: "Claim Your Founding Spot →"
  }
};

function Pricing() {
  const { niche } = Route.useSearch();
  const banner = NICHE_BANNERS[niche || "generic"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-extrabold text-center mb-12 text-gray-900 dark:text-white">
          Simple, Results-Driven Pricing
        </h1>

        <div className="grid gap-8 sm:grid-cols-2 mb-16">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm opacity-50 cursor-not-allowed">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white text-center">Growth</h2>
            <div className="text-4xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">$99<span className="text-lg font-medium text-gray-500">/mo</span></div>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400 mb-8">
              <li>• Unlimited QR Scans</li>
              <li>• Basic Automations</li>
              <li>• Weekly Reports</li>
            </ul>
            <button disabled className="w-full py-3 bg-gray-200 dark:bg-gray-800 text-gray-500 rounded-xl font-bold">Coming Soon</button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 border-rose-600 dark:border-rose-500 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-rose-600 text-white px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-bl-xl">
              Founding Member
            </div>
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white text-center">Lifetime Lock-in</h2>
            <div className="text-4xl font-extrabold text-center mb-6 text-gray-900 dark:text-white">$49<span className="text-lg font-medium text-gray-500">/mo</span></div>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400 mb-8 font-medium">
              <li>• Priority Feature Access</li>
              <li>• Owner HQ Mobile App</li>
              <li>• Direct Developer Support</li>
              <li className="text-rose-600 font-bold">• $49/mo Locked Forever</li>
            </ul>
            <a href="/signup" className="block text-center w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg transition-colors">
              Get Started Now
            </a>
          </div>
        </div>

        {/* Niche-Specific Scarcity Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-rose-600 rounded-3xl p-1 text-white shadow-2xl">
          <div className="bg-white dark:bg-gray-900 rounded-[calc(1.5rem-4px)] p-8 sm:p-12">
            <h3 className="text-2xl sm:text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-600">
              {banner.headline}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {banner.body}
            </p>

            <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 mb-8">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-bold">Perk</th>
                    <th className="px-6 py-3 font-bold">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {banner.perks.map((perk, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{perk.name}</td>
                      <td className="px-6 py-4 text-sm text-rose-600 font-bold">{perk.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-xl font-bold text-gray-900 dark:text-white italic">
                "{banner.math}"
              </p>
              <a href="/signup" className="rounded-full bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 font-black text-lg shadow-lg transition-transform hover:scale-105">
                {banner.cta}
              </a>
            </div>
            <p className="mt-8 text-center text-sm text-gray-400 font-medium">
              ⏳ 10 spots per niche. When they're gone, the rate goes to $99/mo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
