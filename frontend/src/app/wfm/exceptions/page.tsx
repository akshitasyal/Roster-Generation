'use client';

import { Search, Filter, ShieldAlert, Check, X } from 'lucide-react';

export default function WfmExceptionsPage() {
  const exceptions = [
    { id: 'ERR-991', rule: 'Leave Collision', target: 'EMP-1042', severity: 'CRITICAL', desc: 'Roster generated shift during approved PL.', actionRequired: true },
    { id: 'ERR-992', rule: 'Skill Deficit', target: 'Team Charlie', severity: 'ERROR', desc: 'Missing L3 Voice associate for Morning Shift.', actionRequired: true },
    { id: 'WRN-105', rule: 'Fairness Score', target: 'Global', severity: 'WARNING', desc: 'Fairness metric dropped below 85% threshold.', actionRequired: false },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Global Exception Matrix</h1>
          <p className="text-slate-500">Manage solver rule violations and manual overrides.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search exceptions..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-brand-primary"
            />
          </div>
          <button className="btn-secondary p-2"><Filter className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-danger/30 bg-white">
        <div className="p-4 border-b border-wfm-border bg-danger/5 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-danger" />
          <h3 className="font-semibold text-slate-800">Validation Alerts (3)</h3>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-wfm-panel/50 border-b border-wfm-border">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Alert ID</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Violated Rule</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Target Entity</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Severity</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase w-1/3">Description</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-right">Force Resolve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border">
              {exceptions.map((ex) => (
                <tr key={ex.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-mono text-slate-500">{ex.id}</td>
                  <td className="p-4 text-sm font-medium text-slate-800">{ex.rule}</td>
                  <td className="p-4 text-sm text-brand-primary">{ex.target}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      ex.severity === 'CRITICAL' ? 'bg-danger/10 text-danger border border-danger/30' : 
                      ex.severity === 'ERROR' ? 'bg-warning/10 text-warning border border-warning/30' : 
                      'bg-slate-50 border border-slate-200 text-slate-500'
                    }`}>
                      {ex.severity}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{ex.desc}</td>
                  <td className="p-4 text-right">
                    {ex.actionRequired ? (
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 rounded bg-success/10 text-success hover:bg-success/20 transition-colors" title="Apply Fix">
                          <Check className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded bg-danger/10 text-danger hover:bg-danger/20 transition-colors" title="Ignore Warning">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Auto-logged</span>
                    )}
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
