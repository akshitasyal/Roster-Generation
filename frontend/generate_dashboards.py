import os

base_dir = "C:/Users/Akshat/Roster Generation/frontend/src/app"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Created {path}")

# --- WFM Dashboard ---
write_file(f"{base_dir}/wfm/dashboard/page.tsx", """
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
      <div className={p-3 rounded-lg bg-/10 border border-/20}>
        <Icon className={w-6 h-6 text-} />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}
""")

# --- WFM Planning ---
write_file(f"{base_dir}/wfm/planning/page.tsx", """
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
""")

# --- TL Dashboard ---
write_file(f"{base_dir}/tl/dashboard/page.tsx", """
'use client';
import { Users, CheckCircle, XCircle } from 'lucide-react';

export default function TlDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Team Lead Portal</h1>
        <p className="text-slate-400">Review associate preference requests and team coverage.</p>
      </div>

      <div className="glass-card mt-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-wfm-border bg-wfm-panel/50 flex items-center gap-3">
          <Users className="w-5 h-5 text-brand-primary" />
          <h2 className="text-lg font-semibold text-white">Pending Preferences</h2>
        </div>
        <div className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-wfm-dark/50 text-slate-400">
              <tr>
                <th className="px-6 py-3 font-medium">Associate</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Dates</th>
                <th className="px-6 py-3 font-medium">Reason</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border text-slate-300">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">John Doe</td>
                <td className="px-6 py-4">Weekly Off Request</td>
                <td className="px-6 py-4">Oct 12 - Oct 13</td>
                <td className="px-6 py-4 text-slate-400">Family event</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors">
                    <XCircle className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
""")

# --- Associate Dashboard ---
write_file(f"{base_dir}/associate/dashboard/page.tsx", """
'use client';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function AssociateDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">My Roster</h1>
        <p className="text-slate-400">View your published schedule and submit preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        
        {/* Next Shift Card */}
        <div className="glass-card p-6 md:col-span-1 border-brand-primary/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-accent"></div>
          <p className="text-xs font-bold text-brand-accent uppercase tracking-wider mb-4">Upcoming Shift</p>
          <h2 className="text-3xl font-bold text-white mb-1">Today</h2>
          <p className="text-slate-400 mb-6">Oct 14, 2026</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-300">
              <Clock className="w-5 h-5 text-brand-primary" />
              <span className="font-medium">09:00 - 18:00</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="w-5 h-5 text-brand-primary" />
              <span className="font-medium">Project Alpha (Voice)</span>
            </div>
          </div>
        </div>
        
        {/* Weekly View Placeholder */}
        <div className="glass-card p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-white" />
              <h2 className="text-lg font-semibold text-white">This Week</h2>
            </div>
            <button className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors">Request Off</button>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className={p-3 rounded-xl border  text-center}>
                <p className="text-xs text-slate-500 mb-2">{day}</p>
                {i > 4 ? (
                  <p className="text-sm font-bold text-slate-600">OFF</p>
                ) : (
                  <p className={	ext-sm font-bold }>9-6</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
""")

print("Dashboards created.")
