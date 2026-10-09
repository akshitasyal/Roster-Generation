'use client';

import { Search, MessageCircle, FileText, PhoneCall, HelpCircle, ChevronRight } from 'lucide-react';

export default function SupportPage() {
  const faqs = [
    {
      question: "How do I request a change to my published roster?",
      answer: "Once a roster is published, you must speak with your Team Leader or Reporting Manager. They can initiate a shift swap or adjustment if business requirements permit."
    },
    {
      question: "When is the deadline to submit preferences?",
      answer: "Preference windows typically close every Tuesday at 11:00 AM for the following week's roster. Check the 'Submit Preferences' page for the exact countdown."
    },
    {
      question: "What happens if I don't submit my preferences?",
      answer: "If no preferences are submitted, the WFM solver will assign your shifts based on business demand and default compliance rules. You will not have priority for your preferred shifts or week-offs."
    },
    {
      question: "How is compensatory off (CO) calculated?",
      answer: "Compensatory off is granted when you work on a designated public holiday or your scheduled week-off, subject to prior approval from your manager."
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-8 animate-fade-in text-slate-800 bg-[#f9fafb] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Help & Support</h1>
          <p className="text-slate-500 text-sm mt-1">Find answers to your questions or reach out for assistance.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for help..." 
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-red-200 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1.5">Leave Policy</h3>
          <p className="text-sm text-slate-500">Read the updated guidelines on SL, CL, and EL encashment.</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1.5">Roster FAQs</h3>
          <p className="text-sm text-slate-500">Common questions about shift allocation and algorithms.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-green-200 hover:shadow-md transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1.5">IT Helpdesk</h3>
          <p className="text-sm text-slate-500">Having trouble accessing the portal? Raise an IT ticket.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FAQs Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 hover:bg-slate-50 transition-colors cursor-pointer group flex gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm mb-2">{faq.question}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-red-500 mt-0.5 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Need more help?</h2>
          <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-6 text-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="font-bold text-lg mb-2">Raise a Ticket</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Can't find what you're looking for? Our WFM support team usually responds within 24 hours.
            </p>
            
            <button className="w-full py-3 bg-[#e31837] text-white font-bold text-sm rounded-lg hover:bg-[#c91530] transition-colors shadow-sm">
              Create New Ticket
            </button>
            
            <button className="w-full py-3 mt-3 bg-white/10 text-white font-bold text-sm rounded-lg hover:bg-white/20 transition-colors">
              View Past Tickets
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
