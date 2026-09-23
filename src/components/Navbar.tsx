import React from 'react';
import { 
  Shield, 
  Radar, 
  Terminal, 
  FileText, 
  AlertTriangle, 
  Presentation, 
  Cpu, 
  CheckCircle2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { SystemStatus } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  status: SystemStatus | null;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  status,
  onReset,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: Shield },
    { id: 'recon', label: 'Recon & Attack Surface', icon: Radar },
    { id: 'scanner', label: 'Scanner Hub', icon: Terminal },
    { 
      id: 'triage', 
      label: 'Findings & Validation', 
      icon: AlertTriangle,
      badge: status?.stats.unverified || 0
    },
    { id: 'poc', label: 'Safe PoC Lab', icon: Cpu },
    { id: 'report', label: 'NTRO Official Report', icon: FileText },
    { id: 'sih26163', label: 'Aegis UI (SIH26163)', icon: Sparkles, highlight: true },
    { id: 'pitch', label: 'Judge Pitch & Q&A', icon: Presentation },
  ];

  return (
    <header className="border-b border-cyber-700/60 bg-cyber-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner: Defense Classification & Context */}
      <div className="bg-cyber-900 border-b border-cyber-800/80 px-4 py-1.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-cyan-400 font-semibold tracking-wider">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>WATCHTOWER VAPT OS</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">SIH 2026 · Problem Statement 26163</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400 font-medium">NTRO (National Technical Research Organisation)</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target: 127.0.0.1 (Local Sinkhole · Safe Mode)</span>
          </div>
          <button
            onClick={onReset}
            title="Reset Findings to Benchmark Seed State"
            className="flex items-center space-x-1 text-slate-400 hover:text-cyan-400 transition text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-white flex items-center space-x-1.5 font-sans">
                <span>WATCHTOWER</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-700/50">v1.0</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono leading-none">
                "World Monitor watches the world. Watchtower watches World Monitor."
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyber-800 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
                      : tab.highlight
                      ? 'text-amber-300 bg-amber-950/40 border border-amber-600/30 hover:bg-amber-900/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-cyber-850'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : tab.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && tab.badge > 0 ? (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                      {tab.badge}
                    </span>
                  ) : null}
                  {tab.highlight && !isActive && (
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
