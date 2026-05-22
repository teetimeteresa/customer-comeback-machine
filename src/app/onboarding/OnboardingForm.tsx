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
  ChevronRight,
  ChevronLeft,
  Settings2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { saveOnboardingAction } from './actions';

const steps = [
  { id: 1, title: 'Basic Info', icon: Building2 },
  { id: 2, title: 'Social & Links', icon: Globe },
  { id: 3, title: 'Brand Tone', icon: Sparkles },
  { id: 4, title: 'Automations', icon: Settings2 },
];

const businessTypes = [
  'Boutique', 'Optical shop', 'Salon', 'Coffee shop', 'Florist', 
  'Gift shop', 'Bakery', 'Med spa', 'Photographer', 'Fitness studio', 
  'Local service', 'Downtown retailer'
];

const brandTones = [
  'Friendly', 'Funny', 'Professional', 'Luxury', 'Heartfelt', 'Simple'
];

export default function OnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Boutique',
    website: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    mailingAddress: '',
    googleReviewLink: '',
    facebookPage: '',
    instagramPage: '',
    mainProducts: '',
    idealCustomer: '',
    brandTone: 'Friendly',
    specialThing: '',
    currentOffer: '',
    referralOffer: '',
    birthdayClubEnabled: true,
    referralEnabled: true,
    reviewEnabled: true,
    comebackEnabled: true,
    smsEnabled: false,
    preferredCTA: 'Visit us again',
    wordsLiked: '',
    wordsDisliked: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await saveOnboardingAction(formData);
      if (result.success) {
        router.push('/dashboard');
      } else {
        alert(result.error || 'Failed to save onboarding data');
      }
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      alert('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Progress Stepper */}
      <nav aria-label="Progress" className="mb-12">
        <ol role="list" className="flex items-center justify-center space-x-8 sm:space-x-12 lg:space-x-16">
          {steps.map((step) => (
            <li key={step.id} className="relative">
              <div className="flex flex-col items-center group">
                <span 
                  className={`
                    flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200
                    ${currentStep >= step.id 
                      ? 'border-amber-500 bg-amber-500 text-white' 
                      : 'border-slate-200 bg-white text-slate-400'}
                  `}
                >
                  <step.icon className="h-6 w-6" />
                </span>
                <span 
                  className={`
                    mt-2 text-xs font-bold uppercase tracking-wider
                    ${currentStep >= step.id ? 'text-amber-600' : 'text-slate-400'}
                  `}
                >
                  {step.title}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 sm:p-12">
          
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Let's start with the basics</h2>
                <p className="mt-2 text-lg text-slate-600">Tell us about your business so we can set up your account.</p>
              </div>

              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Business Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="e.g. Sunnyvale Boutique"
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Business Type</label>
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
                  <label htmlFor="website" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Website (Optional)</label>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="Sunnyvale"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">State</label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="CA"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Business Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="(555) 000-0000"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Business Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="hello@yourbusiness.com"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="mailingAddress" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Physical Mailing Address (Required for Email Compliance)</label>
                  <input
                    type="text"
                    name="mailingAddress"
                    id="mailingAddress"
                    required
                    value={formData.mailingAddress}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="123 Main St, Suite 100, City, State, ZIP"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Social & Links */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Connect your socials</h2>
                <p className="mt-2 text-lg text-slate-600">We'll use these to help customers find you and leave reviews.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="googleReviewLink" className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                    <Star className="h-4 w-4 text-amber-500" />
                    Google Review Link
                  </label>
                  <input
                    type="url"
                    name="googleReviewLink"
                    id="googleReviewLink"
                    value={formData.googleReviewLink}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="https://g.page/r/your-id/review"
                  />
                  <p className="mt-1 text-xs text-slate-500">This is crucial for our review request automation!</p>
                </div>

                <div>
                  <label htmlFor="facebookPage" className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                    <Share2 className="h-4 w-4 text-blue-600" />
                    Facebook Page
                  </label>
                  <input
                    type="url"
                    name="facebookPage"
                    id="facebookPage"
                    value={formData.facebookPage}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="https://facebook.com/yourbusiness"
                  />
                </div>

                <div>
                  <label htmlFor="instagramPage" className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                    <Camera className="h-4 w-4 text-pink-600" />
                    Instagram Page
                  </label>
                  <input
                    type="url"
                    name="instagramPage"
                    id="instagramPage"
                    value={formData.instagramPage}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="https://instagram.com/yourbusiness"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Brand Tone */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your brand's personality</h2>
                <p className="mt-2 text-lg text-slate-600">This helps our AI write messages that sound exactly like you.</p>
              </div>

              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div className="sm:col-span-2">
                  <label htmlFor="brandTone" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Brand Tone</label>
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {brandTones.map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, brandTone: tone }))}
                        className={`
                          px-4 py-3 rounded-xl border-2 font-semibold transition-all text-sm
                          ${formData.brandTone === tone 
                            ? 'border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-500/20' 
                            : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}
                        `}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="mainProducts" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Main Products / Services</label>
                  <textarea
                    name="mainProducts"
                    id="mainProducts"
                    rows={3}
                    value={formData.mainProducts}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all resize-none"
                    placeholder="e.g. Handmade jewelry, organic candles, custom flower arrangements"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="idealCustomer" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Ideal Customer</label>
                  <input
                    type="text"
                    name="idealCustomer"
                    id="idealCustomer"
                    value={formData.idealCustomer}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="e.g. Modern women looking for unique, sustainable gifts"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="specialThing" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">What makes your business special?</label>
                  <textarea
                    name="specialThing"
                    id="specialThing"
                    rows={2}
                    value={formData.specialThing}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all resize-none"
                    placeholder="e.g. Everything is locally sourced and crafted with love in small batches."
                  />
                </div>

                <div>
                  <label htmlFor="wordsLiked" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Words you LOVE (Optional)</label>
                  <input
                    type="text"
                    name="wordsLiked"
                    id="wordsLiked"
                    value={formData.wordsLiked}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="e.g. Magical, curated, local"
                  />
                </div>

                <div>
                  <label htmlFor="wordsDisliked" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Words you HATE (Optional)</label>
                  <input
                    type="text"
                    name="wordsDisliked"
                    id="wordsDisliked"
                    value={formData.wordsDisliked}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="e.g. Cheap, discount, corporate"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Automations */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Final touches</h2>
                <p className="mt-2 text-lg text-slate-600">Choose which automations you want to enable from day one.</p>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'birthdayClubEnabled', title: 'Birthday Club', desc: 'Send a special offer 7 days before their birthday.', icon: Sparkles },
                  { id: 'reviewEnabled', title: 'Review Requests', desc: 'Automatically ask for a Google review after a visit.', icon: MessageSquare },
                  { id: 'comebackEnabled', title: 'Comeback Offers', desc: 'Bring them back with a special 7-day follow-up.', icon: Sparkles },
                  { id: 'referralEnabled', title: 'Referral Program', desc: 'Reward customers for spreading the word.', icon: CheckCircle2 },
                  { id: 'smsEnabled', title: 'SMS Marketing', desc: 'Reach customers on their phones (Requires Pro Plan).', icon: Phone },
                ].map((item) => (
                  <label key={item.id} className="flex items-start p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center h-5">
                      <input
                        id={item.id}
                        name={item.id}
                        type="checkbox"
                        checked={formData[item.id as keyof typeof formData] as boolean}
                        onChange={handleChange}
                        className="h-6 w-6 text-amber-500 border-slate-300 rounded-lg focus:ring-amber-500 transition-all"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <item.icon className="h-4 w-4 text-amber-500" />
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-6">
                <div>
                  <label htmlFor="currentOffer" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Default Comeback Offer (e.g. 10% off next visit)</label>
                  <input
                    type="text"
                    name="currentOffer"
                    id="currentOffer"
                    value={formData.currentOffer}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="10% off your next visit"
                  />
                </div>

                <div>
                  <label htmlFor="referralOffer" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Referral Reward (e.g. A free coffee for both)</label>
                  <input
                    type="text"
                    name="referralOffer"
                    id="referralOffer"
                    value={formData.referralOffer}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="Get a free coffee when you refer a friend"
                  />
                </div>

                <div>
                  <label htmlFor="preferredCTA" className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Preferred Call to Action</label>
                  <input
                    type="text"
                    name="preferredCTA"
                    id="preferredCTA"
                    value={formData.preferredCTA}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-2xl border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
                    placeholder="e.g. Book your next appointment"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors px-6 py-3"
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < steps.length ? (
              <Button
                type="button"
                size="lg"
                onClick={handleNext}
                className="flex items-center gap-2 px-10 shadow-lg shadow-amber-500/20"
              >
                Continue
                <ChevronRight className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-10 shadow-lg shadow-amber-500/20"
              >
                {isSubmitting ? 'Saving...' : 'Finish Setup'}
                <CheckCircle2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
