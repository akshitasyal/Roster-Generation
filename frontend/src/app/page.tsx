import Link from "next/link";
import { ArrowRight, Cpu, Layers, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="h-full flex flex-col justify-center animate-fade-in relative z-10">
      
      {/* Hero Section */}
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-medium mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
          </span>
          Engine v2.0 Active
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Next-Gen <br />
          <span className="gradient-text">Workforce Optimization</span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s' }}>
          Powered by Google OR-Tools CP-SAT. Generating 100% compliant, mathematically proven optimal rosters in milliseconds.
        </p>
        
        <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Link href="/wfm/dashboard" className="btn-primary group">
            <span>Enter WFM Console</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/associate/dashboard" className="btn-secondary">
            View My Schedule
          </Link>
        </div>
      </div>
      
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <FeatureCard 
          icon={Cpu} 
          title="CP-SAT Solver" 
          desc="Mathematical constraint programming engine handling millions of shift permutations instantly."
        />
        <FeatureCard 
          icon={ShieldCheck} 
          title="100% Compliant" 
          desc="Strictly enforces 11-hour rest gaps, consecutive day limits, and approved leave lockouts."
        />
        <FeatureCard 
          icon={Layers} 
          title="Dynamic Scaling" 
          desc="Automatically provisions Team Leads and Managers based on interval associate demand ratios."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="glass-card p-6 group">
      <div className="w-12 h-12 rounded-xl bg-wfm-dark border border-wfm-border flex items-center justify-center mb-4 group-hover:border-brand-primary/50 group-hover:bg-brand-primary/10 transition-colors">
        <Icon className="w-6 h-6 text-brand-accent group-hover:text-brand-primary transition-colors" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
