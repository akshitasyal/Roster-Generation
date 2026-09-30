'use client';
import { CalendarDays, Save, Plus } from 'lucide-react';

export default function PlanningDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Cycle Planning</h1>
          <p className="text-slate-400">Configure new planning cycles and input interval demand.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Cycle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Cycle Config */}
        <div className="glass-card p-6 lg:col-span-1 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <CalendarDays className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg font-semibold text-white">New Cycle Properties</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Cycle Name</label>
            <input type="text" className="w-full bg-wfm-dark border border-wfm-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand-primary transition-colors" defaultValue="October Wk1" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Start Date</label>
              <input type="date" className="w-full bg-wfm-dark border border-wfm-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">End Date</label>
              <input type="date" className="w-full bg-wfm-dark border border-wfm-border rounded-xl px-4 py-2 text-white focus:outline-none focus:border-brand-primary transition-colors" />
            </div>
          </div>
          
          <button className="w-full btn-secondary mt-4 flex justify-center items-center gap-2">
            <Save className="w-4 h-4" /> Save Cycle
          </button>
        </div>
        
        {/* Demand Input */}
        <div className="glass-card lg:col-span-2 overflow-hidden flex flex-col">
           <div className="px-6 py-4 border-b border-wfm-border bg-wfm-panel/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Demand Entry (Headcount)</h2>
            <select className="bg-wfm-dark border border-wfm-border rounded-lg px-3 py-1 text-sm text-slate-300 outline-none">
              <option>Project Alpha</option>
              <option>Project Beta</option>
            </select>
          </div>
          <div className="p-6 flex-1 flex items-center justify-center text-slate-500 text-sm">
             Select a cycle and project to enter interval-level demand.
          </div>
        </div>
      </div>
    </div>
  );
}
