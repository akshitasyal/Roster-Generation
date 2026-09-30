'use client';

import { useEffect, useState } from 'react';
import { Calendar, Search, Filter, Plus, ChevronRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function PlanningCyclesPage() {
  const [cycles, setCycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const data = await api.get('/planning-cycles');
        setCycles(data);
      } catch (err) {
        console.error('Failed to fetch planning cycles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCycles();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Planning Cycles</h1>
          <p className="text-slate-400">Manage all past, current, and future roster cycles across projects.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search cycles..." 
              className="bg-wfm-card border border-wfm-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
          <button className="btn-secondary p-2"><Filter className="w-5 h-5"/></button>
          <button className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
            <Plus className="w-4 h-4" /> New Cycle
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-wfm-border/50">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-wfm-panel/50 border-b border-wfm-border">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Cycle</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Project</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-center">Demand</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-center">Preferences</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-center">Roster</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-center">Approval</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-right">Workspace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">Loading planning cycles...</td>
                </tr>
              ) : cycles.map((cycle, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-brand-primary" />
                      <div>
                        <div className="font-bold text-slate-800 group-hover:text-brand-primary transition-colors">{cycle.name || `Cycle-${cycle.id}`}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{cycle.startDate} - {cycle.endDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-700">{cycle.project || 'Global'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      cycle.status === 'PUBLISHED' ? 'bg-success/10 text-success border-success/30' :
                      cycle.status === 'UNDER_REVIEW' || cycle.status === 'VALIDATED' ? 'bg-warning/10 text-warning border-warning/30' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {cycle.status || 'DRAFT'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <StatusBadge status={cycle.demandStatus || 'Pending'} />
                  </td>
                  <td className="p-4 text-center">
                    <StatusBadge status={cycle.preferenceStatus || 'Pending'} />
                  </td>
                  <td className="p-4 text-center">
                    <StatusBadge status={cycle.rosterStatus || 'Not Generated'} />
                  </td>
                  <td className="p-4 text-center text-sm text-slate-600">
                    {cycle.approvalStatus || 'N/A'}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/wfm/cycles/${cycle.id}`} className="inline-flex items-center justify-center p-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'Locked' || status === 'Complete' || status === 'Loaded' || status === 'Generated' || status === 'Published' || status === 'Ready') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
        <CheckCircle2 className="w-3.5 h-3.5" /> {status}
      </span>
    );
  }
  if (status === 'Pending' || status === 'Pending TL') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-warning">
        <Clock className="w-3.5 h-3.5" /> {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
      <AlertTriangle className="w-3.5 h-3.5" /> {status}
    </span>
  );
}
