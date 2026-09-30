'use client';

import { useParams } from 'next/navigation';
import { CycleWorkspaceHeader } from '@/components/layout/CycleWorkspaceHeader';
import { AlertTriangle, Filter, Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function CycleExceptionsPage() {
  const params = useParams();
  const cycleId = params.id as string;
  const [selectedException, setSelectedException] = useState<any>(null);

  const exceptions = [
    { id: 'EX-101', type: 'STAFFING SHORTAGE', team: 'Team Alpha', date: '05 Oct (Mon)', shift: 'Morning', gap: 4, severity: 'HIGH', status: 'OPEN' },
    { id: 'EX-102', type: 'SKILL DEFICIT', team: 'Team Bravo', date: '06 Oct (Tue)', shift: 'Night', gap: 2, severity: 'CRITICAL', status: 'OPEN' },
    { id: 'EX-103', type: 'OVERTIME ALERT', team: 'Team Alpha', date: '08 Oct (Thu)', shift: 'Evening', gap: 0, severity: 'MEDIUM', status: 'RESOLVED' },
  ];

  return (
    <div className="space-y-6">
      <CycleWorkspaceHeader cycleId={cycleId} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">Exception Center</h2>
          <p className="text-sm text-slate-400">Resolve staffing shortages and critical constraints before approval.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search exceptions..." 
              className="bg-wfm-dark border border-wfm-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 border-danger/30 bg-danger/5">
          <span className="text-[10px] uppercase text-danger font-bold tracking-wider">Critical</span>
          <p className="text-2xl font-bold text-danger mt-1">2</p>
        </div>
        <div className="glass-card p-4 border-warning/30 bg-warning/5">
          <span className="text-[10px] uppercase text-warning font-bold tracking-wider">High</span>
          <p className="text-2xl font-bold text-warning mt-1">5</p>
        </div>
        <div className="glass-card p-4 border-brand-primary/30 bg-brand-primary/5">
          <span className="text-[10px] uppercase text-brand-primary font-bold tracking-wider">Medium</span>
          <p className="text-2xl font-bold text-brand-primary mt-1">7</p>
        </div>
        <div className="glass-card p-4">
          <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Low</span>
          <p className="text-2xl font-bold text-white mt-1">3</p>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 glass-card overflow-hidden h-fit">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-wfm-panel/80">
                <th className="p-4 font-semibold text-slate-400 uppercase border-b border-wfm-border">Type</th>
                <th className="p-4 font-semibold text-slate-400 uppercase border-b border-wfm-border">Team</th>
                <th className="p-4 font-semibold text-slate-400 uppercase border-b border-wfm-border">Date</th>
                <th className="p-4 font-semibold text-slate-400 uppercase border-b border-wfm-border">Shift</th>
                <th className="p-4 font-semibold text-slate-400 uppercase border-b border-wfm-border text-center">Gap</th>
                <th className="p-4 font-semibold text-slate-400 uppercase border-b border-wfm-border text-center">Severity</th>
                <th className="p-4 font-semibold text-slate-400 uppercase border-b border-wfm-border text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border text-slate-300">
              {exceptions.map((ex) => (
                <tr key={ex.id} className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedException?.id === ex.id ? 'bg-white/[0.05]' : ''}`} onClick={() => setSelectedException(ex)}>
                  <td className="p-4 font-bold text-white text-xs">{ex.type}</td>
                  <td className="p-4">{ex.team}</td>
                  <td className="p-4">{ex.date}</td>
                  <td className="p-4">{ex.shift}</td>
                  <td className="p-4 text-center font-bold text-danger">{ex.gap > 0 ? `-${ex.gap}` : '-'}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      ex.severity === 'CRITICAL' ? 'bg-danger/20 text-danger border border-danger/30' :
                      ex.severity === 'HIGH' ? 'bg-warning/20 text-warning border border-warning/30' :
                      'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                    }`}>
                      {ex.severity}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <ChevronRight className="w-5 h-5 inline-block text-slate-500" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedException && (
          <div className="w-80 flex-shrink-0 glass-card flex flex-col border-warning/30 animate-slide-left h-fit">
            <div className="p-4 border-b border-wfm-border bg-wfm-panel flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" /> Exception Details
              </h3>
              <button onClick={() => setSelectedException(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-5 flex-1 space-y-6">
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Issue</div>
                <div className="font-bold text-white text-lg">{selectedException.type}</div>
                <div className="text-sm text-slate-400 mt-1">{selectedException.team} • {selectedException.date} • {selectedException.shift}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-3 bg-wfm-dark border border-wfm-border rounded-lg">
                  <div className="text-xs text-slate-500 uppercase mb-1">Required</div>
                  <div className="font-bold text-white">20</div>
                </div>
                <div className="p-3 bg-wfm-dark border border-wfm-border rounded-lg">
                  <div className="text-xs text-slate-500 uppercase mb-1">Assigned</div>
                  <div className="font-bold text-white">16</div>
                </div>
                <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg">
                  <div className="text-xs text-danger uppercase mb-1">Gap</div>
                  <div className="font-bold text-danger">4</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Root Cause Analysis (Why?)</h4>
                <ul className="text-sm space-y-2 border border-wfm-border rounded-lg p-3 bg-wfm-dark/50">
                  <li className="flex justify-between border-b border-wfm-border/50 pb-2"><span className="text-slate-400">Total Eligible Employees</span> <span className="font-bold text-white">16</span></li>
                  <li className="flex justify-between border-b border-wfm-border/50 pb-2 pt-1"><span className="text-slate-400">Unavailable</span> <span className="font-bold text-danger">7</span></li>
                  <li className="flex justify-between border-b border-wfm-border/50 pb-2 pt-1"><span className="text-slate-400">On Leave</span> <span className="font-bold text-warning">3</span></li>
                  <li className="flex justify-between border-b border-wfm-border/50 pb-2 pt-1"><span className="text-slate-400">Skill Mismatch</span> <span className="font-bold text-slate-300">2</span></li>
                  <li className="flex justify-between border-b border-wfm-border/50 pb-2 pt-1"><span className="text-slate-400">Shift Ineligible</span> <span className="font-bold text-slate-300">1</span></li>
                  <li className="flex justify-between pt-1"><span className="text-slate-400">Rest Conflict</span> <span className="font-bold text-slate-300">1</span></li>
                </ul>
              </div>

              <div className="pt-2">
                <button className="w-full btn-primary justify-center bg-brand-primary text-white mb-2 hover:bg-brand-secondary">
                  Find Replacements
                </button>
                <button className="w-full btn-secondary justify-center text-slate-400 hover:text-white">
                  Acknowledge & Ignore
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
