import React from 'react';
import { cn } from '@/lib/utils';

interface RosterGridProps {
  scope: 'SELF' | 'TEAM' | 'GLOBAL';
  readOnly?: boolean;
  allowAdjustment?: boolean;
  allowLock?: boolean;
}

export function RosterGrid({ scope }: RosterGridProps) {
  // Temporary mock data for Associate view
  const days = ['Mon 05', 'Tue 06', 'Wed 07', 'Thu 08', 'Fri 09', 'Sat 10', 'Sun 11'];
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-wfm-panel border-b border-wfm-border">
            {scope !== 'SELF' && <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Employee</th>}
            {days.map(day => (
              <th key={day} className="p-4 text-xs font-semibold text-slate-400 uppercase min-w-[120px] text-center">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-wfm-border">
          <tr className="hover:bg-white/[0.02] transition-colors">
            {scope !== 'SELF' && (
              <td className="p-4">
                <div className="font-medium text-white">EMP001</div>
                <div className="text-xs text-slate-500">John Doe</div>
              </td>
            )}
            <td className="p-4"><RosterCell shift="Morning" time="09:00 - 18:00" status="Scheduled" /></td>
            <td className="p-4"><RosterCell shift="Morning" time="09:00 - 18:00" status="Scheduled" /></td>
            <td className="p-4"><RosterCell shift="OFF" time="Weekly Off" status="Approved" isOff /></td>
            <td className="p-4"><RosterCell shift="Morning" time="09:00 - 18:00" status="Scheduled" /></td>
            <td className="p-4"><RosterCell shift="Morning" time="09:00 - 18:00" status="Scheduled" /></td>
            <td className="p-4"><RosterCell shift="OFF" time="Weekly Off" status="Approved" isOff /></td>
            <td className="p-4"><RosterCell shift="OFF" time="Weekly Off" status="Approved" isOff /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function RosterCell({ shift, time, status, isOff = false }: { shift: string; time: string; status: string; isOff?: boolean }) {
  return (
    <div className={cn(
      "p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.02]",
      isOff 
        ? "bg-wfm-dark/50 border-wfm-border/30 opacity-70" 
        : "bg-wfm-panel border-wfm-border hover:border-brand-primary/50"
    )}>
      <span className={cn("text-sm font-bold mb-1", isOff ? "text-slate-500" : "text-white")}>{shift}</span>
      <span className="text-[10px] text-slate-400 font-medium tracking-wider mb-2">{time}</span>
      <span className={cn(
        "text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full font-semibold",
        isOff ? "bg-white/5 text-slate-400" : "bg-success/10 text-success"
      )}>
        {status}
      </span>
    </div>
  );
}
