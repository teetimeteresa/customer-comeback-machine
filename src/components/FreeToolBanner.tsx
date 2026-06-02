import React from 'react';
import Link from 'next/link';
import { Button } from './Button';

export const FreeToolBanner = () => {
  return (
    <div className="mt-20 rounded-[3rem] bg-amber-500 p-12 text-center text-white shadow-2xl shadow-amber-500/20">
      <h2 className="text-3xl font-black sm:text-4xl">Want to see exactly what to send?</h2>
      <p className="mt-4 text-xl font-medium text-amber-50 opacity-90">Try our free tool and get 5 custom follow-up templates in seconds.</p>
      <div className="mt-10">
        <Link href="/free-tool">
          <Button size="lg" className="bg-white text-amber-500 hover:bg-amber-50">
            Try the Free Tool
          </Button>
        </Link>
      </div>
    </div>
  );
};
