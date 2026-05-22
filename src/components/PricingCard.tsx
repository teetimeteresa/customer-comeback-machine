import React from 'react';
import { Button } from './Button';
import Link from 'next/link';

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  description,
  features,
  popular = false,
}) => {
  return (
    <div className={`relative flex flex-col rounded-3xl border p-8 transition-all hover:shadow-xl ${
      popular ? 'border-amber-500 ring-4 ring-amber-500/10' : 'border-slate-200'
    }`}>
      {popular && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
          Most Popular
        </span>
      )}
      
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900">{name}</h3>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900">${price}</span>
          <span className="ml-1 text-xl font-medium text-slate-500">/month</span>
        </div>
      </div>
      
      <ul className="mb-8 flex-1 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg className="h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-slate-600">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link href="/signup" className="w-full">
        <Button variant={popular ? 'primary' : 'outline'} className="w-full">
          Choose {name}
        </Button>
      </Link>
    </div>
  );
};
