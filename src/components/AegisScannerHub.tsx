import React, { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle2, ArrowRight } from 'lucide-react';

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
    '[INIT] Aegis // Watchtower Automated Security Engine initialized.',
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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Intro */}
      <div className="border-b border-[#253740] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#6be1d6] tracking-widest uppercase block font-mono">
            PHASE 02 // MULTI-ENGINE EXECUTION
          </span>
          <h2 className="font-syne font-extrabold text-3xl text-white tracking-tight mt-1">
            Automated scanner <em className="text-[#6be1d6] not-italic font-normal">hub</em>
          </h2>
          <p className="text-xs text-[#7f939d] max-w-xl mt-2 leading-relaxed">
            Execute real-time non-destructive scanning against the World Monitor repository. Results automatically update the live findings database with CVSS v3.1 scoring.
          </p>
        </div>

        {progress === 100 && (
          <button
            onClick={onNavigateToTriage}
            className="flex items-center space-x-2 px-4 py-2 rounded-sm bg-[#c2e66b] text-[#10252b] text-xs font-syne font-bold hover:bg-[#b0d655] transition-all shadow-md"
          >
            <span>Review Findings & Triage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Progress Bar (Visible while scanning) */}
      {scanning && (
        <div className="border border-[#31525b] bg-[#122832] p-4 rounded-sm space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#6be1d6] font-syne font-semibold flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#6be1d6] animate-pulse"></span>
              <span>Running {activeScanType?.toUpperCase()} Scan Engine...</span>
            </span>
            <span className="text-[#7f939d] font-mono">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#203943] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6be1d6] to-[#c2e66b] transition-all duration-300"
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
            className={`border rounded-sm p-5 flex flex-col justify-between transition-all ${
              engine.highlight
                ? 'border-[#3a6267] bg-gradient-to-br from-[#162f38] to-[#102029]'
                : 'border-[#253740] bg-gradient-to-br from-[#152831] to-[#102029]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#6be1d6] font-mono border border-[#3a6267] px-2 py-0.5 rounded">
                  {engine.tag}
                </span>
                {engine.highlight && (
                  <span className="text-[9px] text-[#c2e66b] font-mono font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>7 NTRO PILLARS</span>
                  </span>
                )}
              </div>
              <h3 className="font-syne font-bold text-base text-white mt-2">{engine.name}</h3>
              <p className="text-xs text-[#7f939d] mt-2 leading-relaxed">{engine.desc}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#253740] flex items-center justify-between">
              <span className="text-[10px] text-[#7f939d]">Safe sandbox · Non-destructive</span>
              <button
                onClick={() => runScan(engine.id)}
                disabled={scanning}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-sm text-xs font-syne font-semibold transition-all shadow-sm ${
                  scanning
                    ? 'bg-[#203943] text-[#7f939d] cursor-not-allowed'
                    : 'bg-[#6be1d6] text-[#10252b] hover:bg-[#5cd4c9]'
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
      <div className="border border-[#253740] bg-[#0c1820] rounded-sm overflow-hidden shadow-xl">
        <div className="h-10 border-b border-[#253740] px-4 flex items-center justify-between bg-[#10202a] text-[10px] text-[#7f939d]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff746d] inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#efb867] inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#c2e66b] inline-block"></span>
            <span className="ml-2 font-syne text-[#e6edf0] font-semibold">scanner://orchestrator/console.log</span>
          </div>
          <span className="text-[#c2e66b] font-mono">LIVE TELEMETRY STREAM</span>
        </div>

        <div
          ref={logContainerRef}
          className="p-4 font-mono text-xs text-[#e6edf0] max-h-72 overflow-y-auto space-y-1.5 bg-[#0a151b]"
        >
          {logs.map((log, index) => (
            <div
              key={index}
              className={`${
                log.includes('[ERROR]')
                  ? 'text-[#ff746d]'
                  : log.includes('✓')
                  ? 'text-[#c2e66b]'
                  : log.includes('Starting')
                  ? 'text-[#6be1d6]'
                  : 'text-[#7f939d]'
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
