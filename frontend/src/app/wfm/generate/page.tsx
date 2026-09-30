'use client';

import { Check, ShieldAlert, Zap, Server, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function WfmGeneratePage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Generate Draft Roster</h1>
        <p className="text-slate-400">Generate a feasible weekly roster using demand, workforce availability, preferences, and configured business rules.</p>
      </div>

      <div className="glass-card border-brand-primary/30 overflow-hidden">
        {/* STEP 1 - CYCLE */}
        <div className="p-6 border-b border-wfm-border bg-wfm-card/80">
          <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-4 flex items-center gap-2">
            Step 1: Scope
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Planning Cycle</label>
              <select className="w-full bg-wfm-dark border border-wfm-border rounded p-2.5 text-white text-sm focus:outline-none focus:border-brand-primary">
                <option>2026-W42 (12 Oct - 18 Oct 2026)</option>
                <option>2026-W43 (19 Oct - 25 Oct 2026)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Project</label>
              <select className="w-full bg-wfm-dark border border-wfm-border rounded p-2.5 text-white text-sm focus:outline-none focus:border-brand-primary">
                <option>Banking Support</option>
                <option>Telecom L1</option>
              </select>
            </div>
          </div>
        </div>

        {/* STEP 2 - READINESS */}
        <div className="p-6 border-b border-wfm-border">
          <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider mb-4">Step 2: Input Readiness</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ReadinessItem label="Demand" ready />
            <ReadinessItem label="Employees" ready />
            <ReadinessItem label="Skills" ready />
            <ReadinessItem label="Availability" ready />
            <ReadinessItem label="Leave" ready />
            <ReadinessItem label="Preferences" ready />
            <ReadinessItem label="Weekly Off" ready />
            <ReadinessItem label="Rules" ready />
          </div>
        </div>

        {/* STEP 3 - SNAPSHOT */}
        <div className="p-6 border-b border-wfm-border bg-wfm-dark/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider">Step 3: Planning Snapshot</h2>
            <span className="px-2 py-1 bg-success/10 border border-success/20 text-success text-xs font-bold rounded">SNAPSHOT READY</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-sm">
            <SnapshotStat label="Employees" value="1,240" />
            <SnapshotStat label="Projects" value="4" />
            <SnapshotStat label="Teams" value="42" />
            <SnapshotStat label="Skills" value="18" />
            <SnapshotStat label="Demand Intervals" value="1,176" />
            <SnapshotStat label="Approved Leaves" value="42" />
            <SnapshotStat label="Locked Assignments" value="17" />
            <SnapshotStat label="Preferences" value="1,108 / 1,240" />
            <SnapshotStat label="Rules Version" value="RV-12" />
            <SnapshotStat label="Previous Roster" value="RV-2026-100" />
          </div>
        </div>

        {/* STEP 4 - CONFIGURATION */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 cursor-pointer group">
            <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider">Step 4: Generation Configuration</h2>
            <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-300 mb-6">
            <div><span className="text-slate-500 mr-2">Horizon:</span> 7 days</div>
            <div><span className="text-slate-500 mr-2">Max Hours:</span> 9</div>
            <div><span className="text-slate-500 mr-2">Min Rest:</span> 11h</div>
            <div><span className="text-slate-500 mr-2">Weekly Off:</span> 2</div>
            <div><span className="text-slate-500 mr-2">Max Consecutive:</span> 6</div>
          </div>
          
          <button className="w-full btn-primary py-4 text-lg font-bold flex justify-center items-center gap-3 shadow-brand-primary/20 hover:shadow-brand-primary/40">
            <Zap className="w-5 h-5 fill-current" /> Generate Draft Roster
          </button>
          <p className="text-center text-xs text-slate-500 mt-3">This will create a new draft roster version. Existing published rosters will not be modified.</p>
        </div>
      </div>
    </div>
  );
}

function ReadinessItem({ label, ready }: { label: string, ready: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {ready ? <Check className="w-4 h-4 text-success" /> : <ShieldAlert className="w-4 h-4 text-warning" />}
      <span className={ready ? "text-slate-300" : "text-warning"}>{label}</span>
    </div>
  );
}

function SnapshotStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col border-l-2 border-brand-primary/20 pl-3">
      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
