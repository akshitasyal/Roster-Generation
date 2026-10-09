'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, Filter, ShieldAlert, Users, Calendar } from 'lucide-react';
import { api } from '@/lib/api';

export default function WfmWorkforcePage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await api.get('/employees');
        setEmployees(Array.isArray(data) ? data : (data?.data || []));
      } catch (err) {
        console.error('Failed to fetch employees:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const name = (emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`).toLowerCase();
      const code = (emp.empId || emp.employeeCode || '').toLowerCase();
      const email = (emp.email || '').toLowerCase();
      const skill = (emp.skill || emp.skillName || '').toLowerCase();
      const designation = (emp.designation || emp.roleCode || '').toLowerCase();
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        name.includes(searchLower) || 
        code.includes(searchLower) || 
        email.includes(searchLower) || 
        skill.includes(searchLower) ||
        designation.includes(searchLower);

      // Role filter check against TechM Designation
      let matchesRole = true;
      if (roleFilter !== 'ALL') {
        const desig = (emp.designation || emp.roleCode || '').toLowerCase();
        if (roleFilter === 'ASSOCIATE') {
          matchesRole = desig === 'associate' || (desig.includes('associate') && !desig.includes('manager'));
        } else if (roleFilter === 'TL') {
          matchesRole = desig === 'team leader' || desig === 'tl' || desig.includes('lead');
        } else if (roleFilter === 'AM') {
          matchesRole = desig === 'associate manager' || desig === 'am';
        } else if (roleFilter === 'MANAGER') {
          matchesRole = desig === 'manager';
        } else if (roleFilter === 'SENIOR_MANAGER') {
          matchesRole = desig === 'senior manager';
        } else if (roleFilter === 'WFM') {
          matchesRole = desig.includes('workforce') || desig === 'wfm';
        }
      }

      // Status filter check
      const isEmpActive = emp.isActive !== false && (emp.status === 'Active' || emp.status === 'ACTIVE' || !emp.status);
      let matchesStatus = true;
      if (statusFilter === 'ACTIVE') {
        matchesStatus = isEmpActive;
      } else if (statusFilter === 'INACTIVE') {
        matchesStatus = !isEmpActive;
      }

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [employees, searchTerm, roleFilter, statusFilter]);

  return (
    <div className="space-y-6 animate-fade-in p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workforce Directory</h1>
          <p className="text-slate-500">Master record of all personnel, skills, and mappings.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ID, Name, Skill..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 shadow-sm transition-all"
            />
          </div>
          <select 
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:border-brand-primary"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="ASSOCIATE">Associate</option>
            <option value="TL">Team Leader</option>
            <option value="AM">Assoc. Manager</option>
            <option value="MANAGER">Manager</option>
            <option value="SENIOR_MANAGER">Sr. Manager</option>
            <option value="WFM">Workforce Manager</option>
          </select>
          <select 
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:border-brand-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-primary" />
            Showing {filteredEmployees.length} Personnel
          </h3>
          <div className="flex gap-2">
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              className="hidden" 
              id="excel-upload"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const response = await api.post('/employees/upload', formData);
                    alert(response.message || 'Successfully uploaded Excel sheet!');
                    // Refresh list
                    const data = await api.get('/employees');
                    setEmployees(Array.isArray(data) ? data : (data?.data || []));
                  } catch (err: any) {
                    alert('Failed to upload file: ' + (err.message || 'Unknown error'));
                  } finally {
                    e.target.value = '';
                  }
                }
              }}
            />
            <label 
              htmlFor="excel-upload"
              className="btn-primary text-xs px-3 py-1.5 flex items-center gap-2 cursor-pointer bg-brand-primary text-white rounded hover:bg-brand-primary/90 transition-colors"
            >
              Import Excel
            </label>
            <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 rounded">
              <ShieldAlert className="w-3.5 h-3.5" /> Bulk Reassign
            </button>
          </div>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Emp ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Designation</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Skill / Profile</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">LOB / Center</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading workforce data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                    No personnel found matching the filters.
                  </td>
                </tr>
              ) : filteredEmployees.map((emp) => (
                <tr key={emp.id || emp.empId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 text-sm font-mono font-semibold text-slate-600">{emp.empId || emp.employeeCode}</td>
                  <td className="p-4 text-sm font-semibold text-slate-900">{emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`}</td>
                  <td className="p-4 text-sm text-brand-primary font-semibold">{emp.designation || emp.roleCode}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-700">
                      {emp.skill || emp.skillName || 'Workforce Management'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-700 font-medium">
                    {emp.lob || 'Operations'}{' '}
                    <span className="text-slate-400 text-xs font-normal">
                      {emp.center ? `(${emp.center})` : (emp.location && !emp.location.includes('-') ? `(${emp.location})` : '')}
                    </span>
                  </td>
                  <td className="p-4">
                    {(emp.isActive !== false && (emp.status === 'Active' || emp.status === 'ACTIVE' || !emp.status)) ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                        Inactive
                      </span>
                    )}
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
