'use client';

import { Filter, Calendar as CalendarIcon, Download } from 'lucide-react';
import { CoverageChart } from '@/components/coverage/CoverageChart';

export default function AmCoveragePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Master Coverage</h1>
          <p className="text-slate-400">Demand vs capacity visualization across all your teams.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="btn-secondary text-sm p-2"><Download className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="glass-card p-6 border-brand-primary/20">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-3">
            <select className="bg-wfm-dark border border-wfm-border rounded-lg text-sm text-white px-4 py-2 focus:outline-none focus:border-brand-primary min-w-[150px]">
              <option>All Teams (3)</option>
              <option>Team Alpha</option>
              <option>Team Bravo</option>
              <option>Team Charlie</option>
            </select>
            <select className="bg-wfm-dark border border-wfm-border rounded-lg text-sm text-white px-4 py-2 focus:outline-none focus:border-brand-primary min-w-[150px]">
              <option>All Skills</option>
              <option>Technical</option>
              <option>Voice</option>
            </select>
            <div className="flex items-center gap-2 bg-wfm-dark border border-wfm-border rounded-lg px-4 py-2 text-sm text-white cursor-pointer hover:border-brand-primary transition-colors">
              <CalendarIcon className="w-4 h-4 text-brand-primary" />
              <span>Oct 05, 2026</span>
            </div>
          </div>
          
          <div className="flex gap-4 text-xs font-medium">
            <span className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-slate-700"></div> Required: 154</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 bg-brand-primary"></div> Assigned: 147</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 bg-danger"></div> Gap: -7</span>
          </div>
        </div>
        
        <div className="bg-wfm-dark/50 border border-wfm-border rounded-xl p-4 pt-10 mt-4">
          <CoverageChart scope="GLOBAL" />
        </div>
      </div>
    </div>
  );
}
