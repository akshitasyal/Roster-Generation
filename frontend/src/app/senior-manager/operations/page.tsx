'use client';

import { Building2, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function SeniorManagerOperationsPage() {
  const managers = [
    { name: 'Priya Nair', role: 'Manager', org: 'Banking & Finance', ams: 4, headcount: 450, health: '98%' },
    { name: 'Vikram Singh', role: 'Manager', org: 'Telecom Operations', ams: 3, headcount: 320, health: '95%' },
    { name: 'Anita Desai', role: 'Manager', org: 'Retail Support', ams: 2, headcount: 210, health: '82%' },
    { name: 'Ravi Verma', role: 'Manager', org: 'Healthcare IT', ams: 3, headcount: 260, health: '78%' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Portfolio Operations</h1>
          <p className="text-slate-400">High-level view of all reporting Managers and their organizations.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search organizations..." 
              className="w-full bg-wfm-card border border-wfm-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
          <button className="btn-secondary p-2"><Filter className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-wfm-border/50">
        <div className="p-4 border-b border-wfm-border bg-wfm-card/50 flex items-center gap-3">
          <Building2 className="w-5 h-5 text-brand-primary" />
          <h3 className="font-semibold text-white">Global Support Portfolio</h3>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-wfm-panel/50 border-b border-wfm-border">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Manager Leader</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Organization</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-center">Sub-AMs</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-center">Total Headcount</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Overall Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border">
              {managers.map((mgr, idx) => {
                const healthValue = parseInt(mgr.health);
                const healthColor = healthValue >= 95 ? 'text-success' : healthValue >= 85 ? 'text-warning' : 'text-danger';
                
                return (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors cursor-pointer group">
                    <td className="p-4">
                      <div className="font-semibold text-white group-hover:text-brand-primary transition-colors">{mgr.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{mgr.role}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-300">{mgr.org}</td>
                    <td className="p-4 text-sm text-center font-medium text-slate-400">{mgr.ams}</td>
                    <td className="p-4 text-sm text-center font-medium text-slate-400">{mgr.headcount}</td>
                    <td className="p-4">
                      <span className={`text-sm font-bold ${healthColor}`}>{mgr.health}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
