'use client';

import { Bell, Search, Menu, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function TopHeader() {
  const { user } = useAuth();
  
  return (
    <header className="h-16 bg-white border-b border-wfm-border px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-6 flex-1">
        <button className="text-slate-500 hover:text-slate-800 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex relative max-w-lg w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for employees, projects, teams..." 
            className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-brand-primary w-full transition-colors focus:bg-white"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative text-slate-500 hover:text-slate-800 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">5</span>
        </button>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-slate-600 text-white flex items-center justify-center font-bold text-sm">
            {user?.fullName?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'U'}
          </div>
          <div className="hidden md:block text-sm">
            <div className="font-bold text-slate-800">{user?.fullName || 'User'}</div>
            <div className="text-slate-500 text-xs">{user?.role === 'WFM' ? 'Workforce Planner' : user?.role || 'Role'}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 hidden md:block ml-1" />
        </div>
      </div>
    </header>
  );
}
