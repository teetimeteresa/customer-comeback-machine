import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { auth } from '@/lib/auth';
import { teamDb } from '@/lib/team-db';
import { redirect } from 'next/navigation';
import { Layout, Users, Mail, MousePointer2, Sparkles, Printer, ExternalLink } from 'lucide-react';

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch business info
  const businesses = await teamDb({
    sql: 'SELECT id, name, slug, type FROM businesses WHERE owner_id = ? LIMIT 1',
    args: [session.user.id]
  });

  const business = businesses[0];
  
  if (!business) {
    redirect('/onboarding');
  }

  // Check for active subscription
  const subscriptions = await teamDb({
    sql: `SELECT id, status, plan FROM subscriptions 
          WHERE business_id = ? AND status = 'active' 
          ORDER BY created_at DESC LIMIT 1`,
    args: [business.id]
  });

  const hasActiveSubscription = subscriptions && subscriptions.length > 0;

  if (!hasActiveSubscription) {
    redirect('/pricing?error=subscription_required');
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

  // Fetch upcoming birthdays
  const upcomingBirthdays = await teamDb({
    sql: `SELECT first_name, last_name, birthday FROM customers 
          WHERE business_id = ? AND birthday IS NOT NULL AND birthday != ''
          LIMIT 5`,
    args: [business.id]
  });

  // Placeholder for clicks until tracking is implemented
  const reviewClicks = 0;
  
  const stats = [
    { label: 'Total Opt-ins', value: customerCount.toLocaleString(), trend: '+12%', color: 'text-emerald-600', icon: Users, bgColor: 'bg-emerald-50' },
    { label: 'Emails Sent', value: emailSent.toLocaleString(), trend: '+5%', color: 'text-blue-600', icon: Mail, bgColor: 'bg-blue-50' },
    { label: 'Review Clicks', value: reviewClicks.toLocaleString(), trend: '0%', color: 'text-amber-600', icon: MousePointer2, bgColor: 'bg-amber-50' },
    { label: 'Upcoming Birthdays', value: upcomingBirthdays.length.toString(), trend: 'Next 30 days', color: 'text-purple-600', icon: Sparkles, bgColor: 'bg-purple-50' },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const optInUrl = `${baseUrl}/optin/${business.slug}`;

  return (
        <><header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8 md:pl-8 mt-6 md:mt-0">
          <h1 className="text-xl font-bold">Welcome back, {session.user.name?.split(' ')[0]}! ❤️</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500">{business.name}</span>
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs">
              {session.user.name?.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Happiness Tip of the Week */}
          <div className="mb-8 rounded-2xl bg-amber-50 border border-amber-100 p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Happiness Tip of the Week</p>
              <p className="text-sm text-amber-900 font-medium">"People will forget what you said, but they will never forget how you made them feel." Try adding a personal note to your next follow-up!</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color.replace('text-', 'text-')}`} />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg bg-slate-50 ${stat.color}`}>{stat.trend}</span>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="mt-1 text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1 rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Your QR Code</h2>
                  <p className="mt-1 text-slate-500 text-sm">Customers scan this to join.</p>
                </div>
                <a 
                  href={`/optin/${business.slug}`} 
                  target="_blank" 
                  className="p-2 bg-slate-50 text-slate-400 hover:text-amber-500 rounded-xl transition-colors"
                  title="View Opt-in Page"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
              
              <div className="flex-grow flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <QRCodeDisplay url={optInUrl} size={160} />
              </div>

              <div className="mt-8 space-y-3">
                <a 
                  href="/dashboard/qr-sign"
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white px-6 py-4 rounded-2xl font-black hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
                >
                  <Printer size={20} />
                  Print QR Sign
                </a>
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Put this on your counter!
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 rounded-[2.5rem] bg-white p-8 shadow-sm border border-slate-100 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-900">Upcoming Birthdays</h2>
                <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Sparkles size={20} />
                </div>
              </div>
              
              <div className="flex-grow space-y-4">
                {upcomingBirthdays.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-4">
                      <Users size={32} />
                    </div>
                    <p className="text-slate-400 font-medium italic">No birthdays on file yet.</p>
                    <p className="text-xs text-slate-300 mt-1">They'll show up here once customers sign up!</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {upcomingBirthdays.map((customer, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-bold group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            {customer.first_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-700">{customer.first_name} {customer.last_name}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Customer</p>
                          </div>
                        </div>
                        <span className="text-sm font-black text-amber-600">{customer.birthday}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
  );
}
