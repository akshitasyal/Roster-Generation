'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, ChevronDown, CheckCircle, Calendar, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function TopHeader() {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <header className="h-16 bg-white border-b border-wfm-border px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-6 flex-1">
        <button className="text-slate-500 hover:text-slate-800 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="hidden md:flex relative max-w-lg w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for employees, projects, teams..." 
            className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-brand-primary w-full transition-colors focus:bg-white"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        
        {/* Notifications Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e31837] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">3</span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in origin-top-right">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                <span className="text-xs font-semibold text-[#e31837] cursor-pointer hover:underline">Mark all as read</span>
              </div>
              <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100">
                
                <div className="p-4 flex gap-3 hover:bg-slate-50 cursor-pointer transition-colors bg-slate-50/50">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-0.5">Roster Published: Next Week</p>
                    <p className="text-xs text-slate-500 line-clamp-2">Your roster for Oct 13 - Oct 19 has been published.</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="p-4 flex gap-3 hover:bg-slate-50 cursor-pointer transition-colors bg-slate-50/50">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-0.5">Leave Request Approved</p>
                    <p className="text-xs text-slate-500 line-clamp-2">Your casual leave request for Oct 15 has been approved.</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1">Yesterday</p>
                  </div>
                </div>

                <div className="p-4 flex gap-3 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-0.5">Preference Window Closing Soon</p>
                    <p className="text-xs text-slate-500 line-clamp-2">You have 24 hours left to submit your preferences.</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1">2 days ago</p>
                  </div>
                </div>

              </div>
              <div className="p-3 border-t border-slate-100 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <span className="text-xs font-bold text-slate-600">View all notifications</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-slate-600 text-white flex items-center justify-center font-bold text-sm">
            {(user?.name || user?.fullName || 'User').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
          </div>
          <div className="hidden md:block text-sm">
            <div className="font-bold text-slate-800">{user?.name || user?.fullName || 'User'}</div>
            <div className="text-slate-500 text-xs">{user?.designation || (user?.isWfm ? 'Workforce Manager' : 'Employee')}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 hidden md:block ml-1" />
        </div>
      </div>
    </header>
  );
}
