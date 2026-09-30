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
              <div key={day} className={`p-3 rounded-xl border ${i === 0 ? 'bg-brand-primary/10 border-brand-primary/30' : i > 4 ? 'bg-wfm-dark border-wfm-border/50 opacity-50' : 'bg-wfm-panel border-wfm-border'} text-center`}>
                <p className="text-xs text-slate-500 mb-2">{day}</p>
                {i > 4 ? (
                  <p className="text-sm font-bold text-slate-600">OFF</p>
                ) : (
                  <p className={`text-sm font-bold ${i === 0 ? 'text-brand-primary' : 'text-slate-300'}`}>9-6</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
