'use client';

import { useParams } from 'next/navigation';
import { CycleWorkspaceHeader } from '@/components/layout/CycleWorkspaceHeader';
import { Upload, Plus, Download, CheckCircle2 } from 'lucide-react';

export default function CycleDemandPage() {
  const params = useParams();
  const cycleId = params.id as string;

  const demandData = [
    { date: '05 Oct (Mon)', interval: '09:00 - 10:00', skill: 'Technical', level: 'L2', required: 20 },
    { date: '05 Oct (Mon)', interval: '10:00 - 11:00', skill: 'Technical', level: 'L2', required: 25 },
    { date: '05 Oct (Mon)', interval: '11:00 - 12:00', skill: 'Technical', level: 'L3', required: 30 },
    { date: '05 Oct (Mon)', interval: '12:00 - 13:00', skill: 'Voice', level: 'L1', required: 50 },
    { date: '05 Oct (Mon)', interval: '13:00 - 14:00', skill: 'Voice', level: 'L1', required: 45 },
  ];

  return (
    <div className="space-y-6">
      <CycleWorkspaceHeader cycleId={cycleId} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">Demand Management</h2>
          <p className="text-sm text-slate-400">Import and validate staffing requirements for this cycle.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary text-sm flex items-center gap-2"><Download className="w-4 h-4" /> Export</button>
          <button className="btn-secondary text-sm flex items-center gap-2"><Upload className="w-4 h-4" /> Import CSV</button>
          <button className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Row</button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-wfm-border bg-wfm-card/50 flex justify-between items-center">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-success bg-success/10 border border-success/30 px-3 py-1 rounded-full">
            <CheckCircle2 className="w-4 h-4" /> Demand Validated & Locked
          </span>
          <span className="text-sm text-slate-400 font-medium">Total Intervals: 1,176</span>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-wfm-panel/50 border-b border-wfm-border">
                <th className="p-4 font-semibold text-slate-400 uppercase">Date</th>
                <th className="p-4 font-semibold text-slate-400 uppercase">Interval</th>
                <th className="p-4 font-semibold text-slate-400 uppercase">Skill</th>
                <th className="p-4 font-semibold text-slate-400 uppercase">Level</th>
                <th className="p-4 font-semibold text-slate-400 uppercase text-right">Required HC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border text-slate-300">
              {demandData.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="p-4 font-medium text-white">{row.date}</td>
                  <td className="p-4">{row.interval}</td>
                  <td className="p-4">{row.skill}</td>
                  <td className="p-4"><span className="px-2 py-0.5 rounded bg-wfm-dark border border-wfm-border text-xs">{row.level}</span></td>
                  <td className="p-4 text-right font-bold text-brand-primary">{row.required}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
