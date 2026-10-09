'use client';

import { useState } from 'react';
import { Bell, Calendar, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'roster',
      icon: Calendar,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      title: 'Roster Published: Next Week',
      description: 'Your roster for the week of Oct 13 - Oct 19 has been published. Please review your shifts.',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      type: 'leave',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      title: 'Leave Request Approved',
      description: 'Your casual leave request for Oct 15 - Oct 16 has been approved by your manager.',
      time: 'Yesterday',
      unread: true,
    },
    {
      id: 3,
      type: 'alert',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      title: 'Preference Window Closing Soon',
      description: 'You have 24 hours left to submit your shift and week-off preferences for the upcoming cycle.',
      time: '2 days ago',
      unread: false,
    },
    {
      id: 4,
      type: 'roster',
      icon: Calendar,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      title: 'Roster Updated',
      description: 'There has been a change to your shift on Oct 08. Your new timing is 11:00 AM - 08:00 PM.',
      time: 'Oct 2, 2025',
      unread: false,
    },
  ];

  const filtered = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return n.unread;
    return n.type === activeFilter;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-8 animate-fade-in text-slate-800 bg-[#f9fafb] min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">Stay updated with your roster, leave requests, and announcements.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          Mark All as Read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Filters */}
        <div className="flex items-center gap-6 px-6 border-b border-slate-100 overflow-x-auto">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`py-4 border-b-2 text-sm whitespace-nowrap transition-colors ${activeFilter === 'all' ? 'border-red-500 font-bold text-slate-900' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
          >
            All Notifications
          </button>
          <button 
            onClick={() => setActiveFilter('unread')}
            className={`py-4 border-b-2 text-sm whitespace-nowrap transition-colors ${activeFilter === 'unread' ? 'border-red-500 font-bold text-slate-900' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
          >
            Unread (2)
          </button>
          <button 
            onClick={() => setActiveFilter('roster')}
            className={`py-4 border-b-2 text-sm whitespace-nowrap transition-colors ${activeFilter === 'roster' ? 'border-red-500 font-bold text-slate-900' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
          >
            Roster Updates
          </button>
          <button 
            onClick={() => setActiveFilter('leave')}
            className={`py-4 border-b-2 text-sm whitespace-nowrap transition-colors ${activeFilter === 'leave' ? 'border-red-500 font-bold text-slate-900' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
          >
            Leaves
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {filtered.length > 0 ? (
            filtered.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-6 flex items-start gap-4 transition-colors hover:bg-slate-50/50 ${notification.unread ? 'bg-slate-50/30' : 'bg-white'}`}
              >
                <div className={`p-3 rounded-xl flex-shrink-0 ${notification.iconBg}`}>
                  <notification.icon className={`w-6 h-6 ${notification.iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className={`text-base font-bold ${notification.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                      <Clock className="w-3.5 h-3.5" />
                      {notification.time}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {notification.description}
                  </p>
                </div>
                {notification.unread && (
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                )}
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium text-slate-600">No notifications found.</p>
              <p className="text-sm mt-1">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
