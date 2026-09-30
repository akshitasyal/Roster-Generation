'use client';

import { Bell, Search, Menu, UserCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function TopHeader() {
  const pathname = usePathname();
  
  // Create simple breadcrumbs from pathname for now
  const paths = pathname.split('/').filter(Boolean);
  const pageTitle = paths[paths.length - 1]?.replace(/-/g, ' ') || 'Dashboard';
  
  return (
    <header className="h-16 glass-panel border-b border-wfm-border px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Mobile menu button could go here */}
        <button className="md:hidden text-slate-400 hover:text-white">
          <Menu className="w-5 h-5" />
        </button>
        
        <div>
          <h2 className="text-lg font-bold text-white capitalize">{pageTitle}</h2>
          <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
            <span>TechM WFM</span>
            {paths.map((p, i) => (
              <span key={p} className="flex items-center gap-2">
                <span>/</span>
                <span className="capitalize">{p.replace(/-/g, ' ')}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-wfm-card border border-wfm-border rounded-lg pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-brand-primary w-64 transition-colors"
          />
        </div>
        
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full ring-2 ring-wfm-panel"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-wfm-card border border-wfm-border flex items-center justify-center cursor-pointer hover:border-brand-primary transition-colors">
          <UserCircle className="w-5 h-5 text-slate-300" />
        </div>
      </div>
    </header>
  );
}
