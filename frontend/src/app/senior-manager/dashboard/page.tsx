'use client';

import { Activity, Users, DollarSign, TrendingUp, PieChart, BarChart } from 'lucide-react';
import Link from 'next/link';

export default function SeniorManagerDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Executive Summary</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span>Portfolio: Global Support Operations</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span>Sr. Manager: Rajesh Sharma</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/senior-manager/analytics" className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
            <PieChart className="w-4 h-4" /> View Analytics
          </Link>
        </div>
      </div>

      {/* High-Level Financial & Operational KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <KpiCard title="Total Headcount" value="1,240" icon={<Users className="w-5 h-5 text-brand-primary" />} />
        <KpiCard title="Overall Coverage" value="98.2%" icon={<Activity className="w-5 h-5 text-success" />} />
        <KpiCard title="Projected Overtime" value="240 hrs" icon={<TrendingUp className="w-5 h-5 text-warning" />} />
        <KpiCard title="Cost Variance" value="+$4.2k" icon={<DollarSign className="w-5 h-5 text-danger" />} danger={true} />
        <KpiCard title="Active Projects" value="8" icon={<BarChart className="w-5 h-5 text-brand-secondary" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-0 overflow-hidden">
          <div className="p-6 border-b border-wfm-border bg-wfm-card/50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Portfolio Health</h2>
          </div>
          <div className="p-6 space-y-6">
            <ProgressBar label="Banking & Finance" value={98} color="bg-success" />
            <ProgressBar label="Telecom Operations" value={95} color="bg-success" />
            <ProgressBar label="Retail Support" value={82} color="bg-warning" />
            <ProgressBar label="Healthcare IT" value={78} color="bg-danger" />
          </div>
        </div>

        <div className="glass-card p-6 border-brand-secondary/20">
          <h2 className="text-sm font-semibold text-brand-secondary uppercase tracking-wider mb-6 flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Financial Impact Alerts
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-wfm-dark border border-wfm-border">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">High Overtime Projected</h3>
                <span className="text-xs text-danger font-bold uppercase">Critical</span>
              </div>
              <p className="text-sm text-slate-400">Retail Support is running with a 15% staffing deficit, projected to incur high OT costs this cycle.</p>
            </div>
            
            <div className="p-4 rounded-xl bg-wfm-dark border border-wfm-border">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">Idle Time Detected</h3>
                <span className="text-xs text-warning font-bold uppercase">Warning</span>
              </div>
              <p className="text-sm text-slate-400">Telecom Operations is over-staffed by 4% during weekend night blocks.</p>
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

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="text-slate-400">{value}% Coverage</span>
      </div>
      <div className="w-full h-2 bg-wfm-dark rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}
