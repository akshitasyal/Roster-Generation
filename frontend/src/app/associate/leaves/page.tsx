'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function MyLeavesPage() {
  const [activeTab, setActiveTab] = useState('history');

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-8 animate-fade-in text-slate-800 bg-[#f9fafb] min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Leaves</h1>
          <p className="text-slate-500 text-sm mt-1">View your leave balance, apply for leave, and track your leave history.</p>
        </div>
        <button className="px-6 py-2.5 bg-[#e31837] text-white font-bold text-sm rounded-lg hover:bg-[#c91530] transition-colors shadow-sm whitespace-nowrap">
          Apply Leave
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-sm font-semibold text-slate-600">Casual Leave (CL)</span>
          <span className="text-3xl font-bold text-slate-900 mt-3">8</span>
          <span className="text-xs font-medium text-slate-500 mt-1">days available</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-sm font-semibold text-slate-600">Sick Leave (SL)</span>
          <span className="text-3xl font-bold text-slate-900 mt-3">5</span>
          <span className="text-xs font-medium text-slate-500 mt-1">days available</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-sm font-semibold text-slate-600">Earned Leave (EL)</span>
          <span className="text-3xl font-bold text-slate-900 mt-3">12</span>
          <span className="text-xs font-medium text-slate-500 mt-1">days available</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <span className="text-sm font-semibold text-slate-600">Compensatory Off (CO)</span>
          <span className="text-3xl font-bold text-slate-900 mt-3">2</span>
          <span className="text-xs font-medium text-slate-500 mt-1">days available</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Side: Tabs and Table */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full">
          
          {/* Tabs */}
          <div className="flex items-center gap-6 px-6 border-b border-slate-100 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('history')}
              className={`py-4 border-b-2 text-sm whitespace-nowrap transition-colors ${activeTab === 'history' ? 'border-red-500 font-bold text-slate-900' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
            >
              Leave History
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`py-4 border-b-2 text-sm whitespace-nowrap transition-colors ${activeTab === 'pending' ? 'border-red-500 font-bold text-slate-900' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
            >
              Pending Requests
            </button>
            <button 
              onClick={() => setActiveTab('approved')}
              className={`py-4 border-b-2 text-sm whitespace-nowrap transition-colors ${activeTab === 'approved' ? 'border-red-500 font-bold text-slate-900' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
            >
              Approved
            </button>
            <button 
              onClick={() => setActiveTab('rejected')}
              className={`py-4 border-b-2 text-sm whitespace-nowrap transition-colors ${activeTab === 'rejected' ? 'border-red-500 font-bold text-slate-900' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
            >
              Rejected
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="font-bold text-slate-800 py-4 px-5">From Date</th>
                  <th className="font-bold text-slate-800 py-4 px-5">To Date</th>
                  <th className="font-bold text-slate-800 py-4 px-5">Leave Type</th>
                  <th className="font-bold text-slate-800 py-4 px-5">No. of Days</th>
                  <th className="font-bold text-slate-800 py-4 px-5">Status</th>
                  <th className="font-bold text-slate-800 py-4 px-5">Applied On</th>
                  <th className="font-bold text-slate-800 py-4 px-5">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { from: '05 Oct 2025', to: '06 Oct 2025', type: 'Sick Leave', days: '2', status: 'Pending', applied: '01 Oct 2025', remarks: 'Medical appointment' },
                  { from: '15 Sep 2025', to: '16 Sep 2025', type: 'Casual Leave', days: '2', status: 'Approved', applied: '10 Sep 2025', remarks: 'Personal work' },
                  { from: '01 Aug 2025', to: '01 Aug 2025', type: 'Sick Leave', days: '1', status: 'Approved', applied: '30 Jul 2025', remarks: 'Fever' },
                  { from: '12 Jul 2025', to: '14 Jul 2025', type: 'Earned Leave', days: '3', status: 'Approved', applied: '05 Jul 2025', remarks: 'Family function' },
                  { from: '20 Jun 2025', to: '20 Jun 2025', type: 'Casual Leave', days: '1', status: 'Rejected', applied: '18 Jun 2025', remarks: '-' },
                  { from: '10 May 2025', to: '12 May 2025', type: 'Earned Leave', days: '3', status: 'Approved', applied: '02 May 2025', remarks: 'Travel' },
                  { from: '25 Mar 2025', to: '25 Mar 2025', type: 'Sick Leave', days: '1', status: 'Approved', applied: '24 Mar 2025', remarks: 'Health issue' },
                ].filter(row => activeTab === 'history' || row.status.toLowerCase() === activeTab).map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 text-slate-600 whitespace-nowrap">{row.from}</td>
                    <td className="py-4 px-5 text-slate-600 whitespace-nowrap">{row.to}</td>
                    <td className="py-4 px-5 text-slate-600">{row.type}</td>
                    <td className="py-4 px-5 text-slate-600">{row.days}</td>
                    <td className="py-4 px-5">
                      {row.status === 'Approved' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-700">
                          Approved
                        </span>
                      ) : row.status === 'Pending' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-700">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-600">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-slate-600 whitespace-nowrap">{row.applied}</td>
                    <td className="py-4 px-5 text-slate-600 truncate max-w-[150px]">{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Calendar Component */}
        <div className="w-full lg:w-[350px] bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-shrink-0">
          <h3 className="font-bold text-slate-900 mb-6 text-lg">Leave Calendar</h3>
          
          <div className="flex items-center justify-between mb-6">
            <button className="p-1 hover:bg-slate-100 rounded text-slate-500 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-slate-900">Sep 2025</span>
            <button className="p-1 hover:bg-slate-100 rounded text-slate-500 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="font-bold text-slate-800 py-2">{day}</div>
            ))}
            
            {/* Calendar Grid (Hardcoded for Sep 2025 layout as per mockup) */}
            {[
              { day: '1',  type: '' }, { day: '2',  type: '' }, { day: '3',  type: '' }, { day: '4',  type: '' }, { day: '5',  type: '' }, { day: '6',  type: '' }, { day: '7',  type: '' },
              { day: '8',  type: '' }, { day: '9',  type: '' }, { day: '10', type: '' }, { day: '11', type: '' }, { day: '12', type: '' }, { day: '13', type: '' }, { day: '14', type: '' },
              { day: '15', type: 'approved' }, { day: '16', type: 'approved' }, { day: '17', type: '' }, { day: '18', type: '' }, { day: '19', type: '' }, { day: '20', type: '' }, { day: '21', type: '' },
              { day: '22', type: '' }, { day: '23', type: '' }, { day: '24', type: '' }, { day: '25', type: '' }, { day: '26', type: '' }, { day: '27', type: '' }, { day: '28', type: '' },
              { day: '29', type: '' }, { day: '30', type: '' }, { day: '',   type: '' }, { day: '',   type: '' }, { day: '',   type: '' }, { day: '',   type: '' }, { day: '',   type: '' }
            ].map((d, i) => (
              <div 
                key={i} 
                className={`
                  h-10 flex items-center justify-center rounded-lg text-slate-700
                  ${d.day ? 'hover:bg-slate-50 cursor-pointer transition-colors' : ''}
                  ${d.type === 'approved' ? 'bg-green-100 text-green-800 font-bold' : ''}
                `}
              >
                {d.day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-300 border border-green-400"></div>
              <span className="text-xs text-slate-600">Approved Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-yellow-200 border border-yellow-300"></div>
              <span className="text-xs text-slate-600">Pending Request</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-red-300 border border-red-400"></div>
              <span className="text-xs text-slate-600">Rejected Leave</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-blue-300 border border-blue-400"></div>
              <span className="text-xs text-slate-600">Today</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
