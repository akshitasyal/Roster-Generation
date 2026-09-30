import os

base_dir = "C:/Users/Akshat/Roster Generation/frontend/src"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
    print(f"Created {path}")

# --- GLOBAL CSS (Tailwind v4) ---
write_file(f"{base_dir}/app/globals.css", """
@import "tailwindcss";

@theme {
  --color-wfm-dark: #0a0a0f;
  --color-wfm-panel: #14151a;
  --color-wfm-card: #1c1d24;
  --color-wfm-border: #2a2b36;
  
  --color-brand-primary: #6366f1;
  --color-brand-secondary: #8b5cf6;
  --color-brand-accent: #06b6d4;
  
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;

  --font-sans: 'Inter', system-ui, sans-serif;
  
  --animate-fade-in: fadeIn 0.4s ease-out forwards;
  --animate-slide-up: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@layer base {
  :root {
    color-scheme: dark;
  }
  
  body {
    @apply bg-wfm-dark text-slate-200 antialiased font-sans selection:bg-brand-primary/30 selection:text-brand-primary;
    background-image: 
      radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
      radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%);
    background-attachment: fixed;
  }
}

@layer components {
  .glass-panel {
    @apply bg-wfm-panel/70 backdrop-blur-xl border border-wfm-border/50 shadow-2xl;
  }
  
  .glass-card {
    @apply bg-wfm-card/60 backdrop-blur-lg border border-wfm-border shadow-lg rounded-2xl hover:border-brand-primary/50 transition-colors duration-300;
  }
  
  .btn-primary {
    @apply relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium text-white rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none;
    background: linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary));
  }
  
  .btn-primary::before {
    content: '';
    @apply absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300;
  }
  
  .btn-primary:hover::before {
    @apply translate-y-0;
  }
  
  .btn-secondary {
    @apply inline-flex items-center justify-center px-6 py-2.5 font-medium text-slate-300 bg-wfm-card border border-wfm-border rounded-xl transition-all duration-300 hover:bg-wfm-border hover:text-white active:scale-[0.98];
  }
  
  .gradient-text {
    @apply text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent;
  }
}
""")

# --- ROOT LAYOUT ---
write_file(f"{base_dir}/app/layout.tsx", """
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { LayoutDashboard, CalendarDays, Users, LogOut, Sparkles } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "TechM WFM Platform",
  description: "Enterprise Workforce Management & Roster Optimization Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={${inter.variable} min-h-screen flex flex-col md:flex-row overflow-hidden}>
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 glass-panel flex-shrink-0 flex flex-col border-r border-wfm-border z-10 hidden md:flex h-screen">
          <div className="p-6 border-b border-wfm-border">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg group-hover:shadow-brand-primary/20 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight tracking-tight text-white">TechM</h1>
                <p className="text-xs text-brand-accent font-medium tracking-wider uppercase">WFM Engine</p>
              </div>
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
            <div>
              <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Workforce</p>
              <nav className="space-y-1">
                <SidebarLink href="/wfm/dashboard" icon={LayoutDashboard} label="WFM Dashboard" />
                <SidebarLink href="/wfm/planning" icon={CalendarDays} label="Planning & Demand" />
              </nav>
            </div>
            
            <div>
              <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Management</p>
              <nav className="space-y-1">
                <SidebarLink href="/tl/dashboard" icon={Users} label="Team Lead Portal" />
              </nav>
            </div>
            
            <div>
              <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Associate</p>
              <nav className="space-y-1">
                <SidebarLink href="/associate/dashboard" icon={LayoutDashboard} label="My Roster" />
              </nav>
            </div>
          </div>
          
          <div className="p-4 border-t border-wfm-border">
            <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors group">
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden glass-panel border-b border-wfm-border p-4 flex items-center justify-between z-20 sticky top-0">
           <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="font-bold text-white tracking-tight">TechM WFM</h1>
            </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 h-screen overflow-y-auto relative scroll-smooth p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

function SidebarLink({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-brand-primary/10 hover:shadow-[inset_4px_0_0_0_var(--color-brand-primary)] transition-all group">
      <Icon className="w-5 h-5 text-slate-400 group-hover:text-brand-primary transition-colors" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}
""")

write_file(f"{base_dir}/app/page.tsx", """
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
""")

print("Initial Global Design System and Root UI generated.")
