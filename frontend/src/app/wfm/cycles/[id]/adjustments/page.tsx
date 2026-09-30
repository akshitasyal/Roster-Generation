'use client';

import { useParams } from 'next/navigation';
import { CycleWorkspaceHeader } from '@/components/layout/CycleWorkspaceHeader';
import { Check, ShieldAlert, GitMerge, Lock } from 'lucide-react';
import { useState } from 'react';

export default function CycleAdjustmentsPage() {
  const params = useParams();
  const cycleId = params.id as string;
  const [newShift, setNewShift] = useState('Morning');

  return (
    <div className="space-y-6">
      <CycleWorkspaceHeader cycleId={cycleId} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">Manual Adjustments Workspace</h2>
          <p className="text-sm text-slate-400">Force override optimizer assignments with instant constraint validation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-wfm-border h-fit">
          <div className="flex items-center gap-3 mb-6 border-b border-wfm-border pb-4">
            <div className="w-12 h-12 rounded-full bg-wfm-dark flex items-center justify-center">
              <span className="font-bold text-slate-400">JD</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">John Doe <span className="text-xs text-slate-500 font-mono ml-2">EMP-024</span></h3>
              <p className="text-sm text-slate-400">Team Alpha • Technical L2</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-wfm-dark border border-wfm-border rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-bold mb-1 block">Target Date</span>
              <p className="font-medium text-white">06 Oct 2026 (Tuesday)</p>
            </div>
            <div className="p-4 bg-wfm-dark border border-wfm-border rounded-xl">
              <span className="text-xs text-slate-500 uppercase font-bold mb-1 block">Current Assignment</span>
              <p className="font-medium text-slate-300">Evening</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Select New Shift</h4>
            <div className="grid grid-cols-3 gap-3">
              {['Morning', 'Evening', 'Night', 'OFF'].map(shift => (
                <button
                  key={shift}
                  onClick={() => setNewShift(shift)}
                  className={`p-3 rounded-lg border text-sm font-bold transition-all ${
                    newShift === shift 
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-[0_0_10px_rgba(var(--color-brand-primary),0.2)]' 
                      : 'border-wfm-border bg-wfm-dark text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {shift}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card flex flex-col border-brand-primary/20 bg-brand-primary/5">
          <div className="p-6 border-b border-wfm-border/50">
            <h3 className="font-bold text-white flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-brand-primary" /> Adjustment Validation
            </h3>
          </div>
          
          <div className="p-6 flex-1 space-y-8">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Hard Constraints (Must Pass)</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center"><span className="text-slate-300">Skill Match</span> <Check className="w-5 h-5 text-success" /></li>
                <li className="flex justify-between items-center"><span className="text-slate-300">Skill Level</span> <Check className="w-5 h-5 text-success" /></li>
                <li className="flex justify-between items-center"><span className="text-slate-300">Availability Window</span> <Check className="w-5 h-5 text-success" /></li>
                <li className="flex justify-between items-center"><span className="text-slate-300">Leave Collision</span> <Check className="w-5 h-5 text-success" /></li>
                <li className="flex justify-between items-center"><span className="text-slate-300">Minimum Rest (11h)</span> <Check className="w-5 h-5 text-success" /></li>
                <li className="flex justify-between items-center"><span className="text-slate-300">Max Working Hours</span> <Check className="w-5 h-5 text-success" /></li>
              </ul>
            </div>

            <div className="pt-6 border-t border-wfm-border/50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Soft Impact Assessment</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between items-start">
                  <span className="text-slate-300">Preference Impact</span> 
                  {newShift !== 'Evening' ? (
                    <span className="flex items-center gap-2 text-warning font-medium"><ShieldAlert className="w-4 h-4" /> Changed from preferred shift</span>
                  ) : (
                    <span className="text-slate-500">No impact</span>
                  )}
                </li>
                <li className="flex justify-between items-start">
                  <span className="text-slate-300">Coverage Impact</span> 
                  <span className="text-success font-medium">+1 Morning</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="p-6 border-t border-wfm-border/50 bg-wfm-card">
            <button className="w-full btn-primary py-3 text-sm font-bold flex justify-center items-center gap-2">
              <Lock className="w-4 h-4" /> Confirm & Lock Adjustment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
