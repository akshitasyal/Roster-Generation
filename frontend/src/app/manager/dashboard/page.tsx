'use client';

import { Building2, Users, Target, Activity, FileCheck2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ManagerDashboard() {
  const projects = [
    { name: 'Banking Support', am: 'Sunita Rao', teams: 3, coverage: 93, gap: -7, status: 'Reviewing' },
    { name: 'Telecom L1', am: 'Deepak Verma', teams: 4, coverage: 98, gap: -1, status: 'Healthy' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Organization Overview</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span>Manager: Priya Nair</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/manager/roster-review" className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4" /> Review Draft Roster
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard title="Projects" value="2" icon={<Building2 className="w-5 h-5 text-brand-primary" />} />
        <KpiCard title="AMs / Teams" value="2 / 7" icon={<Users className="w-5 h-5 text-brand-secondary" />} />
        <KpiCard title="Coverage" value="95.5%" icon={<Activity className="w-5 h-5 text-warning" />} />
        <KpiCard title="Staffing Gap" value="-8" icon={<Target className="w-5 h-5 text-danger" />} danger={true} />
        <KpiCard title="Pending Reviews" value="1" icon={<FileCheck2 className="w-5 h-5 text-brand-primary" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-0 overflow-hidden">
            <div className="p-6 border-b border-wfm-border bg-wfm-card/50">
              <h2 className="text-lg font-semibold text-white">Project Health</h2>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-wfm-panel/50 border-b border-wfm-border">
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Project</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">AM Leader</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-center">Teams</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Coverage</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-center">Staff Gap</th>
                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-wfm-border">
                  {projects.map((proj, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-semibold text-white">{proj.name}</td>
                      <td className="p-4 text-sm text-slate-300">{proj.am}</td>
                      <td className="p-4 text-sm text-center font-medium text-slate-300">{proj.teams}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-300 w-8">{proj.coverage}%</span>
                          <div className="w-20 h-1.5 bg-wfm-dark rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${proj.coverage > 95 ? 'bg-success' : 'bg-warning'}`} 
                              style={{ width: `${proj.coverage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center text-sm font-medium text-danger">{proj.gap}</td>
                      <td className="p-4 text-right">
                        <Link href="/manager/organization" className="inline-flex items-center justify-center p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-brand-primary/30">
            <h2 className="text-sm font-semibold text-brand-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4" /> Roster Approvals
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-wfm-dark border border-wfm-border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">Banking Support</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-warning/10 text-warning uppercase">Draft</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">Cycle: 05 Oct - 11 Oct</p>
                <Link href="/manager/roster-review" className="w-full btn-secondary py-2 text-sm justify-center">Review Generation</Link>
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
