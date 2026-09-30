'use client';

import { Search, Filter, Edit, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function WfmWorkforcePage() {
  const employees = [
    { id: 'EMP-1042', name: 'John Doe', role: 'Associate', skill: 'Technical L2', team: 'Alpha', status: 'Active' },
    { id: 'EMP-1043', name: 'Jane Smith', role: 'Associate', skill: 'Voice L1', team: 'Alpha', status: 'Active' },
    { id: 'EMP-0056', name: 'Arun Kumar', role: 'Team Leader', skill: 'Management', team: 'Alpha', status: 'Active' },
    { id: 'EMP-0012', name: 'Sunita Rao', role: 'Associate Manager', skill: 'Management', team: 'N/A', status: 'Active' },
    { id: 'EMP-1102', name: 'Emily Davis', role: 'Associate', skill: 'Chat Support', team: 'Bravo', status: 'Leave' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workforce Directory</h1>
          <p className="text-slate-400">Master record of all personnel, skills, and mappings.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              className="w-full bg-wfm-card border border-wfm-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
          <button className="btn-secondary p-2"><Filter className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-wfm-border/50">
        <div className="p-4 border-b border-wfm-border bg-wfm-card/50 flex justify-between items-center">
          <h3 className="font-semibold text-white">All Employees (1,240)</h3>
          <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Bulk Reassign
          </button>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-wfm-panel/50 border-b border-wfm-border">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Emp ID</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Name</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Role</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Skill/Profile</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Assigned Team</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-sm font-mono text-slate-300">{emp.id}</td>
                  <td className="p-4 text-sm font-medium text-white">{emp.name}</td>
                  <td className="p-4 text-sm text-brand-primary">{emp.role}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-wfm-dark border border-wfm-border rounded-md text-xs text-slate-300">{emp.skill}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-300">{emp.team}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      emp.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-slate-500 hover:text-brand-primary transition-colors p-1 rounded hover:bg-brand-primary/10">
                      <Edit className="w-4 h-4" />
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
