import { Sidebar } from '@/components/Sidebar';
import { auth } from '@/lib/auth';
import { teamDb } from '@/lib/team-db';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch business info
  const businesses = await teamDb({
    sql: 'SELECT id, name FROM businesses WHERE owner_id = ? LIMIT 1',
    args: [session.user.id]
  });

  const business = businesses[0];
  
  if (!business) {
    redirect('/onboarding');
  }

  // Fetch real stats
  const customerCountResult = await teamDb({
    sql: 'SELECT COUNT(*) as count FROM customers WHERE business_id = ?',
    args: [business.id]
  });
  const customerCount = customerCountResult[0]?.count || 0;

  const emailSentResult = await teamDb({
    sql: 'SELECT COUNT(*) as count FROM emails WHERE business_id = ? AND status = "sent"',
    args: [business.id]
  });
  const emailSent = emailSentResult[0]?.count || 0;

  // Placeholder for clicks until tracking is implemented
  const reviewClicks = 0;
  const comebackClicks = 0;

  const stats = [
    { label: 'Total Opt-ins', value: customerCount.toLocaleString(), trend: '+0%', color: 'text-emerald-600' },
    { label: 'Emails Sent', value: emailSent.toLocaleString(), trend: '+0%', color: 'text-blue-600' },
    { label: 'Review Clicks', value: reviewClicks.toLocaleString(), trend: '0%', color: 'text-amber-600' },
    { label: 'Comeback Clicks', value: comebackClicks.toLocaleString(), trend: '0%', color: 'text-purple-600' },
  ];

  // Fetch upcoming birthdays
  const upcomingBirthdays = await teamDb({
    sql: `SELECT first_name, last_name, birthday FROM customers 
          WHERE business_id = ? AND birthday IS NOT NULL AND birthday != ''
          LIMIT 5`,
    args: [business.id]
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      
      <main className="pl-64">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <h1 className="text-xl font-bold">Business Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500">{business.name}</span>
            <div className="h-8 w-8 rounded-full bg-slate-200"></div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <div className="mt-2 flex items-baseline justify-between">
                  <p className="text-3xl font-extrabold">{stat.value}</p>
                  <span className={`text-sm font-bold ${stat.color}`}>{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Your QR Code</h2>
                  <p className="mt-2 text-slate-500 text-sm">Customers scan this to join your list.</p>
                </div>
                <a 
                  href={`/optin/${business.slug}`} 
                  target="_blank" 
                  className="text-xs font-bold text-amber-600 hover:underline"
                >
                  View Opt-in Page &rarr;
                </a>
              </div>
              <div className="mt-6 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-100 rounded-2xl">
                <div className="h-32 w-32 bg-slate-100 rounded-lg flex items-center justify-center">
                   <svg className="h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                   </svg>
                </div>
                <button className="mt-6 text-sm font-bold text-amber-600 hover:text-amber-700 underline">
                  Download High-Res QR Code
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold">Upcoming Birthdays</h2>
              <p className="mt-2 text-slate-500 text-sm">Customers with birthdays on file.</p>
              <div className="mt-6 space-y-4">
                {upcomingBirthdays.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No birthdays on file yet.</p>
                ) : (
                  upcomingBirthdays.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <span className="font-medium">{customer.first_name} {customer.last_name}</span>
                      <span className="text-sm text-slate-400">{customer.birthday}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
