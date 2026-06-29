import { auth } from '@/lib/auth';
import { teamDb } from '@/lib/team-db';
import { redirect } from 'next/navigation';
import { QRSignTemplate } from '@/components/QRSignTemplate';
import { PrintButton } from '@/components/PrintButton';
import { ArrowLeft } from 'lucide-react';

export default async function QRSignPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch business info
  const businesses = await teamDb({
    sql: 'SELECT id, name, type, slug FROM businesses WHERE owner_id = ? LIMIT 1',
    args: [session.user.id]
  });

  const business = businesses[0];
  if (!business) {
    redirect('/onboarding');
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const optInUrl = `${baseUrl}/optin/${business.slug}`;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <div className="print:hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
              <ArrowLeft size={20} className="text-slate-500" />
            </a>
            <h1 className="text-xl font-bold">Your Printable QR Sign</h1>
          </div>
          <div className="flex items-center gap-3">
             <p className="text-sm text-slate-500 mr-2 italic">Pro tip: Use cardstock for a premium feel.</p>
             <PrintButton />
          </div>
        </header>

        <div className="p-4 md:p-12 flex justify-center">
          <div className="scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-100 origin-top transform transition-transform">
             <QRSignTemplate 
               businessName={business.name} 
               businessType={business.type} 
               url={optInUrl} 
             />
          </div>
        </div>
      </div>

      {/* This only shows when printing */}
      <div className="hidden print:block bg-white h-screen w-screen p-0 m-0">
        <QRSignTemplate 
          businessName={business.name} 
          businessType={business.type} 
          url={optInUrl} 
        />
      </div>
    </div>
  );
}
