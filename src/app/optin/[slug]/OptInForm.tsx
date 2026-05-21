'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { submitOptIn } from './actions';

interface OptInFormProps {
  businessId: string;
  businessName: string;
  colorScheme: string;
}

export function OptInForm({ businessId, businessName, colorScheme }: OptInFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.append('businessId', businessId);

    try {
      const result = await submitOptIn(formData);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">You're in!</h2>
        <p className="mt-4 text-slate-600">
          Thanks for joining the {businessName} family. Keep an eye on your inbox for a special welcome message from us!
        </p>
        <div className="mt-8">
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl border border-slate-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
              placeholder="Jane"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
            placeholder="jane@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
            placeholder="(555) 000-0000"
          />
        </div>

        <div>
          <label htmlFor="birthday" className="block text-sm font-semibold text-slate-700">
            Birthday (Optional)
          </label>
          <input
            type="date"
            name="birthday"
            id="birthday"
            className="mt-1 block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 focus:border-amber-500 focus:ring-amber-500 outline-none transition-all"
          />
          <p className="mt-1 text-xs text-slate-500 italic">We'll send you a special treat on your big day!</p>
        </div>

        {/* Consent */}
        <div className="space-y-4 pt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                name="emailConsent"
                value="yes"
                className="h-5 w-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500 transition-all cursor-pointer"
                required
              />
            </div>
            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
              I agree to receive email updates and marketing messages from {businessName}.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                name="smsConsent"
                value="yes"
                className="h-5 w-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500 transition-all cursor-pointer"
              />
            </div>
            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
              I agree to receive text message updates (Standard rates may apply).
            </span>
          </label>
        </div>

        <Button 
          type="submit" 
          size="lg" 
          className="w-full shadow-lg mt-8" 
          disabled={isSubmitting}
          style={{ backgroundColor: colorScheme }}
        >
          {isSubmitting ? 'Joining...' : 'Count Me In!'}
        </Button>
      </form>
    </div>
  );
}
