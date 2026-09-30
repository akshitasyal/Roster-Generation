'use client';

import { useParams } from 'next/navigation';
import { CycleWorkspaceHeader } from '@/components/layout/CycleWorkspaceHeader';
import { Search, Filter, ShieldAlert } from 'lucide-react';

export default function CycleWorkforcePage() {
  const params = useParams();
  const cycleId = params.id as string;

  const employees = [
    { id: 'EMP-1042', name: 'John Doe', team: 'Alpha', skill: 'Technical L2', availability: 'Available', leave: 'None', eligible: true },
    { id: 'EMP-1043', name: 'Jane Smith', team: 'Alpha', skill: 'Voice L1', availability: 'Available', leave: 'None', eligible: true },
    { id: 'EMP-1102', name: 'Emily Davis', team: 'Bravo', skill: 'Chat Support', availability: 'Unavailable', leave: 'Approved (Full Week)', eligible: false },
  ];

  return (
    <div className="space-y-6">
      <CycleWorkspaceHeader cycleId={cycleId} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">Workforce Snapshot</h2>
          <p className="text-sm text-slate-400">Review eligible workforce mapped to this cycle.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search employee..." 
              className="w-full bg-wfm-card border border-wfm-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
          <button className="btn-secondary p-2"><Filter className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="glass-card p-4"><span className="text-xs text-slate-400 uppercase font-bold">Total HC</span><p className="text-2xl font-bold text-white">1,240</p></div>
        <div className="glass-card p-4"><span className="text-xs text-slate-400 uppercase font-bold">Available</span><p className="text-2xl font-bold text-success">1,190</p></div>
        <div className="glass-card p-4"><span className="text-xs text-slate-400 uppercase font-bold">On Leave</span><p className="text-2xl font-bold text-warning">42</p></div>
        <div className="glass-card p-4"><span className="text-xs text-slate-400 uppercase font-bold">Unavailable</span><p className="text-2xl font-bold text-danger">8</p></div>
        <div className="glass-card p-4"><span className="text-xs text-slate-400 uppercase font-bold">Eligible</span><p className="text-2xl font-bold text-brand-primary">1,190</p></div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-wfm-panel/50 border-b border-wfm-border">
                <th className="p-4 font-semibold text-slate-400 uppercase">Employee</th>
                <th className="p-4 font-semibold text-slate-400 uppercase">Team</th>
                <th className="p-4 font-semibold text-slate-400 uppercase">Skill/Profile</th>
                <th className="p-4 font-semibold text-slate-400 uppercase">Availability</th>
                <th className="p-4 font-semibold text-slate-400 uppercase">Leave Status</th>
                <th className="p-4 font-semibold text-slate-400 uppercase text-center">Eligible for Engine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border text-slate-300">
              {employees.map((emp, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-medium text-white">{emp.name} <span className="text-xs text-slate-500 font-mono ml-2">{emp.id}</span></td>
                  <td className="p-4">{emp.team}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-wfm-dark border border-wfm-border rounded text-xs">{emp.skill}</span></td>
                  <td className="p-4">
                    <span className={`font-medium ${emp.availability === 'Available' ? 'text-success' : 'text-danger'}`}>{emp.availability}</span>
                  </td>
                  <td className="p-4 text-slate-400">{emp.leave}</td>
                  <td className="p-4 text-center">
                    {emp.eligible ? (
                      <span className="px-2 py-1 rounded bg-success/10 text-success text-xs font-bold uppercase">Yes</span>
                    ) : (
                      <span className="px-2 py-1 rounded bg-danger/10 text-danger text-xs font-bold uppercase">No</span>
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
