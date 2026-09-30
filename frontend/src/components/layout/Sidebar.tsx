'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { NAVIGATION_CONFIG } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  if (!user) return null;

  return (
    <aside className="w-full md:w-64 flex-shrink-0 flex flex-col z-10 hidden md:flex h-screen" style={{ backgroundColor: 'var(--color-sidebar-bg)' }}>
      {/* Brand Header */}
      <div className="p-6">
        <Link href="/" className="flex flex-col group">
          <div className="text-2xl font-bold tracking-tight text-white leading-none">
            Tech
          </div>
          <div className="text-2xl font-bold tracking-tight text-brand-primary leading-none">
            Mahindra
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        {NAVIGATION_CONFIG.filter(section => section.roles.includes(user.role)).map((section, idx) => (
          <div key={section.title} className={idx > 0 ? 'mt-6' : ''}>
            {/* Show section headers only if there's more than one section (like for WFM) */}
            {NAVIGATION_CONFIG.filter(s => s.roles.includes(user.role)).length > 1 && section.title !== 'Dashboard' && (
              <p className="px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {section.title}
              </p>
            )}
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    className={cn(
                      "flex items-center gap-3 px-6 py-2.5 transition-all group",
                      isActive 
                        ? "text-white bg-brand-primary" 
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                    )} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
      
      {/* Bottom Profile */}
      <div className="p-4" style={{ borderTop: '1px solid var(--color-sidebar-border)' }}>
        <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors group">
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
