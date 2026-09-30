'use client';

import { Check, ShieldAlert, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

export default function WfmPublishedPage() {
  const [selectedReplacement, setSelectedReplacement] = useState<string | null>(null);

  const candidates = [
    { id: 'EMP-031', name: 'Ravi Kumar', passed: true, issues: [] },
    { id: 'EMP-044', name: 'Sara Khan', passed: false, issues: ['Weekly-off impact (Soft conflict)'] },
    { id: 'EMP-052', name: 'Amit Singh', passed: false, issues: ['Skill Mismatch (L1 instead of L2)'] },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Post-Publish Adjustments</h1>
          <p className="text-slate-400">Handle emergency unavailability and replace associates in published rosters.</p>
        </div>
      </div>

      <div className="glass-card border-danger/30 p-0 overflow-hidden">
        <div className="bg-danger/10 border-b border-danger/30 p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-danger" />
          <h2 className="text-lg font-bold text-white">UNAVAILABILITY ALERT</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold mb-1">Target Employee</div>
              <div className="flex items-center gap-3 bg-wfm-dark border border-wfm-border p-3 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-wfm-panel flex items-center justify-center font-bold text-slate-400">JD</div>
                <div>
                  <div className="font-bold text-white">John Doe <span className="text-xs text-slate-500 font-mono">EMP-024</span></div>
                  <div className="text-sm text-slate-400">Banking Support • Team Alpha</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-wfm-dark border border-wfm-border p-3 rounded-xl">
                <span className="text-slate-500 block mb-1">Date</span>
                <span className="font-bold text-white">14 Oct (Monday)</span>
              </div>
              <div className="bg-wfm-dark border border-wfm-border p-3 rounded-xl">
                <span className="text-slate-500 block mb-1">Shift</span>
                <span className="font-bold text-brand-primary">Morning</span>
              </div>
              <div className="bg-wfm-dark border border-wfm-border p-3 rounded-xl col-span-2">
                <span className="text-slate-500 block mb-1">Reason for Unavailability</span>
                <span className="font-bold text-warning">Emergency Leave Reported</span>
              </div>
            </div>

            <div className="bg-wfm-dark border border-wfm-border p-4 rounded-xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Coverage Impact</h3>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300">Required: 10</span>
                <span className="text-slate-300">Available: 9</span>
                <span className="font-bold text-danger">Gap: -1</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-4">Replacement Candidates</h3>
            
            {candidates.map(candidate => (
              <div 
                key={candidate.id}
                onClick={() => setSelectedReplacement(candidate.id)}
                className={`p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedReplacement === candidate.id 
                    ? 'border-brand-primary bg-brand-primary/10 shadow-[0_0_10px_rgba(var(--color-brand-primary),0.2)]' 
                    : 'border-wfm-border bg-wfm-dark hover:border-slate-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-white">{candidate.name} <span className="text-xs text-slate-500 font-mono ml-1">{candidate.id}</span></div>
                  {candidate.passed ? (
                    <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold uppercase">Optimal Fit</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-warning/10 text-warning text-[10px] font-bold uppercase">Conflict</span>
                  )}
                </div>
                
                <ul className="text-xs space-y-1">
                  {candidate.passed ? (
                    <>
                      <li className="flex items-center gap-1 text-slate-400"><Check className="w-3 h-3 text-success" /> Skill Match & Level</li>
                      <li className="flex items-center gap-1 text-slate-400"><Check className="w-3 h-3 text-success" /> Available & No Leave</li>
                      <li className="flex items-center gap-1 text-slate-400"><Check className="w-3 h-3 text-success" /> Rest & Hours Compliant</li>
                    </>
                  ) : (
                    candidate.issues.map((issue, idx) => (
                      <li key={idx} className="flex items-center gap-1 text-warning"><AlertTriangle className="w-3 h-3" /> {issue}</li>
                    ))
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {selectedReplacement && (
          <div className="p-6 bg-wfm-panel border-t border-wfm-border animate-slide-up">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">Confirm Replacement Assignment</h3>
            <div className="flex items-center gap-4 bg-wfm-dark border border-wfm-border p-4 rounded-xl mb-6">
              <div className="flex-1 text-center">
                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Original</div>
                <div className="font-bold text-white">EMP-024</div>
                <div className="text-xs text-danger">Off (Leave)</div>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-500" />
              <div className="flex-1 text-center">
                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Replacement</div>
                <div className="font-bold text-white">{selectedReplacement}</div>
                <div className="text-xs text-brand-primary">Morning Shift</div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 btn-secondary text-slate-300" onClick={() => setSelectedReplacement(null)}>Cancel</button>
              <button className="flex-1 btn-primary bg-brand-primary hover:bg-brand-secondary justify-center text-white">Publish Adjustment</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
