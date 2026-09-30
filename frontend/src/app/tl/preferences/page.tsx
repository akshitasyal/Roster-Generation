'use client';

import { Check, X, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function PreferencesReviewPage() {
  const [selectedDeclined, setSelectedDeclined] = useState<string | null>(null);

  const pendingPreferences = [
    { id: 'EMP001', name: 'John Doe', shift: 'Morning', weeklyOff: 'Sat + Sun', deadline: '48h left', status: 'Pending' },
    { id: 'EMP002', name: 'Jane Smith', shift: 'Evening', weeklyOff: 'Fri + Sat', deadline: '48h left', status: 'Pending' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Preferences Review</h1>
        <p className="text-slate-400">Review and decline associate preferences before the cycle deadline.</p>
      </div>

      <div className="p-4 rounded-xl bg-wfm-panel border border-wfm-border text-sm text-slate-300">
        <strong className="text-white">Note:</strong> If you do not explicitly decline a preference before the deadline, it will be <strong>Auto-Accepted</strong> by the optimization engine. You should only decline if there is a known conflict or issue.
      </div>

      <div className="space-y-4">
        {pendingPreferences.map((pref) => (
          <div key={pref.id} className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-white text-lg">{pref.name}</span>
                <span className="text-xs text-slate-500 bg-wfm-dark px-2 py-1 rounded-md">{pref.id}</span>
                <span className="text-xs font-semibold text-warning bg-warning/10 px-2 py-1 rounded-full">{pref.status}</span>
              </div>
              
              <div className="flex flex-wrap gap-x-8 gap-y-2 mt-4 text-sm">
                <div>
                  <span className="text-slate-500 block text-xs uppercase mb-1">Top Shift Choice</span>
                  <span className="font-medium text-slate-200">{pref.shift}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs uppercase mb-1">Weekly Off</span>
                  <span className="font-medium text-slate-200">{pref.weeklyOff}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs uppercase mb-1">Deadline</span>
                  <span className="font-medium text-brand-primary flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {pref.deadline}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setSelectedDeclined(pref.id)}
                className="btn-secondary px-4 text-danger hover:border-danger hover:bg-danger/10 hover:text-danger"
              >
                <X className="w-4 h-4 mr-2" /> Decline
              </button>
            </div>
          </div>
        ))}

        {pendingPreferences.length === 0 && (
          <div className="p-12 text-center border border-dashed border-wfm-border rounded-2xl bg-wfm-panel/30">
            <Check className="w-12 h-12 text-success mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-white">All Caught Up</h3>
            <p className="text-slate-400 mt-2">There are no pending preferences to review.</p>
          </div>
        )}
      </div>

      {/* Decline Modal Placeholder */}
      {selectedDeclined && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-wfm-card border border-wfm-border p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Decline Preference</h3>
            <p className="text-sm text-slate-400 mb-4">You must provide a reason for declining {selectedDeclined}'s preference.</p>
            
            <textarea 
              className="w-full h-32 bg-wfm-dark border border-wfm-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-danger transition-colors resize-none mb-6"
              placeholder="E.g., Business requirement requires evening shift..."
            ></textarea>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setSelectedDeclined(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => setSelectedDeclined(null)} className="btn-primary bg-gradient-to-r from-danger to-red-600 shadow-danger/20 hover:shadow-danger/40">
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
