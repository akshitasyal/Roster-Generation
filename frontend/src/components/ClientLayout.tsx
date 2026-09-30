'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, CalendarDays, Users, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const isLoginPage = pathname === '/login';

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-wfm-dark"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-primary"></div></div>;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Sidebar */}
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
          
          {(user?.role === 'WFM' || user?.role === 'SENIOR_MANAGER') && (
            <div>
              <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Workforce</p>
              <nav className="space-y-1">
                <SidebarLink href="/wfm/dashboard" icon={LayoutDashboard} label="WFM Dashboard" />
                <SidebarLink href="/wfm/planning" icon={CalendarDays} label="Planning & Demand" />
              </nav>
            </div>
          )}
          
          {(user?.role === 'TL' || user?.role === 'MANAGER' || user?.role === 'AM' || user?.role === 'SENIOR_MANAGER' || user?.role === 'WFM') && (
            <div>
              <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Management</p>
              <nav className="space-y-1">
                <SidebarLink href="/tl/dashboard" icon={Users} label="Team Portal" />
              </nav>
            </div>
          )}
          
          <div>
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Associate</p>
            <nav className="space-y-1">
              <SidebarLink href="/associate/dashboard" icon={LayoutDashboard} label="My Roster" />
            </nav>
          </div>
        </div>
        
        <div className="p-4 border-t border-wfm-border">
          <div className="px-4 py-3 mb-2 rounded-lg bg-white/5 border border-white/5">
            <p className="text-sm font-semibold text-white">{user?.fullName}</p>
            <p className="text-xs text-slate-400">{user?.role}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-danger hover:bg-danger/10 transition-colors group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden glass-panel border-b border-wfm-border p-4 flex items-center justify-between z-20 sticky top-0">
         <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-white tracking-tight">TechM WFM</h1>
          </Link>
          <button onClick={logout} className="text-slate-400 hover:text-white">
            <LogOut className="w-5 h-5" />
          </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative scroll-smooth p-4 md:p-8">
        <div className="max-w-7xl mx-auto h-full">
          {children}
        </div>
      </main>
    </>
  );
}

function SidebarLink({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isActive ? 'text-white bg-brand-primary/20 shadow-[inset_4px_0_0_0_var(--color-brand-primary)]' : 'text-slate-400 hover:text-white hover:bg-brand-primary/10 hover:shadow-[inset_4px_0_0_0_var(--color-brand-primary)]'}`}>
      <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-brand-primary' : 'text-slate-500 group-hover:text-brand-primary'}`} />
      <span className="font-medium">{label}</span>
    </Link>
  );
}
