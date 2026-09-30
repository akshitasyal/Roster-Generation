'use client';

import { useParams } from 'next/navigation';
import { CycleWorkspaceHeader } from '@/components/layout/CycleWorkspaceHeader';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function CycleOverviewPage() {
  const params = useParams();
  const cycleId = params.id as string;

  return (
    <div className="space-y-6">
      <CycleWorkspaceHeader cycleId={cycleId} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Workflow Readiness</h2>
          <div className="space-y-4">
            <WorkflowItem title="Demand Loaded" status="complete" date="01 Oct, 10:00" />
            <WorkflowItem title="Workforce Snapshot" status="complete" date="01 Oct, 10:15" />
            <WorkflowItem title="Preference Collection" status="complete" date="03 Oct, 18:00" />
            <WorkflowItem title="TL Preference Review" status="complete" date="04 Oct, 12:00" />
            <WorkflowItem title="Roster Generation" status="complete" date="04 Oct, 14:32" />
            <WorkflowItem title="Validation & Adjustment" status="warning" date="In Progress (3 Issues)" />
            <WorkflowItem title="Management Review" status="pending" />
            <WorkflowItem title="WFM Publish" status="pending" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-brand-primary/20 bg-brand-primary/5">
            <h2 className="text-sm font-semibold text-brand-primary uppercase tracking-wider mb-4">Current Active State</h2>
            <p className="text-white font-medium mb-2">Roster Draft RV-2026-101 Generated</p>
            <p className="text-sm text-slate-400 mb-6">The roster engine has completed generation. You must resolve all critical validation errors before it can be submitted for management approval.</p>
            <div className="flex gap-3">
              <Link href={`/wfm/cycles/${cycleId}/validation`} className="btn-primary flex-1 justify-center">Go to Validation</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">Required HC</div>
              <div className="text-2xl font-bold text-white">1,240</div>
            </div>
            <div className="glass-card p-5">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">Assigned</div>
              <div className="text-2xl font-bold text-white">1,226</div>
            </div>
            <div className="glass-card p-5 border-danger/30 bg-danger/5">
              <div className="text-xs font-bold text-danger uppercase mb-1">Staffing Gap</div>
              <div className="text-2xl font-bold text-danger">-14</div>
            </div>
            <div className="glass-card p-5">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">Coverage</div>
              <div className="text-2xl font-bold text-brand-primary">98.9%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowItem({ title, status, date }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
        status === 'complete' ? 'bg-success/20 text-success' :
        status === 'warning' ? 'bg-warning/20 text-warning' :
        'bg-wfm-dark border border-wfm-border text-slate-600'
      }`}>
        {status === 'complete' ? <CheckCircle2 className="w-4 h-4" /> : 
         status === 'warning' ? <AlertTriangle className="w-4 h-4" /> : 
         <Clock className="w-4 h-4" />}
      </div>
      <div className="flex-1 flex justify-between items-center border-b border-wfm-border/50 pb-2">
        <span className={`font-medium ${status === 'pending' ? 'text-slate-500' : 'text-slate-200'}`}>{title}</span>
        {date && <span className={`text-xs ${status === 'warning' ? 'text-warning font-semibold' : 'text-slate-500'}`}>{date}</span>}
      </div>
    </div>
  );
}
