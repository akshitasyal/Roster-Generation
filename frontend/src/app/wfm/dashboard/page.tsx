'use client';
import { useState } from 'react';
import { AlertCircle, Calendar, CheckCircle2, Play, Users, FileWarning } from 'lucide-react';

export default function WfmDashboard() {
  const [isGenerating, setIsGenerating] = useState(false);

  const triggerOptimization = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">WFM Dashboard</h1>
          <p className="text-slate-400">Manage cycle optimization, review coverage gaps, and handle exceptions.</p>
        </div>
        <button 
          onClick={triggerOptimization}
          disabled={isGenerating}
          className="btn-primary flex items-center gap-2"
        >
          {isGenerating ? (
            <><span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span> Optimizing...</>
          ) : (
            <><Play className="w-4 h-4 fill-current" /> Run CP-SAT Optimizer</>
          )}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Active Cycle" value="Wk42 (Oct)" icon={Calendar} color="brand-accent" />
        <KpiCard title="Generated Drafts" value="3" icon={CheckCircle2} color="success" />
        <KpiCard title="Coverage Gaps" value="12" icon={Users} color="warning" />
        <KpiCard title="Critical Exceptions" value="2" icon={AlertCircle} color="danger" />
      </div>

      {/* Exception Review Panel */}
      <div className="glass-card overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-wfm-border bg-wfm-panel/50 flex items-center gap-3">
          <FileWarning className="w-5 h-5 text-warning" />
          <h2 className="text-lg font-semibold text-white">Validation Exceptions</h2>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-wfm-dark/50 text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Severity</th>
                <th className="px-6 py-3 font-medium">Target</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border text-slate-300">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4"><span className="px-2 py-1 bg-danger/20 text-danger rounded-md text-xs font-semibold">MANUAL_OVERRIDE</span></td>
                <td className="px-6 py-4">CRITICAL</td>
                <td className="px-6 py-4">EMP-1042</td>
                <td className="px-6 py-4">Shift assigned during approved leave.</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-brand-primary hover:text-brand-secondary font-medium transition-colors">Resolve</button>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4"><span className="px-2 py-1 bg-warning/20 text-warning rounded-md text-xs font-semibold">STAFFING_SHORTAGE</span></td>
                <td className="px-6 py-4">ERROR</td>
                <td className="px-6 py-4">Shift 2 (Night)</td>
                <td className="px-6 py-4">Gap: 3 Associates required.</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-brand-primary hover:text-brand-secondary font-medium transition-colors">Adjust</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
  return (
    <div className="glass-card p-5 flex items-start gap-4">
      <div className={`p-3 rounded-lg bg-${color}/10 border border-${color}/20`}>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}
