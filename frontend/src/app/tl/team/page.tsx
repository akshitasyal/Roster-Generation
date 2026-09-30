'use client';

import { Search, Filter, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function MyTeamPage() {
  const team = [
    { id: 'EMP001', name: 'John Doe', skill: 'Technical L2', shift: 'Morning', status: 'Active', leave: 'None' },
    { id: 'EMP002', name: 'Jane Smith', skill: 'Voice L1', shift: 'Evening', status: 'Active', leave: 'Approved (Tomorrow)' },
    { id: 'EMP003', name: 'Michael Johnson', skill: 'Technical L3', shift: 'General', status: 'On Leave', leave: 'Current' },
    { id: 'EMP004', name: 'Emily Davis', skill: 'Chat Support', shift: 'Night', status: 'Active', leave: 'None' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Team</h1>
          <p className="text-slate-400">Manage and view details for all associates in Team Alpha.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search employee..." 
              className="w-full bg-wfm-card border border-wfm-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>
          <button className="btn-secondary p-2"><Filter className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-wfm-border/50">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-wfm-panel/50 border-b border-wfm-border">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Employee</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Skill</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Current Shift</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Leave Info</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border">
              {team.map((emp) => (
                <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-xs font-bold text-brand-primary border border-brand-primary/30">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{emp.name}</div>
                        <div className="text-xs text-slate-500">{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-300">
                    <span className="px-2 py-1 bg-wfm-dark border border-wfm-border rounded-md text-xs">{emp.skill}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-300">{emp.shift}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      emp.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-400">{emp.leave}</td>
                  <td className="p-4 text-right">
                    <button className="text-slate-500 hover:text-brand-primary transition-colors p-1 rounded hover:bg-brand-primary/10">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
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
