'use client';

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function MyRosterPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-8 animate-fade-in text-slate-800 bg-[#f9fafb] min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Roster</h1>
          <p className="text-slate-500 text-sm mt-1">View your assigned shifts, week-offs, and schedule for upcoming weeks.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm">
            <button className="p-2 hover:bg-slate-50 text-slate-500 transition-colors border-r border-slate-200">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 font-semibold text-sm text-slate-700">
              22 Sep 2025 - 28 Sep 2025
            </div>
            <button className="p-2 hover:bg-slate-50 text-slate-500 transition-colors border-l border-slate-200">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            Today
          </button>
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
            <CalendarIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <span className="text-3xl font-bold text-slate-900">5</span>
          <span className="text-sm font-semibold text-slate-700 mt-1">Working Days</span>
          <span className="text-xs text-slate-400 mt-0.5">This Week</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <span className="text-3xl font-bold text-slate-900">2</span>
          <span className="text-sm font-semibold text-slate-700 mt-1">Week Off Days</span>
          <span className="text-xs text-slate-400 mt-0.5">This Week</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <span className="text-3xl font-bold text-slate-900">0</span>
          <span className="text-sm font-semibold text-slate-700 mt-1">Night Shifts</span>
          <span className="text-xs text-slate-400 mt-0.5">This Week</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <span className="text-3xl font-bold text-slate-900">5</span>
          <span className="text-sm font-semibold text-slate-700 mt-1">Day Shifts</span>
          <span className="text-xs text-slate-400 mt-0.5">This Week</span>
        </div>
      </div>

      {/* Main View Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Tabs */}
        <div className="flex items-center gap-6 px-6 border-b border-slate-200">
          <button className="py-4 border-b-2 border-red-500 font-bold text-slate-900 text-sm">
            Weekly View
          </button>
          <button className="py-4 border-b-2 border-transparent font-medium text-slate-500 hover:text-slate-700 text-sm transition-colors">
            Monthly View
          </button>
          <button className="py-4 border-b-2 border-transparent font-medium text-slate-500 hover:text-slate-700 text-sm transition-colors">
            List View
          </button>
        </div>

        {/* Weekly Grid */}
        <div className="p-4 overflow-x-auto">
          <div className="min-w-[800px] grid grid-cols-7 gap-3">
            {[
              { day: 'Mon', date: '22 Sep', type: 'Day Shift', time: '10:00 AM - 07:00 PM', project: 'Project S1', location: 'Noida (Hybrid)', isOff: false },
              { day: 'Tue', date: '23 Sep', type: 'Day Shift', time: '10:00 AM - 07:00 PM', project: 'Project S1', location: 'Noida (Hybrid)', isOff: false },
              { day: 'Wed', date: '24 Sep', type: 'Day Shift', time: '10:00 AM - 07:00 PM', project: 'Project S1', location: 'Noida (Hybrid)', isOff: false },
              { day: 'Thu', date: '25 Sep', type: 'Week Off', sub: '(Day 1 of 2)', isOff: true },
              { day: 'Fri', date: '26 Sep', type: 'Week Off', sub: '(Day 2 of 2)', isOff: true },
              { day: 'Sat', date: '27 Sep', type: 'Day Shift', time: '10:00 AM - 07:00 PM', project: 'Project S1', location: 'Noida (Hybrid)', isOff: false },
              { day: 'Sun', date: '28 Sep', type: 'Day Shift', time: '10:00 AM - 07:00 PM', project: 'Project S1', location: 'Noida (Hybrid)', isOff: false },
            ].map((d, i) => (
              <div key={i} className="flex flex-col min-h-[160px]">
                <div className="text-center pb-3 border-b border-slate-100 mb-3">
                  <div className="font-bold text-slate-900 text-sm">{d.day}</div>
                  <div className="text-xs text-slate-500">{d.date}</div>
                </div>
                {d.isOff ? (
                  <div className="flex-1 bg-red-50/50 border border-red-100 rounded-lg p-3 flex flex-col items-center justify-center text-center">
                    <span className="font-bold text-red-500 text-sm">{d.type}</span>
                    <span className="text-xs text-red-500 mt-1">{d.sub}</span>
                    <span className="text-red-400 mt-2">-</span>
                  </div>
                ) : (
                  <div className="flex-1 bg-green-50/50 border border-green-100 rounded-lg p-3 flex flex-col text-center justify-center">
                    <span className="font-bold text-slate-800 text-sm">{d.type}</span>
                    <span className="text-xs text-slate-600 mt-2">{d.time}</span>
                    <span className="text-xs text-slate-600 mt-1">{d.project}</span>
                    <span className="text-xs text-slate-600 mt-1">{d.location}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Roster */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Upcoming Roster</h3>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View More
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="font-bold text-slate-800 py-3 px-5">Date</th>
                  <th className="font-bold text-slate-800 py-3 px-5">Day</th>
                  <th className="font-bold text-slate-800 py-3 px-5">Shift</th>
                  <th className="font-bold text-slate-800 py-3 px-5">Timing</th>
                  <th className="font-bold text-slate-800 py-3 px-5">Project</th>
                  <th className="font-bold text-slate-800 py-3 px-5">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { date: '29 Sep 2025', day: 'Mon', shift: 'Day Shift', time: '10:00 AM - 07:00 PM', isOff: false },
                  { date: '30 Sep 2025', day: 'Tue', shift: 'Day Shift', time: '10:00 AM - 07:00 PM', isOff: false },
                  { date: '01 Oct 2025', day: 'Wed', shift: 'Day Shift', time: '10:00 AM - 07:00 PM', isOff: false },
                  { date: '02 Oct 2025', day: 'Thu', shift: 'Week Off', time: '-', isOff: true },
                  { date: '03 Oct 2025', day: 'Fri', shift: 'Week Off', time: '-', isOff: true },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-5 text-slate-600">{r.date}</td>
                    <td className="py-3 px-5 text-slate-600">{r.day}</td>
                    <td className="py-3 px-5">
                      {r.isOff ? (
                        <span className="font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded">{r.shift}</span>
                      ) : (
                        <span className="font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">{r.shift}</span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-slate-600">{r.time}</td>
                    <td className="py-3 px-5 text-slate-600">{r.isOff ? '-' : 'S1'}</td>
                    <td className="py-3 px-5 text-slate-600">{r.isOff ? '-' : 'Noida (Hybrid)'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shift Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Shift Summary (This Month)</h3>
          </div>
          <div className="p-5">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="font-bold text-slate-800 pb-3">Shift Type</th>
                  <th className="font-bold text-slate-800 pb-3 text-center">Total Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr>
                  <td className="py-4 text-slate-600">Day Shifts</td>
                  <td className="py-4 font-bold text-slate-900 text-center">16</td>
                </tr>
                <tr>
                  <td className="py-4 text-slate-600">Night Shifts</td>
                  <td className="py-4 font-bold text-slate-900 text-center">2</td>
                </tr>
                <tr>
                  <td className="py-4 text-slate-600">Week Off</td>
                  <td className="py-4 font-bold text-slate-900 text-center">4</td>
                </tr>
                <tr>
                  <td className="py-4 text-slate-600">Other</td>
                  <td className="py-4 font-bold text-slate-900 text-center">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
