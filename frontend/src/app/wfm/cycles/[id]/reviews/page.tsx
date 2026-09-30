'use client';

import { useParams } from 'next/navigation';
import { CycleWorkspaceHeader } from '@/components/layout/CycleWorkspaceHeader';
import { CheckCircle2, Clock, AlertTriangle, UploadCloud } from 'lucide-react';
import { useState } from 'react';

export default function CycleReviewsPage() {
  const params = useParams();
  const cycleId = params.id as string;
  const [published, setPublished] = useState(false);

  return (
    <div className="space-y-6">
      <CycleWorkspaceHeader cycleId={cycleId} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">Management Reviews & Publish</h2>
          <p className="text-sm text-slate-400">Track approval status across the organizational hierarchy.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-6">Approval Workflow</h3>
          
          <div className="relative border-l-2 border-wfm-dark ml-4 space-y-8 pb-4">
            <WorkflowStep title="Generated & Validated" status="complete" subtitle="By WFM Engine (Auto)" date="04 Oct, 14:32" />
            <WorkflowStep title="Team Leader Review" status="complete" subtitle="12/12 TLs Approved" date="04 Oct, 18:00" />
            <WorkflowStep title="AM Review" status="complete" subtitle="4/4 AMs Approved" date="05 Oct, 09:30" />
            <WorkflowStep title="Manager Review" status="pending" subtitle="Pending Priya Nair" active />
            <WorkflowStep title="Senior Manager Review" status="pending" subtitle="Requires Manager Approval First" />
            <WorkflowStep title="WFM Final Approval" status="pending" subtitle="Pending All Approvals" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-brand-primary/20 bg-brand-primary/5">
            <h3 className="font-bold text-white mb-4">Publish Configuration</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-wfm-border/50">
                <span className="text-sm text-slate-400">Target Version</span>
                <span className="font-medium text-white">RV-2026-101</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-wfm-border/50">
                <span className="text-sm text-slate-400">Target Cycle</span>
                <span className="font-medium text-white">{cycleId}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-wfm-border/50">
                <span className="text-sm text-slate-400">Employees Affected</span>
                <span className="font-medium text-white">1,240</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-wfm-border/50">
                <span className="text-sm text-slate-400">Manual Adjustments</span>
                <span className="font-medium text-brand-primary">23</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-400">Open Exceptions</span>
                <span className="font-medium text-warning flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> 14 (Acknowledged)</span>
              </div>
            </div>

            {published ? (
              <div className="w-full btn-primary bg-success/20 border-success/30 text-success py-4 text-sm font-bold flex justify-center items-center gap-2 cursor-default">
                <CheckCircle2 className="w-5 h-5" /> Roster Published Successfully
              </div>
            ) : (
              <button 
                onClick={() => setPublished(true)}
                className="w-full btn-primary py-4 text-sm font-bold flex justify-center items-center gap-2 shadow-brand-primary/20 hover:shadow-brand-primary/40"
              >
                <UploadCloud className="w-5 h-5" /> Force Publish Roster (Override Approvals)
              </button>
            )}
            {!published && <p className="text-xs text-center text-slate-500 mt-3">Warning: Forcing publish bypasses pending management approvals. A notification will be sent to the Senior Manager.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowStep({ title, subtitle, status, date, active }: any) {
  return (
    <div className="relative pl-8">
      <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
        status === 'complete' ? 'bg-brand-primary border-brand-primary text-white shadow-[0_0_10px_rgba(var(--color-brand-primary),0.5)]' :
        active ? 'bg-wfm-card border-brand-primary text-brand-primary z-10' :
        'bg-wfm-dark border-wfm-border'
      }`}>
        {status === 'complete' && <CheckCircle2 className="w-3 h-3" />}
        {active && <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>}
      </div>
      
      <div className={`${active ? 'bg-white/[0.03] p-4 rounded-lg border border-wfm-border/50 -mt-3' : ''}`}>
        <div className="flex justify-between items-start">
          <div>
            <div className={`font-bold ${status === 'complete' ? 'text-white' : active ? 'text-brand-primary' : 'text-slate-500'}`}>{title}</div>
            <div className="text-xs text-slate-400 mt-1">{subtitle}</div>
          </div>
          {date && <div className="text-xs text-slate-500 font-medium">{date}</div>}
        </div>
      </div>
    </div>
  );
}
