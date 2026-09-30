'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Calendar, ChevronRight } from 'lucide-react';

export function CycleWorkspaceHeader({ cycleId }: { cycleId: string }) {
  const pathname = usePathname();

  const tabs = [
    { label: 'Overview', href: `/wfm/cycles/${cycleId}` },
    { label: 'Demand', href: `/wfm/cycles/${cycleId}/demand` },
    { label: 'Workforce', href: `/wfm/cycles/${cycleId}/workforce` },
    { label: 'Preferences', href: `/wfm/cycles/${cycleId}/preferences` },
    { label: 'Rules', href: `/wfm/cycles/${cycleId}/rules` },
    { label: 'Roster', href: `/wfm/cycles/${cycleId}/roster` },
    { label: 'Coverage', href: `/wfm/cycles/${cycleId}/coverage` },
    { label: 'Validation', href: `/wfm/cycles/${cycleId}/validation` },
    { label: 'Exceptions', href: `/wfm/cycles/${cycleId}/exceptions` },
    { label: 'Reviews', href: `/wfm/cycles/${cycleId}/reviews` },
    { label: 'Adjustments', href: `/wfm/cycles/${cycleId}/adjustments` },
    { label: 'Audit', href: `/wfm/cycles/${cycleId}/audit` },
  ];

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center text-sm text-slate-400 mb-4">
        <Link href="/wfm/cycles" className="hover:text-brand-primary transition-colors">Planning Cycles</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-slate-200 font-medium">{cycleId}</span>
      </div>

      <div className="glass-card p-6 border-brand-primary/20 bg-gradient-to-r from-wfm-card to-wfm-dark">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                Planning Cycle {cycleId}
                <span className="px-2.5 py-1 rounded-full bg-warning/10 text-warning font-bold uppercase text-[10px] tracking-wider border border-warning/30">
                  Under Review
                </span>
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                <span className="font-medium text-slate-300">05 Oct - 11 Oct 2026</span>
                <span className="text-slate-600">|</span>
                <span>Project: <strong className="text-slate-200">Banking Support</strong></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-b border-wfm-border flex gap-6 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <Link 
              key={tab.href}
              href={tab.href}
              className={cn(
                "pb-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                pathname === tab.href 
                  ? "text-brand-primary border-brand-primary" 
                  : "text-slate-400 border-transparent hover:text-white hover:border-slate-700"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
