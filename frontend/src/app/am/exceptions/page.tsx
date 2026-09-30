'use client';

import { AlertTriangle, Filter, Search } from 'lucide-react';

export default function AmExceptionsPage() {
  const exceptions = [
    { id: 'EX-1042', team: 'Team Alpha', type: 'Staffing Shortage', severity: 'High', date: '05 Oct', impact: '-2 Associates', status: 'Open' },
    { id: 'EX-1045', team: 'Team Alpha', type: 'Skill Shortage', severity: 'Medium', date: '06 Oct', impact: 'Missing L3 Tech', status: 'Open' },
    { id: 'EX-1050', team: 'Team Charlie', type: 'Staffing Shortage', severity: 'Critical', date: '05 Oct', impact: '-5 Associates', status: 'Open' },
    { id: 'EX-1051', team: 'Team Charlie', type: 'Staffing Shortage', severity: 'Critical', date: '06 Oct', impact: '-4 Associates', status: 'Open' },
    { id: 'EX-1021', team: 'Team Charlie', type: 'Leave Conflict', severity: 'Medium', date: '08 Oct', impact: 'TL Neha Gupta', status: 'Escalated' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Escalated Exceptions</h1>
          <p className="text-slate-400">Review conflicts and shortages across all your teams.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search exceptions..." 
              className="w-full bg-wfm-card border border-wfm-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
          <button className="btn-secondary p-2"><Filter className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-wfm-border/50">
        <div className="p-4 border-b border-wfm-border flex justify-between items-center bg-wfm-card/50">
          <h3 className="font-semibold text-white">Active Exceptions (5)</h3>
          <div className="flex gap-2">
            <select className="bg-wfm-dark border border-wfm-border rounded-lg text-sm text-white px-3 py-1.5 focus:outline-none">
              <option>All Severities</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
            </select>
          </div>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-wfm-panel/50 border-b border-wfm-border">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Issue ID</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Team</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Type & Severity</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Date</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Impact</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border">
              {exceptions.map((issue) => (
                <tr key={issue.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-300">{issue.id}</td>
                  <td className="p-4 text-sm font-medium text-white">{issue.team}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${issue.severity === 'Critical' || issue.severity === 'High' ? 'text-danger' : 'text-warning'}`} />
                      <div>
                        <div className="text-sm font-medium text-white">{issue.type}</div>
                        <div className={`text-xs ${issue.severity === 'Critical' || issue.severity === 'High' ? 'text-danger' : 'text-warning'}`}>{issue.severity}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-200">{issue.date}</td>
                  <td className="p-4 text-sm font-medium text-slate-300">{issue.impact}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      issue.status === 'Open' ? 'bg-wfm-panel text-slate-300 border-wfm-border' : 'bg-warning/10 text-warning border-warning/20'
                    }`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors">Mitigate</button>
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
