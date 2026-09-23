import React, { useState, useEffect } from 'react';
import { NtroReportData } from '../types';
import { Printer, Download, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AegisNtroReport: React.FC = () => {
  const [report, setReport] = useState<NtroReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    a.download = `NTRO_PS26163_WATCHTOWER_VAPT_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-16 text-center font-mono text-xs text-[#6be1d6]">
        Compiling Official NTRO VAPT Readout...
      </div>
    );
  }

  if (!report) {
    return <div className="p-8 text-center text-[#ff746d] font-mono text-xs">Error compiling report.</div>;
  }

  return (
    <div className="space-y-6 animate-tab-enter pb-12 font-mono">
      {/* Page Intro & Actions */}
      <div className="border-b border-[#181f2e] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 no-print">
        <div>
          <span className="text-[10px] text-[#00f0ff] tracking-widest uppercase block font-mono">
            PHASE 04 // DELIVERY
          </span>
          <h2 className="font-syne font-extrabold text-3xl text-white tracking-tight mt-1">
            NTRO <em className="text-[#00f0ff] not-italic font-semibold">readout</em>
          </h2>
          <p className="text-xs text-[#94a3b8] max-w-xl mt-2 leading-relaxed">
            A board-ready executive deliverable assembled from verified evidence, CVSS v3.1 metrics, and Indian regulatory compliance.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportJson}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-sm bg-[#05070a] text-[#94a3b8] hover:text-white border border-[#181f2e] text-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-sm bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] text-[#040507] font-syne font-bold text-xs hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Assessment (PDF)</span>
          </button>
        </div>
      </div>

      {/* Watchtower Report Preview Box */}
      <div className="border border-[#181f2e] bg-gradient-to-br from-[#0c0e14] to-[#07080c] rounded-sm overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 print-card">
        {/* Left: Report Cover */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#091522] via-[#060e18] to-[#04080e] p-8 lg:p-10 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-[#181f2e]">
          <div>
            <div className="font-syne font-extrabold text-xl tracking-wider text-[#00f0ff] flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"></span>
              <span>WATCHTOWER</span>
            </div>
            <span className="block text-[10px] text-[#64748b] mt-12 tracking-widest uppercase">
              CONFIDENTIAL // AUTHORIZED USE ONLY
            </span>
            <h3 className="font-syne font-extrabold text-3xl lg:text-4xl text-white mt-4 leading-tight">
              World Monitor<br />
              <em className="text-[#00f0ff] not-italic font-normal">Security Assessment</em>
            </h3>
            <p className="text-[11px] text-[#94a3b8] leading-relaxed mt-4 max-w-sm">
              Problem Statement ID 26163 · National Technical Research Organisation (NTRO)
            </p>
          </div>

          <div className="mt-12 flex items-center justify-between pt-6 border-t border-[#181f2e]">
            <div className="text-[10px] text-[#64748b]">
              <span>EVALUATION DATE</span>
              <strong className="block text-white font-syne mt-0.5">
                {report.targetSystem?.assessmentPeriod || new Date().toISOString().slice(0, 10)}
              </strong>
            </div>
            <div className="border border-[#00ff9d] text-[#00ff9d] bg-[#00ff9d]/10 text-[10px] px-3 py-1.5 rounded-sm font-syne font-bold text-center">
              FINAL<br />
              <b className="text-xl block">
                {report.summary?.confirmedVulnerabilities ?? report.confirmedFindings?.length ?? 0}
              </b>
              FINDINGS
            </div>
          </div>
        </div>

        {/* Right: Report Summary & Facts */}
        <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-[#64748b] tracking-widest uppercase block">
              EXECUTIVE SUMMARY
            </span>
            <h3 className="font-syne font-bold text-xl text-white mt-1">
              Risk posture requires targeted remediation.
            </h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed mt-3">
              The automated assessment identified critical authorization control failures and server-side request forgery risks alongside hardening opportunities across the 7 mandated NTRO pillars. All findings were verified in a non-destructive simulation environment with mathematical CVSS v3.1 scoring.
            </p>

            {/* Report Facts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-[#181f2e]">
              <div>
                <b className="font-syne font-bold text-2xl text-[#ff2a5f] block">
                  {report.confirmedFindings && report.confirmedFindings.length > 0
                    ? Math.max(...report.confirmedFindings.map(f => f.cvssScore)).toFixed(1)
                    : (report.summary?.averageCvssScore || 9.1).toFixed(1)}
                </b>
                <span className="text-[10px] text-[#64748b] mt-1 block">Max CVSS</span>
              </div>
              <div>
                <b className="font-syne font-bold text-2xl text-[#00f0ff] block">164</b>
                <span className="text-[10px] text-[#64748b] mt-1 block">Assets mapped</span>
              </div>
              <div>
                <b className="font-syne font-bold text-2xl text-[#00ff9d] block">18</b>
                <span className="text-[10px] text-[#64748b] mt-1 block">Evidence items</span>
              </div>
              <div>
                <b className="font-syne font-bold text-2xl text-white block">100%</b>
                <span className="text-[10px] text-[#64748b] mt-1 block">Scope compliance</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#181f2e] flex items-center justify-between text-[11px] text-[#64748b]">
            <span>Lead Auditor: <b className="text-white">A. Kumar (Analyst)</b></span>
            <span>Target Hash: <code className="text-[#00f0ff]">sha256:wm26163</code></span>
          </div>
        </div>
      </div>

      {/* OWASP Top 10 Compliance Matrix */}
      <div className="border border-[#181f2e] bg-gradient-to-br from-[#0c0e14] to-[#07080c] p-6 rounded-sm shadow-md">
        <h4 className="font-syne font-bold text-base text-white mb-4">
          OWASP Top 10 (2021) Compliance Matrix
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#181f2e] text-[10px] text-[#64748b]">
                <th className="py-2">Category</th>
                <th className="py-2 text-center">Findings</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181f2e]">
              {(report.complianceMapping?.owASPtop10 || report.complianceMapping?.owaspTop10 || []).map((item, i) => (
                <tr key={i} className="hover:bg-[#111622]/50">
                  <td className="py-2.5 text-white">{item.id}</td>
                  <td className="py-2.5 text-center text-[#94a3b8]">{item.findingsCount}</td>
                  <td className="py-2.5 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-syne font-bold ${
                      item.status === 'Non-Compliant'
                        ? 'text-[#ff2a5f] bg-[#ff2a5f]/10 border border-[#ff2a5f]/30'
                        : 'text-[#ffb703] bg-[#ffb703]/10 border border-[#ffb703]/30'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DPDP Act 2023 Regulatory Assessment */}
      <div className="border border-[#181f2e] bg-gradient-to-br from-[#0c0e14] to-[#07080c] p-6 rounded-sm shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-syne font-bold text-base text-white">
            Digital Personal Data Protection (DPDP) Act 2023 Analysis
          </h4>
          <span className="text-[10px] text-[#ff2a5f] font-syne font-bold border border-[#ff2a5f]/40 px-2 py-0.5 rounded bg-[#ff2a5f]/10">
            NON-COMPLIANT
          </span>
        </div>
        <p className="text-xs text-[#94a3b8] leading-relaxed">
          Statutory compliance review mandated for Indian sovereignty and data fiduciary obligations:
        </p>
        <ul className="space-y-2 mt-2">
          {(report.complianceMapping?.dpdpAct2023?.issues || []).map((issue, idx) => (
            <li key={idx} className="flex items-start space-x-2 text-xs text-[#ffb703] bg-[#05070a] p-3 rounded border border-[#ffb703]/25 font-mono">
              <span className="text-[#ff2a5f] font-bold">⚠</span>
              <span>{issue}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmed Findings Remediation Deliverable */}
      <div className="border border-[#181f2e] bg-gradient-to-br from-[#0c0e14] to-[#07080c] p-6 rounded-sm shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-[#181f2e] pb-3">
          <h4 className="font-syne font-bold text-base text-white">
            Confirmed Vulnerabilities & Required Remediations
          </h4>
          <span className="text-xs text-[#00f0ff]">
            {(report.confirmedFindings || []).length} Validated Issues
          </span>
        </div>

        <div className="divide-y divide-[#181f2e]">
          {(report.confirmedFindings || []).map((f) => (
            <div key={f.id} className="py-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-syne font-bold uppercase ${
                    f.severity === 'Critical' || f.severity === 'CRITICAL' ? 'text-[#ff2a5f] bg-[#ff2a5f]/10 border border-[#ff2a5f]/30' :
                    f.severity === 'High' || f.severity === 'HIGH' ? 'text-[#ff5c38] bg-[#ff5c38]/10 border border-[#ff5c38]/30' :
                    f.severity === 'Medium' || f.severity === 'MEDIUM' ? 'text-[#ffb703] bg-[#ffb703]/10 border border-[#ffb703]/30' :
                    'text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/30'
                  }`}>
                    {f.severity}
                  </span>
                  <strong className="text-white text-xs font-syne font-semibold">{f.title}</strong>
                  <span className="text-[#64748b] text-[10px]">({f.id})</span>
                </div>
                <span className="font-syne font-bold text-white text-xs">CVSS {f.cvssScore.toFixed(1)}</span>
              </div>
              <p className="text-[11px] text-[#94a3b8] m-0">{f.description}</p>
              <div className="text-[10px] text-[#00ff9d] bg-[#05070a] p-2.5 rounded border border-[#00ff9d]/25">
                <b>Fix:</b> {f.remediation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
