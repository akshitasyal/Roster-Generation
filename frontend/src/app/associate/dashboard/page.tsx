'use client';

import { useAuth } from '@/context/AuthContext';
import { Calendar, User, MapPin, ChevronRight, Clock, Home } from 'lucide-react';
import Link from 'next/link';

export default function AssociateDashboard() {
  const { user } = useAuth();
  const userName = user?.fullName?.split(' ')[0] || 'Maahi';

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-8 animate-fade-in text-slate-800">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-slate-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Good Morning, {userName}!</h1>
            <p className="text-slate-500 text-sm mt-1">Here's your roster and upcoming activities.</p>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Calendar className="w-4 h-4 text-slate-500" /> Mon, 22 Sep 2025
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <MapPin className="w-4 h-4" /> Noida (Hybrid)
          </div>
        </div>
      </div>

      {/* Current Week Roster */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <Calendar className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Current Week Roster</h2>
              <p className="text-sm text-slate-500">22 Sep 2025 - 28 Sep 2025</p>
            </div>
          </div>
          <Link href="/associate/roster" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
            View Full Roster <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* Mon */}
          <div className="flex flex-col items-center p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-300 transition-all shadow-sm">
            <span className="text-sm font-bold text-slate-900">Mon</span>
            <span className="text-xs text-slate-500 mb-3">22 Sep</span>
            <span className="text-sm font-semibold text-slate-700">10:00 - 19:00</span>
            <span className="mt-2 px-6 py-1 bg-green-100 text-green-700 font-bold text-sm rounded-md w-full text-center">S1</span>
          </div>
          {/* Tue */}
          <div className="flex flex-col items-center p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-300 transition-all shadow-sm">
            <span className="text-sm font-bold text-slate-900">Tue</span>
            <span className="text-xs text-slate-500 mb-3">23 Sep</span>
            <span className="text-sm font-semibold text-slate-700">10:00 - 19:00</span>
            <span className="mt-2 px-6 py-1 bg-green-100 text-green-700 font-bold text-sm rounded-md w-full text-center">S1</span>
          </div>
          {/* Wed */}
          <div className="flex flex-col items-center p-4 rounded-xl border border-red-50 bg-red-50/30 hover:border-red-200 transition-all shadow-sm">
            <span className="text-sm font-bold text-slate-900">Wed</span>
            <span className="text-xs text-slate-500 mb-3">24 Sep</span>
            <span className="text-sm font-bold text-red-500 mt-1">Week Off</span>
            <div className="mt-2 h-[28px] flex items-center justify-center">
              <Home className="w-5 h-5 text-red-500" fill="currentColor" />
            </div>
          </div>
          {/* Thu */}
          <div className="flex flex-col items-center p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-300 transition-all shadow-sm">
            <span className="text-sm font-bold text-slate-900">Thu</span>
            <span className="text-xs text-slate-500 mb-3">25 Sep</span>
            <span className="text-sm font-semibold text-slate-700">11:00 - 20:00</span>
            <span className="mt-2 px-6 py-1 bg-blue-50 text-blue-600 font-bold text-sm rounded-md w-full text-center">S2</span>
          </div>
          {/* Fri */}
          <div className="flex flex-col items-center p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-300 transition-all shadow-sm">
            <span className="text-sm font-bold text-slate-900">Fri</span>
            <span className="text-xs text-slate-500 mb-3">26 Sep</span>
            <span className="text-sm font-semibold text-slate-700">11:00 - 20:00</span>
            <span className="mt-2 px-6 py-1 bg-blue-50 text-blue-600 font-bold text-sm rounded-md w-full text-center">S2</span>
          </div>
          {/* Sat */}
          <div className="flex flex-col items-center p-4 rounded-xl border border-red-50 bg-red-50/30 hover:border-red-200 transition-all shadow-sm">
            <span className="text-sm font-bold text-slate-900">Sat</span>
            <span className="text-xs text-slate-500 mb-3">27 Sep</span>
            <span className="text-sm font-bold text-red-500 mt-1">Week Off</span>
            <div className="mt-2 h-[28px] flex items-center justify-center">
              <Home className="w-5 h-5 text-red-500" fill="currentColor" />
            </div>
          </div>
          {/* Sun */}
          <div className="flex flex-col items-center p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-300 transition-all shadow-sm">
            <span className="text-sm font-bold text-slate-900">Sun</span>
            <span className="text-xs text-slate-500 mb-3">28 Sep</span>
            <span className="text-sm font-semibold text-slate-700">10:00 - 19:00</span>
            <span className="mt-2 px-6 py-1 bg-green-100 text-green-700 font-bold text-sm rounded-md w-full text-center">S1</span>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Preference Window */}
        <div className="lg:col-span-2 bg-amber-50/30 rounded-2xl p-6 border border-amber-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  Preference Window <span className="font-normal text-slate-500">(Next Week)</span>
                </h2>
                <p className="text-sm text-slate-500 mt-1">29 Sep 2025 - 05 Oct 2025</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-md text-xs font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" /> OPEN
            </span>
          </div>
          
          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-slate-700 mb-3">Submit your shift and week-off preferences.</p>
              <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                <Clock className="w-4 h-4" /> Deadline: Tue, 23 Sep 2025, 11:00 AM
              </div>
            </div>
            <Link 
              href="/associate/preferences" 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm text-center"
            >
              Submit Preferences
            </Link>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <Calendar className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Leave Balance</h2>
          </div>
          
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Casual Leave (CL)</span>
              <span className="font-bold text-slate-900">8 days</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Sick Leave (SL)</span>
              <span className="font-bold text-slate-900">5 days</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 font-medium">Earned Leave (EL)</span>
              <span className="font-bold text-slate-900">12 days</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
