'use client';

import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export default function MyProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 animate-fade-in text-slate-800 bg-[#f9fafb] min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">View and manage your personal information, work details, and preferences.</p>
        </div>
        <button className="px-6 py-2.5 bg-[#e31837] text-white font-bold text-sm rounded-lg hover:bg-[#c91530] transition-colors shadow-sm whitespace-nowrap">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Summary Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-500 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              MS
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Maahi Sharma</h2>
              <div className="text-slate-600 text-sm space-y-1">
                <p>Employee ID: TM12345</p>
                <p>Software Engineer</p>
                <p>Project S1 | Noida (Hybrid)</p>
                <p>Team: Digital Solutions</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Tabs */}
            <div className="flex items-center gap-6 px-6 border-b border-slate-100 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('personal')}
                className={`py-4 border-b-2 text-sm whitespace-nowrap transition-colors ${activeTab === 'personal' ? 'border-red-500 font-bold text-slate-900' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
              >
                Personal Information
              </button>
              <button 
                onClick={() => setActiveTab('work')}
                className={`py-4 border-b-2 text-sm whitespace-nowrap transition-colors ${activeTab === 'work' ? 'border-red-500 font-bold text-slate-900' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
              >
                Work Information
              </button>
              <button 
                onClick={() => setActiveTab('preferences')}
                className={`py-4 border-b-2 text-sm whitespace-nowrap transition-colors ${activeTab === 'preferences' ? 'border-red-500 font-bold text-slate-900' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
              >
                Preferences
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`py-4 border-b-2 text-sm whitespace-nowrap transition-colors ${activeTab === 'security' ? 'border-red-500 font-bold text-slate-900' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
              >
                Security
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'personal' && (
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Maahi Sharma" 
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Employee ID</label>
                    <input 
                      type="text" 
                      defaultValue="TM12345" 
                      readOnly
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-600 shadow-sm focus:outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Birth</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        defaultValue="23 Jan 2004" 
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-slate-400"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                    <div className="relative">
                      <select className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 shadow-sm appearance-none focus:outline-none focus:border-slate-400">
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <input 
                      type="text" 
                      defaultValue="+91 98765 43210" 
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Alternate Email</label>
                    <input 
                      type="email" 
                      defaultValue="maahi.syal@gmail.com" 
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-slate-400"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Address</label>
                    <input 
                      type="text" 
                      defaultValue="Lucknow, Uttar Pradesh, India" 
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                    Cancel
                  </button>
                  <button className="px-6 py-2.5 bg-[#e31837] text-white font-bold text-sm rounded-lg hover:bg-[#c91530] transition-colors shadow-sm">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Contact Information</h3>
            </div>
            <div className="p-5">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 text-slate-500 font-medium w-[45%]">Work Email</td>
                    <td className="py-3 text-slate-900 font-medium">maahi.sharma@techmahindra.com</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-medium">Phone Number</td>
                    <td className="py-3 text-slate-900 font-medium">+91 98765 43210</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-medium">Alternate Email</td>
                    <td className="py-3 text-slate-900 font-medium">maahi.syal@gmail.com</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-medium">Location</td>
                    <td className="py-3 text-slate-900 font-medium">Noida (Hybrid)</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-medium">Reporting Manager</td>
                    <td className="py-3 text-slate-900 font-medium">Priya Verma</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-medium">Team Lead</td>
                    <td className="py-3 text-slate-900 font-medium">Rohit Singh</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Employment Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Employment Details</h3>
            </div>
            <div className="p-5">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 text-slate-500 font-medium w-[45%]">Designation</td>
                    <td className="py-3 text-slate-900 font-medium">Software Engineer</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-medium">Grade</td>
                    <td className="py-3 text-slate-900 font-medium">U1</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-medium">Business Unit</td>
                    <td className="py-3 text-slate-900 font-medium">Digital Solutions</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-medium">Project</td>
                    <td className="py-3 text-slate-900 font-medium">Project S1</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-medium">Work Location</td>
                    <td className="py-3 text-slate-900 font-medium">Noida (Hybrid)</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-medium">Date of Joining</td>
                    <td className="py-3 text-slate-900 font-medium">01 Aug 2024</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-medium">Employment Type</td>
                    <td className="py-3 text-slate-900 font-medium">Full Time</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-medium">Reporting Manager</td>
                    <td className="py-3 text-slate-900 font-medium">Priya Verma</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-medium">Team Lead</td>
                    <td className="py-3 text-slate-900 font-medium">Rohit Singh</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
