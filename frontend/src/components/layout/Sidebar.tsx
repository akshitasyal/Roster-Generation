'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NAVIGATION_CONFIG } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  if (!user) return null;

  return (
    <aside className="w-full md:w-64 glass-panel flex-shrink-0 flex flex-col border-r border-wfm-border z-10 hidden md:flex h-screen">
      <div className="p-6 border-b border-wfm-border">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg group-hover:shadow-brand-primary/20 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-white">TechM</h1>
            <p className="text-xs text-brand-accent font-medium tracking-wider uppercase">WFM Engine</p>
          </div>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {NAVIGATION_CONFIG.filter(section => section.roles.includes(user.role)).map((section) => (
          <div key={section.title}>
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {section.title}
            </p>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                      isActive 
                        ? "text-white bg-brand-primary/20 shadow-[inset_4px_0_0_0_var(--color-brand-primary)]" 
                        : "text-slate-400 hover:text-white hover:bg-brand-primary/10 hover:shadow-[inset_4px_0_0_0_var(--color-brand-primary)]"
                    )}
                  >
                    <item.icon className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-brand-primary" : "text-slate-500 group-hover:text-brand-primary"
                    )} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-wfm-border">
        <div className="px-4 py-3 mb-2 rounded-lg bg-white/5 border border-white/5 flex flex-col">
          <span className="text-sm font-semibold text-white truncate">{user.fullName}</span>
          <span className="text-xs text-brand-accent">{user.role}</span>
        </div>
        <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-danger hover:bg-danger/10 transition-colors group">
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
