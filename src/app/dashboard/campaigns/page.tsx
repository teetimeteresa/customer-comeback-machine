import { auth } from '@/lib/auth';
import { teamDb } from '@/lib/team-db';
import { redirect } from 'next/navigation';

export default async function CampaignsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const businesses = await teamDb({
    sql: 'SELECT id, name FROM businesses WHERE owner_id = ? LIMIT 1',
    args: [session.user.id]
  });

  const business = businesses[0];

  const sequences = [
    { name: 'Welcome Email', trigger: 'Immediately after opt-in', status: 'Active', description: 'Warm thank-you message to new customers.' },
    { name: 'Review Request', trigger: '2 days later', status: 'Active', description: 'Polite nudge to leave a Google review.' },
    { name: 'Comeback Offer', trigger: '7 days later', status: 'Active', description: 'Discount code to encourage a second visit.' },
    { name: 'Referral Request', trigger: '21 days later', status: 'Active', description: 'Reward for customers who refer friends.' },
    { name: 'Win-Back Message', trigger: '45 days later', status: 'Active', description: 'Offer to bring back slipping customers.' },
    { name: 'Birthday Club', trigger: '7 days before birthday', status: business?.birthday_club_enabled ? 'Active' : 'Inactive', description: 'Special treat for their big day.' },
  ];

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8 md:pl-8 mt-6 md:mt-0">
        <h1 className="text-xl font-bold">Campaigns</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-500">{business?.name || 'My Business'}</span>
          <div className="h-8 w-8 rounded-full bg-slate-200"></div>
        </div>
      </header>

      <div className="p-4 md:p-8">
        <div className="grid gap-6">
          <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex items-center justify-between">
            <div>
              <h2 className="text-amber-800 font-bold">Automated Follow-Up Sequence</h2>
              <p className="text-amber-700 text-sm mt-1">These campaigns run automatically for every new customer who scans your QR code.</p>
            </div>
            <span className="bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">Running</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {sequences.map((campaign, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-2 h-full ${campaign.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{campaign.name}</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{campaign.trigger}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    campaign.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <p className="mt-4 text-slate-600 text-sm leading-relaxed">{campaign.description}</p>
                <div className="mt-6 pt-6 border-t border-slate-50 flex gap-4">
                  <button className="text-sm font-bold text-slate-400 hover:text-slate-600">Preview</button>
                  <button className="text-sm font-bold text-amber-600 hover:text-amber-700">Edit Copy</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
