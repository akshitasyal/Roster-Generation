'use client';

import { Calendar, Clock, MapPin, User, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AssociateDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Good Morning, {user?.fullName || 'Associate'}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> ID: {user?.employeeCode || 'EMP-001'}</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Project Alpha</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span>Team Bravo</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span>TL: Arun Kumar</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/associate/preferences" className="btn-secondary text-sm px-4 py-2">Submit Preferences</Link>
          <Link href="/associate/roster" className="btn-primary text-sm px-4 py-2">View Full Roster</Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Today's Shift" 
          value="09:00 - 18:00" 
          subtitle="Morning Shift" 
          icon={<Clock className="w-5 h-5 text-brand-primary" />} 
        />
        <KpiCard 
          title="Weekly Hours" 
          value="40 / 40" 
          subtitle="100% Scheduled" 
          icon={<Calendar className="w-5 h-5 text-success" />} 
        />
        <KpiCard 
          title="Next Weekly Off" 
          value="Sat + Sun" 
          subtitle="Oct 10 - Oct 11" 
          icon={<Calendar className="w-5 h-5 text-brand-secondary" />} 
        />
        <KpiCard 
          title="Current Status" 
          value="Scheduled" 
          subtitle="No Active Exceptions" 
          icon={<CheckCircle2 className="w-5 h-5 text-success" />} 
        />
      </div>

      {/* Upcoming & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Upcoming Schedule</h2>
            <div className="space-y-3">
              {[
                { day: 'Today', date: '05 Oct', shift: '09:00 - 18:00', type: 'Morning', status: 'Scheduled' },
                { day: 'Tomorrow', date: '06 Oct', shift: '09:00 - 18:00', type: 'Morning', status: 'Scheduled' },
                { day: 'Wednesday', date: '07 Oct', shift: 'OFF', type: 'Weekly Off', status: 'Approved' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-wfm-dark border border-wfm-border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-wfm-panel flex flex-col items-center justify-center border border-wfm-border/50">
                      <span className="text-xs font-semibold text-brand-primary">{s.day.slice(0, 3)}</span>
                      <span className="text-sm font-bold text-white">{s.date.split(' ')[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{s.shift}</p>
                      <p className="text-xs text-slate-400">{s.type}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.shift === 'OFF' ? 'bg-wfm-panel text-slate-300' : 'bg-success/10 text-success'}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/associate/roster" className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors py-2">
              View Full Calendar <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <ActionCard title="Apply Leave" icon="🏖️" href="/associate/leaves" />
              <ActionCard title="Raise Issue" icon="⚠️" href="#" />
              <ActionCard title="My Preferences" icon="⚙️" href="/associate/preferences" />
              <ActionCard title="Help & Support" icon="❓" href="#" />
            </div>
          </div>
          
          <div className="glass-card p-6 border-brand-primary/20">
            <h2 className="text-sm font-semibold text-brand-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Active Notices
            </h2>
            <div className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/20">
              <p className="text-sm text-slate-300 mb-2">Preference submission window for next cycle (Oct 12 - Oct 18) closes in <strong>2 days</strong>.</p>
              <Link href="/associate/preferences" className="text-sm font-medium text-brand-primary hover:underline">Submit now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, subtitle, icon }: any) {
  return (
    <div className="glass-card p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function ActionCard({ title, icon, href }: any) {
  return (
    <Link href={href} className="p-4 rounded-xl bg-wfm-dark border border-wfm-border hover:border-brand-primary hover:bg-wfm-panel transition-all flex flex-col items-center justify-center text-center gap-2 group">
      <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-xs font-medium text-slate-300 group-hover:text-white">{title}</span>
    </Link>
  );
}
