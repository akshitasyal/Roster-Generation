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
