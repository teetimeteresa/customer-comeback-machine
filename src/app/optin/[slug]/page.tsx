import React from 'react';
import { notFound } from 'next/navigation';
import { teamDb } from '@/lib/team-db';
import { OptInForm } from './OptInForm';
import { DbBusiness } from '@/lib/db';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = params;

  // Fetch business info
  const businesses = await teamDb<DbBusiness>(
    `SELECT * FROM businesses WHERE slug = '${slug}'`
  );

  if (!businesses || businesses.length === 0) {
    notFound();
  }

  const business = businesses[0];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <main className="container mx-auto max-w-lg px-4 py-16">
        {/* Business Branding */}
        <div className="text-center">
          {business.logo_url ? (
            <img 
              src={business.logo_url} 
              alt={business.name} 
              className="mx-auto h-24 w-24 rounded-2xl object-cover shadow-lg border-2 border-white"
            />
          ) : (
            <div 
              className="mx-auto h-20 w-20 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: business.color_scheme || '#f59e0b' }}
            >
              <span className="text-white font-bold text-3xl">
                {business.name.charAt(0)}
              </span>
            </div>
          )}
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
            {business.name}
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            {business.special_thing || 'Join our VIP list to get exclusive offers and stay in the loop!'}
          </p>
        </div>

        {/* Opt-in Form */}
        <OptInForm 
          businessId={business.id} 
          businessName={business.name} 
          colorScheme={business.color_scheme || '#f59e0b'}
        />

        {/* Google Review Link (Optional) */}
        {business.google_review_link && (
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500 mb-3">Love our business? Leave us a review!</p>
            <a 
              href={business.google_review_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 font-semibold hover:underline"
            >
              Write a Google Review
            </a>
          </div>
        )}

        {/* Footer */}
        <p className="mt-12 text-center text-sm text-slate-400">
          Powered by <span className="font-bold text-slate-500">Customer Comeback Machine</span>
        </p>
      </main>
    </div>
  );
}
