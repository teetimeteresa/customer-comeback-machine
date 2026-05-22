import { Sidebar } from '@/components/Sidebar';
import { auth } from '@/lib/auth';
import { teamDb } from '@/lib/team-db';
import { redirect } from 'next/navigation';

export default async function CustomersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Get the business ID for this user
  const businesses = await teamDb({
    sql: 'SELECT id, name FROM businesses WHERE owner_id = ? LIMIT 1',
    args: [session.user.id]
  });

  const business = businesses[0];
  let customers: any[] = [];

  if (business) {
    customers = await teamDb({
      sql: 'SELECT * FROM customers WHERE business_id = ? ORDER BY created_at DESC',
      args: [business.id]
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      
      <main className="pl-64">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <h1 className="text-xl font-bold">Customers</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500">{business?.name || 'My Business'}</span>
            <div className="h-8 w-8 rounded-full bg-slate-200"></div>
          </div>
        </header>

        <div className="p-8">
          <div className="rounded-3xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold">Your Customer List</h2>
              <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                {customers.length} Total
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-8 py-4 font-semibold">Name</th>
                    <th className="px-8 py-4 font-semibold">Email</th>
                    <th className="px-8 py-4 font-semibold">Joined</th>
                    <th className="px-8 py-4 font-semibold">Marketing</th>
                    <th className="px-8 py-4 font-semibold">Last Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center">
                          <p className="text-lg font-medium">No customers yet</p>
                          <p className="text-sm">Share your QR code to start building your list!</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-4 font-medium">{customer.first_name} {customer.last_name}</td>
                        <td className="px-8 py-4 text-slate-600">{customer.email}</td>
                        <td className="px-8 py-4 text-slate-500 text-sm">
                          {new Date(customer.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            customer.email_consent ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {customer.email_consent ? 'Opted In' : 'No Consent'}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-slate-500 text-sm">
                          {customer.last_email_type ? (
                            <span className="capitalize">{customer.last_email_type.replace(/_/g, ' ')}</span>
                          ) : (
                            <span className="text-slate-300">None sent</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
