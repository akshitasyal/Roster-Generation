'use client';

import { useParams } from 'next/navigation';
import { CycleWorkspaceHeader } from '@/components/layout/CycleWorkspaceHeader';
import { ClipboardList, Filter, Search, CheckCircle2 } from 'lucide-react';

export default function CyclePreferencesPage() {
  const params = useParams();
  const cycleId = params.id as string;

  const prefs = [
    { empId: 'EMP-1042', name: 'John Doe', shift: 'Morning', off: 'Sat + Sun', tlStatus: 'Auto-Accepted' },
    { empId: 'EMP-1043', name: 'Jane Smith', shift: 'Morning', off: 'Sat + Sun', tlStatus: 'Auto-Accepted' },
    { empId: 'EMP-1102', name: 'Emily Davis', shift: 'Night', off: 'Fri + Sat', tlStatus: 'Declined (Reason Provided)' },
  ];

  return (
    <div className="space-y-6">
      <CycleWorkspaceHeader cycleId={cycleId} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">Preference Collection</h2>
          <p className="text-sm text-slate-400">Status of associate preferences and TL reviews for this cycle.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="glass-card p-4"><span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Status</span><p className="text-lg font-bold text-success mt-1">Closed</p></div>
        <div className="glass-card p-4"><span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Submitted</span><p className="text-xl font-bold text-white mt-1">1,108 <span className="text-sm font-medium text-slate-500">/ 1,240</span></p></div>
        <div className="glass-card p-4"><span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Pending TL</span><p className="text-xl font-bold text-white mt-1">0</p></div>
        <div className="glass-card p-4"><span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Declined</span><p className="text-xl font-bold text-warning mt-1">12</p></div>
        <div className="glass-card p-4"><span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Auto-Accepted</span><p className="text-xl font-bold text-brand-primary mt-1">1,096</p></div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-wfm-border bg-wfm-card/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-success bg-success/10 border border-success/30 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-4 h-4" /> Collection & TL Review Complete
          </span>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-wfm-dark border border-wfm-border rounded-lg pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-wfm-panel/50 border-b border-wfm-border">
                <th className="p-4 font-semibold text-slate-400 uppercase">Employee</th>
                <th className="p-4 font-semibold text-slate-400 uppercase">Preferred Shift</th>
                <th className="p-4 font-semibold text-slate-400 uppercase">Weekly Off</th>
                <th className="p-4 font-semibold text-slate-400 uppercase">TL Review Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border text-slate-300">
              {prefs.map((pref, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-medium text-white">{pref.name} <span className="text-xs text-slate-500 font-mono ml-2">{pref.empId}</span></td>
                  <td className="p-4 text-brand-primary font-medium">{pref.shift}</td>
                  <td className="p-4 text-slate-300">{pref.off}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      pref.tlStatus === 'Auto-Accepted' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {pref.tlStatus}
                    </span>
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
