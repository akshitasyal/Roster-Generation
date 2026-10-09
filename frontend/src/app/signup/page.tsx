'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, UserCheck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [empId, setEmpId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await signup(empId.trim().toUpperCase(), email.trim(), password);
      setSuccessMsg('Account created successfully! Redirecting...');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.data?.message || 'Signup failed. Please verify your Employee ID and TechM Email.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-wfm-dark relative overflow-hidden py-10">
      
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/10 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 px-4">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6 animate-fade-in">
          <div className="text-3xl font-bold tracking-tight text-slate-800 leading-none">
            Tech
          </div>
          <div className="text-3xl font-bold tracking-tight text-brand-primary leading-none">
            Mahindra
          </div>
          <p className="text-slate-500 font-semibold tracking-widest uppercase text-xs mt-3">Employee Portal Registration</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white p-8 rounded-2xl border border-wfm-border shadow-lg animate-fade-in">
          
          <h2 className="text-xl font-bold text-slate-800 mb-2 text-center">Activate Employee Account</h2>
          <p className="text-xs text-slate-500 text-center mb-6">Enter your TechM Employee ID and registered official email to set up your password.</p>
          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
              <p className="text-sm text-danger/90 font-medium">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-800 font-medium">{successMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Employee ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserCheck className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:bg-white transition-all uppercase"
                  placeholder="e.g. TM10003"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">TechM Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:bg-white transition-all"
                  placeholder="firstname.lastname@techmahindra.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Create Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:bg-white transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary focus:bg-white transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !empId || !email || !password || !confirmPassword}
              className="w-full bg-brand-primary hover:bg-brand-secondary text-white rounded-xl py-3 px-4 font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group mt-4 text-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account & Login
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Already registered your account?{' '}
              <Link href="/login" className="text-brand-primary hover:underline font-semibold">
                Sign In Here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
