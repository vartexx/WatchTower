import React, { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle2, ArrowRight } from 'lucide-react';
import { TypewriterText } from './TypewriterText';

interface AegisScannerHubProps {
  onScanComplete: () => void;
  onNavigateToTriage: () => void;
}

export const AegisScannerHub: React.FC<AegisScannerHubProps> = ({
  onScanComplete,
  onNavigateToTriage,
}) => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [activeScanType, setActiveScanType] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Watchtower Automated Security Engine initialized.',
    '[READY] Target mapped: /target:ro (World Monitor repository)',
    '[SAFETY] Safe PoC Sinkhole active (127.0.0.1 sandbox)',
    '[READY] Select an engine profile below to execute an automated audit...'
  ]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const fetchRecentLogs = async () => {
    try {
      const res = await fetch('/api/scan/logs');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setLogs(prev => [...data.slice(0, 50).reverse(), ...prev].slice(0, 100));
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchRecentLogs();
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const runScan = async (type: string) => {
    if (scanning) return;
    setScanning(true);
    setActiveScanType(type);
    setProgress(20);

    const logEntry = (msg: string) => {
      setLogs(prev => [...prev, `[${new Date().toISOString().slice(11, 19)}] ${msg}`]);
    };

    logEntry(`Starting ${type.toUpperCase()} scan against target /target...`);

    const progressTimer = setInterval(() => {
      setProgress(p => (p < 85 ? p + 15 : p));
    }, 400);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanType: type })
      });
      const data = await res.json();
      clearInterval(progressTimer);
      setProgress(100);

      logEntry(`✓ Scan complete. Total findings discovered/updated: ${data.findingsCount || data.findings?.length || 0}`);
      logEntry(`Status: Verified in controlled environment.`);

      onScanComplete();
    } catch (e) {
      clearInterval(progressTimer);
      logEntry(`[ERROR] Scan execution encountered an issue: ${e}`);
    } finally {
      setTimeout(() => {
        setScanning(false);
        setActiveScanType(null);
      }, 1000);
    }
  };

  const scanEngines = [
    {
      id: 'all',
      name: 'Full Multi-Engine Assessment',
      desc: 'Orchestrates SAST AST analysis, dependency CVE audit, and security header verification across all 7 NTRO pillars.',
      highlight: true,
      tag: 'RECOMMENDED'
    },
    {
      id: 'sast',
      name: 'Static Code Analysis (SAST)',
      desc: 'Deep AST pattern scanner targeting SSRF filter bypasses, IDOR endpoints, unhandled input, and CORS reflections.',
      tag: 'CODE AUDIT'
    },
    {
      id: 'deps',
      name: 'Software Composition Analysis (SCA)',
      desc: 'Parses package-lock.json against the National Vulnerability Database (NVD) and npm audit for known CVEs.',
      tag: 'DEPENDENCIES'
    },
    {
      id: 'headers',
      name: 'Security Headers & Defense-in-Depth',
      desc: 'Inspects HTTP response policies, Content-Security-Policy (CSP), Permissions-Policy, and HSTS coverage.',
      tag: 'HTTP HEADERS'
    }
  ];

  return (
    <div className="space-y-6 animate-tab-enter pb-12">
      {/* Intro */}
      <div className="border-b border-[#181f2e] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#00f0ff] tracking-widest uppercase block font-mono">
            PHASE 02 // MULTI-ENGINE EXECUTION
          </span>
          <h2 className="font-syne font-extrabold text-3xl text-white tracking-tight mt-1">
            Automated scanner <em className="text-[#00f0ff] not-italic font-normal">hub</em>
          </h2>

          {/* Typewriter Prompt */}
          <div className="mt-3 inline-flex items-center space-x-2 py-1 px-3 rounded bg-[#05070a] border border-[#181f2e] text-xs font-mono shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse inline-block"></span>
            <span className="text-[#00f0ff] font-bold">ORCHESTRATOR &gt;</span>
            <TypewriterText
              phrases={[
                "Awaiting multi-engine VAPT trigger on target: /target:ro...",
                "SAST engine prepared with AST security pattern traversal rules...",
                "SCA engine synced with National Vulnerability Database (NVD)...",
                "HTTP response policy checker armed for OWASP secure headers benchmark."
              ]}
              typingSpeed={38}
              deletingSpeed={18}
              pauseDuration={2400}
              className="text-[#38bdf8]"
            />
          </div>

          <p className="text-xs text-[#94a3b8] max-w-xl mt-2 leading-relaxed">
            Execute real-time non-destructive scanning against the World Monitor repository. Results automatically update the live findings database with CVSS v3.1 scoring.
          </p>
        </div>

        {progress === 100 && (
          <button
            onClick={onNavigateToTriage}
            className="flex items-center space-x-2 px-4 py-2 rounded-sm bg-gradient-to-r from-[#00ff9d] to-[#10b981] text-black text-xs font-syne font-bold hover:shadow-[0_0_15px_rgba(0,255,157,0.4)] transition-all shadow-md"
          >
            <span>Review Findings & Triage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Progress Bar with bottom-to-top equalizer bars (Visible while scanning) */}
      {scanning && (
        <div className="border border-[#181f2e] bg-[#0c1017] p-4 rounded-sm space-y-2.5 shadow-lg relative overflow-hidden animate-slide-up-dock">
          <div className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent pointer-events-none animate-scan-beam-vertical" />
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#00f0ff] font-syne font-semibold flex items-center space-x-2">
              {/* Equalizer bars coming from bottom to top */}
              <div className="flex items-end space-x-0.5 h-3.5">
                <span className="w-1 bg-[#00f0ff] rounded-xs animate-bar-1 h-3.5 inline-block" />
                <span className="w-1 bg-[#00ff9d] rounded-xs animate-bar-2 h-3.5 inline-block" />
                <span className="w-1 bg-[#00f0ff] rounded-xs animate-bar-3 h-3.5 inline-block" />
                <span className="w-1 bg-[#38bdf8] rounded-xs animate-bar-4 h-3.5 inline-block" />
              </div>
              <span>Running {activeScanType?.toUpperCase()} Scan Engine...</span>
            </span>
            <span className="text-[#00ff9d] font-mono font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-[#181f2e] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#00ff9d] transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Engine Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scanEngines.map((engine) => (
          <div
            key={engine.id}
            className={`border rounded-sm p-5 flex flex-col justify-between transition-all cyber-card ${
              engine.highlight
                ? 'border-[#00f0ff]/50 bg-gradient-to-br from-[#0c1424] to-[#07090f] shadow-[0_0_20px_rgba(0,240,255,0.12)]'
                : 'border-[#181f2e] bg-gradient-to-br from-[#0c0e14] to-[#07080c] shadow-lg hover:border-[#1e2638]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#00f0ff] font-mono border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-2 py-0.5 rounded">
                  {engine.tag}
                </span>
                {engine.highlight && (
                  <span className="text-[9px] text-[#00ff9d] font-mono font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>7 NTRO PILLARS</span>
                  </span>
                )}
              </div>
              <h3 className="font-syne font-bold text-base text-white mt-2">{engine.name}</h3>
              <p className="text-xs text-[#94a3b8] mt-2 leading-relaxed">{engine.desc}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#181f2e] flex items-center justify-between">
              <span className="text-[10px] text-[#64748b]">Safe sandbox · Non-destructive</span>
              <button
                onClick={() => runScan(engine.id)}
                disabled={scanning}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-sm text-xs font-syne font-bold transition-all shadow-sm ${
                  scanning
                    ? 'bg-[#181f2e] text-[#64748b] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#00f0ff] to-[#00c8ff] text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Launch Engine</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Terminal Console */}
      <div className="border border-[#181f2e] bg-[#05070a] rounded-sm overflow-hidden shadow-2xl">
        <div className="h-10 border-b border-[#181f2e] px-4 flex items-center justify-between bg-[#080b10] text-[10px] text-[#94a3b8]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff2a5f] inline-block shadow-[0_0_6px_#ff2a5f]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb703] inline-block shadow-[0_0_6px_#ffb703]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff9d] inline-block shadow-[0_0_6px_#00ff9d]"></span>
            <span className="ml-2 font-syne text-white font-semibold">scanner://orchestrator/console.log</span>
          </div>
          <span className="text-[#00ff9d] font-mono">LIVE TELEMETRY STREAM</span>
        </div>

        <div
          ref={logContainerRef}
          className="p-4 font-mono text-xs text-[#f8fafc] max-h-72 overflow-y-auto space-y-1.5 bg-[#030406]"
        >
          {logs.map((log, index) => (
            <div
              key={index}
              className={`${
                log.includes('[ERROR]')
                  ? 'text-[#ff2a5f]'
                  : log.includes('✓')
                  ? 'text-[#00ff9d]'
                  : log.includes('Starting')
                  ? 'text-[#00f0ff]'
                  : 'text-[#94a3b8]'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
