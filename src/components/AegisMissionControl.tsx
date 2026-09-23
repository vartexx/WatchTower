import React from 'react';
import { Finding, SystemStatus } from '../types';
import { Shield, AlertTriangle, CheckCircle2, ArrowUpRight, Activity } from 'lucide-react';

interface AegisMissionControlProps {
  status: SystemStatus | null;
  findings: Finding[];
  onNavigateTab: (tab: string) => void;
  onRunScan: () => void;
  isScanning: boolean;
}

export const AegisMissionControl: React.FC<AegisMissionControlProps> = ({
  status,
  findings,
  onNavigateTab,
  onRunScan,
  isScanning,
}) => {
  const criticalCount = findings.filter(f => f.severity === 'CRITICAL').length;
  const highCount = findings.filter(f => f.severity === 'HIGH').length;
  const medCount = findings.filter(f => f.severity === 'MEDIUM').length;
  const lowCount = findings.filter(f => f.severity === 'LOW').length;

  // Calculate dynamic security score (0 to 100) based on CVSS weights
  const maxPossibleDeduction = 100;
  const deductions = (criticalCount * 18) + (highCount * 12) + (medCount * 6) + (lowCount * 2);
  const securityScore = Math.max(15, Math.min(95, 100 - deductions));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Row: Assessment Headline & Animated Radar */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pb-4">
        <div className="flex-1 max-w-2xl">
          <span className="text-[10px] text-[#00f0ff] tracking-widest font-mono uppercase block">
            LIVE ASSESSMENT // WM-26163
          </span>
          <h2 className="font-syne font-extrabold text-4xl lg:text-5xl text-white tracking-tight mt-2 leading-[1.08]">
            See the risk<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#a855f7]">
              before it spreads.
            </span>
          </h2>
          <p className="text-sm text-[#94a3b8] leading-relaxed mt-4 max-w-xl">
            A controlled, evidence-first automated VAPT security assessment of the World Monitor application.
            Audit against 7 NTRO mandated pillars, validate impact mathematically via CVSS v3.1, and verify DPDP Act 2023 compliance.
          </p>

          {/* Control Strip */}
          <div className="mt-8 border border-[#1e2638] bg-gradient-to-r from-[#0c1017] to-[#07090e] p-4 flex flex-wrap items-center justify-between gap-4 rounded-sm shadow-xl">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff] animate-pulse"></span>
              <div>
                <strong className="block text-xs text-white font-syne">Assessment engine ready</strong>
                <span className="block text-[10px] text-[#94a3b8] mt-0.5 font-mono">
                  {status?.recon?.totalEndpoints || 164} assets mapped · 18 evidence artifacts · Target: /target:ro
                </span>
              </div>
            </div>
            <button
              onClick={onRunScan}
              disabled={isScanning}
              className={`px-4 py-2 text-xs font-syne font-bold rounded-sm transition-all shadow-md ${
                isScanning
                  ? 'bg-[#181f2e] text-[#64748b] cursor-wait'
                  : 'bg-gradient-to-r from-[#00f0ff] to-[#00c8ff] text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]'
              }`}
            >
              <span>{isScanning ? '◌' : '▶'}</span>
              <span className="ml-1.5">{isScanning ? 'Executing scan...' : 'Run simulated scan'}</span>
            </button>
          </div>
        </div>

        {/* Hero Art: Animated Aegis Radar */}
        <div className="w-full lg:w-80 flex flex-col items-center">
          <div className="radar">
            <span className="radar-sweep"></span>
            <span className="radar-ring"></span>
            <span className="radar-ring ring-two"></span>
            <span className="absolute w-2.5 h-2.5 rounded-full bg-[#ff2a5f] shadow-[0_0_12px_#ff2a5f] top-[29%] left-[63%]"></span>
            <span className="absolute w-2.5 h-2.5 rounded-full bg-[#ffb703] shadow-[0_0_12px_#ffb703] top-[64%] left-[29%]"></span>
            <span className="absolute w-2.5 h-2.5 rounded-full bg-[#00ff9d] shadow-[0_0_12px_#00ff9d] top-[22%] left-[26%]"></span>
            <div className="radar-center font-syne font-bold text-[#00f0ff]">WM</div>
          </div>
          <div className="text-[10px] text-[#94a3b8] text-center mt-3 font-mono leading-relaxed">
            TARGET / WORLD MONITOR<br />
            <b className="text-[#00f0ff] font-normal">SIMULATION & VAPT MODE</b>
          </div>
        </div>
      </div>

      {/* Executive Signal: 4 Metrics Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#181f2e] pb-2">
          <div>
            <span className="text-[10px] text-[#94a3b8] tracking-widest uppercase block font-mono">EXECUTIVE SIGNAL</span>
            <h3 className="font-syne font-bold text-xl text-white">Risk at a glance</h3>
          </div>
          <span className="text-[10px] text-[#94a3b8] font-mono flex items-center space-x-1">
            <span>UPDATED LIVE</span>
            <span className="text-[#00f0ff]">↻</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Security Score */}
          <article className="border border-[#181f2e] bg-gradient-to-br from-[#0c0e14] to-[#07080c] p-4 rounded-sm flex flex-col justify-between min-h-[145px] hover:border-[#00f0ff]/30 transition-all shadow-md">
            <div className="flex justify-between items-center text-[10px] text-[#94a3b8]">
              <span>SECURITY SCORE</span>
              <span className="text-[#ff2a5f] font-mono">↓ 8.4%</span>
            </div>
            <div className="my-2">
              <div className="flex items-baseline space-x-1">
                <strong className="font-syne font-bold text-4xl text-white">{securityScore}</strong>
                <span className="text-[#94a3b8] text-xs">/ 100</span>
                <div className="ml-auto w-24 h-1.5 bg-[#181f2e] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff2a5f] via-[#ffb703] to-[#00ff9d] transition-all duration-700"
                    style={{ width: `${securityScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-[#94a3b8] m-0">Needs remediation before production launch</p>
          </article>

          {/* Card 2: Open Findings */}
          <article
            onClick={() => onNavigateTab('findings')}
            className="border border-[#181f2e] bg-gradient-to-br from-[#0c0e14] to-[#07080c] p-4 rounded-sm flex flex-col justify-between min-h-[145px] cursor-pointer hover:border-[#ff2a5f]/40 transition-all shadow-md"
          >
            <div className="flex justify-between items-center text-[10px] text-[#94a3b8]">
              <span>OPEN FINDINGS</span>
              <span className="text-[#ff2a5f] font-mono">△ ACTIVE</span>
            </div>
            <div className="my-1">
              <strong className="font-syne font-bold text-4xl text-white">
                {findings.length < 10 ? `0${findings.length}` : findings.length}
              </strong>
              <p className="text-[10px] text-[#94a3b8] mt-1">
                <b className="text-[#ff2a5f] font-normal">{criticalCount + highCount} High/Crit</b> · {medCount} Medium · {lowCount} Low
              </p>
            </div>
            <div className="flex items-end space-x-1.5 h-4">
              <span className="w-2.5 bg-[#ff2a5f] rounded-t-xs" style={{ height: `${Math.min(100, criticalCount * 30 + 30)}%` }}></span>
              <span className="w-2.5 bg-[#ff2a5f]/80 rounded-t-xs" style={{ height: `${Math.min(100, highCount * 25 + 20)}%` }}></span>
              <span className="w-2.5 bg-[#ffb703] rounded-t-xs" style={{ height: `${Math.min(100, medCount * 20 + 20)}%` }}></span>
              <span className="w-2.5 bg-[#38bdf8] rounded-t-xs" style={{ height: `${Math.min(100, lowCount * 15 + 15)}%` }}></span>
            </div>
          </article>

          {/* Card 3: Asset Coverage */}
          <article
            onClick={() => onNavigateTab('surface')}
            className="border border-[#181f2e] bg-gradient-to-br from-[#0c0e14] to-[#07080c] p-4 rounded-sm flex flex-col justify-between min-h-[145px] cursor-pointer hover:border-[#00ff9d]/40 transition-all shadow-md"
          >
            <div className="flex justify-between items-center text-[10px] text-[#94a3b8]">
              <span>ASSET COVERAGE</span>
              <span className="text-[#00ff9d] font-mono">◌ COMPLETE</span>
            </div>
            <div className="my-1">
              <strong className="font-syne font-bold text-4xl text-white">
                100<span className="text-xl text-[#94a3b8] font-normal">%</span>
              </strong>
              <p className="text-[10px] text-[#94a3b8] mt-1">
                {status?.recon?.totalEndpoints || 164} routes inventory verified
              </p>
            </div>
            <div className="w-full h-1 bg-[#181f2e] rounded-full overflow-hidden">
              <div className="h-full bg-[#00ff9d] w-full"></div>
            </div>
          </article>

          {/* Card 4: Remediation Velocity / DPDP Status */}
          <article
            onClick={() => onNavigateTab('report')}
            className="border border-[#181f2e] bg-gradient-to-br from-[#0c0e14] to-[#07080c] p-4 rounded-sm flex flex-col justify-between min-h-[145px] cursor-pointer hover:border-[#ffb703]/40 transition-all shadow-md"
          >
            <div className="flex justify-between items-center text-[10px] text-[#94a3b8]">
              <span>DPDP ACT COMPLIANCE</span>
              <span className="text-[#ff2a5f] font-mono">NON-COMPLIANT</span>
            </div>
            <div className="my-1">
              <strong className="font-syne font-bold text-4xl text-[#ffb703]">
                2<span className="text-xl text-[#94a3b8] font-normal"> Gaps</span>
              </strong>
              <p className="text-[10px] text-[#94a3b8] mt-1">
                Sec 8(5) Data Safeguards · Sec 8(7) Retention
              </p>
            </div>
            <div className="text-[10px] text-[#00ff9d] flex items-center space-x-1">
              <span>↗ Fix guide ready in NTRO Readout</span>
            </div>
          </article>
        </div>
      </div>

      {/* Dashboard Grid: Threat Model + Assessment Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* Threat Model Map */}
        <div className="lg:col-span-7 border border-[#181f2e] bg-gradient-to-br from-[#0c0e14] to-[#07080c] p-5 rounded-sm shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#181f2e]">
            <div>
              <span className="text-[10px] text-[#94a3b8] tracking-widest uppercase block font-mono">THREAT MODEL</span>
              <h3 className="font-syne font-bold text-lg text-white">Exposure Map</h3>
            </div>
            <span className="text-[10px] text-[#00f0ff] border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-2 py-0.5 rounded font-mono shadow-[0_0_8px_rgba(0,240,255,0.2)]">
              STRIDE / LIVE
            </span>
          </div>

          <div className="threat-map mt-4 rounded-sm border border-[#181f2e] relative">
            <div className="map-lines"></div>

            {/* Core Node */}
            <div className="node node-core cursor-pointer hover:border-[#00f0ff] transition-all" onClick={() => onNavigateTab('surface')}>
              <span>WM</span>
              <b>World Monitor</b>
              <small>Core Intelligence App</small>
            </div>

            {/* API Node */}
            <div className="node node-api cursor-pointer hover:border-[#ff2a5f] transition-all" onClick={() => onNavigateTab('surface')}>
              <span>API</span>
              <b>Public API Surface</b>
              <small>{status?.recon?.totalEndpoints || 164} routes</small>
              <i className="risk-dot red"></i>
            </div>

            {/* Auth Node */}
            <div className="node node-auth cursor-pointer hover:border-[#ffb703] transition-all" onClick={() => onNavigateTab('findings')}>
              <span>AUTH</span>
              <b>Identity & Session</b>
              <small>Clerk + OAuth Layer</small>
              <i className="risk-dot amber"></i>
            </div>

            {/* Data Node */}
            <div className="node node-data cursor-pointer hover:border-[#00ff9d] transition-all" onClick={() => onNavigateTab('findings')}>
              <span>DB</span>
              <b>Data & Telemetry</b>
              <small>IP Cache / Storage</small>
              <i className="risk-dot red"></i>
            </div>

            {/* Legend */}
            <div className="map-legend">
              <span className="flex items-center"><i className="risk-dot red"></i> Elevated</span>
              <span className="flex items-center"><i className="risk-dot amber"></i> Observe</span>
              <span className="flex items-center"><i className="risk-dot lime"></i> Verified</span>
            </div>
          </div>
        </div>

        {/* Activity Stream */}
        <div className="lg:col-span-5 border border-[#181f2e] bg-gradient-to-br from-[#0c0e14] to-[#07080c] p-5 rounded-sm flex flex-col shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#181f2e]">
            <div>
              <span className="text-[10px] text-[#94a3b8] tracking-widest uppercase block font-mono">ASSESSMENT STREAM</span>
              <h3 className="font-syne font-bold text-lg text-white">What is happening</h3>
            </div>
            <button
              onClick={() => onNavigateTab('findings')}
              className="text-[10px] text-[#00f0ff] hover:underline flex items-center space-x-1"
            >
              <span>View all findings</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-2 divide-y divide-[#181f2e] flex-1">
            <div className="py-3 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full border border-[#ff2a5f]/60 bg-[#ff2a5f]/15 text-[#ff2a5f] text-xs grid place-items-center mt-0.5 shadow-[0_0_8px_rgba(255,42,95,0.3)]">
                △
              </span>
              <div className="flex-1 min-w-0">
                <strong className="block text-xs text-white font-syne font-semibold truncate">
                  Critical Authorization Bypass Verified
                </strong>
                <span className="block text-[10px] text-[#94a3b8] mt-0.5">
                  IDOR on /api/v1/reports/export · CVSS 9.1
                </span>
              </div>
              <time className="text-[9px] text-[#ff2a5f] whitespace-nowrap font-mono">Verified</time>
            </div>

            <div className="py-3 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full border border-[#ffb703]/60 bg-[#ffb703]/15 text-[#ffb703] text-xs grid place-items-center mt-0.5 shadow-[0_0_8px_rgba(255,183,3,0.3)]">
                ⌁
              </span>
              <div className="flex-1 min-w-0">
                <strong className="block text-xs text-white font-syne font-semibold truncate">
                  SSRF Filter Bypass Sinkhole Trapped
                </strong>
                <span className="block text-[10px] text-[#94a3b8] mt-0.5">
                  Controlled 127.0.0.1 loopback probe intercepted
                </span>
              </div>
              <time className="text-[9px] text-[#ffb703] whitespace-nowrap font-mono">PoC Safe</time>
            </div>

            <div className="py-3 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full border border-[#00f0ff]/60 bg-[#00f0ff]/15 text-[#00f0ff] text-xs grid place-items-center mt-0.5 shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                ⚡
              </span>
              <div className="flex-1 min-w-0">
                <strong className="block text-xs text-white font-syne font-semibold truncate">
                  Endpoint Inventory Synchronized
                </strong>
                <span className="block text-[10px] text-[#94a3b8] mt-0.5">
                  164 assets mapped across 7 NTRO scope pillars
                </span>
              </div>
              <time className="text-[9px] text-[#00f0ff] whitespace-nowrap font-mono">100%</time>
            </div>

            <div className="py-3 flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full border border-[#00ff9d]/60 bg-[#00ff9d]/15 text-[#00ff9d] text-xs grid place-items-center mt-0.5 shadow-[0_0_8px_rgba(0,255,157,0.3)]">
                ✓
              </span>
              <div className="flex-1 min-w-0">
                <strong className="block text-xs text-white font-syne font-semibold truncate">
                  Evidence Vault Cryptographic Seal
                </strong>
                <span className="block text-[10px] text-[#94a3b8] mt-0.5">
                  SHA-256 integrity hash generated for NTRO readout
                </span>
              </div>
              <time className="text-[9px] text-[#00ff9d] whitespace-nowrap font-mono">Sealed</time>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
