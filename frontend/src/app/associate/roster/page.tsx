'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { RosterGrid } from '@/components/roster/RosterGrid';

export default function MyRosterPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Roster</h1>
          <p className="text-slate-400">View your personal schedule and assignments.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-wfm-card border border-wfm-border rounded-xl p-1">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-wfm-panel rounded-lg transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <div className="px-4 font-medium text-sm text-white">05 Oct - 11 Oct 2026</div>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-wfm-panel rounded-lg transition-colors"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-wfm-border/50">
        <div className="p-4 border-b border-wfm-border flex justify-between items-center bg-wfm-card/50">
          <h3 className="font-semibold text-white">Current Week</h3>
          <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-2"><Filter className="w-3.5 h-3.5"/> Filter</button>
        </div>
        <div className="p-0">
          <RosterGrid scope="SELF" readOnly />
        </div>
      </div>
    </div>
  );
}
