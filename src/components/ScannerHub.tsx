import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Play, 
  Code, 
  Package, 
  Radio, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  Layers, 
  Clock,
  ArrowRight
} from 'lucide-react';

interface ScannerHubProps {
  onScanComplete: () => void;
  onNavigateToTriage: () => void;
}

export const ScannerHub: React.FC<ScannerHubProps> = ({
  onScanComplete,
  onNavigateToTriage,
}) => {
  const [scanning, setScanning] = useState(false);
  const [activeScanType, setActiveScanType] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Watchtower Automated Security Engine v1.0 initialized.',
    '[READY] Target local sandbox configured: ./worldmonitor (127.0.0.1 sinkhole)',
    '[READY] Select a scan profile below to begin inspection...'
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
    setProgress(15);

    const scanStartTime = Date.now();
    setLogs(prev => [
      `[ORCHESTRATOR] >>> Dispatching ${type.toUpperCase()} scan job against local World Monitor copy...`,
      ...prev
    ]);

    // Simulated progress animation while real scan runs
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 18, 90));
    }, 400);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanType: type })
      });
      const data = await res.json();

      clearInterval(progressInterval);
      setProgress(100);

      const elapsed = ((Date.now() - scanStartTime) / 1000).toFixed(2);

      setLogs(prev => [
        `[COMPLETE] Scan execution finished in ${elapsed}s.`,
        `[FINDINGS] Discovered ${data.addedCount || 0} candidate vulnerabilities imported as [UNVERIFIED].`,
        ...(data.logs || []),
        ...prev
      ]);

      onScanComplete();
    } catch (err: any) {
      clearInterval(progressInterval);
      setLogs(prev => [
        `[ERROR] Scan failed: ${err.message}`,
        ...prev
      ]);
    } finally {
      setScanning(false);
      setActiveScanType(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-cyber-900 border border-cyber-700/60 rounded-xl p-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
          <Flame className="w-4 h-4 text-cyan-400" />
          <span>AUTOMATED MULTI-ENGINE SCANNER LAYER</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Vulnerability Detection Orchestrator
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Triggers static AST source checks, npm supply-chain audit parsers, and HTTP security header probes against the self-hosted World Monitor target. All newly flagged issues are quarantined as <strong className="text-amber-400">Unverified</strong> until human validation.
        </p>
      </div>

      {/* Scanner Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile 1: Full Suite */}
        <div className="bg-cyber-900 border border-cyan-500/40 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-400 transition shadow-[0_0_15px_rgba(0,240,255,0.1)]">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700/50">ALL-IN-ONE</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white mt-2">Full VAPT Suite</h3>
            <p className="text-xs text-slate-400 mt-1">
              Executes SAST source checks, dependency CVE analysis, and live HTTP security header probes concurrently.
            </p>
          </div>
          <button
            onClick={() => runScan('all')}
            disabled={scanning}
            className="mt-4 w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase transition disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>{scanning && activeScanType === 'all' ? 'Scanning...' : 'Launch Full Audit'}</span>
          </button>
        </div>

        {/* Profile 2: SAST */}
        <div className="bg-cyber-900 border border-cyber-700/60 rounded-xl p-4 flex flex-col justify-between hover:border-cyber-600 transition">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-cyber-950 border border-cyber-800">SOURCE CODE</span>
              <Code className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-white mt-2">SAST Code Analyzer</h3>
            <p className="text-xs text-slate-400 mt-1">
              Inspects source files for hardcoded secrets, innerHTML sinks, SSRF-prone fetches, and unvalidated parameters.
            </p>
          </div>
          <button
            onClick={() => runScan('sast')}
            disabled={scanning}
            className="mt-4 w-full py-2 px-3 rounded-lg bg-cyber-800 hover:bg-cyber-700 text-cyan-300 border border-cyber-600 font-mono text-xs uppercase transition disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{scanning && activeScanType === 'sast' ? 'Scanning...' : 'Run SAST Scan'}</span>
          </button>
        </div>

        {/* Profile 3: Dependency Scan */}
        <div className="bg-cyber-900 border border-cyber-700/60 rounded-xl p-4 flex flex-col justify-between hover:border-cyber-600 transition">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-cyber-950 border border-cyber-800">SUPPLY CHAIN</span>
              <Package className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-white mt-2">Dependency Auditor</h3>
            <p className="text-xs text-slate-400 mt-1">
              Parses npm lockfiles and advisories, uncovering known CVEs in libraries like Deck.gl, Clerk, and WebGL loaders.
            </p>
          </div>
          <button
            onClick={() => runScan('deps')}
            disabled={scanning}
            className="mt-4 w-full py-2 px-3 rounded-lg bg-cyber-800 hover:bg-cyber-700 text-cyan-300 border border-cyber-600 font-mono text-xs uppercase transition disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{scanning && activeScanType === 'deps' ? 'Auditing...' : 'Run Dependency Scan'}</span>
          </button>
        </div>

        {/* Profile 4: Headers & Config */}
        <div className="bg-cyber-900 border border-cyber-700/60 rounded-xl p-4 flex flex-col justify-between hover:border-cyber-600 transition">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-cyber-950 border border-cyber-800">NETWORK/DAST</span>
              <Radio className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-white mt-2">Headers & TLS Audit</h3>
            <p className="text-xs text-slate-400 mt-1">
              Probes target HTTP responses for missing HSTS, CSP policy holes, CORS wildcard reflections, and MIME sniff headers.
            </p>
          </div>
          <button
            onClick={() => runScan('headers')}
            disabled={scanning}
            className="mt-4 w-full py-2 px-3 rounded-lg bg-cyber-800 hover:bg-cyber-700 text-cyan-300 border border-cyber-600 font-mono text-xs uppercase transition disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{scanning && activeScanType === 'headers' ? 'Probing...' : 'Run Header Probe'}</span>
          </button>
        </div>
      </div>

      {/* Scanning Progress Banner */}
      {scanning && (
        <div className="bg-cyber-900 border border-cyan-500/50 rounded-xl p-4 shadow-lg animate-pulse">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
            <span className="flex items-center space-x-2">
              <Clock className="w-4 h-4 animate-spin" />
              <span>SCAN RUNNING: {activeScanType?.toUpperCase()} PROFILE IN PROGRESS...</span>
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-cyber-950 rounded-full h-2.5 overflow-hidden border border-cyber-700">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Terminal Live Console */}
      <div className="bg-cyber-950 border border-cyber-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-cyber-900 border-b border-cyber-800 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-mono text-xs text-slate-300">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Watchtower Engine Console // STDOUT Stream</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono text-emerald-400">Live Agent Stream</span>
          </div>
        </div>

        <div 
          ref={logContainerRef}
          className="p-4 font-mono text-xs text-slate-300 space-y-1 h-72 overflow-y-auto bg-[#070b12]"
        >
          {logs.map((log, index) => {
            const isError = log.includes('[ERROR]');
            const isComplete = log.includes('[COMPLETE]');
            const isFinding = log.includes('[FINDINGS]') || log.includes('[CRITICAL]') || log.includes('[HIGH]');
            const isDep = log.includes('[DEP]');
            const isSast = log.includes('[SAST]');
            const isRecon = log.includes('[RECON]');

            return (
              <div 
                key={index}
                className={`leading-relaxed ${
                  isError ? 'text-rose-400 font-bold' :
                  isComplete ? 'text-emerald-400 font-bold' :
                  isFinding ? 'text-amber-300' :
                  isDep ? 'text-blue-300' :
                  isSast ? 'text-purple-300' :
                  isRecon ? 'text-cyan-300' :
                  'text-slate-400'
                }`}
              >
                {log}
              </div>
            );
          })}
        </div>

        <div className="bg-cyber-900/60 border-t border-cyber-800/80 px-4 py-3 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            Next Action: Proceed to Findings Triage to review raw alerts and eliminate false positives.
          </span>
          <button
            onClick={onNavigateToTriage}
            className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-semibold transition"
          >
            <span>Open Findings Triage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
