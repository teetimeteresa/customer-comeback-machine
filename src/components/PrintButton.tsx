'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export const PrintButton = () => {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-amber-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20"
    >
      <Printer size={18} />
      Print Sign
    </button>
  );
};
