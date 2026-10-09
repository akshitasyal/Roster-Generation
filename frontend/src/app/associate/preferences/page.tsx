'use client';

import { useState } from 'react';
import { Calendar, Clock, Info, ChevronDown } from 'lucide-react';

export default function PreferencesPage() {
  const [activeTab, setActiveTab] = useState('shift');
  
  // Mock state for the radio buttons
  const [preferences, setPreferences] = useState<Record<string, string>>({
    'Mon': 'S1',
    'Tue': 'S1',
    'Wed': 'S2',
    'Thu': 'S2',
    'Fri': 'S1',
    'Sat': 'NotAvailable',
    'Sun': 'NotAvailable',
  });

  const [weekoffPrefs, setWeekoffPrefs] = useState<Record<string, string>>({
    'Mon': 'Available',
    'Tue': 'Available',
    'Wed': 'Available',
    'Thu': 'Available',
    'Fri': 'Available',
    'Sat': 'Primary',
    'Sun': 'Primary',
  });

  const handleSelect = (day: string, shift: string) => {
    setPreferences(prev => ({ ...prev, [day]: shift }));
  };

  const handleWeekoffSelect = (day: string, type: string) => {
    setWeekoffPrefs(prev => ({ ...prev, [day]: type }));
  };

  const days = [
    { name: 'Monday', short: 'Mon', date: '06 Oct' },
    { name: 'Tuesday', short: 'Tue', date: '07 Oct' },
    { name: 'Wednesday', short: 'Wed', date: '08 Oct' },
    { name: 'Thursday', short: 'Thu', date: '09 Oct' },
    { name: 'Friday', short: 'Fri', date: '10 Oct' },
    { name: 'Saturday', short: 'Sat', date: '11 Oct' },
    { name: 'Sunday', short: 'Sun', date: '12 Oct' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-8 animate-fade-in text-slate-800 bg-[#f9fafb] min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Submit Preferences</h1>
          <p className="text-slate-500 text-sm mt-1">Select your preferred shifts and week-off for the next planning period.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Preference Window Widget */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm w-full sm:w-auto">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <Calendar className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Preference Window</div>
              <div className="text-xs text-slate-500 mt-0.5">29 Sep 2025 - 05 Oct 2025</div>
            </div>
          </div>
          
          {/* Deadline Widget */}
          <div className="flex items-center gap-3 bg-white border border-red-200 rounded-xl px-4 py-3 shadow-sm w-full sm:w-auto">
            <div className="bg-red-50 p-2 rounded-lg border border-red-100">
              <Clock className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="text-xs font-bold text-red-500">Deadline</div>
              <div className="text-xs font-bold text-red-500 mt-0.5">Tue, 23 Sep 2025<br/>11:00 AM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selectors and Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Select Week</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-slate-300">
                <option>06 Oct 2025 - 12 Oct 2025</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">Select Project (Optional)</label>
            <div className="relative">
              <select className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-slate-300">
                <option>All Projects</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Your preferences will be considered while creating the roster. Final shifts are subject to business requirements.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Tabs */}
        <div className="flex items-center gap-6 px-6 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('shift')}
            className={`py-4 border-b-2 text-sm transition-colors ${activeTab === 'shift' ? 'border-red-500 font-bold text-slate-900' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
          >
            Shift Preferences
          </button>
          <button 
            onClick={() => setActiveTab('weekoff')}
            className={`py-4 border-b-2 text-sm transition-colors ${activeTab === 'weekoff' ? 'border-red-500 font-bold text-slate-900' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
          >
            Week-off Preferences
          </button>
        </div>

        {/* Tab Content: Shift Preferences */}
        {activeTab === 'shift' && (
          <div className="p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Select your preferred shift for each day</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="font-bold text-slate-800 py-3 px-2 w-[15%]">Day</th>
                    <th className="font-bold text-slate-800 py-3 px-2 w-[15%]">Date</th>
                    <th className="font-bold text-slate-800 py-3 px-2 w-[45%]">Shift Options (Select in order of preference)</th>
                    <th className="font-bold text-slate-800 py-3 px-2 w-[25%]">Remarks (Optional)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {days.map((day) => (
                    <tr key={day.short} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 px-2 font-medium text-slate-700">{day.name}</td>
                      <td className="py-4 px-2 text-slate-600">{day.date}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border-[5px] transition-colors ${preferences[day.short] === 'S1' ? 'border-blue-600 bg-white' : 'border-slate-300 bg-white group-hover:border-blue-300'}`}></div>
                            <input type="radio" name={`shift-${day.short}`} className="hidden" checked={preferences[day.short] === 'S1'} onChange={() => handleSelect(day.short, 'S1')} />
                            <span className="text-slate-600 text-sm whitespace-nowrap">S1 (10:00 - 19:00)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border-[5px] transition-colors ${preferences[day.short] === 'S2' ? 'border-blue-600 bg-white' : 'border-slate-300 bg-white group-hover:border-blue-300'}`}></div>
                            <input type="radio" name={`shift-${day.short}`} className="hidden" checked={preferences[day.short] === 'S2'} onChange={() => handleSelect(day.short, 'S2')} />
                            <span className="text-slate-600 text-sm whitespace-nowrap">S2 (11:00 - 20:00)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border-[5px] transition-colors ${preferences[day.short] === 'NotAvailable' ? 'border-blue-600 bg-white' : 'border-slate-300 bg-white group-hover:border-blue-300'}`}></div>
                            <input type="radio" name={`shift-${day.short}`} className="hidden" checked={preferences[day.short] === 'NotAvailable'} onChange={() => handleSelect(day.short, 'NotAvailable')} />
                            <span className="text-slate-600 text-sm whitespace-nowrap">Not Available</span>
                          </label>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <input 
                          type="text" 
                          placeholder="Add remarks..." 
                          className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-400 shadow-sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Week-off Preferences */}
        {activeTab === 'weekoff' && (
          <div className="p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Select your preferred week-off days</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="font-bold text-slate-800 py-3 px-2 w-[15%]">Day</th>
                    <th className="font-bold text-slate-800 py-3 px-2 w-[15%]">Date</th>
                    <th className="font-bold text-slate-800 py-3 px-2 w-[45%]">Week-off Options (Select primary & alternative)</th>
                    <th className="font-bold text-slate-800 py-3 px-2 w-[25%]">Remarks (Optional)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {days.map((day) => (
                    <tr key={day.short} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 px-2 font-medium text-slate-700">{day.name}</td>
                      <td className="py-4 px-2 text-slate-600">{day.date}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border-[5px] transition-colors ${weekoffPrefs[day.short] === 'Primary' ? 'border-blue-600 bg-white' : 'border-slate-300 bg-white group-hover:border-blue-300'}`}></div>
                            <input type="radio" name={`weekoff-${day.short}`} className="hidden" checked={weekoffPrefs[day.short] === 'Primary'} onChange={() => handleWeekoffSelect(day.short, 'Primary')} />
                            <span className="text-slate-600 text-sm whitespace-nowrap">Primary Off</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border-[5px] transition-colors ${weekoffPrefs[day.short] === 'Alternative' ? 'border-blue-600 bg-white' : 'border-slate-300 bg-white group-hover:border-blue-300'}`}></div>
                            <input type="radio" name={`weekoff-${day.short}`} className="hidden" checked={weekoffPrefs[day.short] === 'Alternative'} onChange={() => handleWeekoffSelect(day.short, 'Alternative')} />
                            <span className="text-slate-600 text-sm whitespace-nowrap">Alternative Off</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border-[5px] transition-colors ${weekoffPrefs[day.short] === 'Available' ? 'border-blue-600 bg-white' : 'border-slate-300 bg-white group-hover:border-blue-300'}`}></div>
                            <input type="radio" name={`weekoff-${day.short}`} className="hidden" checked={weekoffPrefs[day.short] === 'Available'} onChange={() => handleWeekoffSelect(day.short, 'Available')} />
                            <span className="text-slate-600 text-sm whitespace-nowrap">Available</span>
                          </label>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <input 
                          type="text" 
                          placeholder="Add remarks..." 
                          className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-400 shadow-sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end items-center gap-4">
          <button className="px-6 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            Reset
          </button>
          <button className="px-6 py-2 bg-[#e31837] text-white font-bold text-sm rounded-lg hover:bg-[#c91530] transition-colors shadow-sm">
            Submit Preferences
          </button>
        </div>
      </div>

    </div>
  );
}
