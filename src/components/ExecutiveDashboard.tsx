import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertOctagon, 
  Filter, 
  Terminal, 
  FileCheck, 
  Lock, 
  Eye, 
  Server, 
  Key, 
  FileCode, 
  Radio, 
  Database,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { SystemStatus, Finding } from '../types';

interface ExecutiveDashboardProps {
  status: SystemStatus | null;
  findings: Finding[];
  onNavigateTab: (tab: string, filterScope?: string) => void;
  onRunScan: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  status,
  findings,
  onNavigateTab,
  onRunScan,
}) => {
  const stats = status?.stats || {
    total: 0,
    confirmed: 0,
    unverified: 0,
    falsePositive: 0,
    remediated: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  const confirmedFindings = findings.filter(f => f.status === 'Confirmed');
  const avgCvss = confirmedFindings.length > 0
    ? (confirmedFindings.reduce((acc, f) => acc + f.cvssScore, 0) / confirmedFindings.length).toFixed(1)
    : '0.0';

  // Security Posture Score (0-100, where 100 is fully secure)
  // Deduct based on confirmed critical (-20) and high (-10) vulnerabilities
  const calculatedPosture = Math.max(12, 100 - (stats.critical * 22 + stats.high * 10 + stats.medium * 4));

  // The 7 NTRO Scope Areas
  const ntroScopes = [
    {
      id: 'Authentication & sessions',
      name: 'Authentication & Sessions',
      icon: Key,
      desc: 'Session hijacking, weak tokens, broken cookies & Clerk auth flaws',
      cwe: 'CWE-287, CWE-384',
    },
    {
      id: 'Authorization & access control',
      name: 'Authorization & Access Control',
      icon: Lock,
      desc: 'BOLA/IDOR in user preferences, privilege escalation & missing RBAC',
      cwe: 'CWE-639, CWE-285',
    },
    {
      id: 'Input validation',
      name: 'Input Validation',
      icon: FileCode,
      desc: 'SSRF in RSS/notification proxies, SQLi, and DOM XSS injection sinks',
      cwe: 'CWE-918, CWE-79',
    },
    {
      id: 'API security',
      name: 'API Security',
      icon: Server,
      desc: 'Missing rate limiting, LLM resource exhaustion & data over-exposure',
      cwe: 'CWE-770, CWE-200',
    },
    {
      id: 'Client-side security',
      name: 'Client-Side Security',
      icon: Eye,
      desc: 'Exposed API tokens, WebGL layer flaws & client bundle vulnerabilities',
      cwe: 'CWE-798, CWE-1395',
    },
    {
      id: 'Secure communication',
      name: 'Secure Communication',
      icon: Radio,
      desc: 'Missing HSTS, TLS downgrade vectors & permissive wildcard CORS',
      cwe: 'CWE-319, CWE-942',
    },
    {
      id: 'Data storage & privacy',
      name: 'Data Storage & Privacy',
      icon: Database,
      desc: 'Unencrypted Redis telemetry, raw PII logs & DPDP Act 2023 compliance',
      cwe: 'CWE-359, CWE-532',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Target & Compliance Banner */}
      <div className="bg-gradient-to-r from-cyber-900 via-cyber-850 to-cyber-900 border border-cyber-700/60 rounded-xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                AUDIT TARGET IDENTIFIER
              </span>
              <span>•</span>
              <span className="text-slate-400">NTRO PS 26163 COMPLIANCE SUITE</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
              <span>World Monitor VAPT Dashboard</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                127.0.0.1 (Local Sinkhole Active)
              </span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Continuous security audit platform inspecting the self-hosted World Monitor codebase across the 7 NTRO security pillars, with automated scanning, human verification, and instant official report generation.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-center">
            <button
              onClick={onRunScan}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Trigger Full Scan</span>
            </button>
            <button
              onClick={() => onNavigateTab('report')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-cyber-800 hover:bg-cyber-700 border border-cyber-600 text-slate-200 font-medium text-xs transition cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>NTRO Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Posture Gauge Card */}
        <div className="bg-cyber-900/80 border border-cyber-700/60 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>SECURITY POSTURE</span>
            <span className="text-rose-400 font-semibold">HIGH RISK</span>
          </div>
          <div className="mt-3 flex items-baseline space-x-3">
            <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
              {calculatedPosture}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <div className="mt-2 w-full bg-cyber-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${calculatedPosture}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            Avg CVSS Base Score: <strong className="text-rose-300">{avgCvss}</strong>
          </p>
        </div>

        {/* Confirmed Findings Card */}
        <div 
          onClick={() => onNavigateTab('triage')}
          className="bg-cyber-900/80 border border-rose-500/30 hover:border-rose-500/60 transition rounded-xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>CONFIRMED FLAWS</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-rose-400 font-mono">
              {stats.confirmed}
            </span>
            <span className="text-xs text-slate-400">verified</span>
          </div>
          <div className="flex items-center space-x-2 mt-3 text-[11px] font-mono">
            <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/80 font-bold">
              {stats.critical} Critical
            </span>
            <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80 font-bold">
              {stats.high} High
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/80">
              {stats.medium} Med
            </span>
          </div>
        </div>

        {/* Pending Human Triage Card */}
        <div 
          onClick={() => onNavigateTab('triage')}
          className="bg-cyber-900/80 border border-amber-500/30 hover:border-amber-500/60 transition rounded-xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>PENDING TRIAGE</span>
            <AlertOctagon className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-amber-400 font-mono">
              {stats.unverified}
            </span>
            <span className="text-xs text-slate-400">unverified</span>
          </div>
          <p className="text-[11px] text-amber-300/80 mt-3 font-mono flex items-center space-x-1">
            <Filter className="w-3 h-3" />
            <span>Human-in-the-loop review required</span>
          </p>
        </div>

        {/* False Positives Filtered Card */}
        <div 
          onClick={() => onNavigateTab('triage')}
          className="bg-cyber-900/80 border border-emerald-500/30 hover:border-emerald-500/60 transition rounded-xl p-5 cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>FALSE POSITIVES</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold text-emerald-400 font-mono">
              {stats.falsePositive}
            </span>
            <span className="text-xs text-slate-400">eliminated</span>
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-3 font-mono">
            Vetted to prevent raw scanner dump
          </p>
        </div>
      </div>

      {/* The 7 Scope Areas Required by NTRO Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span>The 7 NTRO Scope Areas</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Mandatory Assessment
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Each security discipline mapped directly to World Monitor's codebase and architecture
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            100% Surface Evaluated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ntroScopes.map((scope, idx) => {
            const Icon = scope.icon;
            const scopeFindings = findings.filter(f => f.scopeArea.toLowerCase().includes(scope.id.toLowerCase()));
            const confirmedCount = scopeFindings.filter(f => f.status === 'Confirmed').length;
            const unverifiedCount = scopeFindings.filter(f => f.status === 'Unverified').length;
            const hasCritical = scopeFindings.some(f => f.severity === 'Critical' && f.status === 'Confirmed');
            const hasHigh = scopeFindings.some(f => f.severity === 'High' && f.status === 'Confirmed');

            return (
              <div
                key={scope.id}
                onClick={() => onNavigateTab('triage', scope.id)}
                className="bg-cyber-900/90 border border-cyber-700/60 hover:border-cyan-500/50 hover:bg-cyber-850/90 transition-all rounded-xl p-4 cursor-pointer group relative"
              >
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-lg bg-cyber-800 border border-cyber-700 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:border-cyan-500/40 transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                    {hasCritical ? (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold animate-pulse">
                        CRITICAL
                      </span>
                    ) : hasHigh ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                        HIGH
                      </span>
                    ) : confirmedCount > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/40">
                        CONFIRMED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        AUDITED
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition flex items-center justify-between">
                    <span>{idx + 1}. {scope.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {scope.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-cyber-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-slate-500">{scope.cwe}</span>
                  <div className="flex items-center space-x-2">
                    {confirmedCount > 0 && (
                      <span className="text-rose-400 font-semibold">{confirmedCount} Flaws</span>
                    )}
                    {unverifiedCount > 0 && (
                      <span className="text-amber-400">+{unverifiedCount} Unverified</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NTRO Golden Rule Advisory Banner */}
      <div className="bg-cyber-900 border border-cyan-500/30 rounded-xl p-4 flex items-start space-x-4">
        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            NTRO Compliance Protocol: Self-Hosted Testing Boundary
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            "You test your own self-hosted local copy of World Monitor (since it's open source), never the real live worldmonitor.app used by real people. This keeps you 100% authorized and safe, and it's exactly what NTRO's rules require ('no impact on production users')."
          </p>
        </div>
      </div>
    </div>
  );
};
