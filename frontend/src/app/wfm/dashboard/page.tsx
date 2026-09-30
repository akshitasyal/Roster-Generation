'use client';

import { CheckCircle2, AlertTriangle, Users, Calendar, BarChart2, Check, Clock } from 'lucide-react';
import Link from 'next/link';

export default function WfmDashboard() {
  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Workforce Planning</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2">
            <span>Planning Cycle: <strong className="text-slate-700">05 Oct – 11 Oct 2026</strong></span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span>Project: <strong className="text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded cursor-pointer hover:border-brand-primary">Banking Support ▼</strong></span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span>Status: <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning font-bold uppercase text-[10px] tracking-wider border border-warning/20">Under Review</span></span>
          </div>
        </div>
        <Link href="/wfm/cycles" className="btn-secondary">Switch Cycle</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard title="Workforce Demand" value="1,240" icon={<Users className="w-4 h-4" />} />
        <KpiCard title="Available Workforce" value="1,310" icon={<CheckCircle2 className="w-4 h-4 text-success" />} />
        <KpiCard title="Coverage" value="96.8%" icon={<BarChart2 className="w-4 h-4 text-brand-primary" />} />
        <KpiCard title="Staffing Gap" value="14" icon={<AlertTriangle className="w-4 h-4 text-danger" />} danger />
        <KpiCard title="Exceptions" value="17" icon={<AlertTriangle className="w-4 h-4 text-warning" />} />
        <div className="glass-card p-4 flex flex-col justify-between border-brand-primary/30">
          <span className="text-[10px] font-bold uppercase text-brand-primary tracking-wider mb-2">Roster Status</span>
          <p className="text-lg font-bold text-slate-800 leading-tight">UNDER REVIEW</p>
        </div>
      </div>

      <div className="glass-card p-6 border-wfm-border relative overflow-hidden bg-white">
        <h2 className="text-lg font-semibold text-slate-800 mb-8 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-primary" /> Planning Cycle Progress
        </h2>

        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-slate-100 rounded-full overflow-hidden hidden md:block">
            <div className="h-full bg-brand-primary w-[70%]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-9 gap-4 relative z-10">
            <ProgressStep title="Demand" status="complete" />
            <ProgressStep title="Workforce" status="complete" />
            <ProgressStep title="Preferences" status="complete" />
            <ProgressStep title="TL Review" status="complete" />
            <ProgressStep title="Generation" status="complete" />
            <ProgressStep title="Validation" status="warning" subtitle="3 issues" />
            <ProgressStep title="Mgmt Review" status="pending" active />
            <ProgressStep title="WFM Approval" status="pending" />
            <ProgressStep title="Publish" status="pending" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-warning/30 bg-warning/5">
          <h3 className="font-semibold text-warning mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Action Required
          </h3>
          <div className="space-y-3">
            <Link href="/wfm/validation" className="block p-4 rounded-xl bg-white border border-slate-200 hover:border-warning/50 transition-colors">
              <div className="font-medium text-slate-800 mb-1">Resolve Validation Issues</div>
              <div className="text-sm text-slate-500">3 manual adjustments required before WFM approval can proceed.</div>
            </Link>
            <Link href="/wfm/cycles/1/reviews" className="block p-4 rounded-xl bg-white border border-slate-200 hover:border-brand-primary/50 transition-colors">
              <div className="font-medium text-slate-800 mb-1">Awaiting Manager Review</div>
              <div className="text-sm text-slate-500">Banking Support roster is currently pending approval from Priya Nair.</div>
            </Link>
          </div>
        </div>

        <div className="glass-card p-6 bg-white">
          <h3 className="font-semibold text-slate-800 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/wfm/adjustments" className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-brand-primary/50 transition-colors text-sm font-medium text-slate-600">
              Manual Adjustments
            </Link>
            <Link href="/wfm/exceptions" className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-brand-primary/50 transition-colors text-sm font-medium text-slate-600">
              View Exceptions
            </Link>
            <Link href="/wfm/cycles" className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-brand-primary/50 transition-colors text-sm font-medium text-slate-600">
              Planning Cycles
            </Link>
            <Link href="/wfm/settings" className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-brand-primary/50 transition-colors text-sm font-medium text-slate-600">
              Edit Business Rules
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, danger = false }: any) {
  return (
    <div className={`glass-card p-4 flex flex-col justify-between ${danger ? 'border-danger/50 bg-danger/5' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider leading-tight w-2/3">{title}</span>
        <div className="text-slate-400">{icon}</div>
      </div>
      <p className={`text-2xl font-bold ${danger ? 'text-danger' : 'text-slate-800'}`}>{value}</p>
    </div>
  );
}

function ProgressStep({ title, status, subtitle, active }: any) {
  return (
    <div className={`flex flex-col items-center text-center group ${active ? 'scale-110 transform transition-transform' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 border-2 ${
        status === 'complete' ? 'bg-brand-primary border-brand-primary text-white shadow-sm' :
        status === 'warning' ? 'bg-warning border-warning text-white shadow-sm' :
        active ? 'bg-white border-brand-primary text-brand-primary' :
        'bg-slate-50 border-slate-200 text-slate-400'
      }`}>
        {status === 'complete' ? <Check className="w-4 h-4" /> : 
         status === 'warning' ? <AlertTriangle className="w-4 h-4" /> : 
         status === 'pending' && active ? <Clock className="w-4 h-4" /> : 
         <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
      </div>
      <div className={`text-xs font-bold leading-tight ${
        status === 'complete' ? 'text-brand-primary' : 
        status === 'warning' ? 'text-warning' : 
        active ? 'text-slate-800' : 
        'text-slate-400'
      }`}>
        {title}
      </div>
      {subtitle && (
        <div className="text-[10px] text-warning mt-1">{subtitle}</div>
      )}
    </div>
  );
}
