'use client';

import { FileCheck2, AlertTriangle, MessageSquare, Check, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function ManagerRosterReviewPage() {
  const [status, setStatus] = useState('UNDER REVIEW');

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Roster Review</h1>
        <p className="text-slate-400">Review and approve generated rosters for your organization.</p>
      </div>

      <div className="glass-card p-6 border-brand-primary/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
            status === 'UNDER REVIEW' ? 'bg-warning/10 text-warning border-warning/30' : 'bg-success/10 text-success border-success/30'
          }`}>
            {status}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg">
            <FileCheck2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Banking Support (Draft)</h2>
            <div className="flex gap-4 text-sm text-slate-400 mt-1">
              <span>Version: RV-2026-101</span>
              <span>•</span>
              <span>Cycle: 05 Oct - 11 Oct</span>
              <span>•</span>
              <span>Generated: Today, 14:32</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard label="Coverage" value="96.4%" color="text-warning" />
          <MetricCard label="Staffing Gap" value="-7" color="text-danger" />
          <MetricCard label="Exceptions" value="12" color="text-danger" />
          <MetricCard label="WFM Status" value="Pending" color="text-slate-300" />
        </div>

        <div className="p-4 rounded-xl bg-wfm-dark border border-wfm-border mb-8">
          <h3 className="font-semibold text-white mb-3">Validation Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="flex justify-between border-b border-wfm-border/50 py-1">
              <span className="text-slate-400">Hard Constraints</span>
              <span className="text-success font-medium flex items-center gap-1"><Check className="w-3.5 h-3.5"/> Passed</span>
            </div>
            <div className="flex justify-between border-b border-wfm-border/50 py-1">
              <span className="text-slate-400">Shift Preferences</span>
              <span className="text-white font-medium">91% Honored</span>
            </div>
            <div className="flex justify-between border-b border-wfm-border/50 py-1">
              <span className="text-slate-400">Weekly Off Preferences</span>
              <span className="text-white font-medium">86% Honored</span>
            </div>
            <div className="flex justify-between border-b border-wfm-border/50 py-1">
              <span className="text-slate-400">Fairness Metric</span>
              <span className="text-white font-medium">94%</span>
            </div>
          </div>
        </div>

        {status === 'UNDER REVIEW' && (
          <div className="flex flex-col sm:flex-row gap-3 border-t border-wfm-border pt-6">
            <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Request WFM Adjustment
            </button>
            <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" /> Add Comment
            </button>
            <button 
              onClick={() => setStatus('APPROVED')}
              className="flex-1 btn-primary bg-gradient-to-r from-success to-emerald-600 flex items-center justify-center gap-2 shadow-success/20 hover:shadow-success/40"
            >
              <Check className="w-4 h-4" /> Approve Roster
            </button>
          </div>
        )}
        
        {status === 'APPROVED' && (
          <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-success flex items-center justify-center gap-2 font-medium">
            <Check className="w-5 h-5" /> You have approved this roster. Awaiting WFM final publish.
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }: any) {
  return (
    <div className="p-4 rounded-xl bg-wfm-panel border border-wfm-border flex flex-col items-center justify-center text-center">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</span>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
  );
}
