'use client';

import { Users, AlertTriangle, Activity, BarChart2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AmDashboard() {
  const teams = [
    { name: 'Team Alpha', tl: 'Arun Kumar', headcount: 12, coverage: 96, exceptions: 2, status: 'Warning' },
    { name: 'Team Bravo', tl: 'Suresh Patil', headcount: 15, coverage: 100, exceptions: 0, status: 'Healthy' },
    { name: 'Team Charlie', tl: 'Neha Gupta', headcount: 10, coverage: 85, exceptions: 5, status: 'Critical' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Operations Overview</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span>Project: Banking Support</span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span>AM: Sunita Rao</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/am/teams" className="btn-secondary text-sm px-4 py-2">View Drill-Down</Link>
          <Link href="/am/coverage" className="btn-primary text-sm px-4 py-2">Master Coverage</Link>
        </div>
      </div>

      {/* AM Level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <KpiCard title="Total Teams" value="3" icon={<Users className="w-5 h-5 text-brand-primary" />} />
        <KpiCard title="Associates" value="37" icon={<Users className="w-5 h-5 text-brand-secondary" />} />
        <KpiCard title="Coverage" value="93%" icon={<Activity className="w-5 h-5 text-warning" />} />
        <KpiCard title="Staffing Gap" value="-7" icon={<BarChart2 className="w-5 h-5 text-danger" />} danger={true} />
        <KpiCard title="Exceptions" value="7" icon={<AlertTriangle className="w-5 h-5 text-danger" />} danger={true} />
        <KpiCard title="Pending" value="0" icon={<AlertTriangle className="w-5 h-5 text-success" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-0 overflow-hidden">
          <div className="p-6 border-b border-wfm-border flex justify-between items-center bg-wfm-card/50">
            <h2 className="text-lg font-semibold text-white">Team Performance Matrix</h2>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-wfm-panel/50 border-b border-wfm-border">
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Team Name</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Team Leader</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-center">Headcount</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Coverage</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-center">Exceptions</th>
                  <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wfm-border">
                {teams.map((team, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white">{team.name}</div>
                      <div className={`text-xs mt-1 ${team.status === 'Healthy' ? 'text-success' : team.status === 'Critical' ? 'text-danger' : 'text-warning'}`}>{team.status}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-300">{team.tl}</td>
                    <td className="p-4 text-sm text-center font-medium text-slate-300">{team.headcount}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-300 w-8">{team.coverage}%</span>
                        <div className="w-24 h-1.5 bg-wfm-dark rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${team.coverage === 100 ? 'bg-success' : team.coverage > 90 ? 'bg-warning' : 'bg-danger'}`} 
                            style={{ width: `${team.coverage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {team.exceptions > 0 ? (
                        <span className="px-2 py-1 bg-danger/10 text-danger border border-danger/20 rounded-lg text-xs font-bold">
                          {team.exceptions} Active
                        </span>
                      ) : (
                        <span className="text-success text-sm font-medium">None</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/am/teams`} className="inline-flex items-center justify-center p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-warning/30">
            <h2 className="text-sm font-semibold text-warning uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Escalations Required
            </h2>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm font-semibold text-white">Team Charlie Shortage</p>
                <p className="text-xs text-warning mt-1">Sustained gap of -5 across morning block.</p>
                <button className="text-xs font-medium bg-wfm-dark border border-warning/30 text-warning px-3 py-1.5 rounded-md mt-3 w-full hover:bg-warning/20 transition-colors">Initiate Cross-Skilling</button>
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
