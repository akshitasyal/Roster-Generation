'use client';

import { useParams } from 'next/navigation';
import { CycleWorkspaceHeader } from '@/components/layout/CycleWorkspaceHeader';
import { Lock, Settings, User, SlidersHorizontal, Search, Download } from 'lucide-react';
import { useState } from 'react';

export default function CycleRosterPage() {
  const params = useParams();
  const cycleId = params.id as string;
  const [selectedCell, setSelectedCell] = useState<any>(null);

  const employees = [
    { id: 'EMP-001', name: 'John Doe', shifts: ['Morning', 'Morning', 'Morning', 'Morning', 'Morning', 'OFF', 'OFF'], locked: [false, false, false, false, false, true, true] },
    { id: 'EMP-002', name: 'Jane Smith', shifts: ['Morning', 'Morning', 'OFF', 'Morning', 'Morning', 'OFF', 'OFF'], locked: [false, false, false, false, false, true, true] },
    { id: 'EMP-003', name: 'Raj Kumar', shifts: ['Evening', 'Evening', 'Evening', 'OFF', 'Evening', 'OFF', 'Evening'], locked: [true, false, false, false, false, false, false] },
    { id: 'EMP-004', name: 'Anita Desai', shifts: ['Night', 'Night', 'Night', 'Night', 'Night', 'OFF', 'OFF'], locked: [false, false, false, false, false, false, false] },
    { id: 'EMP-005', name: 'Vikram Singh', shifts: ['Morning', 'Evening', 'Night', 'Morning', 'OFF', 'OFF', 'OFF'], locked: [false, true, false, false, false, false, false] },
  ];

  const days = ['MON 05', 'TUE 06', 'WED 07', 'THU 08', 'FRI 09', 'SAT 10', 'SUN 11'];

  return (
    <div className="space-y-6">
      <CycleWorkspaceHeader cycleId={cycleId} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">Master Roster Grid</h2>
          <p className="text-sm text-slate-400">Review assignments, edit shifts, and manage locks.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter roster..." 
              className="bg-wfm-dark border border-wfm-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> View Options</button>
          <button className="btn-primary flex items-center gap-2"><Download className="w-4 h-4" /> Export</button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 glass-card overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-wfm-panel/80">
                  <th className="p-3 font-semibold text-slate-400 uppercase border-b border-r border-wfm-border sticky left-0 bg-wfm-panel/80 z-10 w-48">Employee</th>
                  {days.map(day => (
                    <th key={day} className="p-3 font-semibold text-slate-400 uppercase text-center border-b border-wfm-border min-w-[100px]">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-wfm-border text-slate-300">
                {employees.map((emp, empIdx) => (
                  <tr key={empIdx} className="hover:bg-white/[0.02]">
                    <td className="p-3 border-r border-wfm-border sticky left-0 bg-wfm-card z-10">
                      <div className="font-medium text-white">{emp.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{emp.id}</div>
                    </td>
                    {emp.shifts.map((shift, dayIdx) => {
                      const isLocked = emp.locked[dayIdx];
                      const isSelected = selectedCell?.empIdx === empIdx && selectedCell?.dayIdx === dayIdx;
                      
                      return (
                        <td key={dayIdx} className="p-1">
                          <button 
                            onClick={() => setSelectedCell({ empIdx, dayIdx, emp, shift, day: days[dayIdx], isLocked })}
                            className={`w-full h-full min-h-[48px] p-2 rounded flex flex-col items-center justify-center relative transition-all border ${
                              isSelected ? 'border-brand-primary bg-brand-primary/10 shadow-[0_0_10px_rgba(var(--color-brand-primary),0.3)]' : 
                              'border-transparent hover:border-slate-600 hover:bg-white/[0.05]'
                            } ${
                              shift === 'OFF' ? 'bg-wfm-dark/50 text-slate-500' :
                              shift === 'Night' ? 'bg-indigo-900/20 text-indigo-300' :
                              'bg-brand-primary/5 text-slate-200'
                            }`}
                          >
                            <span className={`font-semibold ${shift === 'OFF' ? 'text-xs' : 'text-sm'}`}>{shift}</span>
                            {shift !== 'OFF' && <span className="text-[10px] opacity-70">
                              {shift === 'Morning' ? '09:00-18:00' : shift === 'Evening' ? '14:00-23:00' : '22:00-07:00'}
                            </span>}
                            {isLocked && <Lock className="w-3 h-3 absolute top-1 right-1 text-slate-500" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel for Adjustments */}
        {selectedCell && (
          <div className="w-80 flex-shrink-0 glass-card flex flex-col border-brand-primary/30 animate-slide-left h-fit">
            <div className="p-4 border-b border-wfm-border bg-wfm-panel flex justify-between items-center">
              <h3 className="font-bold text-white">Assignment Details</h3>
              <button onClick={() => setSelectedCell(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-4 flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-wfm-dark flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{selectedCell.emp.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{selectedCell.emp.id}</div>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-wfm-dark border border-wfm-border rounded-lg text-sm">
                <div className="flex justify-between mb-2 pb-2 border-b border-wfm-border/50">
                  <span className="text-slate-400">Date</span>
                  <span className="font-medium text-white">{selectedCell.day}</span>
                </div>
                <div className="flex justify-between mb-2 pb-2 border-b border-wfm-border/50">
                  <span className="text-slate-400">Current Shift</span>
                  <span className="font-medium text-brand-primary">{selectedCell.shift}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Source</span>
                  <span className="font-medium text-slate-300">{selectedCell.isLocked ? 'Manual Adjustment' : 'Optimizer'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full btn-primary justify-center bg-wfm-dark border-brand-primary text-brand-primary hover:bg-brand-primary/10">
                  Change Shift
                </button>
                <button className={`w-full btn-secondary justify-center flex items-center gap-2 ${selectedCell.isLocked ? 'text-warning border-warning/50' : ''}`}>
                  <Lock className="w-4 h-4" /> {selectedCell.isLocked ? 'Unlock Assignment' : 'Lock Assignment'}
                </button>
              </div>

              <div className="pt-4 border-t border-wfm-border">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Validation Context</h4>
                <ul className="text-xs space-y-2">
                  <li className="flex justify-between"><span className="text-slate-400">Rest Requirement</span> <span className="text-success">✓ Passed</span></li>
                  <li className="flex justify-between"><span className="text-slate-400">Working Hours</span> <span className="text-success">✓ Passed</span></li>
                  <li className="flex justify-between"><span className="text-slate-400">Preference</span> {selectedCell.shift === 'OFF' ? <span className="text-slate-400">-</span> : <span className="text-success">✓ Honored</span>}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
