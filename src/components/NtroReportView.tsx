import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Download, 
  Shield, 
  FileCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Award,
  Layers,
  FileText
} from 'lucide-react';
import { NtroReportData } from '../types';

export const NtroReportView: React.FC = () => {
  const [report, setReport] = useState<NtroReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/report');
      const data = await res.json();
      setReport(data);
    } catch (e) {
      console.error('Failed to load report data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NTRO_PS26163_VAPT_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-sm text-cyan-400">
        Compiling Official NTRO VAPT Report...
      </div>
    );
  }

  if (!report) {
    return <div className="p-8 text-center text-rose-400">Error generating report.</div>;
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Controls Header (Hidden during Print) */}
      <div className="no-print bg-cyber-900 border border-cyber-700/60 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>REPORT GENERATION ENGINE</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            NTRO Official VAPT Assessment Report (PS 26163)
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Standardized security assessment deliverable formatted to NTRO standards, incorporating CVSS v3.1 scores, verified reproduction steps, and DPDP Act 2023 compliance mapping.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-lg bg-cyber-800 hover:bg-cyber-700 border border-cyber-600 text-xs font-mono text-slate-300 flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-xs uppercase flex items-center space-x-1.5 transition shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 fill-black" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER (Styling adapts for print) */}
      <div className="bg-slate-900/95 print:bg-white text-slate-100 print:text-black border border-cyber-700/80 print:border-none rounded-2xl p-8 sm:p-12 shadow-2xl max-w-4xl mx-auto space-y-8 font-sans">
        {/* Formal Report Cover / Title Banner */}
        <div className="border-b-2 border-cyan-500 print:border-black pb-6 text-center space-y-2">
          <div className="text-xs font-mono tracking-widest text-cyan-400 print:text-gray-700 uppercase font-bold">
            GOVERNMENT OF INDIA • NATIONAL TECHNICAL RESEARCH ORGANISATION (NTRO)
          </div>
          <div className="text-[11px] font-mono text-slate-400 print:text-gray-600">
            SMART INDIA HACKATHON 2026 // PROBLEM STATEMENT: PS 26163
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white print:text-black font-sans uppercase pt-2">
            Vulnerability Assessment & Penetration Testing (VAPT) Report
          </h1>
          <div className="inline-block px-3 py-1 rounded bg-rose-950/80 text-rose-300 print:bg-gray-200 print:text-black text-xs font-mono font-bold border border-rose-800 print:border-gray-400 mt-2">
            RESTRICTED // SECURITY EVALUATION DELIVERABLE
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold text-cyan-400 print:text-blue-900 uppercase tracking-wider border-b border-cyber-800 print:border-gray-300 pb-1">
            1. Executive Summary & Audit Context
          </h2>
          <p className="text-xs leading-relaxed text-slate-300 print:text-gray-800">
            Between September 2026, a comprehensive Vulnerability Assessment and Penetration Testing (VAPT) evaluation was executed against the self-hosted instance of <strong>World Monitor</strong> ({report.targetSystem.name}), an open-source global intelligence and situational monitoring platform.
          </p>
          <p className="text-xs leading-relaxed text-slate-300 print:text-gray-800">
            In strict compliance with NTRO competition rules, all offensive probing, security scanning, and Proof-of-Concept validations were restricted to an isolated, self-hosted sandbox instance (<strong>127.0.0.1:3000</strong>) to ensure zero impact on production infrastructure or active users.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 bg-cyber-950 print:bg-gray-100 rounded-lg border border-cyber-800 print:border-gray-300 text-center">
              <span className="text-slate-400 print:text-gray-600 block text-[10px]">TOTAL DISCOVERED</span>
              <span className="text-xl font-bold text-white print:text-black">{report.summary.totalDiscovered}</span>
            </div>
            <div className="p-3 bg-cyber-950 print:bg-gray-100 rounded-lg border border-rose-800/60 print:border-gray-300 text-center">
              <span className="text-slate-400 print:text-gray-600 block text-[10px]">CONFIRMED VULNERABILITIES</span>
              <span className="text-xl font-bold text-rose-400 print:text-red-700">{report.summary.confirmedVulnerabilities}</span>
            </div>
            <div className="p-3 bg-cyber-950 print:bg-gray-100 rounded-lg border border-emerald-800/60 print:border-gray-300 text-center">
              <span className="text-slate-400 print:text-gray-600 block text-[10px]">FALSE POSITIVES FILTERED</span>
              <span className="text-xl font-bold text-emerald-400 print:text-green-700">{report.summary.falsePositivesEliminated}</span>
            </div>
            <div className="p-3 bg-cyber-950 print:bg-gray-100 rounded-lg border border-cyber-800 print:border-gray-300 text-center">
              <span className="text-slate-400 print:text-gray-600 block text-[10px]">AVERAGE CVSS SCORE</span>
              <span className="text-xl font-bold text-cyan-400 print:text-blue-800">{report.summary.averageCvssScore}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Scope of Testing (The 7 Pillars) */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold text-cyan-400 print:text-blue-900 uppercase tracking-wider border-b border-cyber-800 print:border-gray-300 pb-1">
            2. Scope of Testing (7 NTRO Mandated Areas)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-cyber-800 print:border-gray-300">
              <thead className="bg-cyber-950 print:bg-gray-200 text-slate-400 print:text-black font-mono">
                <tr>
                  <th className="p-2.5 border-b border-cyber-800 print:border-gray-300">#</th>
                  <th className="p-2.5 border-b border-cyber-800 print:border-gray-300">Scope Pillar</th>
                  <th className="p-2.5 border-b border-cyber-800 print:border-gray-300">Evaluation Method</th>
                  <th className="p-2.5 border-b border-cyber-800 print:border-gray-300">Risk Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-800 print:divide-gray-300 font-mono text-[11px]">
                <tr>
                  <td className="p-2 font-bold">1</td>
                  <td className="p-2 font-bold">Authentication & Sessions</td>
                  <td className="p-2 text-slate-400 print:text-gray-700">Token lifecycle, cookie attributes, revocation checks</td>
                  <td className="p-2 text-amber-400 print:text-amber-800 font-bold">HIGH (7.1)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">2</td>
                  <td className="p-2 font-bold">Authorization & Access Control</td>
                  <td className="p-2 text-slate-400 print:text-gray-700">BOLA/IDOR user preference testing, privilege escalation</td>
                  <td className="p-2 text-rose-400 print:text-red-700 font-bold">HIGH (8.1)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">3</td>
                  <td className="p-2 font-bold">Input Validation</td>
                  <td className="p-2 text-slate-400 print:text-gray-700">SSRF boundary probe, DOM XSS sink analysis</td>
                  <td className="p-2 text-rose-500 print:text-red-800 font-bold">CRITICAL (9.3)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">4</td>
                  <td className="p-2 font-bold">API Security</td>
                  <td className="p-2 text-slate-400 print:text-gray-700">LLM endpoint concurrency flooding, rate-limit evaluation</td>
                  <td className="p-2 text-amber-400 print:text-amber-800 font-bold">MEDIUM (7.5)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">5</td>
                  <td className="p-2 font-bold">Client-Side Security</td>
                  <td className="p-2 text-slate-400 print:text-gray-700">Supply-chain CVE audit, WebGL buffer vulnerability</td>
                  <td className="p-2 text-amber-400 print:text-amber-800 font-bold">HIGH (7.6)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">6</td>
                  <td className="p-2 font-bold">Secure Communication</td>
                  <td className="p-2 text-slate-400 print:text-gray-700">HSTS presence, TLS downgrade vector, CORS policies</td>
                  <td className="p-2 text-blue-400 print:text-blue-800 font-bold">MEDIUM (5.9)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">7</td>
                  <td className="p-2 font-bold">Data Storage & Privacy</td>
                  <td className="p-2 text-slate-400 print:text-gray-700">Client IP hashing, retention schedule, DPDP Act 2023</td>
                  <td className="p-2 text-blue-400 print:text-blue-800 font-bold">MEDIUM (5.5)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Compliance Mapping */}
        <div className="space-y-3">
          <h2 className="text-sm font-mono font-bold text-cyan-400 print:text-blue-900 uppercase tracking-wider border-b border-cyber-800 print:border-gray-300 pb-1">
            3. Regulatory & Framework Compliance Mapping
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-cyber-950 print:bg-gray-100 rounded-xl border border-cyber-800 print:border-gray-300 space-y-2">
              <h3 className="font-mono font-bold text-white print:text-black">OWASP Top 10 (2021) Evaluation</h3>
              <div className="space-y-1 font-mono text-[11px]">
                {report.complianceMapping.owaspTop10.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1 border-b border-cyber-900 print:border-gray-200">
                    <span className="text-slate-300 print:text-gray-800">{item.id}</span>
                    <span className="text-rose-400 print:text-red-700 font-bold">{item.status} ({item.findingsCount})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-cyber-950 print:bg-gray-100 rounded-xl border border-cyber-800 print:border-gray-300 space-y-2">
              <h3 className="font-mono font-bold text-white print:text-black">Digital Personal Data Protection (DPDP) Act 2023</h3>
              <div className="space-y-2 text-slate-300 print:text-gray-800 text-[11px]">
                {report.complianceMapping.dpdpAct2023.issues.map((issue, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Detailed Confirmed Findings Dossier */}
        <div className="space-y-6 pt-4">
          <h2 className="text-sm font-mono font-bold text-cyan-400 print:text-blue-900 uppercase tracking-wider border-b border-cyber-800 print:border-gray-300 pb-1">
            4. Itemized Confirmed Security Vulnerabilities
          </h2>

          {report.confirmedFindings.map((finding, idx) => (
            <div 
              key={finding.id}
              className="p-5 rounded-xl bg-cyber-950 print:bg-white border border-cyber-800 print:border-gray-400 space-y-4 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyber-800 print:border-gray-300 pb-2">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="font-bold text-cyan-400 print:text-black">Finding #{idx + 1}: {finding.id}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 print:text-red-800 font-bold text-[10px]">
                    {finding.severity.toUpperCase()}
                  </span>
                  <span className="text-slate-400 print:text-gray-600">({finding.scopeArea})</span>
                </div>
                <div className="font-mono text-right">
                  <span className="text-slate-400 print:text-gray-600 mr-1">CVSS v3.1:</span>
                  <strong className="text-rose-400 print:text-red-800">{finding.cvssScore}</strong>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white print:text-black text-sm">{finding.title}</h3>
                <p className="text-slate-400 print:text-gray-600 text-[11px] font-mono mt-0.5">Component: {finding.component} | {finding.cwe}</p>
              </div>

              <div className="space-y-1">
                <span className="font-mono font-bold text-slate-300 print:text-gray-900 uppercase text-[10px]">Vulnerability Details:</span>
                <p className="text-slate-300 print:text-gray-800 leading-relaxed">{finding.description}</p>
              </div>

              <div className="space-y-1">
                <span className="font-mono font-bold text-rose-400 print:text-red-800 uppercase text-[10px]">Threat Impact:</span>
                <p className="text-rose-300 print:text-red-900 leading-relaxed">{finding.impact}</p>
              </div>

              <div className="space-y-1">
                <span className="font-mono font-bold text-cyan-400 print:text-blue-900 uppercase text-[10px]">Proof of Concept Reproduction Steps:</span>
                <div className="space-y-1 font-mono text-[11px] text-slate-300 print:text-gray-800">
                  {finding.reproductionSteps?.map((step, sIdx) => (
                    <div key={sIdx}>{step}</div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-mono font-bold text-emerald-400 print:text-green-800 uppercase text-[10px]">Remediation Recommendation:</span>
                <p className="text-emerald-300 print:text-green-900 leading-relaxed font-sans">{finding.remediation}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section 5: Documented False Positives (Human-in-the-Loop Proof) */}
        <div className="space-y-3 pt-4">
          <h2 className="text-sm font-mono font-bold text-emerald-400 print:text-green-800 uppercase tracking-wider border-b border-cyber-800 print:border-gray-300 pb-1">
            5. Documented & Eliminated False Positives (Validation Rigor)
          </h2>
          <p className="text-xs text-slate-300 print:text-gray-700 leading-relaxed">
            To satisfy NTRO criteria and avoid superficial scanner dumps, the audit team performed human-in-the-loop validation to test automated alerts. The following alerts were proven to be defended by upstream security controls:
          </p>

          {report.falsePositives.map((fp) => (
            <div key={fp.id} className="p-4 rounded-lg bg-cyber-950 print:bg-gray-50 border border-emerald-900/60 print:border-gray-300 space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-slate-200 print:text-black">{fp.id}: {fp.title}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 print:text-green-800 font-bold text-[10px]">
                  DISCARDED AS FALSE POSITIVE
                </span>
              </div>
              <p className="text-slate-400 print:text-gray-600 font-mono text-[11px]">{fp.validationNotes}</p>
            </div>
          ))}
        </div>

        {/* Section 6: Official Sign-off & Assessment Certification */}
        <div className="pt-8 border-t-2 border-cyan-500 print:border-black flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-slate-400 print:text-gray-600 block text-[10px]">AUDIT EXECUTION ENGINE</span>
            <div className="font-bold text-white print:text-black">Watchtower Security Assessment OS v1.0</div>
            <div className="text-slate-400 print:text-gray-600">Smart India Hackathon 2026 // Team Watchtower</div>
          </div>

          <div className="border-t border-slate-700 print:border-black pt-2 w-48 text-center">
            <span className="font-bold text-white print:text-black block">LEAD VAPT AUDITOR</span>
            <span className="text-[10px] text-slate-500 print:text-gray-600">Cyber Defense Evaluation Wing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
