'use client';

import { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

export default function PreferencesPage() {
  const [step, setStep] = useState(1);
  const deadlineDays = 2;
  
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Shift & Roster Preferences</h1>
        <p className="text-slate-400">Submit your preferences for the upcoming planning cycle (Oct 12 - Oct 18).</p>
      </div>
      
      {/* Deadline Notice */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-warning/10 border border-warning/20 text-warning">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-semibold text-sm">Submission Deadline Approaching</p>
          <p className="text-xs opacity-90 mt-0.5">You have {deadlineDays} days left to submit or modify your preferences for the next cycle.</p>
        </div>
      </div>
      
      <div className="glass-card p-0 overflow-hidden border-wfm-border/50">
        <div className="flex border-b border-wfm-border">
          <StepButton number={1} title="Preferred Shifts" active={step === 1} onClick={() => setStep(1)} />
          <StepButton number={2} title="Weekly Off" active={step === 2} onClick={() => setStep(2)} />
          <StepButton number={3} title="Availability" active={step === 3} onClick={() => setStep(3)} />
        </div>
        
        <div className="p-6 md:p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-white">Rank your preferred shifts</h2>
              <p className="text-sm text-slate-400">Drag and drop to reorder. WFM will attempt to honor your highest ranked shift.</p>
              
              <div className="space-y-3 mt-6">
                <RankRow rank={1} label="Morning (09:00 - 18:00)" />
                <RankRow rank={2} label="General (11:00 - 20:00)" />
                <RankRow rank={3} label="Evening (14:00 - 23:00)" />
                <RankRow rank={4} label="Night (21:00 - 06:00)" />
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-white">Select preferred weekly off combination</h2>
              <p className="text-sm text-slate-400">Select your primary and alternative weekly off preference.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl border-2 border-brand-primary bg-brand-primary/5 cursor-pointer">
                  <div className="text-xs font-bold text-brand-primary mb-2 uppercase tracking-wider">Primary Choice</div>
                  <div className="text-lg font-bold text-white mb-1">Saturday + Sunday</div>
                  <div className="text-xs text-slate-400">Standard weekend off</div>
                </div>
                <div className="p-4 rounded-xl border border-wfm-border hover:border-brand-primary/50 bg-wfm-panel cursor-pointer transition-colors">
                  <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Alternative Choice</div>
                  <div className="text-lg font-bold text-white mb-1">Friday + Saturday</div>
                  <div className="text-xs text-slate-400">Middle-eastern weekend off</div>
                </div>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-white">Review & Submit</h2>
              <p className="text-sm text-slate-400">By submitting, your TL will review your preferences. If no action is taken before the deadline, they will be auto-accepted.</p>
              
              <div className="bg-wfm-dark p-6 rounded-xl border border-wfm-border mt-6 space-y-4">
                <div className="flex justify-between border-b border-wfm-border pb-4">
                  <span className="text-slate-400 font-medium">Status</span>
                  <span className="px-3 py-1 bg-wfm-panel rounded-full text-xs font-bold text-slate-300">DRAFT</span>
                </div>
                <div className="flex justify-between border-b border-wfm-border pb-4">
                  <span className="text-slate-400 font-medium">Top Shift Preference</span>
                  <span className="text-white font-semibold">Morning</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-slate-400 font-medium">Primary Weekly Off</span>
                  <span className="text-white font-semibold">Saturday + Sunday</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-wfm-border bg-wfm-card flex justify-between items-center">
          <button 
            disabled={step === 1} 
            onClick={() => setStep(s => s - 1)}
            className="btn-secondary px-6"
          >
            Back
          </button>
          
          {step < 3 ? (
            <button 
              onClick={() => setStep(s => s + 1)}
              className="btn-primary px-8"
            >
              Continue
            </button>
          ) : (
            <button className="btn-primary px-8 gap-2">
              <Save className="w-4 h-4" /> Submit Preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepButton({ number, title, active, onClick }: { number: number; title: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 p-4 flex flex-col sm:flex-row items-center justify-center gap-3 transition-colors ${active ? 'bg-wfm-card border-b-2 border-brand-primary' : 'hover:bg-white/[0.02] border-b-2 border-transparent opacity-60'}`}
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${active ? 'bg-brand-primary text-white' : 'bg-wfm-border text-slate-400'}`}>
        {number}
      </div>
      <span className={`font-semibold hidden sm:block ${active ? 'text-brand-primary' : 'text-slate-400'}`}>{title}</span>
    </button>
  );
}

function RankRow({ rank, label }: { rank: number; label: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-wfm-panel border border-wfm-border cursor-grab active:cursor-grabbing hover:border-brand-primary/50 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-wfm-dark flex items-center justify-center font-bold text-slate-400 border border-wfm-border">
        {rank}
      </div>
      <span className="font-medium text-white">{label}</span>
    </div>
  );
}
