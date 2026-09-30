'use client';

import { Settings, Save, SlidersHorizontal, Scale, ShieldAlert } from 'lucide-react';

export default function WfmSettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Optimization Settings</h1>
          <p className="text-slate-400">Configure global constraint weights and engine parameters.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 px-6">
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full text-left p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/30 text-brand-primary font-semibold flex items-center gap-3 transition-colors">
            <SlidersHorizontal className="w-5 h-5" /> Constraint Weights
          </button>
          <button className="w-full text-left p-4 rounded-xl hover:bg-white/[0.02] border border-transparent text-slate-400 font-medium flex items-center gap-3 transition-colors">
            <Scale className="w-5 h-5" /> Fairness Metrics
          </button>
          <button className="w-full text-left p-4 rounded-xl hover:bg-white/[0.02] border border-transparent text-slate-400 font-medium flex items-center gap-3 transition-colors">
            <ShieldAlert className="w-5 h-5" /> Hard Constraints
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6 border-wfm-border">
            <h2 className="text-lg font-semibold text-white mb-6">Constraint Weights</h2>
            
            <div className="space-y-6">
              <WeightSlider 
                label="Preference Fulfillment" 
                description="Weight given to honoring associate shift preferences." 
                value={80} 
              />
              <WeightSlider 
                label="Weekly Off Continuity" 
                description="Penalty for splitting weekly off days (e.g. Sat & Mon instead of Sat/Sun)." 
                value={95} 
              />
              <WeightSlider 
                label="Skill Matching" 
                description="Strictness of mapping L1/L2/L3 associates to exactly required demand blocks." 
                value={100} 
              />
              <WeightSlider 
                label="Overtime Cost Penalty" 
                description="Resistance to scheduling overtime to fill staffing gaps." 
                value={60} 
              />
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 text-warning text-sm flex gap-3">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold">Engine Restart Required</p>
              <p className="opacity-90 mt-1">Changes to constraint weights will only take effect on the next roster generation cycle.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WeightSlider({ label, description, value }: { label: string; description: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <label className="font-semibold text-white block">{label}</label>
          <span className="text-xs text-slate-400">{description}</span>
        </div>
        <span className="px-2 py-1 bg-wfm-dark border border-wfm-border rounded text-brand-primary font-bold text-xs">{value} / 100</span>
      </div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        defaultValue={value} 
        className="w-full h-2 bg-wfm-dark rounded-lg appearance-none cursor-pointer accent-brand-primary"
      />
    </div>
  );
}
