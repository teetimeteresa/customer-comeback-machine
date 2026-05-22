'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  Share2, 
  Camera, 
  Star, 
  MessageSquare, 
  Sparkles,
  CheckCircle2,
  Settings2
} from 'lucide-react';
import { saveOnboardingAction } from '@/app/onboarding/actions';

const businessTypes = [
  'Boutique', 'Optical shop', 'Salon', 'Coffee shop', 'Florist', 
  'Gift shop', 'Bakery', 'Med spa', 'Photographer', 'Fitness studio', 
  'Local service', 'Downtown retailer'
];

const brandTones = [
  'Friendly', 'Funny', 'Professional', 'Luxury', 'Heartfelt', 'Simple'
];

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    try {
      const result = await saveOnboardingAction(formData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(result.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Basic Info Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <Building2 className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold">Basic Information</h3>
        </div>

        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Business Name</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Business Type</label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all appearance-none"
            >
              {businessTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="website" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Website</label>
            <input
              type="url"
              name="website"
              id="website"
              value={formData.website}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">City</label>
            <input
              type="text"
              name="city"
              id="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">State</label>
            <input
              type="text"
              name="state"
              id="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Business Phone</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Business Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="mailingAddress" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Mailing Address (For Compliance)</label>
            <input
              type="text"
              name="mailingAddress"
              id="mailingAddress"
              required
              value={formData.mailingAddress}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Socials & Links Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Globe className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold">Socials & Reviews</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="googleReviewLink" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Google Review Link</label>
            <input
              type="url"
              name="googleReviewLink"
              id="googleReviewLink"
              value={formData.googleReviewLink}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="facebookPage" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Facebook Page</label>
              <input
                type="url"
                name="facebookPage"
                id="facebookPage"
                value={formData.facebookPage}
                onChange={handleChange}
                className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="instagramPage" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Instagram Page</label>
              <input
                type="url"
                name="instagramPage"
                id="instagramPage"
                value={formData.instagramPage}
                onChange={handleChange}
                className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand & AI Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold">Brand Personality</h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Brand Tone</label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {brandTones.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setFormData((prev: any) => ({ ...prev, brandTone: tone }))}
                  className={`
                    px-2 py-2 rounded-xl border text-xs font-bold transition-all
                    ${formData.brandTone === tone 
                      ? 'border-amber-500 bg-amber-50 text-amber-700' 
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}
                  `}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="mainProducts" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Main Products/Services</label>
            <textarea
              name="mainProducts"
              id="mainProducts"
              rows={2}
              value={formData.mainProducts}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label htmlFor="specialThing" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">What Makes You Special</label>
            <textarea
              name="specialThing"
              id="specialThing"
              rows={2}
              value={formData.specialThing}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all resize-none"
            />
          </div>
        </div>
      </section>

      {/* Automations Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Settings2 className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-bold">Automations</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { id: 'birthdayClubEnabled', title: 'Birthday Club' },
            { id: 'reviewEnabled', title: 'Review Requests' },
            { id: 'comebackEnabled', title: 'Comeback Offers' },
            { id: 'referralEnabled', title: 'Referral Program' },
          ].map((item) => (
            <label key={item.id} className="flex items-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
              <input
                id={item.id}
                name={item.id}
                type="checkbox"
                checked={formData[item.id as keyof typeof formData] as boolean}
                onChange={handleChange}
                className="h-5 w-5 text-amber-500 border-slate-300 rounded focus:ring-amber-500"
              />
              <span className="ml-3 text-sm font-bold text-slate-700">{item.title}</span>
            </label>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-50 space-y-6">
          <div>
            <label htmlFor="currentOffer" className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Current Comeback Offer</label>
            <input
              type="text"
              name="currentOffer"
              id="currentOffer"
              value={formData.currentOffer}
              onChange={handleChange}
              className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Floating Save Bar */}
      <div className="fixed bottom-8 right-8 left-72 z-10">
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-xl flex items-center justify-between">
          <p className="text-sm text-slate-500 ml-4 font-medium">
            {success ? (
              <span className="text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Changes saved successfully!
              </span>
            ) : 'You have unsaved changes'}
          </p>
          <Button 
            type="submit" 
            size="lg" 
            disabled={isSubmitting}
            className="px-12 shadow-lg shadow-amber-500/20"
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </form>
  );
}
