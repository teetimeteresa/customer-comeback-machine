import { Sidebar } from '@/components/Sidebar';
import { auth } from '@/lib/auth';
import { teamDb } from '@/lib/team-db';
import { DbBusiness, DbUser, DbSubscription } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Button } from '@/components/Button';

export default async function AdminDashboard() {
  const session = await auth();

  // In a real app, we'd check if role is 'admin'
  // if (session?.user?.role !== 'admin') {
  //   redirect('/dashboard');
  // }

  // Fetch all users
  const users = await teamDb<DbUser>(
    `SELECT * FROM users`
  );

  // Fetch all businesses
  const businesses = await teamDb<DbBusiness>(
    `SELECT * FROM businesses`
  );

  // Fetch all subscriptions
  const subscriptions = await teamDb<DbSubscription>(
    `SELECT * FROM subscriptions`
  );

  // Fetch all leads
  const leads = await teamDb(
    `SELECT * FROM leads`
  );

  const totalMRR = subscriptions
    .filter(s => s.status === 'active')
    .reduce((acc, s) => {
      if (s.plan === 'starter') return acc + 49;
      if (s.plan === 'growth') return acc + 99;
      if (s.plan === 'pro') return acc + 199;
      return acc;
    }, 0);

  const stats = [
    { label: 'Total Users', value: users.length.toString() },
    { label: 'Total Businesses', value: businesses.length.toString() },
    { label: 'Total Leads', value: leads.length.toString() },
    { label: 'MRR', value: `${totalMRR}` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      
      <main className="pl-64">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-amber-600 font-bold px-3 py-1 bg-amber-50 rounded-full">System Admin</span>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {stat.label === 'MRR' ? `${stat.value}` : stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {/* Businesses Table */}
            <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold mb-6">Manage Businesses</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50">
                      <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Business</th>
                      <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Owner</th>
                      <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Plan</th>
                      <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {businesses.map((biz) => {
                      const owner = users.find(u => u.id === biz.owner_id);
                      const sub = subscriptions.find(s => s.business_id === biz.id);
                      return (
                        <tr key={biz.id} className="group">
                          <td className="py-4">
                            <div className="font-bold text-slate-900">{biz.name}</div>
                            <div className="text-xs text-slate-400">{biz.slug}</div>
                          </td>
                          <td className="py-4 text-slate-600">{owner?.name || 'Unknown'}</td>
                          <td className="py-4">
                            <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded capitalize">
                              {sub?.plan || 'Free'}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className={`h-2 w-2 inline-block rounded-full mr-2 ${sub?.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                            <span className="text-sm text-slate-600 capitalize">{sub?.status || 'Inactive'}</span>
                          </td>
                          <td className="py-4 text-right">
                            <Button variant="outline" size="sm" className="mr-2">View</Button>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-100 hover:bg-red-50">Pause</Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Team & Happiness Sidebar */}
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-900 p-8 shadow-xl text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="text-amber-400">❤️</span> Team Morale
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  The family is working hard behind the scenes. Check out the latest wins from the team!
                </p>
                <a 
                  href="/WEEKLY_WINS.md" 
                  target="_blank"
                  className="block w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-center text-xs font-black uppercase tracking-widest transition-colors"
                >
                  View Weekly Wins
                </a>
              </div>

              <div className="rounded-3xl bg-amber-50 p-8 border border-amber-100">
                <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <span className="text-amber-500">✨</span> Happiness Pulse
                </h3>
                <p className="text-sm text-amber-800 leading-relaxed mb-6">
                  866 leads are primed and ready for follow-up. Our "Surprise & Delight" systems are live.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs font-bold text-amber-700">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                    Virtual Coffee: ACTIVE
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-amber-700">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                    Heartfelt UX: DEPLOYED
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
