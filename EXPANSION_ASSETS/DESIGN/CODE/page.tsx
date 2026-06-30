'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExpansionQRSign, expansionNiches } from '@/components/templates/ExpansionQRSign';

function ExpansionQRSignsContent() {
  const searchParams = useSearchParams();
  const nicheParam = searchParams.get('niche');
  const selectedNiche = nicheParam ? expansionNiches.find(n => n.id === nicheParam) : null;

  return (
    <div className="bg-slate-100 min-h-screen p-20 flex flex-col items-center">
      {!selectedNiche && (
        <div className="mb-20 text-center">
          <h1 className="text-6xl font-black text-slate-900 mb-4">Expansion Niche QR Signs</h1>
          <p className="text-2xl text-slate-500 font-medium">Hero-Guide Narrative Marketing Ready</p>
        </div>
      )}

      {selectedNiche ? (
        <ExpansionQRSign niche={selectedNiche} />
      ) : (
        <div className="flex flex-col gap-20">
          {expansionNiches.map(niche => (
            <ExpansionQRSign key={niche.id} niche={niche} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExpansionQRSignsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExpansionQRSignsContent />
    </Suspense>
  );
}
