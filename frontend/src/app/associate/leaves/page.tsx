'use client';

import { Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function LeavesPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Leaves</h1>
          <p className="text-slate-400">Manage your leave balances and requests.</p>
        </div>
        <button className="btn-primary text-sm px-6">Apply Leave</button>
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BalanceCard title="Casual Leave (CL)" balance={5} total={12} color="brand-primary" />
        <BalanceCard title="Sick Leave (SL)" balance={3} total={10} color="brand-secondary" />
        <BalanceCard title="Earned Leave (EL)" balance={8} total={15} color="success" />
      </div>

      {/* Leave History */}
      <div className="glass-card overflow-hidden border-wfm-border/50">
        <div className="p-5 border-b border-wfm-border bg-wfm-card/50">
          <h3 className="font-semibold text-white">Leave History</h3>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-wfm-panel/50 border-b border-wfm-border">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Date Range</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Type</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Duration</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Reason</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Reviewer</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border">
              <LeaveRow 
                dates="12 Oct - 13 Oct 2026" 
                type="Casual Leave" 
                duration="2 Days" 
                reason="Personal work" 
                reviewer="Arun Kumar" 
                status="Pending" 
              />
              <LeaveRow 
                dates="25 Sep 2026" 
                type="Sick Leave" 
                duration="1 Day" 
                reason="Fever" 
                reviewer="Arun Kumar" 
                status="Approved" 
              />
              <LeaveRow 
                dates="10 Aug - 14 Aug 2026" 
                type="Earned Leave" 
                duration="5 Days" 
                reason="Family Trip" 
                reviewer="Priya Nair" 
                status="Approved" 
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function BalanceCard({ title, balance, total, color }: { title: string; balance: number; total: number; color: string }) {
  return (
    <div className="glass-card p-5 relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-1 h-full bg-${color}`}></div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-slate-300">{title}</h3>
        <Calendar className="w-5 h-5 text-slate-500" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{balance}</span>
        <span className="text-sm text-slate-500">/ {total} days</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-wfm-dark rounded-full mt-4 overflow-hidden">
        <div 
          className={`h-full bg-${color} rounded-full transition-all duration-1000`} 
          style={{ width: `${(balance/total)*100}%` }}
        ></div>
      </div>
    </div>
  );
}

function LeaveRow({ dates, type, duration, reason, reviewer, status }: { dates: string; type: string; duration: string; reason: string; reviewer: string; status: string }) {
  const isApproved = status === 'Approved';
  const isPending = status === 'Pending';
  const isRejected = status === 'Rejected';
  
  return (
    <tr className="hover:bg-white/[0.02] transition-colors">
      <td className="p-4 font-medium text-white text-sm">{dates}</td>
      <td className="p-4 text-sm text-slate-300">{type}</td>
      <td className="p-4 text-sm text-slate-400">{duration}</td>
      <td className="p-4 text-sm text-slate-400 truncate max-w-[200px]">{reason}</td>
      <td className="p-4 text-sm text-slate-400">{reviewer}</td>
      <td className="p-4 text-right">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
          isApproved ? 'bg-success/10 text-success border-success/20' : 
          isPending ? 'bg-warning/10 text-warning border-warning/20' : 
          'bg-danger/10 text-danger border-danger/20'
        }`}>
          {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
          {isPending && <Clock className="w-3.5 h-3.5" />}
          {isRejected && <XCircle className="w-3.5 h-3.5" />}
          {status}
        </span>
      </td>
    </tr>
  );
}
