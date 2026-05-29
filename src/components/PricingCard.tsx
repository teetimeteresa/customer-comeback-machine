import React from 'react';
import { Button } from './Button';
import Link from 'next/link';
import { Check } from 'lucide-react';

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
    <div
      className={`
        relative flex flex-col rounded-[2.5rem] p-8 transition-all duration-300
        ${popular 
          ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 scale-105 z-10 border-4 border-amber-500' 
          : 'bg-white text-slate-900 border border-slate-100 hover:shadow-xl hover:border-amber-100'}
      `}
    >
      {popular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-500 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-lg">
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className={`text-xl font-black uppercase tracking-widest ${popular ? 'text-amber-400' : 'text-amber-500'}`}>
          {name}
        </h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-5xl font-black tracking-tight">${price}</span>
          <span className={`text-sm font-bold uppercase tracking-widest ${popular ? 'text-slate-400' : 'text-slate-500'}`}>
            /month
          </span>
        </div>
        <p className={`mt-4 text-sm font-medium leading-relaxed ${popular ? 'text-slate-300' : 'text-slate-500'}`}>
          {description}
        </p>
      </div>

      <ul className="mb-8 space-y-4 flex-grow">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${popular ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-500'}`}>
              <Check size={12} strokeWidth={4} />
            </div>
            <span className={`text-sm font-bold tracking-tight ${popular ? 'text-slate-100' : 'text-slate-700'}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Link href={`/signup?plan=${name.toLowerCase()}`} className="w-full">
        <Button
          variant={popular ? 'default' : 'outline'}
          size="lg"
          className={`
            w-full rounded-2xl font-black uppercase tracking-widest text-xs py-4
            ${popular ? 'bg-amber-500 hover:bg-amber-600 border-none shadow-lg shadow-amber-500/20' : 'border-2 border-slate-200 hover:border-amber-500 hover:text-amber-600'}
          `}
        >
          Start with {name}
        </Button>
      </Link>
    </div>
  );
};
