'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Send, 
  Settings, 
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Customers', icon: Users, href: '/dashboard/customers' },
    { label: 'Campaigns', icon: Send, href: '/dashboard/campaigns' },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-100 bg-white flex flex-col z-20">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Sparkles className="text-white h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-slate-900 leading-none">Comeback</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 mt-1">Machine</span>
          </div>
        </div>
      </div>

      <nav className="flex-grow px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`
                flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-200
                ${isActive 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-500'}`} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4 text-slate-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 mb-4">
          <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">Growth Tip</p>
          <p className="text-xs text-amber-700 font-medium leading-relaxed">
            Did you know? Review requests are most effective when sent within 48 hours.
          </p>
        </div>
        
        <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-bold text-sm group">
          <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
};
