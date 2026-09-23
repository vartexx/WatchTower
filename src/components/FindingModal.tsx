import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Calculator, 
  FileText, 
  Terminal, 
  Wrench, 
  ShieldCheck, 
  Save, 
  CheckCheck,
  AlertTriangle,
  FileCode,
  Layers
} from 'lucide-react';
import { Finding, CvssMetrics } from '../types';

interface FindingModalProps {
  finding: Finding;
  onClose: () => void;
  onUpdate: (updated: Finding) => void;
}

export const FindingModal: React.FC<FindingModalProps> = ({
  finding,
  onClose,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'dossier' | 'cvss' | 'poc' | 'remediation'>('dossier');
  const [status, setStatus] = useState(finding.status);
  const [notes, setNotes] = useState(finding.validationNotes || '');
  const [metrics, setMetrics] = useState<CvssMetrics>(finding.cvssMetrics || {
    AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'U', C: 'L', I: 'L', A: 'N'
  });
  const [saving, setSaving] = useState(false);

  // CVSS Local recalculator for immediate interactive feedback
  const computeScore = (m: CvssMetrics) => {
    const avVal = m.AV === 'N' ? 0.85 : m.AV === 'A' ? 0.62 : m.AV === 'L' ? 0.55 : 0.20;
    const acVal = m.AC === 'L' ? 0.77 : 0.44;
    const prVal = m.S === 'U' 
      ? (m.PR === 'N' ? 0.85 : m.PR === 'L' ? 0.62 : 0.27)
      : (m.PR === 'N' ? 0.85 : m.PR === 'L' ? 0.68 : 0.50);
    const uiVal = m.UI === 'N' ? 0.85 : 0.62;

    const cVal = m.C === 'H' ? 0.56 : m.C === 'L' ? 0.22 : 0.0;
    const iVal = m.I === 'H' ? 0.56 : m.I === 'L' ? 0.22 : 0.0;
    const aVal = m.A === 'H' ? 0.56 : m.A === 'L' ? 0.22 : 0.0;

    const iss = 1 - ((1 - cVal) * (1 - iVal) * (1 - aVal));
    const impact = m.S === 'U' ? 6.42 * iss : 7.52 * (iss - 0.029) - 3.25 * Math.pow(iss - 0.02, 15);
    const exploitability = 8.22 * avVal * acVal * prVal * uiVal;

    let base = 0;
    if (impact > 0) {
      const raw = m.S === 'U' ? Math.min(impact + exploitability, 10) : Math.min(1.08 * (impact + exploitability), 10);
      base = Math.round(raw * 10) / 10;
    }

    let sev: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info' = 'Low';
    if (base >= 9.0) sev = 'Critical';
    else if (base >= 7.0) sev = 'High';
    else if (base >= 4.0) sev = 'Medium';

    const vector = `CVSS:3.1/AV:${m.AV}/AC:${m.AC}/PR:${m.PR}/UI:${m.UI}/S:${m.S}/C:${m.C}/I:${m.I}/A:${m.A}`;

    return { baseScore: base, severity: sev, vector };
  };

  const currentCvss = computeScore(metrics);

  const handleMetricChange = (key: keyof CvssMetrics, value: any) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (newStatus?: string) => {
    setSaving(true);
    const targetStatus = newStatus || status;

    try {
      const res = await fetch(`/api/findings/${finding.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: targetStatus,
          validationNotes: notes,
          cvssMetrics: metrics
        })
      });
      const data = await res.json();
      onUpdate(data);
      onClose();
    } catch (e) {
      console.error('Failed to update finding', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-cyber-900 border border-cyber-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-cyber-950 px-6 py-4 border-b border-cyber-800 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-2 py-0.5 rounded bg-cyber-900 text-cyan-400 font-bold border border-cyan-800">
                {finding.id}
              </span>
              <span className="px-2 py-0.5 rounded bg-cyber-850 text-slate-300 border border-cyber-700">
                {finding.scopeArea}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{finding.cwe}</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {finding.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-cyber-850 text-slate-400 hover:text-white hover:bg-cyber-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-cyber-900/90 border-b border-cyber-800 px-6 flex space-x-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`py-3 border-b-2 font-medium flex items-center space-x-1.5 transition ${
              activeTab === 'dossier' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Vulnerability Dossier</span>
          </button>
          <button
            onClick={() => setActiveTab('cvss')}
            className={`py-3 border-b-2 font-medium flex items-center space-x-1.5 transition ${
              activeTab === 'cvss' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>CVSS v3.1 Calculator</span>
          </button>
          <button
            onClick={() => setActiveTab('poc')}
            className={`py-3 border-b-2 font-medium flex items-center space-x-1.5 transition ${
              activeTab === 'poc' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Proof of Concept & Reproduction</span>
          </button>
          <button
            onClick={() => setActiveTab('remediation')}
            className={`py-3 border-b-2 font-medium flex items-center space-x-1.5 transition ${
              activeTab === 'remediation' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Remediation & Patch</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {/* TAB 1: Dossier */}
          {activeTab === 'dossier' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1.5">
                  Technical Vulnerability Description
                </h4>
                <div className="p-4 rounded-xl bg-cyber-950 border border-cyber-800 text-slate-200 text-xs leading-relaxed font-sans">
                  {finding.description}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono text-rose-400 uppercase tracking-wider mb-1.5">
                  Security & Operational Impact (CIA Analysis + DPDP Act)
                </h4>
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-200 text-xs leading-relaxed">
                  {finding.impact}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-cyber-950 border border-cyber-800 rounded-lg">
                  <span className="text-slate-500 block mb-1">AFFECTED COMPONENT</span>
                  <span className="text-white font-semibold">{finding.component}</span>
                </div>
                <div className="p-3 bg-cyber-950 border border-cyber-800 rounded-lg">
                  <span className="text-slate-500 block mb-1">CWE WEAKNESS</span>
                  <span className="text-cyan-300">{finding.cwe}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CVSS Calculator */}
          {activeTab === 'cvss' && (
            <div className="space-y-6">
              {/* Score Display */}
              <div className="p-4 rounded-xl bg-cyber-950 border border-cyber-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-slate-400">CALCULATED CVSS v3.1 BASE SCORE</div>
                  <div className="flex items-baseline space-x-3 mt-1">
                    <span className={`text-4xl font-extrabold font-mono ${
                      currentCvss.baseScore >= 9.0 ? 'text-rose-400' :
                      currentCvss.baseScore >= 7.0 ? 'text-amber-400' :
                      currentCvss.baseScore >= 4.0 ? 'text-blue-400' : 'text-slate-200'
                    }`}>
                      {currentCvss.baseScore}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded uppercase font-bold bg-cyber-800 text-slate-300">
                      {currentCvss.severity}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-500 block">CVSS VECTOR STRING</span>
                  <span className="text-xs font-mono text-cyan-400 select-all">{currentCvss.vector}</span>
                </div>
              </div>

              {/* Exploitability Metrics */}
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Exploitability Metrics (Attack Surface)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">Attack Vector (AV)</label>
                    <select
                      value={metrics.AV}
                      onChange={(e) => handleMetricChange('AV', e.target.value)}
                      className="w-full bg-cyber-950 border border-cyber-700 rounded p-2 text-white"
                    >
                      <option value="N">Network (N)</option>
                      <option value="A">Adjacent (A)</option>
                      <option value="L">Local (L)</option>
                      <option value="P">Physical (P)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Attack Complexity (AC)</label>
                    <select
                      value={metrics.AC}
                      onChange={(e) => handleMetricChange('AC', e.target.value)}
                      className="w-full bg-cyber-950 border border-cyber-700 rounded p-2 text-white"
                    >
                      <option value="L">Low (L)</option>
                      <option value="H">High (H)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Privileges Req (PR)</label>
                    <select
                      value={metrics.PR}
                      onChange={(e) => handleMetricChange('PR', e.target.value)}
                      className="w-full bg-cyber-950 border border-cyber-700 rounded p-2 text-white"
                    >
                      <option value="N">None (N)</option>
                      <option value="L">Low (L)</option>
                      <option value="H">High (H)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">User Interaction (UI)</label>
                    <select
                      value={metrics.UI}
                      onChange={(e) => handleMetricChange('UI', e.target.value)}
                      className="w-full bg-cyber-950 border border-cyber-700 rounded p-2 text-white"
                    >
                      <option value="N">None (N)</option>
                      <option value="R">Required (R)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Impact Metrics */}
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Impact Metrics (CIA Triad & Scope)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">Scope (S)</label>
                    <select
                      value={metrics.S}
                      onChange={(e) => handleMetricChange('S', e.target.value)}
                      className="w-full bg-cyber-950 border border-cyber-700 rounded p-2 text-white"
                    >
                      <option value="U">Unchanged (U)</option>
                      <option value="C">Changed (C)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Confidentiality (C)</label>
                    <select
                      value={metrics.C}
                      onChange={(e) => handleMetricChange('C', e.target.value)}
                      className="w-full bg-cyber-950 border border-cyber-700 rounded p-2 text-white"
                    >
                      <option value="H">High (H)</option>
                      <option value="L">Low (L)</option>
                      <option value="N">None (N)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Integrity (I)</label>
                    <select
                      value={metrics.I}
                      onChange={(e) => handleMetricChange('I', e.target.value)}
                      className="w-full bg-cyber-950 border border-cyber-700 rounded p-2 text-white"
                    >
                      <option value="H">High (H)</option>
                      <option value="L">Low (L)</option>
                      <option value="N">None (N)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Availability (A)</label>
                    <select
                      value={metrics.A}
                      onChange={(e) => handleMetricChange('A', e.target.value)}
                      className="w-full bg-cyber-950 border border-cyber-700 rounded p-2 text-white"
                    >
                      <option value="H">High (H)</option>
                      <option value="L">Low (L)</option>
                      <option value="N">None (N)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Reproduction & PoC */}
          {activeTab === 'poc' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
                  Safe Reproduction Protocol
                </h4>
                <div className="space-y-2">
                  {finding.reproductionSteps?.map((step, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-cyber-950 border border-cyber-800 text-xs text-slate-300 font-mono">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
                  Observed Raw Evidence / HTTP Payload
                </h4>
                <pre className="p-4 rounded-xl bg-cyber-950 border border-cyber-800 text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap">
                  {finding.evidence || 'No raw capture attached.'}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: Remediation */}
          {activeTab === 'remediation' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
                  Architectural Fix & Defense-in-Depth Recommendation
                </h4>
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-200 text-xs leading-relaxed font-sans">
                  {finding.remediation}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyber-950 border border-cyber-800 text-xs font-mono text-slate-400 space-y-2">
                <span className="text-cyan-400 font-bold block">CODE HARDENING CHECKLIST</span>
                <div>• Apply strict input type checking & parameter allowlisting</div>
                <div>• Extract subject context from cryptographically signed session tokens</div>
                <div>• Enforce automated integration tests preventing regressions</div>
              </div>
            </div>
          )}

          {/* Human Triage & Validation Actions */}
          <div className="pt-4 border-t border-cyber-800 space-y-3">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Auditor Triage Verdict & Evidence Notes
            </h4>
            <textarea
              placeholder="Record human reproduction evidence, local verification steps, or rationale for false positive determination..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-cyber-950 border border-cyber-700/80 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSave('Confirmed')}
                  disabled={saving}
                  className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Vulnerability</span>
                </button>

                <button
                  onClick={() => handleSave('False Positive')}
                  disabled={saving}
                  className="px-3.5 py-2 rounded-lg bg-cyber-800 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-500/40 font-mono text-xs flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Mark False Positive</span>
                </button>

                <button
                  onClick={() => handleSave('Remediated')}
                  disabled={saving}
                  className="px-3.5 py-2 rounded-lg bg-cyber-800 hover:bg-blue-900/50 text-blue-400 border border-blue-500/40 font-mono text-xs flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark Remediated</span>
                </button>
              </div>

              <button
                onClick={() => handleSave()}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 fill-black" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
