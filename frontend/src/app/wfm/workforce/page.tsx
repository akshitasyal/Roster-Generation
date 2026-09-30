'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function WfmWorkforcePage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await api.get('/employees');
        setEmployees(data);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workforce Directory</h1>
          <p className="text-slate-400">Master record of all personnel, skills, and mappings.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              className="w-full bg-wfm-card border border-wfm-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
          <button className="btn-secondary p-2"><Filter className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-wfm-border/50">
        <div className="p-4 border-b border-wfm-border bg-wfm-card/50 flex justify-between items-center">
          <h3 className="font-semibold text-white">All Employees (1,240)</h3>
          <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Bulk Reassign
          </button>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-wfm-panel/50 border-b border-wfm-border">
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Emp ID</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Name</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Role</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Skill/Profile</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Assigned Team</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-400 uppercase text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wfm-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">Loading workforce data...</td>
                </tr>
              ) : employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-sm font-mono text-slate-500">{emp.employeeCode}</td>
                  <td className="p-4 text-sm font-medium text-slate-800">{emp.firstName} {emp.lastName}</td>
                  <td className="p-4 text-sm text-brand-primary">{emp.role}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600">{emp.skillName || 'N/A'}</span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{emp.teamName || 'N/A'}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-slate-400 hover:text-brand-primary transition-colors p-1 rounded hover:bg-brand-primary/10">
                      Edit
                    </button>
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
