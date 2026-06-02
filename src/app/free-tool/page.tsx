"use client";

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/Button';
import { messageTemplates } from './data';

export default function FreeTool() {
  const [formData, setFormData] = useState({
    businessType: 'Boutique',
    action: 'Bought a product',
    tone: 'Friendly',
    goal: 'Get a review',
    email: ''
  });

  const [results, setResults] = useState<null | {
    thank_you: string;
    review_request: string;
    comeback_offer: string;
    referral: string;
    social_caption: string;
  }>(null);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      alert("Please enter your email to see the results.");
      return;
    }

    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      const templates = (messageTemplates as any)[formData.tone];
      
      const processed = {
        thank_you: replacePlaceholders(templates.thank_you),
        review_request: replacePlaceholders(templates.review_request),
        comeback_offer: replacePlaceholders(templates.comeback_offer),
        referral: replacePlaceholders(templates.referral),
        social_caption: replacePlaceholders(templates.social_caption),
      };

      setResults(processed);
      setIsGenerating(false);
      
      // Scroll to results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const replacePlaceholders = (text: string) => {
    return text
      .replace(/\[Name\]/g, "Customer")
      .replace(/\[BusinessType\]/g, formData.businessType)
      .replace(/\[Business Name\]/g, "Your Business");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        {results ? (
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">Your Custom Follow-Up Messages</h2>
            <div className="space-y-6">
              {[
                { label: "1. Thank-You Message", text: results.thank_you },
                { label: "2. Review Request", text: results.review_request },
                { label: "3. Comeback Offer", text: results.comeback_offer },
                { label: "4. Referral Message", text: results.referral },
                { label: "5. Social Media Caption", text: results.social_caption },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{item.label}</h4>
                  <p className="text-lg text-slate-800">{item.text}</p>
                  <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigator.clipboard.writeText(item.text)}>
                    Copy to Clipboard
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button size="lg" onClick={() => setResults(null)}>Start Over</Button>
              <p className="mt-4 text-slate-500">We've also sent these to {formData.email}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                What Follow-Up Should I Send My Customer?
              </h1>
              <p className="mt-4 text-xl text-slate-600">
                Tell us about your customer, and we'll help you find the perfect words.
              </p>
            </div>

            <div className="mt-12 mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Question 1 */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    1. What kind of business do you run?
                  </label>
                  <select 
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                    className="mt-4 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500"
                  >
                    <option>Boutique</option>
                    <option>Salon</option>
                    <option>Coffee Shop</option>
                    <option>Bakery</option>
                    <option>Med Spa</option>
                    <option>Photographer</option>
                    <option>Fitness Studio</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Question 2 */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    2. What did the customer do?
                  </label>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {['Bought a product', 'Booked a service', 'Just browsed'].map((option) => (
                      <label key={option} className={`relative flex cursor-pointer rounded-xl border p-4 transition-colors ${formData.action === option ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <input 
                          type="radio" 
                          name="action" 
                          className="mr-2 accent-amber-500" 
                          checked={formData.action === option}
                          onChange={() => setFormData({...formData, action: option})}
                        />
                        <span className="text-sm font-medium text-slate-900">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Question 3 */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    3. What’s your brand tone?
                  </label>
                  <select 
                    value={formData.tone}
                    onChange={(e) => setFormData({...formData, tone: e.target.value})}
                    className="mt-4 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500"
                  >
                    <option>Friendly</option>
                    <option>Professional</option>
                    <option>Luxury</option>
                    <option>Funny</option>
                    <option>Heartfelt</option>
                    <option>Neighborly</option>
                    <option>Simple</option>
                  </select>
                </div>

                {/* Question 4 */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
                    4. What’s your main goal?
                  </label>
                  <select 
                    value={formData.goal}
                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                    className="mt-4 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500"
                  >
                    <option>Get a review</option>
                    <option>Bring them back</option>
                    <option>Ask for a referral</option>
                    <option>Get a birthday list</option>
                    <option>Thank-you message</option>
                  </select>
                </div>

                {/* Email Collection (Before Results) */}
                <div className="rounded-2xl bg-amber-50 p-6 border border-amber-100">
                  <h3 className="text-lg font-bold text-amber-900">Where should we send your results?</h3>
                  <p className="mt-1 text-sm text-amber-700">Enter your email and we'll send you the full templates.</p>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="you@example.com"
                    className="mt-4 block w-full rounded-xl border-amber-200 bg-white px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none" 
                  />
                </div>

                <Button 
                  type="submit"
                  size="lg" 
                  disabled={isGenerating}
                  className="w-full shadow-lg shadow-amber-500/20"
                >
                  {isGenerating ? "Generating..." : "Generate My Follow-Up Messages"}
                </Button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

