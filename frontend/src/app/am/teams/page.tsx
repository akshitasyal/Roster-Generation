'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Users, Search, FolderTree } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AmTeamsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Organization Hierarchy</h1>
          <p className="text-slate-400">Drill down through your teams, leaders, and associates.</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Find associate or team..." 
            className="w-full bg-wfm-card border border-wfm-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="p-4 border-b border-wfm-border bg-wfm-card/50 flex items-center gap-3">
          <FolderTree className="w-5 h-5 text-brand-primary" />
          <h2 className="font-semibold text-white">Operations: Sunita Rao</h2>
        </div>
        
        <div className="p-2">
          {/* Mock hierarchy tree */}
          <HierarchyNode title="Team Alpha" subtitle="TL: Arun Kumar" count={12} isExpanded={true}>
            <div className="ml-6 pl-4 border-l border-wfm-border py-2 space-y-1">
              <EmployeeNode name="John Doe" id="EMP001" skill="Technical L2" />
              <EmployeeNode name="Jane Smith" id="EMP002" skill="Voice L1" />
              <EmployeeNode name="Michael Johnson" id="EMP003" skill="Technical L3" />
              <div className="text-xs text-brand-primary font-medium py-1 px-2 cursor-pointer hover:bg-brand-primary/10 w-fit rounded transition-colors">+ 9 more associates</div>
            </div>
          </HierarchyNode>

          <HierarchyNode title="Team Bravo" subtitle="TL: Suresh Patil" count={15} isExpanded={false} />
          <HierarchyNode title="Team Charlie" subtitle="TL: Neha Gupta" count={10} isExpanded={false} />
        </div>
      </div>
    </div>
  );
}

function HierarchyNode({ title, subtitle, count, isExpanded, children }: any) {
  const [open, setOpen] = useState(isExpanded);
  
  return (
    <div className="mb-1">
      <div 
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] cursor-pointer transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="p-1 rounded bg-wfm-dark border border-wfm-border group-hover:border-brand-primary/50 text-slate-400 group-hover:text-brand-primary transition-colors">
            {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          <Users className="w-5 h-5 text-slate-500" />
          <div>
            <span className="font-semibold text-white">{title}</span>
            <span className="ml-3 text-xs text-slate-400">{subtitle}</span>
          </div>
        </div>
        <div className="text-xs font-bold bg-wfm-dark border border-wfm-border px-2.5 py-1 rounded-full text-slate-300">
          {count} Members
        </div>
      </div>
      
      {open && children && (
        <div className="animate-slide-up">
          {children}
        </div>
      )}
    </div>
  );
}

function EmployeeNode({ name, id, skill }: any) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-wfm-panel transition-colors cursor-default group">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded bg-brand-primary/10 text-brand-primary flex items-center justify-center text-[10px] font-bold border border-brand-primary/20">
          {name.charAt(0)}
        </div>
        <span className="text-sm text-slate-200">{name}</span>
        <span className="text-xs text-slate-500">{id}</span>
      </div>
      <span className="text-xs text-slate-400 bg-wfm-dark px-2 py-0.5 rounded border border-wfm-border">{skill}</span>
    </div>
  );
}
