'use client';

import { AlertTriangle, Clock, Users, CalendarX2 } from 'lucide-react';
import Link from 'next/link';

export default function TeamIssuesPage() {
  const issues = [
    { id: 'EX-1042', type: 'Staffing Shortage', severity: 'High', date: '05 Oct', shift: 'Morning', impact: '-2 Associates', status: 'Open' },
    { id: 'EX-1045', type: 'Skill Shortage', severity: 'Medium', date: '06 Oct', shift: 'Evening', impact: 'Missing L3 Tech', status: 'Open' },
    { id: 'EX-1021', type: 'Leave Conflict', severity: 'Medium', date: '08 Oct', shift: 'General', impact: 'EMP003', status: 'In Review' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Team Issues</h1>
          <p className="text-slate-400">Review coverage exceptions and conflicts for your team.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-danger/10 text-danger rounded-full text-xs font-bold border border-danger/20 flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" /> 2 High Priority
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <IssueSummaryCard icon={<Users className="w-5 h-5 text-danger" />} title="Coverage Shortages" count={2} />
        <IssueSummaryCard icon={<Clock className="w-5 h-5 text-warning" />} title="Shift Conflicts" count={0} />
        <IssueSummaryCard icon={<CalendarX2 className="w-5 h-5 text-brand-secondary" />} title="Leave Conflicts" count={1} />
      </div>

      <div className="glass-card overflow-hidden border-wfm-border/50">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-wfm-panel/50 border-b border-wfm-border">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Issue ID</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Type & Severity</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Date / Shift</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Impact</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-300">{issue.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {issue.severity === 'High' ? (
                        <AlertTriangle className="w-4 h-4 text-danger" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">{issue.type}</div>
                        <div className={`text-xs ${issue.severity === 'High' ? 'text-danger' : 'text-warning'}`}>{issue.severity}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">
                    <div className="text-slate-200">{issue.date}</div>
                    <div className="text-slate-500 text-xs">{issue.shift}</div>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-300">{issue.impact}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      issue.status === 'Open' ? 'bg-wfm-panel text-slate-300 border-wfm-border' : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                    }`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href="#" className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors">Inspect</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function IssueSummaryCard({ icon, title, count }: { icon: React.ReactNode; title: string; count: number }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-wfm-dark border border-wfm-border flex items-center justify-center shadow-inner">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-white leading-none mb-1">{count}</div>
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</div>
      </div>
    </div>
  );
}
