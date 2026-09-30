'use client';

import { Users, UserX, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { CoverageChart } from '@/components/coverage/CoverageChart';

export default function TlDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Good Morning, Arun</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span>Team: Alpha</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span>Project: Banking Support</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/tl/preferences" className="btn-secondary text-sm px-4 py-2">Review Preferences</Link>
          <Link href="/tl/roster" className="btn-primary text-sm px-4 py-2">Team Roster</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard title="Team Size" value="12" icon={<Users className="w-5 h-5 text-brand-primary" />} />
        <KpiCard title="Scheduled" value="10" icon={<ShieldCheck className="w-5 h-5 text-success" />} />
        <KpiCard title="On Leave" value="1" icon={<UserX className="w-5 h-5 text-warning" />} />
        <KpiCard title="Unavailable" value="1" icon={<UserX className="w-5 h-5 text-slate-400" />} />
        <KpiCard title="Exceptions" value="2" icon={<AlertTriangle className="w-5 h-5 text-danger" />} danger={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Coverage Today</h2>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-slate-700"></div> Required</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-brand-primary"></div> Assigned</span>
              <span className="flex items-center gap-2"><div className="w-3 h-3 bg-danger"></div> Shortage</span>
            </div>
          </div>
          <CoverageChart scope="TEAM" />
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-danger/30">
            <h2 className="text-sm font-semibold text-danger uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Active Exceptions
            </h2>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                <p className="text-sm font-semibold text-white">Staffing Shortage (11:00)</p>
                <p className="text-xs text-danger mt-1">Gap of -2 associates for Morning Shift.</p>
              </div>
              <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                <p className="text-sm font-semibold text-white">Staffing Shortage (15:00)</p>
                <p className="text-xs text-danger mt-1">Gap of -3 associates for Evening Shift.</p>
              </div>
              <Link href="/tl/issues" className="block text-center text-sm text-danger hover:underline mt-4">View All Issues</Link>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Pending Reviews</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-wfm-dark border border-wfm-border">
                <div>
                  <p className="text-sm font-medium text-white">EMP012 Preferences</p>
                  <p className="text-xs text-slate-500">Submitted 2h ago</p>
                </div>
                <Link href="/tl/preferences" className="text-brand-primary"><ChevronRight className="w-5 h-5"/></Link>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-wfm-dark border border-wfm-border">
                <div>
                  <p className="text-sm font-medium text-white">EMP009 Leave Request</p>
                  <p className="text-xs text-slate-500">Submitted 5h ago</p>
                </div>
                <Link href="#" className="text-brand-primary"><ChevronRight className="w-5 h-5"/></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, danger = false }: { title: string; value: string; icon: React.ReactNode; danger?: boolean }) {
  return (
    <div className={`glass-card p-4 flex flex-col justify-between ${danger ? 'border-danger/50 bg-danger/5' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase text-slate-400">{title}</span>
        {icon}
      </div>
      <p className={`text-2xl font-bold ${danger ? 'text-danger' : 'text-white'}`}>{value}</p>
    </div>
  );
}
