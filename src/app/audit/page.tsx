"use client";

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';

type AuditData = {
  businessName: string;
  businessType: string;
  monthlyCustomers: number;
  avgTicket: number;
  churnRate: number;
  hasLoyaltyProgram: string;
  hasAutomatedFollowUp: string;
  hasReviewSystem: string;
  email: string;
};

type AuditResult = {
  score: number;
  grade: string;
  color: string;
  lostCustomersPerYear: number;
  lostRevenuePerYear: number;
  recoverableRevenue: number;
  findings: string[];
  recommendations: string[];
};

export default function ReputationGuardAudit() {
  const [step, setStep] = useState<'form' | 'loading' | 'results'>('form');
  const [data, setData] = useState<AuditData>({
    businessName: '',
    businessType: 'salon',
    monthlyCustomers: 100,
    avgTicket: 80,
    churnRate: 30,
    hasLoyaltyProgram: 'no',
    hasAutomatedFollowUp: 'no',
    hasReviewSystem: 'no',
    email: '',
  });
  const [result, setResult] = useState<AuditResult | null>(null);

  const update = (field: keyof AuditData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const calculateScore = (): number => {
    let score = 50;

    // Churn rate impact
    if (data.churnRate <= 15) score += 20;
    else if (data.churnRate <= 25) score += 10;
    else if (data.churnRate <= 35) score += 0;
    else score -= 10;

    // Loyalty program
    if (data.hasLoyaltyProgram === 'yes') score += 15;
    else if (data.hasLoyaltyProgram === 'manual') score += 5;

    // Automated follow-up
    if (data.hasAutomatedFollowUp === 'yes') score += 20;
    else if (data.hasAutomatedFollowUp === 'partial') score += 8;

    // Review system
    if (data.hasReviewSystem === 'yes') score += 15;
    else if (data.hasReviewSystem === 'manual') score += 5;

    return Math.max(0, Math.min(100, score));
  };

  const getGrade = (score: number): { grade: string; color: string; label: string } => {
    if (score >= 85) return { grade: 'A', color: 'text-emerald-500', label: 'Guardian' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-500', label: 'Protector' };
    if (score >= 50) return { grade: 'C', color: 'text-amber-500', label: 'Sentinel' };
    if (score >= 30) return { grade: 'D', color: 'text-orange-500', label: 'Vulnerable' };
    return { grade: 'F', color: 'text-red-500', label: 'At Risk' };
  };

  const getFindings = (): string[] => {
    const findings: string[] = [];
    if (data.churnRate > 30) findings.push(`Your churn rate of ${data.churnRate}% is above the industry average of 25%.`);
    else if (data.churnRate > 20) findings.push(`Your churn rate of ${data.churnRate}% is near the industry average of 25%.`);
    else findings.push(`Your churn rate of ${data.churnRate}% is below the industry average — great start!`);

    if (data.hasLoyaltyProgram !== 'yes') findings.push('Without a loyalty program, you are leaving repeat business on the table.');
    if (data.hasAutomatedFollowUp !== 'yes') findings.push('You have no automated follow-up system — most customers who leave are never contacted.');
    if (data.hasReviewSystem !== 'yes') findings.push('Without a review request system, 70% of your satisfied customers never leave a public review.');
    return findings;
  };

  const getRecommendations = (): string[] => {
    const recs: string[] = [];
    if (data.hasAutomatedFollowUp !== 'yes') recs.push('Set up automated email follow-ups triggered by a QR scan — recapture 40% of lost customers.');
    if (data.hasLoyaltyProgram !== 'yes') recs.push('Launch a digital loyalty program (birthday club, punch cards) to increase visit frequency by 30%.');
    if (data.hasReviewSystem !== 'yes') recs.push('Automate review requests to turn one-time visitors into your best marketing channel.');
    recs.push('Add "We Miss You" win-back campaigns for customers who have not visited in 90+ days.');
    return recs;
  };

  const saveAuditResult = async (resultData: AuditResult) => {
    try {
      await fetch('/api/audit/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          businessName: data.businessName,
          businessType: data.businessType,
          monthlyCustomers: data.monthlyCustomers,
          avgTicket: data.avgTicket,
          churnRate: data.churnRate,
          city: '',
          score: resultData.score,
          grade: resultData.grade,
          lostCustomersPerYear: resultData.lostCustomersPerYear,
          lostRevenuePerYear: resultData.lostRevenuePerYear,
          recoverableRevenue: resultData.recoverableRevenue,
          findings: resultData.findings,
          recommendations: resultData.recommendations,
        }),
      });
    } catch (err) {
      console.error('Failed to save audit result:', err);
    }
  };

  const runAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');

    const score = calculateScore();
    const grade = getGrade(score);
    const monthlyLost = Math.round(data.monthlyCustomers * (data.churnRate / 100));
    const yearlyLostCustomers = monthlyLost * 12;
    const yearlyLostRevenue = yearlyLostCustomers * data.avgTicket;
    const recoverable = Math.round(yearlyLostRevenue * 0.4);

    const resultData: AuditResult = {
      score,
      grade: grade.grade,
      color: grade.color,
      lostCustomersPerYear: yearlyLostCustomers,
      lostRevenuePerYear: yearlyLostRevenue,
      recoverableRevenue: recoverable,
      findings: getFindings(),
      recommendations: getRecommendations(),
    };

    // Simulate calculation delay, then save and show results
    setTimeout(() => {
      setResult(resultData);
      setStep('results');
      // Save to pipeline (fire-and-forget)
      saveAuditResult(resultData);
    }, 2000);
  };

  const scoreColor = result?.color || 'text-slate-500';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        {/* Loading State */}
        {step === 'loading' && (
          <div className="mx-auto max-w-md text-center py-32">
            <div className="animate-pulse">
              <div className="mx-auto h-24 w-24 rounded-full bg-amber-200 flex items-center justify-center">
                <svg className="h-12 w-12 text-amber-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <h2 className="mt-8 text-2xl font-bold text-slate-700">Analyzing Your Reputation Guard Score...</h2>
              <p className="mt-4 text-slate-500">Calculating churn impact and retention opportunities</p>
            </div>
          </div>
        )}

        {/* Results */}
        {step === 'results' && result && (
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Your <span className="text-amber-500">Reputation Guard</span> Score
              </h1>
              <p className="mt-4 text-xl text-slate-600">
                Personalized retention audit for <strong>{data.businessName || 'your business'}</strong>
              </p>
            </div>

            {/* Score Card */}
            <div className="rounded-3xl bg-white p-10 shadow-xl border border-slate-100 text-center mb-8">
              <div className={`text-8xl font-black ${scoreColor} mb-4`}>
                {result.grade}
              </div>
              <div className="text-lg font-bold text-slate-500 uppercase tracking-widest mb-2">
                {result.score}/100 — {result.grade === 'A' ? 'Guardian' : result.grade === 'B' ? 'Protector' : result.grade === 'C' ? 'Sentinel' : result.grade === 'D' ? 'Vulnerable' : 'At Risk'}
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${result.score >= 70 ? 'bg-emerald-500' : result.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            {/* Impact Stats */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 text-center">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Customers Lost / Year</div>
                <div className="text-3xl font-extrabold text-red-500">{result.lostCustomersPerYear.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 text-center">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Revenue Lost / Year</div>
                <div className="text-3xl font-extrabold text-red-500">${result.lostRevenuePerYear.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-amber-50 p-6 shadow-md border border-amber-100 text-center">
                <div className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-2">Recoverable Revenue</div>
                <div className="text-3xl font-extrabold text-amber-600">${result.recoverableRevenue.toLocaleString()}</div>
              </div>
            </div>

            {/* Findings */}
            <div className="rounded-3xl bg-white p-8 shadow-xl border border-slate-100 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">🔍 Key Findings</h2>
              <ul className="space-y-4">
                {result.findings.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <span className="mt-1 text-amber-500 shrink-0">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 p-8 shadow-xl border border-amber-100 mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">🛡️ Your Custom Action Plan</h2>
              <ul className="space-y-4">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="text-center">
              <div className="rounded-3xl bg-slate-900 p-8 shadow-xl mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Want us to set this up for you?</h3>
                <p className="text-slate-300 mb-6">
                  We will build and launch your custom retention system in <strong>48 hours</strong> — white-glove setup included.
                </p>
                <a href="/signup">
                  <Button size="lg" className="shadow-lg shadow-amber-500/20 bg-amber-500 hover:bg-amber-600 text-white">
                    Claim Your Custom Setup →
                  </Button>
                </a>
              </div>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setStep('form')}>
                  Run Another Audit
                </Button>
                <a href="/pricing">
                  <Button variant="ghost">View Pricing</Button>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {step === 'form' && (
          <>
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Your <span className="text-amber-500">Reputation Guard</span> Score
              </h1>
              <p className="mt-4 text-xl text-slate-600">
                See exactly how much revenue you are losing to customer churn — and how to win it back.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
                <span>⚡</span> Free audit — takes 2 minutes
              </div>
            </div>

            <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
              <form className="space-y-8" onSubmit={runAudit}>
                {/* Business Info */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    1. Business Name
                  </label>
                  <input
                    type="text"
                    value={data.businessName}
                    onChange={(e) => update('businessName', e.target.value)}
                    placeholder="e.g. Main Street Salon"
                    className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    2. What type of business?
                  </label>
                  <select
                    value={data.businessType}
                    onChange={(e) => update('businessType', e.target.value)}
                    className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                  >
                    <option value="salon">Salon / Barber</option>
                    <option value="medspa">Med Spa</option>
                    <option value="dental">Dental</option>
                    <option value="optical">Optical</option>
                    <option value="fitness">Fitness / Yoga</option>
                    <option value="pet">Pet Grooming</option>
                    <option value="coffee">Coffee Shop</option>
                    <option value="bakery">Bakery</option>
                    <option value="auto">Auto Repair / Detailing</option>
                    <option value="boutique">Boutique / Retail</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Monthly Volume */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                      3. Monthly customers
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100000}
                      value={data.monthlyCustomers}
                      onChange={(e) => update('monthlyCustomers', parseInt(e.target.value) || 0)}
                      className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                      4. Avg ticket price ($)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={data.avgTicket}
                      onChange={(e) => update('avgTicket', parseInt(e.target.value) || 0)}
                      className="mt-2 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                {/* Churn Rate */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    5. Estimated churn rate — what % of customers never return?
                  </label>
                  <div className="mt-2 flex items-center gap-4">
                    <input
                      type="range"
                      min={5}
                      max={70}
                      value={data.churnRate}
                      onChange={(e) => update('churnRate', parseInt(e.target.value))}
                      className="flex-1 accent-amber-500"
                    />
                    <span className="text-lg font-bold text-amber-600 w-16 text-right">{data.churnRate}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 px-1">
                    <span>5% (Great)</span>
                    <span>35% (Average)</span>
                    <span>70% (Critical)</span>
                  </div>
                </div>

                {/* Systems Check */}
                <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Current Systems Check</h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Do you have a loyalty / rewards program?
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'yes', label: '✅ Yes, automated' },
                          { value: 'manual', label: '📋 Manual (punch cards)' },
                          { value: 'no', label: '❌ No' },
                        ].map((opt) => (
                          <label
                            key={opt.value}
                            className={`relative flex cursor-pointer items-center justify-center rounded-xl border p-3 text-sm font-medium transition-colors ${data.hasLoyaltyProgram === opt.value ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                          >
                            <input
                              type="radio"
                              name="loyalty"
                              className="sr-only"
                              checked={data.hasLoyaltyProgram === opt.value}
                              onChange={() => update('hasLoyaltyProgram', opt.value)}
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Do you have automated follow-up emails/texts?
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'yes', label: '✅ Yes, fully' },
                          { value: 'partial', label: '🔧 Partial' },
                          { value: 'no', label: '❌ No' },
                        ].map((opt) => (
                          <label
                            key={opt.value}
                            className={`relative flex cursor-pointer items-center justify-center rounded-xl border p-3 text-sm font-medium transition-colors ${data.hasAutomatedFollowUp === opt.value ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                          >
                            <input
                              type="radio"
                              name="followup"
                              className="sr-only"
                              checked={data.hasAutomatedFollowUp === opt.value}
                              onChange={() => update('hasAutomatedFollowUp', opt.value)}
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Do you have an automated review request system?
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'yes', label: '✅ Yes, automated' },
                          { value: 'manual', label: '📋 Ask manually' },
                          { value: 'no', label: '❌ No' },
                        ].map((opt) => (
                          <label
                            key={opt.value}
                            className={`relative flex cursor-pointer items-center justify-center rounded-xl border p-3 text-sm font-medium transition-colors ${data.hasReviewSystem === opt.value ? 'border-amber-500 bg-amber-50 text-amber-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                          >
                            <input
                              type="radio"
                              name="review"
                              className="sr-only"
                              checked={data.hasReviewSystem === opt.value}
                              onChange={() => update('hasReviewSystem', opt.value)}
                            />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Capture */}
                <div className="rounded-2xl bg-amber-50 p-6 border border-amber-100">
                  <h3 className="text-lg font-bold text-amber-900">Get your full audit report</h3>
                  <p className="mt-1 text-sm text-amber-700">
                    Enter your email and we'll send you a detailed PDF breakdown of your score.
                  </p>
                  <input
                    type="email"
                    required
                    value={data.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                    className="mt-4 block w-full rounded-xl border-amber-200 bg-white px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full shadow-lg shadow-amber-500/20"
                >
                  Calculate My Reputation Guard Score
                </Button>
              </form>
            </div>

            {/* Trust Building */}
            <div className="mx-auto max-w-2xl mt-12 text-center">
              <div className="flex justify-center gap-8 text-sm text-slate-500">
                <span>🔒 No spam, ever</span>
                <span>⚡ Results in 2 minutes</span>
                <span>📋 Free PDF report</span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}