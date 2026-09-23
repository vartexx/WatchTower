import React, { useState, useEffect } from 'react';
import { SystemStatus } from '../types';
import { RotateCcw, ShieldCheck, Terminal, AlertCircle } from 'lucide-react';

interface AegisShellProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  status: SystemStatus | null;
  findingsCount: number;
  onReset: () => void;
  onQuickScan: () => void;
  isScanning: boolean;
  children: React.ReactNode;
}

export const AegisShell: React.FC<AegisShellProps> = ({
  activeTab,
  setActiveTab,
  status,
  findingsCount,
  onReset,
  onQuickScan,
  isScanning,
  children,
}) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcTime(`${now.toISOString().slice(11, 19)} UTC`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'overview', symbol: '◈', label: 'Mission control', tag: '01' },
    { id: 'surface', symbol: '⌁', label: 'Attack surface', tag: status?.recon?.totalEndpoints ? `${status.recon.totalEndpoints}` : '164' },
    { id: 'scanner', symbol: '⚡', label: 'Scanner hub', tag: isScanning ? 'SCANNING' : 'RUN' },
    { id: 'findings', symbol: '△', label: 'Findings & triage', tag: findingsCount > 0 ? (findingsCount < 10 ? `0${findingsCount}` : `${findingsCount}`) : '00' },
    { id: 'poc', symbol: '◫', label: 'Safe PoC lab', tag: 'LAB' },
    { id: 'evidence', symbol: '▣', label: 'Evidence vault', tag: '18' },
    { id: 'report', symbol: '↗', label: 'NTRO readout', tag: 'PDF' },
    { id: 'pitch', symbol: '✦', label: 'Judge pitch & Q&A', tag: 'VAPT' },
  ];

  const getViewTitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Security assessment cockpit';
      case 'surface':
        return 'Attack surface inventory';
      case 'scanner':
        return 'Multi-engine scanner hub';
      case 'findings':
        return 'Validated findings & triage';
      case 'poc':
        return 'Safe Proof-of-Concept testing';
      case 'evidence':
        return 'Evidence chain of custody';
      case 'report':
        return 'Official NTRO assessment readout';
      case 'pitch':
        return 'SIH evaluator battlecards & defense';
      default:
        return 'Security assessment cockpit';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b161d] text-[#e6edf0] font-mono selection:bg-[#6be1d6] selection:text-[#0b161d]">
      {/* Watchtower Left Sidebar */}
      <aside className="w-72 flex-none border-r border-[#253740] px-5 py-6 flex flex-col bg-[#0a161d]/90 backdrop-blur-md sticky top-0 h-screen overflow-y-auto overflow-x-hidden">
        {/* Brand */}
        <div 
          className="flex items-center space-x-2.5 cursor-pointer group select-none pb-1" 
          onClick={() => setActiveTab('overview')}
        >
          <div className="w-8 h-8 rounded bg-[#132c35] border border-[#6be1d6]/50 flex items-center justify-center flex-none group-hover:border-[#6be1d6] group-hover:shadow-[0_0_10px_rgba(107,225,214,0.3)] transition-all">
            <span className="text-[#6be1d6] text-base font-bold leading-none transition-transform group-hover:scale-110">✳</span>
          </div>
          <div className="min-w-0">
            <div className="font-syne font-extrabold text-[15px] tracking-wide text-white whitespace-nowrap leading-none">
              WATCHTOWER
            </div>
            <div className="text-[9px] text-[#7f939d] tracking-widest uppercase whitespace-nowrap leading-none mt-1">
              NTRO // SIH 2026 · PS 26163
            </div>
          </div>
        </div>

        {/* Mission Status Card */}
        <div className="mt-8 mb-6 border border-[#34505a] bg-[#152a32] p-3.5 rounded-sm">
          <span className="text-[10px] text-[#7f939d] tracking-widest block uppercase">Mission Status</span>
          <strong className="block font-syne font-bold text-xs text-white my-1.5">Authorized assessment</strong>
          <div className="text-[10px] text-[#6be1d6] flex items-center space-x-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#6be1d6] animate-pulse shadow-[0_0_8px_#6be1d6]"></span>
            <span>Controlled environment</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1" aria-label="Primary navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-left transition-all ${
                  isActive
                    ? 'bg-[#203943] text-white font-medium shadow-sm border-l-2 border-[#6be1d6]'
                    : 'text-[#7f939d] hover:bg-[#162a33] hover:text-[#e6edf0]'
                }`}
              >
                <span className={`text-base ${isActive ? 'text-[#6be1d6]' : 'text-[#7f939d]'}`}>{item.symbol}</span>
                <span className="text-xs">{item.label}</span>
                <b className={`ml-auto text-[10px] font-normal ${isActive ? 'text-[#6be1d6]' : 'text-[#4e6871]'}`}>
                  {item.tag}
                </b>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom: Operator & Non-destructive note */}
        <div className="mt-auto pt-6 border-t border-[#253740] space-y-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-[#c2e66b] text-[#15231d] font-bold text-[10px] grid place-items-center">
              AK
            </div>
            <div className="flex-1 min-w-0">
              <strong className="block text-[11px] text-white truncate font-syne font-semibold">Analyst / A. Kumar</strong>
              <span className="block text-[10px] text-[#7f939d]">Red team lead</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#c2e66b] shadow-[0_0_6px_#c2e66b]" title="Online"></span>
          </div>

          <div className="flex items-start space-x-2.5 text-[#7f939d] border-l-2 border-[#6be1d6] pl-2.5 py-1">
            <span className="text-[#6be1d6] text-sm leading-none">⌁</span>
            <p className="text-[10px] leading-relaxed m-0">
              All activity is simulated<br />and non-destructive.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="border-b border-[#253740] bg-[#0c1820]/90 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <div className="text-[10px] text-[#7f939d] tracking-widest flex items-center space-x-1.5">
              <span>PROJECTS</span>
              <span>/</span>
              <span className="text-[#6be1d6]">WORLD MONITOR</span>
              <span>/</span>
              <span>WM-26163</span>
            </div>
            <h1 className="font-syne font-bold text-lg text-white mt-1">{getViewTitle()}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-xs text-[#7f939d] font-mono bg-[#14242d] px-2.5 py-1 border border-[#253740] rounded">
              {utcTime}
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-[11px] text-[#7f939d] bg-[#14242d] px-3 py-1 border border-[#253740] rounded">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6be1d6]" />
              <span>Target: <code className="text-[#6be1d6] font-mono">worldmonitor:ro</code></span>
            </div>

            <button
              onClick={onQuickScan}
              disabled={isScanning}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-syne font-semibold transition-all shadow-sm ${
                isScanning
                  ? 'bg-[#203943] text-[#7f939d] cursor-wait'
                  : 'bg-[#6be1d6] text-[#0b161d] hover:bg-[#5cd4c9]'
              }`}
            >
              <span>{isScanning ? '◌' : '▶'}</span>
              <span>{isScanning ? 'Scanning...' : 'Run Scan'}</span>
            </button>

            <button
              onClick={onReset}
              className="p-1.5 text-[#7f939d] hover:text-white hover:bg-[#1f3741] border border-[#253740] rounded transition-all"
              title="Reset Database to Clean State"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* View Body */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 lg:px-10 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};
