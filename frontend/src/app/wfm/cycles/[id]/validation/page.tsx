'use client';

import { useParams } from 'next/navigation';
import { CycleWorkspaceHeader } from '@/components/layout/CycleWorkspaceHeader';
import { Check, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function CycleValidationPage() {
  const params = useParams();
  const cycleId = params.id as string;

  return (
    <div className="space-y-6">
      <CycleWorkspaceHeader cycleId={cycleId} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">Validation Results</h2>
          <p className="text-sm text-slate-400">Review hard constraints and soft metric satisfaction for this roster draft.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-t-4 border-t-success relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="px-3 py-1 rounded bg-success/10 text-success text-xs font-bold border border-success/20 uppercase tracking-wider">
              Feasible
            </span>
          </div>
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-success" /> Hard Constraint Validation
          </h3>
          <ul className="space-y-4">
            <ValidationRow label="Leave Conflicts" count={0} pass />
            <ValidationRow label="Overlapping Shifts" count={0} pass />
            <ValidationRow label="Skill Violations" count={0} pass />
            <ValidationRow label="Availability Violations" count={0} pass />
            <ValidationRow label=">9 Hour Violations" count={0} pass />
            <ValidationRow label="Rest Violations" count={0} pass />
            <ValidationRow label="Weekly-Off Violations" count={0} pass />
          </ul>
        </div>

        <div className="glass-card p-6 border-t-4 border-t-brand-primary relative overflow-hidden">
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-brand-primary" /> Soft Constraint Metrics
          </h3>
          <ul className="space-y-6">
            <MetricProgress label="Morning Preference Honored" value={91} />
            <MetricProgress label="Weekend Fairness" value={94} />
            <MetricProgress label="Weekly-Off Preference Honored" value={86} />
            <MetricProgress label="Workload Balance" value={92} />
            <MetricProgress label="Shift Stability" value={88} />
          </ul>
        </div>
      </div>
    </div>
  );
}

function ValidationRow({ label, count, pass }: { label: string; count: number; pass: boolean }) {
  return (
    <li className="flex justify-between items-center p-3 bg-wfm-dark border border-wfm-border rounded-lg">
      <span className="text-slate-300 text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <span className={`font-mono text-sm ${pass ? 'text-slate-500' : 'text-danger font-bold'}`}>{count} Violations</span>
        {pass ? <Check className="w-5 h-5 text-success" /> : <ShieldAlert className="w-5 h-5 text-danger" />}
      </div>
    </li>
  );
}

function MetricProgress({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="font-bold text-white">{value}%</span>
      </div>
      <div className="w-full h-2.5 bg-wfm-dark rounded-full overflow-hidden border border-wfm-border">
        <div className="h-full rounded-full bg-brand-primary" style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}
