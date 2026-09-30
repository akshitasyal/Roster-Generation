'use client';

import { useParams } from 'next/navigation';
import { CycleWorkspaceHeader } from '@/components/layout/CycleWorkspaceHeader';
import { Filter, Search, Download } from 'lucide-react';
import { CoverageChart } from '@/components/coverage/CoverageChart';

export default function CycleCoveragePage() {
  const params = useParams();
  const cycleId = params.id as string;

  return (
    <div className="space-y-6">
      <CycleWorkspaceHeader cycleId={cycleId} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">Coverage Analysis</h2>
          <p className="text-sm text-slate-400">Analyze required vs assigned headcount across all intervals.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="bg-wfm-dark border border-wfm-border rounded-lg text-sm text-white px-4 py-2 focus:outline-none focus:border-brand-primary min-w-[150px]">
            <option>All Skills</option>
            <option>Technical</option>
            <option>Voice</option>
          </select>
          <button className="btn-secondary text-sm flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</button>
          <button className="btn-secondary text-sm flex items-center gap-2"><Download className="w-4 h-4" /> Export</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4"><span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Required HC</span><p className="text-2xl font-bold text-white mt-1">1,240</p></div>
        <div className="glass-card p-4"><span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Assigned HC</span><p className="text-2xl font-bold text-brand-primary mt-1">1,226</p></div>
        <div className="glass-card p-4 border-danger/30 bg-danger/5"><span className="text-[10px] uppercase text-danger font-bold tracking-wider">Staffing Gap</span><p className="text-2xl font-bold text-danger mt-1">14</p></div>
        <div className="glass-card p-4"><span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Overall Coverage</span><p className="text-2xl font-bold text-success mt-1">98.9%</p></div>
      </div>

      <div className="glass-card p-6 border-wfm-border">
        <h3 className="font-semibold text-white mb-6">Hourly Coverage (05 Oct - Monday)</h3>
        <div className="bg-wfm-dark/50 border border-wfm-border rounded-xl p-4 pt-10">
          <CoverageChart scope="GLOBAL" />
        </div>
      </div>
      
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-wfm-border bg-wfm-panel/50">
          <h3 className="font-semibold text-white">Interval Breakdown</h3>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-wfm-dark/50 border-b border-wfm-border">
                <th className="p-4 font-semibold text-slate-400 uppercase">Interval</th>
                <th className="p-4 font-semibold text-slate-400 uppercase text-center">Required</th>
                <th className="p-4 font-semibold text-slate-400 uppercase text-center">Assigned</th>
                <th className="p-4 font-semibold text-slate-400 uppercase text-center">Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border text-slate-300">
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-medium text-white">09:00 - 10:00</td>
                <td className="p-4 text-center">180</td>
                <td className="p-4 text-center">180</td>
                <td className="p-4 text-center text-success font-bold">0</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-medium text-white">10:00 - 11:00</td>
                <td className="p-4 text-center">190</td>
                <td className="p-4 text-center">184</td>
                <td className="p-4 text-center text-danger font-bold">-6</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-medium text-white">11:00 - 12:00</td>
                <td className="p-4 text-center">200</td>
                <td className="p-4 text-center">192</td>
                <td className="p-4 text-center text-danger font-bold">-8</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
