import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";

// Define search params for niche-specific variations
type HomeSearch = {
  niche?: "dentistry" | "hvac" | "chiropractic";
};

const getBusinessName = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const cfg = JSON.parse(await readFile("site.json", "utf8")) as {
      businessName?: string;
    };
    return cfg.businessName?.trim() ?? "";
  } catch {
    return "";
  }
});

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    return {
      niche: (search.niche as HomeSearch["niche"]) || undefined,
    };
  },
  loader: () => getBusinessName(),
  component: Home,
});

const NICHE_CONTENT = {
  dentistry: {
    icon: "🦷",
    h1: "Your $10k patients are one forgotten appointment away from never coming back.",
    subtitle: "40-50% of cosmetic patients miss their 6-month recall. Not because they don't love their smile — because life gets in the way. The Connection Guard automates the gentle nudges that bring them home.",
    cta: "Start Your Free Trial — Protect Your Patient LTV",
    features: [
      {
        title: "Smile Guard Automation",
        description: "Custom-timed sequence: Day 1 smile check → Month 5.5 recall → 4-week Invisalign check → Annual birthday surprise → 60-day win-back."
      },
      {
        title: "Set It and Forget It",
        description: "Automatically send post-treatment smile checks, 6-month hygiene recall reminders, and Invisalign progress nudges."
      },
      {
        title: "Build Your List Effortlessly",
        description: "A beautiful QR code on your checkout counter captures every patient's info. One scan = a lifetime relationship tracked."
      }
    ],
    socialProof: "Dr. Patel recovered $40k+/year in lost recall revenue. One Invisalign patient ($5,600) paid for CCM for the entire year. The rest was pure practice growth."
  },
  hvac: {
    icon: "🏠",
    h1: "Stop Playing Emergency Roulette — Turn One Call Into a Lifetime Customer.",
    subtitle: "HVAC has the highest CPC in local business ($50-$150/click). You're spending a fortune to acquire customers who call once and disappear. The Connection Guard turns emergency repairs into annual maintenance contracts — automatically.",
    cta: "Start Your Free Trial — Build Annual Contracts",
    features: [
      {
        title: "Seasonal Contract Protection",
        description: "Timed automation: Day 1 thank-you → March spring tune-up → October fall inspection → Quarterly filter change → 12-month win-back."
      },
      {
        title: "Set It and Forget It",
        description: "A QR code on every invoice triggers automated spring tune-up reminders, fall inspection nudges, and quarterly filter alerts."
      },
      {
        title: "Build Your List Effortlessly",
        description: "Every service call becomes a captured contact. No more chasing lost leads. No more re-buying customers from Google every season."
      }
    ],
    socialProof: "Mike's HVAC was spending $12k/month on Google Ads. CCM turned 25% of emergency callers into annual maintenance contracts. One contract ($579/year) paid for CCM. The other 24 were pure profit."
  },
  chiropractic: {
    icon: "🦴",
    h1: "60% of Your Patients Ghost After 3 Visits. Not Because You Failed.",
    subtitle: "The 'Pain-Only' Cycle is the #1 revenue killer in chiropractic. Patients feel 'good enough' and stop coming — long before they're fully recovered. The Connection Guard bridges the gap with automated wellness check-ins that feel like care, not sales.",
    cta: "Start Your Free Trial — Keep Patients on Track",
    features: [
      {
        title: "Pain-Free Recovery Automation",
        description: "Timed sequence: Day 1 'How's your alignment?' → 2-week check-in → 4-week maintenance → 60-day win-back → Referral request at visit 5."
      },
      {
        title: "Set It and Forget It",
        description: "Automated alignment check-ins at 2 weeks, maintenance reminders at 4 weeks, and win-back sequences for patients who've drifted."
      },
      {
        title: "Build Your List Effortlessly",
        description: "A QR code on your front desk captures every new patient. One scan starts a wellness journey that keeps them coming back for months."
      }
    ],
    socialProof: "Dr. Rivera boosted patient compliance by 40%. One maintenance patient ($1,800/year) paid for 3 full years of CCM. The other 39 retained patients? Pure practice growth."
  },
  generic: {
    icon: "🛡️",
    h1: "Stop Letting Good Customers Disappear Into The Void.",
    subtitle: "The average local business loses 20-40% of their customers every year just to 'drift.' The Connection Guard is the automated safety net that turns one-time visitors into lifetime regulars.",
    cta: "Start Your Free Trial — Guard Your Revenue",
    features: [
      {
        title: "Set It and Forget It",
        description: "Automated follow-ups, review requests, and loyalty campaigns triggered by a simple QR code scan."
      },
      {
        title: "Build Your List Effortlessly",
        description: "Capture customer data at the point of sale without slowing down your workflow."
      },
      {
        title: "Founding Member Offer",
        description: "Lock in our $49/mo lifetime rate. Only 10 spots available per niche."
      }
    ],
    socialProof: "One recovered customer per year pays for the entire system. Everything else is pure profit."
  }
};

function Home() {
  const businessName = Route.useLoaderData();
  const { niche } = Route.useSearch();
  const content = NICHE_CONTENT[niche || "generic"];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Scarcity Banner */}
      <div className="bg-amber-500 py-2 text-center text-sm font-bold text-white">
        ⏳ FOUNDING MEMBER OFFER: $49/MO LIFETIME RATE — ONLY 10 SPOTS LEFT IN {niche?.toUpperCase() || "YOUR AREA"}
      </div>

      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-24">
        {/* Hero Section */}
        <section className="text-center">
          <div className="mb-6 flex justify-center">
             <span className="text-5xl">{content.icon}</span>
          </div>
          <h1 className="mb-6 bg-gradient-to-r from-amber-500 to-rose-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            {content.h1}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600 dark:text-gray-400">
            {content.subtitle}
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/signup"
              className="rounded-lg bg-rose-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-rose-700 transition-colors"
            >
              {content.cta}
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">
              No credit card required • 5-minute setup • $49/mo Founding Member rate
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-24 grid gap-12 sm:grid-cols-3">
          {content.features.map((feature, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        {/* Social Proof Banner */}
        <section className="mt-24 rounded-3xl bg-gradient-to-br from-amber-50 to-rose-50 p-8 text-center dark:from-gray-900 dark:to-gray-900 border border-amber-100 dark:border-amber-900/30">
          <p className="text-2xl font-medium italic text-gray-800 dark:text-gray-200">
            "{content.socialProof}"
          </p>
        </section>
      </main>

      <footer className="py-12 text-center text-sm text-gray-400 dark:text-gray-600">
        © 2026 {businessName || "Customer Comeback Machine"}. Built with{" "}
        <a href="https://cto.new" className="underline hover:text-gray-600 dark:hover:text-gray-400">
          cto.new
        </a>
      </footer>
    </div>
  );
}
