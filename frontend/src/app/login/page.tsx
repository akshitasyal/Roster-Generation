'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Wfm@12345'); // Default seed password
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-wfm-dark relative overflow-hidden">
      
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/10 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 px-4">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 animate-fade-in">
          <div className="text-3xl font-bold tracking-tight text-slate-800 leading-none">
            Tech
          </div>
          <div className="text-3xl font-bold tracking-tight text-brand-primary leading-none">
            Mahindra
          </div>
          <p className="text-slate-500 font-semibold tracking-widest uppercase text-xs mt-3">Workforce Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-2xl border border-wfm-border shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
          
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Sign in to your account</h2>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <p className="text-sm text-danger/90 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:bg-white transition-all"
                  placeholder="name@techm.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs text-brand-primary hover:text-brand-secondary transition-colors font-medium">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:bg-white transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white rounded-xl py-3 px-4 font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Continue to Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>
        
        {/* Helper text for demo */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p className="text-xs text-slate-500 font-medium">Test Accounts (Password: Wfm@12345):</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2 text-xs text-slate-600 font-semibold">
            <span className="bg-white px-3 py-1 rounded-full border border-slate-200">WFM: ankit.joshi@acme.wfm</span>
            <span className="bg-white px-3 py-1 rounded-full border border-slate-200">TL: arun.kumar@acme.wfm</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
