import React from 'react';
import { cn } from '@/lib/utils';

export function CoverageChart({ scope = 'TEAM' }: { scope?: 'TEAM' | 'GLOBAL' }) {
  // Mock data for the coverage chart
  const data = [
    { hour: '09:00', required: 12, assigned: 12, gap: 0 },
    { hour: '10:00', required: 12, assigned: 12, gap: 0 },
    { hour: '11:00', required: 12, assigned: 10, gap: -2 },
    { hour: '12:00', required: 12, assigned: 12, gap: 0 },
    { hour: '13:00', required: 12, assigned: 12, gap: 0 },
    { hour: '14:00', required: 15, assigned: 15, gap: 0 },
    { hour: '15:00', required: 15, assigned: 12, gap: -3 },
    { hour: '16:00', required: 15, assigned: 15, gap: 0 },
  ];

  const maxDemand = Math.max(...data.map(d => Math.max(d.required, d.assigned)));

  return (
    <div className="w-full h-64 flex items-end gap-2 px-2 pt-8 relative">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end items-center group relative h-full">
          {/* Tooltip */}
          <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-wfm-panel border border-wfm-border rounded-lg p-2 text-xs z-10 whitespace-nowrap shadow-xl transition-opacity pointer-events-none">
            <div className="font-bold text-white mb-1">{d.hour}</div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-400">Req: {d.required}</span>
              <span className={d.gap < 0 ? "text-danger" : "text-success"}>Assigned: {d.assigned}</span>
            </div>
          </div>
          
          <div className="w-full relative h-full flex items-end justify-center px-1">
            {/* Required Bar (Background outline) */}
            <div 
              className="absolute w-full border-2 border-slate-700 rounded-t-sm"
              style={{ height: `${(d.required / maxDemand) * 100}%` }}
            ></div>
            
            {/* Assigned Bar (Solid fill) */}
            <div 
              className={cn(
                "w-full rounded-t-sm transition-all duration-500",
                d.gap < 0 ? "bg-danger" : "bg-brand-primary"
              )}
              style={{ height: `${(d.assigned / maxDemand) * 100}%` }}
            ></div>
          </div>
          
          <div className="mt-2 text-[10px] text-slate-500 font-medium tracking-wider">{d.hour.split(':')[0]}</div>
        </div>
      ))}
    </div>
  );
}
