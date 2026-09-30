'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Building2, Search, Network } from 'lucide-react';

export default function ManagerOrgPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Organization Hierarchy</h1>
          <p className="text-slate-400">View structure across AMs and their respective teams.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search organization..." 
            className="w-full bg-wfm-card border border-wfm-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden border-brand-primary/20">
        <div className="p-4 border-b border-wfm-border bg-wfm-card/50 flex items-center gap-3">
          <Network className="w-5 h-5 text-brand-primary" />
          <h2 className="font-semibold text-white">Manager: Priya Nair</h2>
        </div>
        
        <div className="p-4 space-y-4">
          <AmNode name="Sunita Rao" role="Associate Manager" project="Banking Support" count="3 Teams">
            <TeamNode name="Team Alpha" tl="Arun Kumar" count="12 Associates" />
            <TeamNode name="Team Bravo" tl="Suresh Patil" count="15 Associates" />
            <TeamNode name="Team Charlie" tl="Neha Gupta" count="10 Associates" />
          </AmNode>

          <AmNode name="Deepak Verma" role="Associate Manager" project="Telecom L1" count="4 Teams">
            <TeamNode name="Team Delta" tl="Rohit Singh" count="14 Associates" />
            <div className="ml-8 text-xs font-medium text-slate-500 py-2">... 3 more teams</div>
          </AmNode>
        </div>
      </div>
    </div>
  );
}

function AmNode({ name, role, project, count, children }: any) {
  const [open, setOpen] = useState(true);
  
  return (
    <div className="rounded-xl border border-wfm-border bg-wfm-dark overflow-hidden">
      <div 
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-4 bg-wfm-panel cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="p-1.5 rounded-lg bg-wfm-dark border border-wfm-border text-brand-primary">
            {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-lg">{name}</span>
              <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded border border-brand-primary/20">{role}</span>
            </div>
            <div className="text-sm text-slate-400 mt-0.5">Project: {project}</div>
          </div>
        </div>
        <div className="text-sm font-semibold text-slate-300 bg-wfm-dark px-3 py-1.5 rounded-lg border border-wfm-border">
          {count}
        </div>
      </div>
      
      {open && (
        <div className="p-4 bg-wfm-dark border-t border-wfm-border space-y-2 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

function TeamNode({ name, tl, count }: any) {
  return (
    <div className="flex items-center justify-between p-3 ml-4 rounded-lg hover:bg-wfm-panel transition-colors border border-transparent hover:border-wfm-border cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-brand-secondary"></div>
        <span className="font-medium text-slate-200">{name}</span>
        <span className="text-sm text-slate-500">TL: {tl}</span>
      </div>
      <span className="text-xs font-medium text-slate-400">{count}</span>
    </div>
  );
}
