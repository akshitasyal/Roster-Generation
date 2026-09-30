'use client';

import { BarChart3, LineChart, Activity, Download } from 'lucide-react';

export default function SeniorManagerAnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Portfolio Analytics</h1>
          <p className="text-slate-400">Deep dive into SLA compliance, staffing trends, and operational costs.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="btn-secondary text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 h-80 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">SLA Compliance vs Staffing Level</h3>
            <LineChart className="w-5 h-5 text-brand-primary" />
          </div>
          
          <div className="flex-1 border border-dashed border-wfm-border/50 rounded-lg flex items-center justify-center bg-wfm-dark/30">
            <div className="text-center">
              <Activity className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-slate-400">Chart Visualization Area</p>
              <p className="text-xs text-slate-500 mt-1">Displays correlation between headcount and SLA hits.</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 h-80 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-white">Overtime Cost Trends</h3>
            <BarChart3 className="w-5 h-5 text-danger" />
          </div>
          
          <div className="flex-1 border border-dashed border-wfm-border/50 rounded-lg flex items-center justify-center bg-wfm-dark/30">
            <div className="text-center">
              <Activity className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-slate-400">Chart Visualization Area</p>
              <p className="text-xs text-slate-500 mt-1">Tracks weekly OT hours and associated costs.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6">
        <h3 className="font-semibold text-white mb-6">Historical Coverage Variance</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-32 text-sm text-slate-300 font-medium">Banking & Finance</div>
            <div className="flex-1 h-3 bg-wfm-dark rounded-full overflow-hidden flex">
              <div className="h-full bg-success" style={{ width: '92%' }}></div>
              <div className="h-full bg-warning" style={{ width: '6%' }}></div>
              <div className="h-full bg-danger" style={{ width: '2%' }}></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 text-sm text-slate-300 font-medium">Telecom Ops</div>
            <div className="flex-1 h-3 bg-wfm-dark rounded-full overflow-hidden flex">
              <div className="h-full bg-success" style={{ width: '85%' }}></div>
              <div className="h-full bg-warning" style={{ width: '10%' }}></div>
              <div className="h-full bg-danger" style={{ width: '5%' }}></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 text-sm text-slate-300 font-medium">Healthcare IT</div>
            <div className="flex-1 h-3 bg-wfm-dark rounded-full overflow-hidden flex">
              <div className="h-full bg-success" style={{ width: '70%' }}></div>
              <div className="h-full bg-warning" style={{ width: '20%' }}></div>
              <div className="h-full bg-danger" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-6 mt-6 pt-6 border-t border-wfm-border justify-center text-xs">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-success rounded-sm"></div> Optimal</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-warning rounded-sm"></div> Minor Variance</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-danger rounded-sm"></div> Critical Gap</div>
        </div>
      </div>
    </div>
  );
}
